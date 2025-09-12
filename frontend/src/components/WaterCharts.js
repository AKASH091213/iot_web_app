import React, { useState, useEffect } from 'react';

const WaterCharts = ({ waterLevel, flowRate }) => {
  const [chartData, setChartData] = useState({
    waterLevel: [],
    flowRate: [],
    timestamps: []
  });

  useEffect(() => {
    // Generate mock historical data for demonstration
    const generateMockData = () => {
      const now = new Date();
      const data = [];
      
      for (let i = 29; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 60000); // Every minute
        data.push({
          timestamp: time.toLocaleTimeString(),
          waterLevel: Math.random() * 100,
          flowRate: Math.random() * 50
        });
      }
      
      return data;
    };

    const mockData = generateMockData();
    setChartData({
      waterLevel: mockData.map(d => d.waterLevel),
      flowRate: mockData.map(d => d.flowRate),
      timestamps: mockData.map(d => d.timestamp)
    });
  }, []);

  // Update with real-time data when available
  useEffect(() => {
    if (waterLevel !== null && flowRate !== null) {
      setChartData(prev => ({
        waterLevel: [...prev.waterLevel.slice(1), waterLevel],
        flowRate: [...prev.flowRate.slice(1), flowRate],
        timestamps: [...prev.timestamps.slice(1), new Date().toLocaleTimeString()]
      }));
    }
  }, [waterLevel, flowRate]);

  const maxWaterLevel = Math.max(...chartData.waterLevel, 100);
  const maxFlowRate = Math.max(...chartData.flowRate, 50);

  return (
    <div className="charts-container">
      <div className="chart-card">
        <h3>Water Level Trend</h3>
        <div className="chart-wrapper">
          <div className="chart-svg">
            <svg viewBox="0 0 400 200" className="chart">
              <defs>
                <linearGradient id="waterGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.8"/>
                  <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.2"/>
                </linearGradient>
              </defs>
              
              {/* Grid lines */}
              {[0, 25, 50, 75, 100].map(y => (
                <line key={y} x1="40" y1={200 - (y * 1.6)} x2="380" y2={200 - (y * 1.6)} 
                      stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
              ))}
              
              {/* Water level line */}
              <polyline
                fill="none"
                stroke="#0ea5e9"
                strokeWidth="3"
                points={chartData.waterLevel.map((value, index) => 
                  `${40 + (index * 340 / 29)},${200 - (value * 1.6)}`
                ).join(' ')}
                className="chart-line"
              />
              
              {/* Area under curve */}
              <polygon
                fill="url(#waterGradient)"
                points={`40,200 ${chartData.waterLevel.map((value, index) => 
                  `${40 + (index * 340 / 29)},${200 - (value * 1.6)}`
                ).join(' ')} 380,200`}
                className="chart-area"
              />
              
              {/* Data points */}
              {chartData.waterLevel.map((value, index) => (
                <circle
                  key={index}
                  cx={40 + (index * 340 / 29)}
                  cy={200 - (value * 1.6)}
                  r="3"
                  fill="#0ea5e9"
                  className="chart-point"
                />
              ))}
            </svg>
          </div>
          <div className="chart-labels">
            <div className="chart-y-labels">
              <span>100%</span>
              <span>75%</span>
              <span>50%</span>
              <span>25%</span>
              <span>0%</span>
            </div>
          </div>
        </div>
        <div className="chart-value">
          Current: {waterLevel !== null ? `${waterLevel}%` : '—'}
        </div>
      </div>

      <div className="chart-card">
        <h3>Flow Rate Trend</h3>
        <div className="chart-wrapper">
          <div className="chart-svg">
            <svg viewBox="0 0 400 200" className="chart">
              <defs>
                <linearGradient id="flowGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#16a34a" stopOpacity="0.8"/>
                  <stop offset="100%" stopColor="#16a34a" stopOpacity="0.2"/>
                </linearGradient>
              </defs>
              
              {/* Grid lines */}
              {[0, 12.5, 25, 37.5, 50].map(y => (
                <line key={y} x1="40" y1={200 - (y * 3.2)} x2="380" y2={200 - (y * 3.2)} 
                      stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
              ))}
              
              {/* Flow rate line */}
              <polyline
                fill="none"
                stroke="#16a34a"
                strokeWidth="3"
                points={chartData.flowRate.map((value, index) => 
                  `${40 + (index * 340 / 29)},${200 - (value * 3.2)}`
                ).join(' ')}
                className="chart-line"
              />
              
              {/* Area under curve */}
              <polygon
                fill="url(#flowGradient)"
                points={`40,200 ${chartData.flowRate.map((value, index) => 
                  `${40 + (index * 340 / 29)},${200 - (value * 3.2)}`
                ).join(' ')} 380,200`}
                className="chart-area"
              />
              
              {/* Data points */}
              {chartData.flowRate.map((value, index) => (
                <circle
                  key={index}
                  cx={40 + (index * 340 / 29)}
                  cy={200 - (value * 3.2)}
                  r="3"
                  fill="#16a34a"
                  className="chart-point"
                />
              ))}
            </svg>
          </div>
          <div className="chart-labels">
            <div className="chart-y-labels">
              <span>50 L/min</span>
              <span>37.5 L/min</span>
              <span>25 L/min</span>
              <span>12.5 L/min</span>
              <span>0 L/min</span>
            </div>
          </div>
        </div>
        <div className="chart-value">
          Current: {flowRate !== null ? `${flowRate} L/min` : '—'}
        </div>
      </div>
    </div>
  );
};

export default WaterCharts;
