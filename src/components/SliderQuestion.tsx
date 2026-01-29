import React, { useState, useRef, useEffect } from 'react';
import { config } from '../config';
import { GhostCursor } from './GhostCursor';
import './SliderQuestion.css';

interface SliderQuestionProps {
  value: number;
  onChange: (value: number) => void;
}

export const SliderQuestion: React.FC<SliderQuestionProps> = ({ onChange }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [displayValue, setDisplayValue] = useState(100);
  const [shownPercentage, setShownPercentage] = useState(100);
  const [isBouncing, setIsBouncing] = useState(false);
  const [showGhost, setShowGhost] = useState(false);
  const [ghostTarget, setGhostTarget] = useState({ x: 0, y: 0 });
  const sliderRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initialValue = Math.floor(Math.random() * (config.slider.maxValue - config.slider.minValue + 1)) + config.slider.minValue;
    onChange(initialValue);
    setShownPercentage(initialValue);
    setDisplayValue(initialValue);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    updateValue(e);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      updateValue(e);
    }
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      
      const startValue = displayValue;
      
      // If already at or above minimum threshold, accept the value as-is
      if (startValue >= config.slider.minValue) {
        onChange(Math.round(startValue));
        return;
      }
      
      // Value is below threshold - need to "correct" it
      const targetValue = Math.floor(Math.random() * (config.slider.maxValue - config.slider.minValue + 1)) + config.slider.minValue;
      
      if (sliderRef.current) {
        const sliderRect = sliderRef.current.getBoundingClientRect();
        
        // Show ghost cursor moving to the target position FIRST
        // Use viewport coordinates since GhostCursor uses position: fixed
        setGhostTarget({ 
          x: sliderRect.left + (targetValue / 100) * sliderRect.width, 
          y: sliderRect.top + sliderRect.height / 2
        });
        setShowGhost(true);
        
        // Wait for ghost to arrive, THEN start the bounce animation
        const ghostArrivalTime = config.ghostCursor.moveSpeed + 100;
        
        setTimeout(() => {
          startBounceAnimation(startValue, targetValue);
        }, ghostArrivalTime);
        
        // Hide ghost after bounce completes
        setTimeout(() => {
          setShowGhost(false);
        }, ghostArrivalTime + 600);
      } else {
        // No ref available, just bounce immediately
        startBounceAnimation(startValue, targetValue);
      }
    }
  };

  const startBounceAnimation = (startValue: number, targetValue: number) => {
    setIsBouncing(true);
    const duration = 500;
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Elastic easing for bouncy effect
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const bounce = Math.sin(progress * Math.PI * 2) * (1 - progress) * 10;
      const newValue = startValue + (targetValue - startValue) * easeOut + bounce;
      
      setDisplayValue(Math.min(100, Math.max(0, newValue)));
      setShownPercentage(Math.round(Math.min(100, Math.max(0, newValue))));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(targetValue);
        setShownPercentage(targetValue);
        onChange(targetValue);
        setIsBouncing(false);
      }
    };
    requestAnimationFrame(animate);
  };

  const updateValue = (e: MouseEvent | React.MouseEvent) => {
    if (!sliderRef.current || isBouncing) return;
    
    const rect = sliderRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    
    setDisplayValue(percentage);
    setShownPercentage(Math.round(percentage));
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, displayValue]);

  const getLabelIndex = () => {
    if (shownPercentage >= 80) return 4;
    if (shownPercentage >= 60) return 3;
    if (shownPercentage >= 40) return 2;
    if (shownPercentage >= 20) return 1;
    return 0;
  };

  return (
    <div className="slider-container" ref={containerRef}>
      <GhostCursor 
        targetX={ghostTarget.x} 
        targetY={ghostTarget.y} 
        visible={showGhost}
        action="Let me adjust that! 📊"
      />
      
      <div className="slider-question">
        {config.slider.question}
      </div>
      
      <div 
        className="slider-track" 
        ref={sliderRef}
        onMouseDown={handleMouseDown}
      >
        <div 
          className={`slider-fill ${isBouncing ? 'bouncing' : ''}`}
          style={{ width: `${displayValue}%` }}
        />
        <div 
          ref={thumbRef}
          className={`slider-thumb ${isBouncing ? 'bouncing' : ''}`}
          style={{ left: `${displayValue}%` }}
        >
          <span className="thumb-value">{shownPercentage}%</span>
        </div>
      </div>
      
      <div className="slider-labels">
        {config.slider.labels.map((label, index) => (
          <span key={label} className={`slider-label ${getLabelIndex() === index ? 'active' : ''}`}>
            {label}
          </span>
        ))}
      </div>
    </div>
  );
};
