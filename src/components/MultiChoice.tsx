import React, { useState, useEffect } from 'react';
import './MultiChoice.css';
import { config } from '../config';

interface MultiChoiceProps {
  value: string;
  onChange: (value: string) => void;
}

// Different throw animations for variety
const throwAnimations = [
  'throw-spin-left',
  'throw-spin-right', 
  'throw-explode',
  'throw-crumple',
  'throw-yeet',
];

const initialOptions = [
  { id: 'exceptional', label: `Exceptional - ${config.name} promotes innovative solutions`, emoji: '🚀' },
  { id: 'excellent', label: `Excellent - ${config.name} consistently exceeds expectations`, emoji: '⭐' },
  { id: 'good', label: 'Good - Meets expectations', emoji: '👍' },
  { id: 'average', label: 'Average - Room for improvement', emoji: '😐' },
  { id: 'poor', label: 'Poor - Needs significant work', emoji: '📉' },
];

export const MultiChoice: React.FC<MultiChoiceProps> = ({ value, onChange }) => {
  const [options, setOptions] = useState(initialOptions);
  const [throwingId, setThrowingId] = useState<string | null>(null);
  const [throwAnimation, setThrowAnimation] = useState<string>('');

  const handleSelect = (optionId: string) => {
    if (optionId === 'exceptional' || optionId === 'excellent') {
      onChange(optionId);
      return;
    }

    // Pick a random throwing animation
    const randomAnim = throwAnimations[Math.floor(Math.random() * throwAnimations.length)];
    setThrowAnimation(randomAnim);
    setThrowingId(optionId);
    
    // Remove after animation
    setTimeout(() => {
      setOptions(prev => prev.filter(opt => opt.id !== optionId));
      setThrowingId(null);
      setThrowAnimation('');
    }, 800);
  };

  useEffect(() => {
    if (!value) {
      setOptions(initialOptions);
    }
  }, [value]);

  return (
    <div className="multi-choice-container">
      <div className="multi-choice-question">
        {config.multiChoice.question}
      </div>

      <div className="options-list">
        {options.map((option) => (
          <button
            key={option.id}
            className={`option-btn ${value === option.id ? 'selected' : ''} ${
              throwingId === option.id ? throwAnimation : ''
            }`}
            onClick={() => handleSelect(option.id)}
          >
            <span className="option-emoji">{option.emoji}</span>
            <span className="option-label">{option.label}</span>
            {value === option.id && <span className="check-mark">✓</span>}
          </button>
        ))}
      </div>
    </div>
  );
};
