from llama_index.core import SimpleDirectoryReader, VectorStoreIndex, ServiceContext
from llama_index.embeddings.huggingface import HuggingFaceEmbedding

DATA_DIR = './data'

# Initialize local, free embedding model
embed_model = HuggingFaceEmbedding(model_name="sentence-transformers/all-MiniLM-L6-v2")

# Build service context with NO LLM (totally local)
service_context = ServiceContext.from_defaults(embed_model=embed_model, llm=None)

print("Loading documents...")
documents = SimpleDirectoryReader(DATA_DIR).load_data()
if len(documents) == 0:
    print("No documents found! Add your PDFs or TXT files to the 'data' folder.")
    exit()

# Build searchable index from your documents
index = VectorStoreIndex.from_documents(documents, service_context=service_context)

print("\nChatbot ready! Type a question or 'exit' to quit:\n")
while True:
    prompt = input("You: ").strip()
    if prompt.lower() in ['exit', 'quit']:
        print("Goodbye!")
        break
    try:
        # Retrieve exactly 1 most relevant chunk
        top_k = 1
        results = index.as_retriever(similarity_top_k=top_k).retrieve(prompt)
        if results:
            print("\nBot: Here’s the most relevant answer found:\n")
            print(results[0].text, "\n")
        else:
            print("\nSorry, no clear answer was found in your documents.\n")
    except Exception as e:
        print("Error during searching:", str(e))
