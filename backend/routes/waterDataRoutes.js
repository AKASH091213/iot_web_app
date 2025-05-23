const express = require('express');
const router = express.Router();
const WaterData = require('../models/WaterData');

let mqttClient;

router.use((req, res, next) => {
  mqttClient = req.app.get('mqttClient');
  next();
});

let latestSensorData = {
  waterLevel: 0,
  flowRate: 0,
};
let motorState = false;

// POST sensor data (from NodeMCU)
router.post('/data', async (req, res) => {
  const { waterLevel, flowRate } = req.body;
  latestSensorData = { waterLevel, flowRate };

  try {
    console.log('Received POST sensor data:', latestSensorData);

    const entry = new WaterData({ waterLevel, flowRate });
    await entry.save();

    if (mqttClient && mqttClient.connected) {
      mqttClient.publish('sensor/data', JSON.stringify(latestSensorData));
      console.log('Published sensor/data MQTT message');
    }

    res.json({ message: 'Sensor data saved and published via MQTT' });
  } catch (err) {
    console.error('Failed to save sensor data:', err);
    res.status(500).json({ error: 'Error saving sensor data' });
  }
});

// GET latest sensor data
router.get('/data', (req, res) => {
  res.json(latestSensorData);
});

// POST motor toggle (from frontend)
router.post('/motor', (req, res) => {
  motorState = req.body.motorOn;
  console.log('Received motor toggle:', motorState);

  if (mqttClient && mqttClient.connected) {
    mqttClient.publish('motor/command', JSON.stringify({ motorOn: motorState }));
    console.log('Published motor/command MQTT message');
  }

  res.json({ motorOn: motorState });
});

// GET motor state (for NodeMCU fallback)
router.get('/motor', (req, res) => {
  res.json({ motorOn: motorState });
});

module.exports = router;
