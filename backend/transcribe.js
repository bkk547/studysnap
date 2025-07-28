const fs = require('fs');
const path = require('path');
const { Model } = require('deepspeech');

// Load model and scorer
const modelPath = 'models/deepspeech.pbmm';
const scorerPath = 'models/deepspeech.scorer';

const model = new Model(modelPath);
model.enableExternalScorer(scorerPath);

// Transcribe function
function transcribe(audioFilePath) {
  const audioBuffer = fs.readFileSync(audioFilePath);
  const result = model.stt(audioBuffer);
  return result;
}

module.exports = transcribe;

