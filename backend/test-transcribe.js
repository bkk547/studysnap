// backend/test-transcribe.js

const transcribe = require('./transcribe');
const path = require('path');

const audioPath = path.join(__dirname, 'test.wav');
const transcript = transcribe(audioPath);

console.log('📝 Transcript:\n', transcript);
