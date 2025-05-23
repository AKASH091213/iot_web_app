import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

function App() {
  const [waterLevel, setWaterLevel] = useState(null);
  const [flowRate, setFlowRate] = useState(null);
  const [motorOn, setMotorOn] = useState(false);

  const socketRef = useRef(null);

  useEffect(() => {
    const socket = io('https://iot-web-app-back.onrender.com');
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Connected to backend via Socket.IO');
    });

    socket.on('sensorData', (data) => {
      if (data.waterLevel !== undefined && data.flowRate !== undefined) {
        setWaterLevel(data.waterLevel);
        setFlowRate(data.flowRate);
      }
    });

    socket.on('motorStatus', (status) => {
      setMotorOn(status.motorOn);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleMotorToggle = () => {
    const newMotorState = !motorOn;
    setMotorOn(newMotorState);

    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('motorCommand', { motorOn: newMotorState });
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
