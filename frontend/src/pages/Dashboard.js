import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import WaterCharts from '../components/WaterCharts';

export default function Dashboard() {
  const [waterLevel, setWaterLevel] = useState(null);
  const [flowRate, setFlowRate] = useState(null);
  const [motorOn, setMotorOn] = useState(false);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    const socket = io('https://iot-web-app-back.onrender.com');
    socketRef.current = socket;

    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));

    socket.on('sensorData', (data) => {
      if (data && data.waterLevel !== undefined) setWaterLevel(data.waterLevel);
      if (data && data.flowRate !== undefined) setFlowRate(data.flowRate);
    });

    socket.on('motorStatus', (status) => {
      if (status && typeof status.motorOn === 'boolean') setMotorOn(status.motorOn);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleMotorToggle = () => {
    const newState = !motorOn;
    setMotorOn(newState);
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('motorCommand', { motorOn: newState });
    }
  };

  return (
    <div className="page">
      <div className="container card-grid">
        <div className="header">
          <h1>REXO IOT Water Management</h1>
          <div className={connected ? 'status online' : 'status offline'}>
            {connected ? 'Online' : 'Offline'}
          </div>
        </div>

        <div className="stats">
          <div className="stat-card">
            <div className="stat-label">Water Level</div>
            <div className="stat-value">{waterLevel !== null ? `${waterLevel}%` : '—'}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Flow Rate</div>
            <div className="stat-value">{flowRate !== null ? `${flowRate} L/min` : '—'}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Motor</div>
            <div className={`stat-badge ${motorOn ? 'on' : 'off'}`}>{motorOn ? 'ON' : 'OFF'}</div>
          </div>
        </div>

        <div className="actions">
          <button className={motorOn ? 'btn stop' : 'btn start'} onClick={handleMotorToggle}>
            {motorOn ? 'Turn Motor OFF' : 'Turn Motor ON'}
          </button>
        </div>

        <WaterCharts waterLevel={waterLevel} flowRate={flowRate} />
      </div>
    </div>
  );
}
