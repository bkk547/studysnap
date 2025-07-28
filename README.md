# 🎧 StudySnap

**StudySnap** is a tool I built from scratch to solve a problem I kept running into: long lectures, messy notes, and no time to review. I wanted something that could take a voice recording and turn it into something useful — a clean transcript and a short summary I could actually study from.

So I built it myself.

StudySnap lets you upload or record audio, transcribes it using speech recognition, and summarizes it using natural language processing. It’s fast, simple, and designed to help students and professionals learn smarter.

---

## 🧠 Why I Built It

I was lowkey tired of rewatching lectures and digging through notebooks trying to find what mattered. I thought: what if I could just record the lecture, and get a summary of the key points?

That’s where StudySnap started.

I built the entire stack myself — the frontend in React, the backend in Node.js, and the microservice in Python. I used DeepSpeech for transcription and Hugging Face for summarization. I designed the UI to be clean and intuitive, with features like transcript history, editable summaries, and custom labels for each recording.

This project taught me how to:
- Architect a full-stack app from scratch
- Work with audio and natural language
- Design a user-friendly interface
- Debug real-world problems and optimize performance

---

## 🚀 Interface
- 🎙️ Upload or record audio
- 🧠 Transcription + summarization
- 📁 Transcript history with custom labels
- 📝 Editable summaries
- 💻 Clean, responsive UI

---

## 🛠️ Tech Stack
- Python (Flask, DeepSpeech)
- Node.js (Express, FFmpeg)
- React (Hooks, CSS)
- Hugging Face Transformers

---

## 📸 Screenshots
*Coming soon — UI, summary editor, history timeline*

## 🚀 Live Demo
Check out the live frontend demo hosted on Netlify:  
🔗 [studysnap-demo.netlify.app](https://studysnap-demo.netlify.app)

> Note: The demo showcases the interface. Full speech-to-text functionality requires local setup due to backend limitations.

## 🧠 Features

- 🎤 Offline speech recognition using DeepSpeech
- 🗂️ Organizes transcribed notes by topic
- 🔒 Runs locally for full privacy
- 🧪 Built with Python, PyTorch, and React

---

## ⚙️ Installation

### 1. Clone the repo

```git bash
git clone https://github.com/bkk547/studysnap.git
cd studysnap
```
## 2. Set up the Python backend

```bash
cd backend
pip install -r requirements.txt

```
## 3. Download DeepSpeech model files
⚠️ These files are not included in the repo due to size limits.

Download the following files:

> deepspeech-0.9.3-models.pbmm

> deepspeech-0.9.3-models.scorer

Place them in a folder named models/:
```
backend/
├── models/
│   ├── deepspeech-0.9.3-models.pbmm
│   └── deepspeech-0.9.3-models.scorer
```
## 4. Run your backend

```bash
python app.py

```
## 5. Set up your frontend

```bash
cd ../frontend
npm install
npm start
```

## 🧪 Optional Enhancements

---

### 📄 Exporting Notes as PDF

StudySnap uses [`jspdf`](https://www.npmjs.com/package/jspdf) to allow users to export transcribed notes.

**To use this feature:**

- Ensure the frontend is running (`npm start`)
- Click the **"Export as PDF"** button after transcription

---

### 🤖 AI-Powered Q&A

Users can ask questions about their notes using the AI chat feature.

**This sends a POST request to the backend endpoint:**

```http
POST /api/ask-ai
Content-Type: application/json

{
  "prompt": "Your question here",
  "engine": "gpt4"
}

```
### Troubleshooting 🛠

If you encounter CORS errors, confirm that the proxy is set correctly in:

```bash
frontend/package.json

```
## 📁 Missing DeepSpeech Files

---
**Download and place the required files in:**

```bash
backend/models/

```
## 📬 Contact
Built by Bienvenu Konan  
[LinkedIn](https://www.linkedin.com/public-profile/settings?trk=d_flagship3_profile_self_view_public_profile) • [GitHub](https://github.com/bkk547)

