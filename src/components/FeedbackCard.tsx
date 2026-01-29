import React from 'react';
import './FeedbackCard.css';

interface FeedbackCardProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  onNext?: () => void;
  onBack?: () => void;
  showBack?: boolean;
  showNext?: boolean;
  nextLabel?: string;
  wide?: boolean;
}

export const FeedbackCard: React.FC<FeedbackCardProps> = ({
  children,
  title,
  subtitle,
  onNext,
  onBack,
  showBack = false,
  showNext = true,
  nextLabel = 'Next',
  wide = false,
}) => {
  return (
    <div className={`feedback-card ${wide ? 'wide' : ''}`}>
      <div className="card-content">
        <h1 className="card-title">{title}</h1>
        <p className="card-subtitle">{subtitle}</p>
        <div className="card-body">{children}</div>
      </div>
      <div className="card-actions">
        {showBack && (
          <button className="btn btn-secondary" onClick={onBack}>
            Back
          </button>
        )}
        {showNext && (
          <button className="btn btn-primary" onClick={onNext}>
            {nextLabel}
          </button>
        )}
      </div>
    </div>
  );
};
