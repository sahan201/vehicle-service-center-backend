// in models/Settings.js
import mongoose from 'mongoose';
const settingsSchema = new mongoose.Schema({
    offPeakDays: {
        type: [String], // Will store an array like ['Monday', 'Tuesday']
        default: ['Monday', 'Tuesday']
    }
});

const Settings = mongoose.model('Settings', settingsSchema);
//module.exports = mongoose.model('Settings', settingsSchema);


//const Inventory = mongoose.model('Inventory', inventorySchema);

export default Settings;