import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';


import './App.css';

//const MQTT_BROKER_URL = 'wss://broker.hivemq.com:8000/mqtt'; // Public broker WS URL

function App() {
  const [waterLevel, setWaterLevel] = useState(null);  // Initially null to avoid resetting to 0
  const [flowRate, setFlowRate] = useState(null);  // Initially null
  const [motorOn, setMotorOn] = useState(false);
  //const [client, setClient] = useState(null);

useEffect(() => {
  const socket = io('https://iot-web-app-back.onrender.com'); // no trailing slash

  socket.on('connect', () => {
    console.log('Connected to backend via Socket.IO');
  });

  socket.on('sensorData', (data) => {
    console.log('Received sensor data:', data);
    if (data.waterLevel !== undefined && data.flowRate !== undefined) {
      setWaterLevel(data.waterLevel);
      setFlowRate(data.flowRate);
    }
  });

  socket.on('motorStatus', (status) => {
    console.log('Received motor status:', status);
    setMotorOn(status.motorOn);
  });

  return () => {
    socket.disconnect();
  };
}, []);
//Empty dependency array ensures this effect runs only once
const handleMotorToggle = () => {
  const newMotorState = !motorOn;
  setMotorOn(newMotorState);

  const socket = io('https://<your-render-app-url>');
  socket.emit('motorCommand', { motorOn: newMotorState });
  socket.disconnect(); // avoid opening multiple sockets
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
