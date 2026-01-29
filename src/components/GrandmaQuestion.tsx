import React, { useState, useRef } from 'react';
import { config } from '../config';
import './GrandmaQuestion.css';

interface GrandmaQuestionProps {
  value: string;
  onChange: (value: string) => void;
}

export const GrandmaQuestion: React.FC<GrandmaQuestionProps> = ({ onChange }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [grandmaState, setGrandmaState] = useState<'idle' | 'angry' | 'happy'>('idle');
  const [shoutMessage, setShoutMessage] = useState('');
  const [shoutCount, setShoutCount] = useState(0);
  const audioContext = useRef<AudioContext | null>(null);
  const timeoutRef = useRef<number | null>(null);

  const options = [
    { value: 'amazing', label: 'Absolutely Amazing!', emoji: '🌟', isGood: true },
    { value: 'wonderful', label: 'Wonderful Person', emoji: '💖', isGood: true },
    { value: 'okay', label: 'Just Okay', emoji: '😐', isGood: false },
    { value: 'needs_work', label: 'Needs Improvement', emoji: '📉', isGood: false },
    { value: 'terrible', label: 'Not Great', emoji: '👎', isGood: false },
  ];

  const grandmaShouts = [
    `WHAT?! You think ${config.name} is just okay?! IN MY DAY we respected people!`,
    `EXCUSE ME?! ${config.name} works SO HARD and THIS is what you say?!`,
    `OH NO YOU DIDN'T! My sweet ${config.name} deserves BETTER!`,
    `*GASP* THE AUDACITY! Have you NO SHAME?!`,
    `YOUNG PERSON! You march right back and pick PROPERLY!`,
    `I'M CALLING YOUR MOTHER! This is UNACCEPTABLE!`,
    `WAIT TILL I TELL THE NEIGHBORS WHAT YOU DID!`,
    `IN MY 80 YEARS I'VE NEVER SEEN SUCH DISRESPECT!`,
  ];

  const grandmaHappyMessages = [
    `Oh what a LOVELY choice! You're such a sweet dear! 🍪`,
    `NOW that's more like it! Would you like some cookies? 🍪`,
    `See? Was that so hard? ${config.name} IS wonderful! 💕`,
  ];

  const playShout = () => {
    // Create a funny "shout" sound effect using Web Audio API
    if (!audioContext.current) {
      audioContext.current = new AudioContext();
    }
    const ctx = audioContext.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.frequency.setValueAtTime(400, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.3);
    
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.3);
  };

  const handleOptionClick = (option: typeof options[0]) => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (!option.isGood) {
      // Grandma gets angry!
      setGrandmaState('angry');
      const randomShout = grandmaShouts[shoutCount % grandmaShouts.length];
      setShoutMessage(randomShout);
      setShoutCount(prev => prev + 1);
      playShout();
      
      // Reset after a moment
      timeoutRef.current = window.setTimeout(() => {
        setGrandmaState('idle');
        setShoutMessage('');
      }, 3000);
      return;
    }

    // Good choice!
    setSelectedOption(option.value);
    setGrandmaState('happy');
    const randomHappy = grandmaHappyMessages[Math.floor(Math.random() * grandmaHappyMessages.length)];
    setShoutMessage(randomHappy);
    onChange(option.value);
  };

  return (
    <div className="grandma-container">
      <div className="grandma-question">
        How would you describe {config.name}?
      </div>

      <div className="grandma-scene">
        <div className={`grandma ${grandmaState}`}>
          <div className="grandma-body">
            <div className="grandma-head">
              <div className="grandma-hair">👵</div>
              {grandmaState === 'angry' && (
                <>
                  <div className="angry-symbols">💢</div>
                  <div className="angry-symbols right">💢</div>
                </>
              )}
              {grandmaState === 'happy' && (
                <div className="hearts">💕</div>
              )}
            </div>
            <div className="grandma-accessories">
              {grandmaState === 'angry' ? '👊' : '🍪'}
            </div>
          </div>
        </div>

        {shoutMessage && (
          <div className={`speech-bubble ${grandmaState}`}>
            <div className="speech-text">{shoutMessage}</div>
          </div>
        )}
      </div>

      <div className="grandma-options">
        {options.map((option) => (
          <button
            key={option.value}
            className={`grandma-option ${selectedOption === option.value ? 'selected' : ''} ${!option.isGood ? 'dangerous' : 'safe'}`}
            onClick={() => handleOptionClick(option)}
            disabled={selectedOption !== null}
          >
            <span className="option-emoji">{option.emoji}</span>
            <span className="option-label">{option.label}</span>
            {!option.isGood && <span className="warning-icon">⚠️</span>}
          </button>
        ))}
      </div>

      <div className="grandma-hint">
        👵 Grandma is watching your choice very carefully...
      </div>
    </div>
  );
};
