const mongoose = require('mongoose');
const ResponderContact = require('../models/ResponderContact');

mongoose.connect('mongodb://127.0.0.1:27017/dms-project', {
  useNewUrlParser: true, useUnifiedTopology: true
});

const contacts = [
  // NGOs
  { name: "Red Cross", type: "NGO", email: "redcross.ngo.demo@gmail.com", location: "Mysore" },
  { name: "Green Hope", type: "NGO", email: "greenhope.ngo.demo@gmail.com", location: "Bangalore" },
  { name: "Helping Hands", type: "NGO", email: "helpinghands.ngo.demo@gmail.com", location: "Mysore" },
  { name: "Relief Aid", type: "NGO", email: "reliefaid.ngo.demo@gmail.com", location: "Mandya" },
  { name: "Support Trust", type: "NGO", email: "supporttrust.ngo.demo@gmail.com", location: "Chamarajanagar" },

  // Hospitals
  { name: "City General Hospital", type: "Hospital", email: "cityhospital.demo@gmail.com", location: "Mysore" },
  { name: "Unity Healthcare", type: "Hospital", email: "unityhospital.demo@gmail.com", location: "Bangalore" },
  { name: "Sunrise Hospital", type: "Hospital", email: "sunrisehospital.demo@gmail.com", location: "Mandya" },
  { name: "Krishna Hospital", type: "Hospital", email: "krishnahospital.demo@gmail.com", location: "Chamarajanagar" },
  { name: "Mercy Clinic", type: "Hospital", email: "mercyclinic.demo@gmail.com", location: "Mysore" },

  // Police
  { name: "Central Police Station", type: "Police", email: "centralpolice.demo@gmail.com", location: "Mysore" },
  { name: "East Zone PS", type: "Police", email: "eastzonepolice.demo@gmail.com", location: "Bangalore" },
  { name: "Mandya Town PS", type: "Police", email: "mandyatownps.demo@gmail.com", location: "Mandya" },
  { name: "Chamrajnagar PS", type: "Police", email: "chamrajnagarps.demo@gmail.com", location: "Chamarajanagar" },
  { name: "West District PS", type: "Police", email: "westdistrictps.demo@gmail.com", location: "Mysore" }
];

ResponderContact.insertMany(contacts)
  .then(() => {
    console.log("Demo responder contacts added!");
    mongoose.disconnect();
  })
  .catch(err => {
    console.error(err);
    mongoose.disconnect();
  });
