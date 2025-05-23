// backend/controllers/waterDataController.js
const WaterData = require('../models/WaterData');

exports.createWaterData = async (req, res) => {
  try {
    const { flowRate, waterLevel } = req.body;
    const newData = new WaterData({ flowRate, waterLevel });
    await newData.save();
    res.status(201).json({ message: 'Data saved successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getLatestWaterData = async (req, res) => {
  try {
    const latestData = await WaterData.findOne().sort({ timestamp: -1 });
    res.status(200).json(latestData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
