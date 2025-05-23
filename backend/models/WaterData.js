const mongoose = require('mongoose');

const waterDataSchema = new mongoose.Schema({
  waterLevel: Number,
  flowRate: Number,
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('WaterData', waterDataSchema);
