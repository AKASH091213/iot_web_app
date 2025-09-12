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
  const getMotorState = req.app.get('motorState');
  const setMotorState = req.app.get('setMotorState');
  
  const newMotorState = req.body.motorOn;
  setMotorState(newMotorState);
  console.log('Received motor toggle:', newMotorState);

  if (mqttClient && mqttClient.connected) {
    mqttClient.publish('motor/command', JSON.stringify({ motorOn: newMotorState }));
    console.log('Published motor/command MQTT message');
  }

  res.json({ motorOn: newMotorState });
});

// GET motor state (for NodeMCU fallback)
router.get('/motor', (req, res) => {
  const getMotorState = req.app.get('motorState');
  res.json({ motorOn: getMotorState() });
});

module.exports = router;
