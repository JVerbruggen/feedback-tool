import React, { useState, useEffect, useRef } from 'react';
import { config } from '../config';
import './DinosaurQuestion.css';

interface DinosaurQuestionProps {
  value: string;
  onChange: (value: string) => void;
}

const ratingOptions = [
  { id: 'legendary', label: 'LEGENDARY', sublabel: 'T-Rex of Talent!', emoji: '🦖', good: true },
  { id: 'epic', label: 'EPIC', sublabel: 'Jurassic-level skills!', emoji: '🦕', good: true },
  { id: 'good', label: 'Good', sublabel: 'Not extinct yet...', emoji: '🦴', good: false },
  { id: 'meh', label: 'Meh', sublabel: 'Fossil material', emoji: '💀', good: false },
];

export const DinosaurQuestion: React.FC<DinosaurQuestionProps> = ({ onChange }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [raptorAttack, setRaptorAttack] = useState(false);
  const [trexRoar, setTrexRoar] = useState(false);
  const [meteorStrike, setMeteorStrike] = useState(false);
  const [extinctOptions, setExtinctOptions] = useState<string[]>([]);
  const [screenShake, setScreenShake] = useState(false);
  const [raptors, setRaptors] = useState<Array<{id: number, side: 'left' | 'right', top: number}>>([]);
  const [footprints, setFootprints] = useState<Array<{id: number, x: number, y: number}>>([]);
  const [celebrationMode, setCelebrationMode] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Random T-Rex footstep sounds (screen shake)
  useEffect(() => {
    const interval = setInterval(() => {
      if (!selectedOption && Math.random() > 0.7) {
        setScreenShake(true);
        // Add footprint
        setFootprints(prev => [...prev, {
          id: Date.now(),
          x: Math.random() * 80 + 10,
          y: Math.random() * 60 + 20
        }]);
        setTimeout(() => setScreenShake(false), 200);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [selectedOption]);

  // Clean old footprints
  useEffect(() => {
    const cleanup = setInterval(() => {
      setFootprints(prev => prev.slice(-8));
    }, 5000);
    return () => clearInterval(cleanup);
  }, []);

  const spawnRaptors = () => {
    const newRaptors = [];
    for (let i = 0; i < 6; i++) {
      newRaptors.push({
        id: Date.now() + i,
        side: Math.random() > 0.5 ? 'left' as const : 'right' as const,
        top: 20 + Math.random() * 50
      });
    }
    setRaptors(newRaptors);
  };

  const handleSelect = (option: typeof ratingOptions[0]) => {
    if (option.good) {
      // EPIC selection - celebration!
      setSelectedOption(option.id);
      setTrexRoar(true);
      setCelebrationMode(true);
      setScreenShake(true);
      
      setTimeout(() => {
        setScreenShake(false);
        setTrexRoar(false);
        onChange(option.id);
      }, 1500);
      return;
    }

    // BAD selection - CHAOS!
    setScreenShake(true);
    setRaptorAttack(true);
    spawnRaptors();

    setTimeout(() => {
      setMeteorStrike(true);
    }, 800);

    setTimeout(() => {
      setExtinctOptions(prev => [...prev, option.id]);
      setRaptorAttack(false);
      setMeteorStrike(false);
      setScreenShake(false);
      setRaptors([]);
    }, 2000);
  };

  const availableOptions = ratingOptions.filter(opt => !extinctOptions.includes(opt.id));

  return (
    <div className={`dinosaur-container ${screenShake ? 'shake' : ''}`} ref={containerRef}>
      {/* Ambient footprints */}
      {footprints.map(fp => (
        <div 
          key={fp.id} 
          className="footprint"
          style={{ left: `${fp.x}%`, top: `${fp.y}%` }}
        >
          🦶
        </div>
      ))}

      {/* Raptor attack! */}
      {raptorAttack && raptors.map(raptor => (
        <div
          key={raptor.id}
          className={`raptor raptor-${raptor.side}`}
          style={{ top: `${raptor.top}%` }}
        >
          🦖
        </div>
      ))}

      {/* Meteor strike */}
      {meteorStrike && (
        <div className="meteor-container">
          <div className="meteor">☄️</div>
          <div className="explosion">💥</div>
          <div className="shockwave"></div>
        </div>
      )}

      {/* T-Rex celebration roar */}
      {trexRoar && (
        <div className="trex-roar">
          <div className="roar-trex">🦖</div>
          <div className="roar-text">ROOOAAARRR!</div>
          <div className="roar-waves">
            <span></span><span></span><span></span>
          </div>
        </div>
      )}

      {/* Celebration confetti */}
      {celebrationMode && (
        <div className="dino-celebration">
          {[...Array(20)].map((_, i) => (
            <span key={i} className="confetti-dino" style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 0.5}s`,
              fontSize: `${1.5 + Math.random() * 1.5}rem`
            }}>
              {['🦕', '🦖', '⭐', '🏆', '🌟'][Math.floor(Math.random() * 5)]}
            </span>
          ))}
        </div>
      )}

      <div className="dino-question">
        <span className="question-dino">🦕</span>
        How would you rate {config.name}'s prehistoric powers?
        <span className="question-dino flip">🦖</span>
      </div>

      <div className="dino-options">
        {availableOptions.map(option => (
          <button
            key={option.id}
            className={`dino-option ${selectedOption === option.id ? 'selected' : ''} ${option.good ? 'good' : 'dangerous'}`}
            onClick={() => handleSelect(option)}
            disabled={selectedOption !== null}
          >
            <span className="option-emoji">{option.emoji}</span>
            <div className="option-text">
              <span className="option-label">{option.label}</span>
              <span className="option-sublabel">{option.sublabel}</span>
            </div>
            {!option.good && <span className="danger-icon">⚠️</span>}
          </button>
        ))}
      </div>

      {extinctOptions.length > 0 && (
        <div className="extinction-notice">
          <span className="volcano">🌋</span>
          {extinctOptions.length} option{extinctOptions.length > 1 ? 's' : ''} went EXTINCT!
          <span className="skull">�</span>
        </div>
      )}

      <div className="dino-hint">
        🦴 The ground trembles with each choice... choose wisely!
      </div>
    </div>
  );
};
