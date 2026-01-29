// ============================================
// FEEDBACK TOOL CONFIGURATION
// ============================================
// Customize this file to personalize the feedback tool
// All settings are centralized here for easy modification

export const config = {
  // ============================================
  // PERSONAL INFO
  // ============================================
  name: 'Jurjen',
  role: 'Software Engineer',
  
  // ============================================
  // BRANDING & TEXT
  // ============================================
  appTitle: 'Professional Feedback Tool™',
  appSubtitle: 'Totally unbiased. Definitely fair. 100% legitimate.',
  footerText: '© 2026 Definitely Not Rigged Feedback Systems Inc.',
  
  // The fake "helper" cursor name shown nudging things
  ghostCursorName: 'Jurjen\'s Assistant',
  
  // ============================================
  // QUESTION 1: STAR RATING
  // ============================================
  starRating: {
    title: 'Rate Your Experience',
    subtitle: 'How would you rate me as a colleague overall?',
    question: 'Overall rating',
    minStars: 5, // Stars will always end up at this value
  },
  
  // ============================================
  // QUESTION 2: SLIDER
  // ============================================
  slider: {
    title: 'Technical Skills',
    subtitle: 'Let\'s dive into the details...',
    question: 'How would you rate my problem-solving skills?',
    minValue: 80,  // Minimum value slider can land on
    maxValue: 100, // Maximum value slider can land on
    labels: ['Poor', 'Fair', 'Good', 'Great', 'Outstanding'],
  },
  
  // ============================================
  // QUESTION 3: MULTIPLE CHOICE
  // ============================================
  multiChoice: {
    title: 'Collaboration',
    subtitle: 'Almost there...',
    question: 'How would you describe my collaboration skills?',
    // Only these options will remain (others disappear when clicked)
    allowedOptions: ['exceptional', 'excellent'],
    options: [
      { id: 'exceptional', label: 'Exceptional - Promotes innovative solutions', emoji: '🚀' },
      { id: 'excellent', label: 'Excellent - Consistently exceeds expectations', emoji: '⭐' },
      { id: 'good', label: 'Good - Meets expectations', emoji: '👍' },
      { id: 'average', label: 'Average - Room for improvement', emoji: '😐' },
      { id: 'poor', label: 'Poor - Needs significant work', emoji: '📉' },
    ],
  },
  
  // ============================================
  // QUESTION 4: YES/NO
  // ============================================
  yesNo: {
    title: 'Recommendation',
    subtitle: 'A simple question...',
    question: 'Would you recommend me as a team member?',
    yesText: 'Absolutely Yes!',
    noText: 'No',
    yesEmoji: '👍',
    noEmoji: '👎',
  },
  
  // ============================================
  // QUESTION 5: TEXT FEEDBACK
  // ============================================
  textFeedback: {
    title: 'Additional Comments',
    subtitle: 'Last question!',
    question: 'Any additional comments about working with me?',
    placeholder: 'Type your feedback here...',
  },
  
  // ============================================
  // THANK YOU PAGE
  // ============================================
  thankYou: {
    title: 'Thank You!',
    subtitle: 'Your feedback has been recorded',
    summaryTitle: 'Your Feedback Summary:',
    restartButtonText: 'Submit Another Review 🔄',
    labels: {
      stars: 'Overall Rating',
      slider: 'Problem Solving',
      choice: 'Collaboration',
      recommend: 'Recommended',
      comments: 'Comments',
    },
  },
  
  // ============================================
  // GHOST CURSOR SETTINGS
  // ============================================
  ghostCursor: {
    enabled: true,
    showNameLabel: true,
    // How often the ghost cursor "helps" (in milliseconds)
    interventionDelay: 800,
    // Cursor movement speed
    moveSpeed: 300,
  },
};

export default config;
