import React, { useState, useEffect } from 'react';
import mqtt from 'mqtt';

import './App.css';

const MQTT_BROKER_URL = 'ws://broker.hivemq.com:8000/mqtt'; // Public broker WS URL

function App() {
  const [waterLevel, setWaterLevel] = useState(null);  // Initially null to avoid resetting to 0
  const [flowRate, setFlowRate] = useState(null);  // Initially null
  const [motorOn, setMotorOn] = useState(false);
  const [client, setClient] = useState(null);

  useEffect(() => {
    const mqttClient = mqtt.connect(MQTT_BROKER_URL);

    mqttClient.on('connect', () => {
      console.log('Connected to MQTT broker');
      
      mqttClient.subscribe('sensor/data', (err) => {
        if (err) console.error('Subscribe error:', err);
      });

      mqttClient.subscribe('motor/status', (err) => {
        if (err) console.error('Subscribe error:', err);
      });
    });

    mqttClient.on('message', (topic, message) => {
      const payload = message.toString();
      console.log(`💡 Received [${topic}] ${payload}`);

      if (topic === 'sensor/data') {
        try {
          const data = JSON.parse(payload);
          // Only update if data is valid
          if (data.waterLevel !== undefined && data.flowRate !== undefined) {
            setWaterLevel(data.waterLevel);
            setFlowRate(data.flowRate);
          }
        } catch (e) {
          console.error('Invalid sensor data JSON:', e);
        }
      } else if (topic === 'motor/status') {
        try {
          const status = JSON.parse(payload);
          setMotorOn(status.motorOn);
        } catch (e) {
          console.error('Invalid motor status JSON:', e);
        }
      }
    });

    setClient(mqttClient);

    return () => {
      if (mqttClient.connected) {
        mqttClient.end();
      }
    };
  }, []); // Empty dependency array ensures this effect runs only once

  const handleMotorToggle = () => {
    const newMotorState = !motorOn;
    setMotorOn(newMotorState); // Optimistic update

    if (client && client.connected) {
      client.publish('motor/command', JSON.stringify({ motorOn: newMotorState }));
    }
  };

  return (
    <div className="video-container">
      <video autoPlay muted loop playsInline className="bg-video">
        <source src="/rain.mp4" type="video/mp4" />
      </video>

      <div className="container">
        <h1>IoT Water Management System</h1>
        <div className="card">
          <p><strong>Water Level:</strong> {waterLevel !== null ? `${waterLevel}%` : 'Waiting for data...'}</p>
          <p><strong>Flow Rate:</strong> {flowRate !== null ? `${flowRate} L/min` : 'Waiting for data...'}</p>
        </div>
        <button className={motorOn ? 'btn stop' : 'btn start'} onClick={handleMotorToggle}>
          {motorOn ? 'Turn Motor OFF' : 'Turn Motor ON'}
        </button>
      </div>
    </div>
  );
}

export default App;
