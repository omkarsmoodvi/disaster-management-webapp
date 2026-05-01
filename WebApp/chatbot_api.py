from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from llama_index.core import SimpleDirectoryReader, VectorStoreIndex, ServiceContext
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
import concurrent.futures
import re
import os
import nltk
nltk.download('punkt', quiet=True)
from nltk.tokenize import sent_tokenize

DATA_DIR = './data'
EMERGENCY_FILE = os.path.join(DATA_DIR, 'EMERGENCY CONTACT NUMBERS.txt')

def load_emergency_numbers(path):
    main_keys = ["ambulance", "police", "fire", "disaster", "national emergency"]
    numbers = {}
    with open(path, 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip().lower()
            m = re.match(r'(.+?)[-—–]+ *(.*\d[\d \-/or,]*)$', line)
            if m:
                key, number = m.groups()
                key = key.replace(':', '').strip()
                number = number.strip()
                for main in main_keys:
                    if main == key or (main in key and len(key.split()) <= 4):
                        if main not in numbers:
                            numbers[main] = number
    return numbers

def fuzzy_emergency_lookup(query, numbers):
    q = query.lower()
    main_keys = ["ambulance", "police", "fire", "disaster", "national emergency"]
    for main in main_keys:
        if main in q.split() or main in q:
            if main in numbers:
                return f"{main.title()} emergency number: {numbers[main]}"
    return None

emergency_numbers = load_emergency_numbers(EMERGENCY_FILE)

embed_model = HuggingFaceEmbedding(model_name="sentence-transformers/all-MiniLM-L6-v2")
service_context = ServiceContext.from_defaults(embed_model=embed_model, llm=None)
print("Loading and indexing ALL files from:", DATA_DIR)
documents = SimpleDirectoryReader(DATA_DIR).load_data()
if not documents:
    raise RuntimeError(f"No documents found in '{DATA_DIR}'. Please add PDFs or .txt files.")
index = VectorStoreIndex.from_documents(documents, service_context=service_context)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatQuery(BaseModel):
    question: str

def action_points_for_topic(text, wanted, deny, max_points=7):
    # Only match lines with real action verbs for THIS disaster, stop if another topic arises
    sents = []
    cleaned = re.sub(r'\s+', ' ', text)
    sentlist = sent_tokenize(cleaned)
    actions = []
    for s in sentlist:
        s1 = s.strip()
        if any(topic in s1.lower() for topic in deny):
            break
        found = False
        # Only accept points about the specific topic and real action verbs
        for word in wanted:
            if s1.lower().startswith(word) or (s1.lower().startswith("do not") and word.startswith("do not")):
                found=True
                break
        if found and 12 < len(s1) < 160:
            actions.append(s1[0].upper()+s1[1:])
        if len(actions) == max_points:
            break
    # Remove duplicates, number, fallback to "ask authorities" if nothing
    uniq = []
    [uniq.append(x) for x in actions if x not in uniq]
    if uniq:
        return "\n".join([f"{i+1}. {x}" for i, x in enumerate(uniq)])
    else:
        return "Sorry, I couldn't find actionable public safety steps for this question. Please contact local authorities or trusted official sources."

@app.post("/chat")
def chat(query: ChatQuery):
    emg_ans = fuzzy_emergency_lookup(query.question, emergency_numbers)
    if emg_ans:
        return {"answer": emg_ans}

    def do_search():
        results = index.as_retriever(similarity_top_k=1).retrieve(query.question)
        return results[0].text if results else None

    with concurrent.futures.ThreadPoolExecutor() as pool:
        future = pool.submit(do_search)
        try:
            answer = future.result(timeout=8)
        except concurrent.futures.TimeoutError:
            answer = None
    if not answer:
        return {"answer": "Sorry, I couldn't find any answer. Please use official helplines."}
    q = query.question.lower()
    possible_topics = {
        "flood": ([
            "move", "seek", "evacuate", "avoid", "do not", "turn off", "help", "keep", "store", "listen", "bring", "protect", "prepare", "leave", "wear", "alert", "wait", "call", "contact"
        ], ["fire", "earthquake", "cyclone", "tsunami"]),
        "earthquake": ([
            "drop", "take", "stay", "move", "avoid", "do not", "remain", "hold", "protect", "keep", "wait", "help", "practice", "identify", "prepare"
        ], ["flood", "fire", "cyclone", "tsunami"]),
        "fire": ([
            "call", "evacuate", "avoid", "do not", "alert", "turn off", "help", "leave", "move", "crawl", "stop", "drop", "roll", "cover", "wait", "stay", "close"
        ], ["flood", "earthquake", "cyclone", "tsunami"]),
    }
    for k in possible_topics:
        if k in q:
            wanted, deny = possible_topics[k]
            return {"answer": action_points_for_topic(answer, wanted, deny)}
    # fallback for generic emergency
    return {"answer": answer.strip().capitalize()[:180]}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
