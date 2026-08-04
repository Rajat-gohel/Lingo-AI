from pathlib import Path
import pickle
import io
import re
import requests

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from gtts import gTTS


# =====================================================
# LOAD MODEL
# =====================================================

BASE_DIR = Path(__file__).resolve().parent

with open(BASE_DIR / "language_model.pkl", "rb") as f:
    model = pickle.load(f)

with open(BASE_DIR / "vectorizer.pkl", "rb") as f:
    vectorizer = pickle.load(f)


# =====================================================
# APP
# =====================================================

app = FastAPI(
    title="Language Translator API",
    version="1.0"
)


# =====================================================
# CORS
# =====================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =====================================================
# LANGUAGES
# =====================================================

LANGUAGES = {
    "English": ("en", "en", "🇬🇧"),
    "Gujarati": ("gu", "gu", "🇮🇳"),
    "Hindi": ("hi", "hi", "🇮🇳"),
    "Marathi": ("mr", "mr", "🇮🇳"),
    "Bengali": ("bn", "bn", "🇮🇳"),
    "Punjabi": ("pa", "pa", "🇮🇳"),
    "Tamil": ("ta", "ta", "🇮🇳"),
    "Telugu": ("te", "te", "🇮🇳"),
    "Kannada": ("kn", "kn", "🇮🇳"),
    "Malayalam": ("ml", "ml", "🇮🇳"),
    "Arabic": ("ar", "ar", "🇸🇦"),
    "French": ("fr", "fr", "🇫🇷"),
    "Spanish": ("es", "es", "🇪🇸"),
    "German": ("de", "de", "🇩🇪"),
    "Russian": ("ru", "ru", "🇷🇺"),
    "Japanese": ("ja", "ja", "🇯🇵"),
    "Chinese": ("zh-CN", "zh-CN", "🇨🇳"),
    "Korean": ("ko", "ko", "🇰🇷"),
    "Urdu": ("ur", "ur", "🇵🇰"),
    "Persian": ("fa", "fa", "🇮🇷"),
    "Turkish": ("tr", "tr", "🇹🇷"),
    "Dutch": ("nl", "nl", "🇳🇱"),
    "Portuguese": ("pt", "pt", "🇵🇹"),
    "Thai": ("th", "th", "🇹🇭"),
    "Romanian": ("ro", "ro", "🇷🇴"),
    "Swedish": ("sv", "sv", "🇸🇪"),
}


# =====================================================
# REQUEST MODELS
# =====================================================

class TextRequest(BaseModel):
    text: str


class TranslateRequest(BaseModel):
    text: str
    target_language: str


class SpeakRequest(BaseModel):
    text: str
    language: str


# =====================================================
# SCRIPT DETECTION
# =====================================================

def detect_script(text):

    if re.search(r"[\u0A80-\u0AFF]", text):
        return "Gujarati"

    if re.search(r"[\u0900-\u097F]", text):
        return "Hindi"

    if re.search(r"[\u0980-\u09FF]", text):
        return "Bengali"

    if re.search(r"[\u0A00-\u0A7F]", text):
        return "Punjabi"

    if re.search(r"[\u0B80-\u0BFF]", text):
        return "Tamil"

    if re.search(r"[\u0C00-\u0C7F]", text):
        return "Telugu"

    if re.search(r"[\u0C80-\u0CFF]", text):
        return "Kannada"

    if re.search(r"[\u0D00-\u0D7F]", text):
        return "Malayalam"

    if re.search(r"[\u0600-\u06FF]", text):
        return "Arabic"

    if re.search(r"[\u3040-\u30FF]", text):
        return "Japanese"

    if re.search(r"[\uAC00-\uD7AF]", text):
        return "Korean"

    if re.search(r"[\u4E00-\u9FFF]", text):
        return "Chinese"

    return None


# =====================================================
# DETECT LANGUAGE
# =====================================================

def detect_language(text):

    # First detect script
    script = detect_script(text)

    if script:
        return script

    # Otherwise use ML model
    try:

        features = vectorizer.transform([text])

        prediction = model.predict(features)[0]

        prediction = str(prediction)

        if prediction == "Portugese":
            prediction = "Portuguese"

        if prediction == "Pushto":
            prediction = "Pashto"

        if prediction in LANGUAGES:
            return prediction

    except Exception as e:

        print("Detection error:", e)

    return "English"


# =====================================================
# GOOGLE TRANSLATE DIRECT REQUEST
# =====================================================

def google_translate(text, source, target):

    url = "https://translate.googleapis.com/translate_a/single"

    params = {
        "client": "gtx",
        "sl": source,
        "tl": target,
        "dt": "t",
        "q": text
    }

    response = requests.get(
        url,
        params=params,
        timeout=15
    )

    response.raise_for_status()

    data = response.json()

    translated = ""

    for item in data[0]:

        if item[0]:
            translated += item[0]

    return translated


# =====================================================
# HOME
# =====================================================

@app.get("/")
def home():

    return {
        "success": True,
        "message": "Language Translator API is running"
    }


# =====================================================
# HEALTH
# =====================================================

@app.get("/health")
def health():

    return {
        "success": True,
        "model": True,
        "vectorizer": True,
        "translator": True
    }


# =====================================================
# LANGUAGES
# =====================================================

@app.get("/languages")
def get_languages():

    result = []

    for name, data in LANGUAGES.items():

        result.append({
            "name": name,
            "code": data[0],
            "tts": data[1],
            "flag": data[2]
        })

    return {
        "success": True,
        "languages": result
    }


# =====================================================
# DETECT
# =====================================================

@app.post("/detect")
def detect(request: TextRequest):

    text = request.text.strip()

    if not text:

        return {
            "success": False,
            "message": "Please enter text"
        }

    language = detect_language(text)

    code, tts, flag = LANGUAGES.get(
        language,
        LANGUAGES["English"]
    )

    return {
        "success": True,
        "text": text,
        "language": language,
        "code": code,
        "tts": tts,
        "flag": flag
    }


# =====================================================
# TRANSLATE
# =====================================================

@app.post("/translate")
def translate(request: TranslateRequest):

    text = request.text.strip()

    target = request.target_language.strip()

    if not text:

        return {
            "success": False,
            "message": "Please enter text"
        }

    if target not in LANGUAGES:

        return {
            "success": False,
            "message": "Invalid target language"
        }

    # Detect source
    source = detect_language(text)

    source_code = LANGUAGES[source][0]
    target_code = LANGUAGES[target][0]

    try:

        # Same language
        if source_code == target_code:

            translated = text

        else:

            translated = google_translate(
                text,
                source_code,
                target_code
            )

        return {

            "success": True,

            "source_language": source,

            "source_code": source_code,

            "target_language": target,

            "target_code": target_code,

            "translated_text": translated
        }

    except Exception as e:

        print("Translation error:", e)

        return {

            "success": False,

            "message": "Translation failed",

            "error": str(e)
        }


# =====================================================
# SPEAK
# =====================================================

@app.post("/speak")
def speak(request: SpeakRequest):

    text = request.text.strip()

    language = request.language.strip()

    if not text:

        return {
            "success": False,
            "message": "Please enter text"
        }

    if language not in LANGUAGES:

        return {
            "success": False,
            "message": "Invalid language"
        }

    try:

        audio = io.BytesIO()

        tts = gTTS(
            text=text,
            lang=LANGUAGES[language][1]
        )

        tts.write_to_fp(audio)

        audio.seek(0)

        return StreamingResponse(
            audio,
            media_type="audio/mpeg"
        )

    except Exception as e:

        return {
            "success": False,
            "message": "Voice generation failed",
            "error": str(e)
        }