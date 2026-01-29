import React from 'react';
import './ThankYou.css';
import { config } from '../config';

interface ThankYouProps {
  answers: {
    stars: number;
    slider: number;
    choice: string;
    recommend: string;
    comments: string;
  };
  onRestart: () => void;
}

export const ThankYou: React.FC<ThankYouProps> = ({ answers, onRestart }) => {
  const getChoiceLabel = (id: string) => {
    const labels: Record<string, string> = {
      exceptional: 'Exceptional',
      excellent: 'Excellent',
    };
    return labels[id] || id;
  };

  return (
    <div className="thank-you-container">
      <div className="confetti">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i} 
            className="confetti-piece"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              backgroundColor: ['#667eea', '#764ba2', '#ffc107', '#22c55e', '#ef4444'][i % 5],
            }}
          />
        ))}
      </div>

      <div className="trophy">🏆</div>
      
      <h1 className="thank-you-title">Thank You!</h1>
      <p className="thank-you-subtitle">
        Your feedback about {config.name} has been recorded
      </p>

      <div className="results-summary">
        <h3>Your Feedback Summary for {config.name}:</h3>
        <div className="result-item">
          <span className="result-label">Overall Rating:</span>
          <span className="result-value">⭐ {answers.stars}/5</span>
        </div>
        <div className="result-item">
          <span className="result-label">Problem Solving:</span>
          <span className="result-value">📊 {answers.slider}%</span>
        </div>
        <div className="result-item">
          <span className="result-label">Collaboration:</span>
          <span className="result-value">🤝 {getChoiceLabel(answers.choice)}</span>
        </div>
        <div className="result-item">
          <span className="result-label">Would Recommend {config.name}:</span>
          <span className="result-value">👍 {answers.recommend === 'yes' ? 'Yes!' : 'Absolutely!'}</span>
        </div>
        {answers.comments && (
          <div className="result-item comments">
            <span className="result-label">Comments:</span>
            <span className="result-value">💬 "{answers.comments}"</span>
          </div>
        )}
      </div>

      <button className="restart-btn" onClick={onRestart}>
        Submit Another Review for {config.name} 🔄
      </button>
    </div>
  );
};
