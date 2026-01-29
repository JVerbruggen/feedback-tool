import { useState } from 'react';
import { FeedbackCard } from './components/FeedbackCard';
import { StarRating } from './components/StarRating';
import { SliderQuestion } from './components/SliderQuestion';
import { MultiChoice } from './components/MultiChoice';
import { YesNoQuestion } from './components/YesNoQuestion';
import { TextFeedback } from './components/TextFeedback';
import { DinosaurQuestion } from './components/DinosaurQuestion';
import { TrainQuestion } from './components/TrainQuestion';
import { GrandmaQuestion } from './components/GrandmaQuestion';
import { ThankYou } from './components/ThankYou';
import './App.css';

function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({
    stars: 0,
    slider: 100,
    choice: '',
    recommend: '',
    dinosaur: '',
    train: 0,
    grandma: '',
    comments: '',
  });

  const totalSteps = 9; // 8 questions + thank you

  const handleNext = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setAnswers({ stars: 0, slider: 100, choice: '', recommend: '', dinosaur: '', train: 0, grandma: '', comments: '' });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <FeedbackCard
            title="Rate Your Experience"
            subtitle="How would you rate me as a colleague overall?"
            onNext={handleNext}
            showNext={answers.stars > 0}
          >
            <StarRating
              value={answers.stars}
              onChange={(value) => setAnswers((prev) => ({ ...prev, stars: value }))}
            />
          </FeedbackCard>
        );
      case 1:
        return (
          <FeedbackCard
            title="Technical Skills"
            subtitle="Let's dive into the details..."
            onNext={handleNext}
            onBack={handleBack}
            showBack={true}
          >
            <SliderQuestion
              value={answers.slider}
              onChange={(value) => setAnswers((prev) => ({ ...prev, slider: value }))}
            />
          </FeedbackCard>
        );
      case 2:
        return (
          <FeedbackCard
            title="Collaboration"
            subtitle="Almost there..."
            onNext={handleNext}
            onBack={handleBack}
            showBack={true}
            showNext={answers.choice !== ''}
          >
            <MultiChoice
              value={answers.choice}
              onChange={(value) => setAnswers((prev) => ({ ...prev, choice: value }))}
            />
          </FeedbackCard>
        );
      case 3:
        return (
          <FeedbackCard
            title="Recommendation"
            subtitle="A simple question..."
            onNext={handleNext}
            onBack={handleBack}
            showBack={true}
            showNext={answers.recommend !== ''}
          >
            <YesNoQuestion
              value={answers.recommend}
              onChange={(value) => setAnswers((prev) => ({ ...prev, recommend: value }))}
            />
          </FeedbackCard>
        );
      case 4:
        return (
          <FeedbackCard
            title="Prehistoric Performance"
            subtitle="Rate my work in dino-terms! 🦖"
            onNext={handleNext}
            onBack={handleBack}
            showBack={true}
            showNext={answers.dinosaur !== ''}
          >
            <DinosaurQuestion
              value={answers.dinosaur}
              onChange={(value) => setAnswers((prev) => ({ ...prev, dinosaur: value }))}
            />
          </FeedbackCard>
        );
      case 5:
        return (
          <FeedbackCard
            title="All Aboard!"
            subtitle="Pick a station for my performance! 🚂"
            onNext={handleNext}
            onBack={handleBack}
            showBack={true}
            showNext={answers.train > 0}
            wide={true}
          >
            <TrainQuestion
              value={answers.train}
              onChange={(value) => setAnswers((prev) => ({ ...prev, train: value }))}
            />
          </FeedbackCard>
        );
      case 6:
        return (
          <FeedbackCard
            title="Grandma's Opinion"
            subtitle="What does grandma think? 👵"
            onNext={handleNext}
            onBack={handleBack}
            showBack={true}
            showNext={answers.grandma !== ''}
          >
            <GrandmaQuestion
              value={answers.grandma}
              onChange={(value) => setAnswers((prev) => ({ ...prev, grandma: value }))}
            />
          </FeedbackCard>
        );
      case 7:
        return (
          <FeedbackCard
            title="Additional Comments"
            subtitle="Last question!"
            onNext={handleNext}
            onBack={handleBack}
            showBack={true}
            nextLabel="Submit"
          >
            <TextFeedback
              value={answers.comments}
              onChange={(value) => setAnswers((prev) => ({ ...prev, comments: value }))}
            />
          </FeedbackCard>
        );
      case 8:
        return (
          <FeedbackCard
            title=""
            subtitle=""
            showNext={false}
          >
            <ThankYou 
              answers={answers} 
              onRestart={handleRestart} 
            />
          </FeedbackCard>
        );
      default:
        return null;
    }
  };

  // Get background theme based on current step
  const getBackgroundTheme = () => {
    switch (currentStep) {
      case 4: return 'dino-theme';
      case 5: return 'train-theme';
      case 6: return 'grandma-theme';
      default: return 'default-theme';
    }
  };

  return (
    <div className={`app ${getBackgroundTheme()}`}>
      <div className="background-decoration">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
        <div className="theme-decoration">
          <div className="dino-extra"></div>
          <div className="roaming-dino dino-1">🦕</div>
          <div className="roaming-dino dino-2">🦖</div>
          <div className="train-extra"></div>
          <div className="train-cloud-1"></div>
          <div className="train-cloud-2"></div>
        </div>
      </div>
      
      <header className="app-header">
        <h1>Professional Feedback Tool™</h1>
        <p>Totally unbiased. Definitely fair. 100% legitimate.</p>
      </header>

      <main className="app-main">
        <div className="progress-bar">
          {Array.from({ length: totalSteps }, (_, i) => (
            <div
              key={i}
              className={`progress-step ${currentStep >= i ? 'active' : ''} ${
                currentStep === i ? 'current' : ''
              }`}
            />
          ))}
        </div>
        {renderStep()}
      </main>

      <footer className="app-footer">
        <p>© 2026 Definitely Not Rigged Feedback Systems Inc.</p>
      </footer>
    </div>
  );
}

export default App;
