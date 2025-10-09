from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import MarianMTModel, MarianTokenizer
from functools import lru_cache

app = Flask(__name__)
CORS(app)

# Supported language pairs (you can add more here)
SUPPORTED_LANGS = {
    "en": "English",
    "fr": "French",
    "es": "Spanish",
    "de": "German",
    "hi": "Hindi",
    "zh": "Chinese",
    "ar": "Arabic",
    "ru": "Russian",
    "it": "Italian",
    "ja": "Japanese",
    "ko": "Korean",
    "pt": "Portuguese",
    "ta": "Tamil",
    "ur": "Urdu"
}

# Lazy-load models for language pairs and cache them
@lru_cache(maxsize=12)
def load_model(src, tgt):
    model_name = f"Helsinki-NLP/opus-mt-{src}-{tgt}"
    try:
        tokenizer = MarianTokenizer.from_pretrained(model_name)
        model = MarianMTModel.from_pretrained(model_name)
        print(f"✅ Loaded model: {model_name}")
        return tokenizer, model
    except Exception as e:
        print(f"❌ Could not load {model_name}: {e}")
        return None, None

@app.route("/languages", methods=["GET"])
def get_languages():
    return jsonify(SUPPORTED_LANGS)

@app.route("/translate", methods=["POST"])
def translate_text():
    data = request.json
    text = data.get("text", "").strip()
    src = data.get("source_lang", "en")
    tgt = data.get("target_lang", "fr")

    if not text:
        return jsonify({"error": "No text provided"}), 400
    if src == tgt:
        return jsonify({"translated_text": text})

    tokenizer, model = load_model(src, tgt)
    if tokenizer is None:
        return jsonify({"error": f"No model available for {src}-{tgt}"}), 404

    try:
        inputs = tokenizer(text, return_tensors="pt", padding=True)
        outputs = model.generate(**inputs)
        translation = tokenizer.batch_decode(outputs, skip_special_tokens=True)[0]
        return jsonify({"translated_text": translation})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
