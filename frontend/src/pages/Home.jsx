import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import '../App.css';

function Home() {
const [transcript, setTranscript] = useState(`Wow, what an audience. But if I'm being honest, I don't care what you think of my talk. I care what the internet thinks of my talk. Because they are the ones who get it seen and shared. Most people get it wrong — they're talking to you here, instead of talking to you, random person scrolling Facebook. Thanks for the click.
Back in 2009, we all had these weird little things called attention spans. Yeah, they're gone. We killed them. I'm trying to think of the last time I watched an 18-minute TED talk. It's been years. So if you're giving a TED talk, keep it quick. I'm doing mine in under a minute. I'm at 44 seconds right now; that means we've got time for one final joke.
Why are balloons so expensive? Inflation.`);
 const [summary, setSummary] = useState(`Woody Roseland delivers a humorous and self-aware TEDx talk about the realities of digital attention spans. He emphasizes that in today's online world, it's not the live audience that matters — it's the internet audience. With wit and brevity, he critiques long-form content and advocates for short, impactful messaging. His punchline? A joke about inflation — both economic and comedic.`);
  const [label, setLabel] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [aiEngine, setAiEngine] = useState('gpt4');
  const [videoUrl, setVideoUrl] = useState('');
  const [showChat, setShowChat] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('audio', file);

    try {
      const res = await fetch('http://localhost:5000/api/transcribe', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setTranscript(data.transcript || 'No transcript found');
      setSummary(data.summary || 'No summary found');
      updateHistory(data.transcript, data.summary);
    } catch (err) {
      console.error('Upload error:', err);
    } finally {
      setLoading(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);
      setAudioChunks([]);
      recorder.ondataavailable = (e) => {
        setAudioChunks((prev) => [...prev, e.data]);
      };
      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const formData = new FormData();
        formData.append('audio', audioBlob, 'recording.wav');
        setLoading(true);
        fetch('http://localhost:5000/api/transcribe', {
          method: 'POST',
          body: formData,
        })
          .then((res) => res.json())
          .then((data) => {
            setTranscript(data.transcript || 'No transcript found');
            setSummary(data.summary || 'No summary found');
            updateHistory(data.transcript, data.summary);
          })
          .catch((err) => console.error('Recording error:', err))
          .finally(() => setLoading(false));
      };
      recorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Mic access error:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const updateHistory = (newTranscript, newSummary) => {
    setHistory((prev) => [
      ...prev,
      {
        id: Date.now(),
        label: label.trim() || 'Untitled',
        transcript: newTranscript,
        summary: newSummary,
      },
    ]);
  };

  const handleChat = async () => {
    if (!chatInput.trim()) return;
    const newMessages = [...chatMessages, { type: 'user', text: chatInput }];
    setChatMessages(newMessages);
    setChatInput('');
    try {
      const res = await fetch('http://localhost:5000/api/ask-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: chatInput, engine: aiEngine }),
      });
      const data = await res.json();
      setChatMessages([...newMessages, { type: 'ai', text: data.answer || 'No response received.' }]);
    } catch (err) {
      console.error('AI error:', err);
      setChatMessages([...newMessages, { type: 'ai', text: 'Something went wrong.' }]);
    }
  };

  const improveSummary = async () => {
    if (!summary.trim()) return;
    try {
      const res = await fetch('http://localhost:5000/api/ask-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: `Improve this summary:\n\n${summary}`, engine: aiEngine }),
      });
      const data = await res.json();
      setSummary(data.answer || summary);
    } catch (err) {
      console.error('Summary improvement failed:', err);
    }
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`StudySnap Notes: ${label}`, 10, 20);
    doc.setFontSize(12);
    doc.text('Transcript:', 10, 30);
    doc.text(transcript, 10, 40);
    doc.text('Summary:', 10, 60);
    doc.text(summary, 10, 70);
    doc.save(`${label || 'studysnap'}-notes.pdf`);
  };

  const summarizeVideo = async () => {
    if (!videoUrl.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/summarize-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: videoUrl }),
      });
      const data = await res.json();
      setTranscript(data.transcript || 'No transcript found');
      setSummary(data.summary || 'No summary found');
      updateHistory(data.transcript, data.summary);
    } catch (err) {
      console.error('Video summary error:', err);
    } finally {
      setLoading(false);
    }
  };

  const wordCount = transcript.split(/\s+/).filter(Boolean).length;
  const estimatedTime = Math.ceil(wordCount / 150);

  return (
    <div className="home-page">
      {/* Controls */}
      <input
  type="file"
  accept="audio/*"
  onChange={handleUpload}
/>
      <div className="card controls">
        <input
          type="text"
          placeholder="Enter a label"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        />
        <input
          type="text"
          placeholder="Paste a video URL"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
        />
        <div className="button-group">
          <button onClick={handleUpload}>📤 Upload Audio</button>
          <button onClick={isRecording ? stopRecording : startRecording}>
            {isRecording ? '⏹️ Stop' : '🎙️ Record'}
          </button>
          <button onClick={summarizeVideo}>🔗 Summarize Video</button>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="loading-container">
          <div className="spinner">⏳ Processing...</div>
          <div className="progress-bar"><div className="progress-fill"></div></div>
        </div>
      )}

      {/* Transcript */}
      <div className="card transcript">
        <h2>📝 Transcript</h2>
        <p>{transcript}</p>
        <p><strong>Words:</strong> {wordCount}</p>
        <p><strong>Estimated Time:</strong> {estimatedTime} min</p>
      </div>

      {/* Summary */}
      <div className="card summary">
        <h2>🧾 Summary</h2>
        <textarea
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          rows={5}
          placeholder="Summary will appear here..."
        />
        <div className="button-group">
          <button onClick={improveSummary}>✨ Improve</button>
          <button onClick={exportPDF}>📄 Export PDF</button>
        </div>
      </div>

      {/* AI Chat */}
{showChat && (
  <div className="chat-window">
    <h3>🤖 Chat with AI</h3>
    <select value={aiEngine} onChange={(e) => setAiEngine(e.target.value)}>
      <option value="gpt4">GPT-4</option>
      <option value="gpt4.1">GPT-4.1</option>
      <option value="gemini">Gemini</option>
      <option value="huggingface">Hugging Face</option>
    </select>
    <div className="chat-feed">
      {chatMessages.map((msg, i) => (
        <div key={i} className={`chat-bubble ${msg.type}`}>
          {msg.text}
        </div>
      ))}
    </div>
    <textarea
      placeholder="Ask a question..."
      value={chatInput}
      onChange={(e) => setChatInput(e.target.value)}
      rows={2}
    />
    <button onClick={handleChat}>💬 Send</button>
  </div>
)}

<button className="chat-toggle" onClick={() => setShowChat(!showChat)}>
  💬
</button>

    </div>
  );
}

export default Home;
