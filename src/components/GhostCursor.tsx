import React, { useState, useEffect } from 'react';
import { config } from '../config';
import './GhostCursor.css';

interface GhostCursorProps {
  targetX: number;
  targetY: number;
  visible: boolean;
  action?: string;
}

export const GhostCursor: React.FC<GhostCursorProps> = ({ targetX, targetY, visible, action }) => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (visible && config.ghostCursor.enabled) {
      // Start from off-screen
      setPosition({ x: window.innerWidth + 50, y: targetY });
      setIsVisible(true);
      
      // Animate to target
      setTimeout(() => {
        setPosition({ x: targetX, y: targetY });
      }, 50);
      
      // Hide after action
      setTimeout(() => {
        setIsVisible(false);
      }, config.ghostCursor.interventionDelay + config.ghostCursor.moveSpeed);
    }
  }, [visible, targetX, targetY]);

  if (!config.ghostCursor.enabled || !isVisible) return null;

  return (
    <div 
      className="ghost-cursor"
      style={{
        left: position.x,
        top: position.y,
        transition: `all ${config.ghostCursor.moveSpeed}ms ease-out`,
      }}
    >
      <svg className="cursor-icon" viewBox="0 0 24 24" width="24" height="24">
        <path 
          d="M4 4 L4 20 L8 16 L12 22 L14 21 L10 15 L16 15 Z" 
          fill="#667eea" 
          stroke="#fff" 
          strokeWidth="1.5"
        />
      </svg>
      {config.ghostCursor.showNameLabel && (
        <div className="cursor-label">
          {config.ghostCursorName}
          {action && <span className="cursor-action">{action}</span>}
        </div>
      )}
    </div>
  );
};
