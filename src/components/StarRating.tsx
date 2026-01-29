import React, { useState, useRef } from 'react';
import { config } from '../config';
import { GhostCursor } from './GhostCursor';
import './StarRating.css';

interface StarRatingProps {
  value: number;
  onChange: (value: number) => void;
}

export const StarRating: React.FC<StarRatingProps> = ({ value, onChange }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldFillStars, setShouldFillStars] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);
  const [clickedPosition, setClickedPosition] = useState<number | null>(null);
  const [showGhost, setShowGhost] = useState(false);
  const [ghostTarget, setGhostTarget] = useState({ x: 0, y: 0 });
  const starRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleClick = (star: number) => {
    if (isAnimating) return;
    
    if (star < config.starRating.minStars) {
      setIsAnimating(true);
      setClickedPosition(star);
      setShouldFillStars(false); // Don't fill yet
      
      // Show ghost cursor moving to 5th star FIRST
      // Use viewport coordinates since GhostCursor uses position: fixed
      const fifthStar = starRefs.current[4];
      if (fifthStar) {
        const starRect = fifthStar.getBoundingClientRect();
        setGhostTarget({ 
          x: starRect.left + starRect.width / 2, 
          y: starRect.top + starRect.height / 2 
        });
        setShowGhost(true);
      }
      
      // Wait for ghost to arrive (moveSpeed), THEN animate the stars
      const ghostArrivalTime = config.ghostCursor.moveSpeed + 200;
      
      setTimeout(() => {
        // NOW fill the stars after ghost has arrived
        setShouldFillStars(true);
        onChange(config.starRating.minStars);
      }, ghostArrivalTime);
      
      // Hide ghost and reset after animation completes
      setTimeout(() => {
        setIsAnimating(false);
        setClickedPosition(null);
        setShowGhost(false);
      }, ghostArrivalTime + 500);
    } else {
      onChange(config.starRating.minStars);
    }
  };

  const displayValue = hovered ?? value;

  return (
    <div className="star-rating-container" ref={containerRef}>
      <GhostCursor 
        targetX={ghostTarget.x} 
        targetY={ghostTarget.y} 
        visible={showGhost}
        action="Let me help! ⭐"
      />
      
      <div className={`star-rating ${isAnimating ? 'animating' : ''}`}>
        {/* Reverse psychology hint - makes them want to try lower ratings */}
        {value === 0 && !isAnimating && (
          <div className="psychology-hint">
            <span className="hint-arrow">←</span>
            <span className="hint-text">Please give 5 stars! It's the only option that works properly!</span>
          </div>
        )}
        {[1, 2, 3, 4, 5].map((star, index) => (
          <button
            key={star}
            ref={el => { starRefs.current[index] = el; }}
            className={`star ${displayValue >= star ? 'filled' : ''} ${
              shouldFillStars && star <= 5 ? 'force-fill' : ''
            } ${clickedPosition && star > clickedPosition ? 'slide-in' : ''}`}
            onClick={() => handleClick(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(null)}
            disabled={isAnimating}
            style={{
              animationDelay: shouldFillStars ? `${(star - 1) * 0.1}s` : '0s',
            }}
          >
            <svg viewBox="0 0 24 24" className="star-icon">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </button>
        ))}
      </div>
      <div className="rating-label">
        {value === config.starRating.minStars ? "⭐⭐⭐⭐⭐" : "Select your rating"}
      </div>
    </div>
  );
};
