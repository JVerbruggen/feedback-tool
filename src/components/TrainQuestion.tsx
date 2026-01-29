import React, { useState, useEffect, useRef } from 'react';
import { config } from '../config';
import './TrainQuestion.css';

interface TrainQuestionProps {
  value: number;
  onChange: (value: number) => void;
}

export const TrainQuestion: React.FC<TrainQuestionProps> = ({ onChange }) => {
  const [trainPosition, setTrainPosition] = useState(110);
  const [selectedStation, setSelectedStation] = useState<number | null>(null);
  const [trainStopped, setTrainStopped] = useState(false);
  const [showMessage, setShowMessage] = useState('');
  const trainRef = useRef<HTMLDivElement>(null);

  const stations = [
    { value: 25, label: 'Needs Work', emoji: '🚧', position: 88 },
    { value: 50, label: 'Mediocre Valley', emoji: '😐', position: 68 },
    { value: 70, label: 'Good Town', emoji: '👍', position: 48 },
    { value: 85, label: 'Great Station', emoji: '⭐', position: 28 },
    { value: 100, label: 'Excellence Central', emoji: '🏆', position: 8 },
  ];

  // Train animation - moving left (like a real train on tracks)
  useEffect(() => {
    if (!trainStopped) {
      const interval = setInterval(() => {
        setTrainPosition(prev => {
          if (prev <= -20) return 110;
          return prev - 0.4;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [trainStopped]);

  const handleStationClick = (station: typeof stations[0]) => {
    // If they click on a low rating station, train "misses" it
    if (station.value < 80) {
      setShowMessage(`🚂 "Sorry, this train doesn't stop at ${station.label}!" 🚃💨`);
      setTimeout(() => setShowMessage(''), 2000);
      return;
    }

    // Stop train at this station
    setTrainPosition(station.position - 5);
    setSelectedStation(station.value);
    setTrainStopped(true);
    onChange(station.value);
    setShowMessage(`🎉 All aboard the ${station.label} express! 🎉`);
  };

  return (
    <div className="train-container">
      <div className="train-question">
        Which station best describes {config.name}'s performance level?
      </div>

      <div className="train-scene">
        <div className="train-track">
          <div className="track-line"></div>
          {stations.map((station) => (
            <div
              key={station.value}
              className={`station ${selectedStation === station.value ? 'selected' : ''}`}
              style={{ left: `${station.position}%` }}
              onClick={() => handleStationClick(station)}
              >
                <div className="station-building">
                  <span className="station-emoji">{station.emoji}</span>
                </div>
                <div className="station-sign">{station.label}</div>
              </div>
            ))}
          </div>

          <div 
            ref={trainRef}
            className={`train ${trainStopped ? 'stopped' : ''}`}
            style={{ left: `${trainPosition}%` }}
          >
            <span className="train-engine">🚂</span>
            <span className="train-car">🚃</span>
            <span className="train-car">🚃</span>
            <span className="steam">💨</span>
          </div>

          <div className="train-tracks-decoration">
            {[...Array(30)].map((_, i) => (
              <div key={i} className="track-tie" style={{ left: `${i * 3.5}%` }}></div>
            ))}
          </div>
        </div>

        {showMessage && (
          <div className={`train-message ${selectedStation ? 'success' : 'error'}`}>
            {showMessage}
          </div>
        )}

        <div className="train-hint">
          🚂 Click a station to stop the train there!
        </div>
      </div>
  );
};
