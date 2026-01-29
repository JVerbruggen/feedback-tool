import React, { useState, useRef, useEffect, useCallback } from 'react';
import { config } from '../config';
import './YesNoQuestion.css';

interface YesNoQuestionProps {
  value: string;
  onChange: (value: string) => void;
}

// Stampede animals
const stampedeAnimals = ['🐘', '🦏', '🐃', '🦬', '🐂', '🐎', '🦌', '🐗', '🦙', '🐪'];

export const YesNoQuestion: React.FC<YesNoQuestionProps> = ({ value, onChange }) => {
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
  const [isEscaping, setIsEscaping] = useState(false);
  const [escapeCount, setEscapeCount] = useState(0);
  const [showStampede, setShowStampede] = useState(false);
  const [noButtonGone, setNoButtonGone] = useState(false);
  const noButtonRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const escapeIntervalRef = useRef<number | null>(null);

  // Check if mouse is overlapping the button
  const isMouseOverButton = useCallback(() => {
    if (!noButtonRef.current) return false;
    const rect = noButtonRef.current.getBoundingClientRect();
    const buffer = 30; // Extra buffer zone around the button
    return (
      mousePos.current.x >= rect.left - buffer &&
      mousePos.current.x <= rect.right + buffer &&
      mousePos.current.y >= rect.top - buffer &&
      mousePos.current.y <= rect.bottom + buffer
    );
  }, []);

  // Escape function - moves button DIRECTLY away from cursor (calculated, not random)
  const escapeFromCursor = useCallback(() => {
    if (!noButtonRef.current || !containerRef.current) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const buttonRect = noButtonRef.current.getBoundingClientRect();
    const buttonCenterX = buttonRect.left + buttonRect.width / 2;
    const buttonCenterY = buttonRect.top + buttonRect.height / 2;
    
    // Calculate direction DIRECTLY away from mouse (no randomness)
    const dx = buttonCenterX - mousePos.current.x;
    const dy = buttonCenterY - mousePos.current.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < 5) {
      // Mouse is basically on top of button, move in any direction
      setNoPosition(prev => ({ x: prev.x + 100, y: prev.y - 50 }));
      return;
    }
    
    // Move enough to be completely clear of the cursor + buffer
    // Minimum move distance should be larger than button size + buffer
    const minMoveDistance = Math.max(buttonRect.width, buttonRect.height) + 60;
    const escapeSpeed = Math.max(minMoveDistance, 100);
    
    // Normalize and multiply by escape speed
    const moveX = (dx / distance) * escapeSpeed;
    const moveY = (dy / distance) * escapeSpeed;
    
    // Calculate bounds relative to container
    const maxX = containerRect.width - buttonRect.width;
    const maxY = 180;
    const minX = -containerRect.width + buttonRect.width + 80;
    const minY = -120;
    
    // Calculate new position
    let newX = noPosition.x + moveX;
    let newY = noPosition.y + moveY;
    
    // If hitting bounds, escape perpendicular (calculated, not random)
    const hitLeft = newX <= minX;
    const hitRight = newX >= maxX;
    const hitTop = newY <= minY;
    const hitBottom = newY >= maxY;
    
    if (hitLeft || hitRight) {
      // Move vertically instead, away from mouse
      const verticalDir = mousePos.current.y > buttonCenterY ? -1 : 1;
      newY = noPosition.y + verticalDir * escapeSpeed;
      newX = hitLeft ? minX + 10 : maxX - 10;
    }
    if (hitTop || hitBottom) {
      // Move horizontally instead, away from mouse
      const horizontalDir = mousePos.current.x > buttonCenterX ? -1 : 1;
      newX = noPosition.x + horizontalDir * escapeSpeed;
      newY = hitTop ? minY + 10 : maxY - 10;
    }
    
    // Final bounds check
    newX = Math.max(minX, Math.min(maxX, newX));
    newY = Math.max(minY, Math.min(maxY, newY));
    
    setNoPosition({ x: newX, y: newY });
  }, [noPosition]);

  // Track mouse position globally
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Keep escaping while mouse is overlapping
  useEffect(() => {
    if (isEscaping && !noButtonGone) {
      escapeIntervalRef.current = window.setInterval(() => {
        if (isMouseOverButton()) {
          escapeFromCursor();
        } else {
          setIsEscaping(false);
        }
      }, 50);
    }
    
    return () => {
      if (escapeIntervalRef.current) {
        clearInterval(escapeIntervalRef.current);
      }
    };
  }, [isEscaping, isMouseOverButton, escapeFromCursor, noButtonGone]);

  // Trigger stampede after 5 evasions
  useEffect(() => {
    if (escapeCount >= 3 && !showStampede && !noButtonGone) {
      setShowStampede(true);
      
      // Remove No button after stampede covers it (about 0.3s in)
      setTimeout(() => {
        setNoButtonGone(true);
      }, 300);
      
      // Hide stampede after animation (4 seconds total)
      setTimeout(() => {
        setShowStampede(false);
      }, 4000);
    }
  }, [escapeCount, showStampede, noButtonGone]);

  const handleNoHover = () => {
    if (noButtonGone) return;
    setIsEscaping(true);
    setEscapeCount(prev => prev + 1);
    escapeFromCursor();
  };

  const handleNoClick = () => {
    // No button does nothing - doesn't trigger Yes
    // User has to actually click Yes
  };

  return (
    <div className="yes-no-container" ref={containerRef}>
      <div className="yes-no-question">
        {config.yesNo.question}
      </div>

      <div className="yes-no-buttons">
        <button 
          className={`yes-btn ${value === 'yes' ? 'selected' : ''}`}
          onClick={() => onChange('yes')}
        >
          <span className="btn-emoji">{config.yesNo.yesEmoji}</span>
          <span className="btn-text">{config.yesNo.yesText}</span>
        </button>
        
        {!noButtonGone && (
          <div className="no-btn-wrapper">
            <button 
              ref={noButtonRef}
              className={`no-btn ${value === 'no' ? 'selected' : ''} ${isEscaping ? 'escaping' : ''}`}
              onClick={handleNoClick}
              onMouseEnter={handleNoHover}
              style={{
                transform: `translate(${noPosition.x}px, ${noPosition.y}px)`,
              }}
            >
              <span className="btn-emoji">{config.yesNo.noEmoji}</span>
              <span className="btn-text">{config.yesNo.noText}</span>
            </button>
          </div>
        )}
      </div>

      {/* Stampede overlay */}
      {showStampede && (
        <div className="stampede-overlay">
          <div className="stampede-warning">⚠️ STAMPEDE! ⚠️</div>
          <div className="stampede-dust"></div>
          <div className="stampede-container">
            {[...Array(150)].map((_, i) => (
              <span 
                key={i} 
                className={`stampede-animal ${i % 3 === 0 ? 'wobble' : ''} ${i % 5 === 0 ? 'spin' : ''}`}
                style={{
                  animationDelay: `${0.05 + Math.random() * 3.5}s`,
                  top: `${Math.random() * 95}%`,
                  fontSize: `${3 + Math.random() * 5}rem`,
                  animationDuration: `${0.5 + Math.random() * 0.5}s`,
                }}
              >
                {stampedeAnimals[Math.floor(Math.random() * stampedeAnimals.length)]}
              </span>
            ))}
          </div>
          <div className="stampede-shake"></div>
          <div className="stampede-debris">
            {[...Array(30)].map((_, i) => (
              <span 
                key={i} 
                className="debris-particle"
                style={{
                  animationDelay: `${Math.random() * 3}s`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
              >
                {['💨', '💥', '🌪️', '☁️', '✨'][Math.floor(Math.random() * 5)]}
              </span>
            ))}
          </div>
        </div>
      )}

      {value === 'yes' && (
        <div className="yes-celebration">
          🎉 Great choice! 🎉
        </div>
      )}

      {noButtonGone && !value && (
        <div className="no-button-gone-message">
          Looks like "No" ran away! Only one option left... 😏
        </div>
      )}
    </div>
  );
};
