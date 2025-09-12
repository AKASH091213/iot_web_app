require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const mqtt = require('mqtt');
const http = require('http');


const waterDataRoutes = require('./routes/waterDataRoutes');
const WaterData = require('./models/WaterData');

const app = express();
app.use(cors());
app.use(express.json());

// Connect MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

// HTTP + Socket.IO server for frontend websocket real-time relay
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, { cors: { origin: '*' } });

// MQTT client connects to broker (use HiveMQ public broker for testing)
const mqttClient = mqtt.connect('mqtt://broker.hivemq.com');
app.set('mqttClient', mqttClient);
mqttClient.on('connect', () => {
  console.log('MQTT connected');

  // Subscribe to sensor data and motor command topics
  mqttClient.subscribe('sensor/data');
  mqttClient.subscribe('motor/command');
});

// Global motor state
let motorState = false;

mqttClient.on('message', async (topic, message) => {
  try {
    const msgString = message.toString();
    if (topic === 'sensor/data') {
      const data = JSON.parse(msgString);

      // Log data for debugging
      console.log('Received sensor data:', data);

      // Save to MongoDB
      const newEntry = new WaterData({
        waterLevel: data.waterLevel,
        flowRate: data.flowRate,
      });
      await newEntry.save();

      // Emit to frontend clients
      io.emit('sensorData', data);
      console.log('Sensor data saved and emitted');
      
    } else if (topic === 'motor/command') {
      const command = JSON.parse(msgString);

      console.log('Received motor command:', command);

      // Update global motor state
      motorState = command.motorOn;

      // Emit motor status to frontend clients
      io.emit('motorStatus', { motorOn: motorState });

      // Optionally publish motor status on 'motor/status' topic for consistency
      mqttClient.publish('motor/status', JSON.stringify({ motorOn: motorState }));
    }
  } catch (error) {
    console.error('Error processing MQTT message:', error);
  }
});

// WebSocket connection for frontend to backend (motor commands)
io.on('connection', (socket) => {
  console.log('Frontend client connected');

  socket.on('motorCommand', (command) => {
    // Publish motor command to MQTT broker
    mqttClient.publish('motor/command', JSON.stringify(command));
    console.log('Motor command published to MQTT:', command);
  });
});

// Pass mqttClient and motorState to routes
app.set('mqttClient', mqttClient);
app.set('io', io);
app.set('motorState', () => motorState);
app.set('setMotorState', (state) => { motorState = state; });
app.use('/api', waterDataRoutes);

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT} with MQTT and Socket.IO`);
});
