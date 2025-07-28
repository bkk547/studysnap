// backend/index.js
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const FormData = require('form-data');
const { exec } = require('child_process');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');
require('dotenv').config();
const { Configuration, OpenAIApi } = require('openai');

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(bodyParser.json());

// 💬 Default route
app.get('/', (req, res) => {
  res.send('<h2>🎧 StudySnap Backend is running!</h2><p>Send a POST request to <code>/api/transcribe</code> with an audio file.</p>');
});

// 🗂️ Multer setup: save uploaded file as lecture.wav
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (_, file, cb) => cb(null, 'lecture.wav'),
});
const upload = multer({ storage });

// 🔊 POST /api/transcribe
app.post('/api/transcribe', upload.single('audio'), async (req, res) => {
  const originalPath = path.join(__dirname, 'uploads/lecture.wav');
  const convertedPath = path.join(__dirname, 'uploads/converted.wav');

  try {
    // ⚡ FFmpeg: trim silence + convert to mono 16kHz WAV
    await new Promise((resolve, reject) => {
      const command = `ffmpeg -y -i "${originalPath}" -af silenceremove=1:0:-50dB -ac 1 -ar 16000 -sample_fmt s16 "${convertedPath}"`;
      exec(command, (err) => {
        if (err) {
          console.error('FFmpeg error:', err);
          reject(err);
        } else {
          resolve();
        }
      });
    });

    // 📡 Send trimmed audio to Python microservice
    const form = new FormData();
    form.append('audio', fs.createReadStream(convertedPath));

    const summaryRes = await fetch('http://localhost:6000/transcribe', {
      method: 'POST',
      body: form,
      headers: form.getHeaders()
    });

    const summaryData = await summaryRes.json();

    // ✅ Return transcript + summary to frontend
    res.json({
      transcript: summaryData.transcript || 'No transcript found',
      summary: summaryData.summary || 'No summary found'
    });

    // 🧹 Optional: clean up files after processing
    fs.unlink(originalPath, () => {});
    fs.unlink(convertedPath, () => {});
  } catch (err) {
    console.error('Processing error:', err);
    res.status(500).json({ error: 'Transcription or summarization failed' });
  }
});

// 🤖 POST /api/ask-ai
app.post('/api/ask-ai', async (req, res) => {
  const { prompt, engine } = req.body;

  try {
    if (engine === 'gpt4') {
      const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
      });
      const openai = new OpenAIApi(configuration);

      const response = await openai.createChatCompletion({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'You are a helpful assistant for transcript analysis.' },
          { role: 'user', content: prompt }
        ],
      });

      const answer = response.data.choices[0].message.content;
      res.json({ answer });
    } else if (engine === 'huggingface') {
      const hfResponse = await fetch('https://api-inference.huggingface.co/models/facebook/bart-large-cnn', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ inputs: prompt })
      });

      const hfData = await hfResponse.json();
      const answer = hfData[0]?.summary_text || 'No summary returned.';
      res.json({ answer });
    } else {
      res.status(400).json({ error: 'Invalid engine selected.' });
    }
  } catch (err) {
    console.error('AI error:', err);
    res.status(500).json({ error: 'AI request failed.' });
  }
});

app.listen(PORT, () => {
  console.log(`🎧 Backend listening on port ${PORT}`);
});
