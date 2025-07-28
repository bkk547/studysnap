import React from 'react';

function Tutorial() {
  const steps = [
    {
      title: '🎙️ Step 1: Record or Upload Audio',
      description:
        'Use StudySnap to record live audio or upload a file. We’ll transcribe everything in a few seconds.',
    },
    {
      title: '🧠 Step 2: Get Instant Summary',
      description:
        'We’ll give you a concise summary of the transcript so you don’t have to sift through everything manually.',
    },
    {
      title: '🤖 Step 3: Chat with AI',
      description:
        'You can ask StudySnap questions about your transcript. Use GPT-4, Gemini, or other AI engines.',
    },
    {
      title: '📄 Step 4: Export Your Notes',
      description:
        'Save your work as a PDF for school, meetings, or review. One click. Easy.',
    },
    {
      title: '📁 Step 5: View Your History',
      description:
        'Check your previous recordings anytime in the History tab. StudySnap remembers for you.',
    },
  ];

  return (
    <div className="card tutorial-page">
      <h2>📘 Welcome to StudySnap</h2>
      <p>This app turns your voice into organized study notes, with the help of some powerful AI friends.</p>

      <div className="tutorial-steps">
        {steps.map((step, i) => (
          <div key={i} className="tutorial-step">
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </div>
        ))}
      </div>

      <p style={{ marginTop: '2rem', fontStyle: 'italic' }}>
        ⚡ Pro tip: You can switch between light/dark modes and choose your favorite AI engine. Stay productive, your way.
      </p>
    </div>
  );
}

export default Tutorial;
