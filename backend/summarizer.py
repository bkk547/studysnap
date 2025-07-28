from flask import Flask, request, jsonify
from transformers import pipeline
from deepspeech import Model
import numpy as np
import wave
import os

app = Flask(__name__)

# 🔊 Load DeepSpeech model and scorer
MODEL_PATH = r"C:\Users\BienvenuKonan\Projects\studysnap\backend\models\deepspeech-0.9.3-models.pbmm"
SCORER_PATH = r"C:\Users\BienvenuKonan\Projects\studysnap\backend\models\deepspeech-0.9.3-models.scorer"

ds = Model(MODEL_PATH)
ds.enableExternalScorer(SCORER_PATH)

# 🧠 Load Hugging Face summarization pipeline (lighter + memory-friendly)
def get_summarizer():
    try:
        return pipeline("summarization", model="sshleifer/distilbart-cnn-6-6")
    except:
        return pipeline("summarization")  # fallback to default if still too heavy

def transcribe(audio_path):
    with wave.open(audio_path, 'rb') as wf:
        frames = wf.getnframes()
        buffer = wf.readframes(frames)
        data16 = np.frombuffer(buffer, dtype=np.int16)
        return ds.stt(data16)

@app.route("/transcribe", methods=["POST"])
def transcribe_and_summarize():
    try:
        audio_file = request.files.get("audio")
        if not audio_file:
            return jsonify({"error": "No audio file provided"}), 400

        audio_path = "lecture.wav"
        audio_file.save(audio_path)

        # 📝 Transcription
        transcript = transcribe(audio_path)
        print("Transcript:", transcript)

        if not transcript.strip():
            return jsonify({"error": "Empty transcript"}), 400

        # 🧠 Summarization (only load model when needed)
        summarizer = get_summarizer()
        summary = summarizer(
            transcript, max_length=60, min_length=20, do_sample=False
        )[0]["summary_text"]

        return jsonify({
            "transcript": transcript,
            "summary": summary
        })

    except Exception as e:
        print("Error:", e)
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(port=6000)
