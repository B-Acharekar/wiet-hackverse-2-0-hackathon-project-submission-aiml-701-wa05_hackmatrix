from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials, auth
import os

# ADD THESE IMPORTS
import sys
sys.path.append("../model")
from utils.inference import MedicalClassifier

load_dotenv()

PORT = os.getenv("PORT")

app = FastAPI(title="Mediseen Backend")

# CORS (allow frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Firebase initialization
cred = credentials.Certificate("firebase_admin.json")
firebase_admin.initialize_app(cred)

# LOAD MODEL (NEW)
classifier = MedicalClassifier(
    model_path="../model/models/pneumonia_resnet50_model.h5",
    class_names=["NORMAL", "PNEUMONIA"]
)

# Request model
class TokenRequest(BaseModel):
    token: str


@app.get("/")
def root():
    return {"message": "Mediseen API Running"}


@app.get("/health")
def health():
    return {"status": "ok"}


# Verify Firebase Token
@app.post("/auth/verify")
def verify_token(data: TokenRequest):

    try:

        decoded_token = auth.verify_id_token(data.token)

        return {
            "status": "verified",
            "uid": decoded_token["uid"],
            "email": decoded_token.get("email")
        }

    except Exception as e:

        raise HTTPException(
            status_code=401,
            detail="Invalid authentication token"
        )


# ---------------------------
# NEW PNEUMONIA PREDICTION API
# ---------------------------

@app.post("/predict/pneumonia")
async def predict_pneumonia(file: UploadFile = File(...)):

    try:

        image_bytes = await file.read()

        result = classifier.predict(image_bytes)

        return {
            "success": True,
            "prediction": result["prediction"],
            "confidence": result["confidence"]
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
