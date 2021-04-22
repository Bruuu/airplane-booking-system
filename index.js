const {Database} = require('./database.js');
const{taskSelection} = require('./uiBookingSystem.js');

let db = new Database('FlightManifest.json');

taskSelection();
db.save();