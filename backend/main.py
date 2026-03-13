from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials, auth
import os
import httpx
import json
import uuid
import traceback
from fastapi.responses import FileResponse

# ADD THESE IMPORTS
import sys
sys.path.append("../model")
from utils.inference import MedicalClassifier

load_dotenv()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

app = FastAPI(title="Mediseen Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Firebase initialization
if os.path.exists("firebase_admin.json"):
    cred = credentials.Certificate("firebase_admin.json")
    firebase_admin.initialize_app(cred)
else:
    firebase_admin.initialize_app(options={
        'projectId': os.getenv("FIREBASE_PROJECT_ID", "mediseen")
    })

<<<<<<< HEAD
=======
# LOAD MODEL (NEW)
classifier = MedicalClassifier(
    model_path="../model/models/pneumonia_resnet50_model.h5",
    class_names=["NORMAL", "PNEUMONIA"]
)

# Request model
>>>>>>> 711b9ddb24bee9afe280d96332ebe9a89cfb97bb
class TokenRequest(BaseModel):
    token: str

@app.get("/")
def root():
    return {"message": "Mediseen API Running"}

@app.post("/auth/verify")
async def verify_token(data: TokenRequest):
    try:
        decoded_token = auth.verify_id_token(data.token)
        return {"status": "verified", "uid": decoded_token["uid"]}
    except:
        raise HTTPException(status_code=401, detail="Invalid token")

@app.get("/heatmap/{image_id}")
async def get_heatmap(image_id: str):
    path = os.path.join(UPLOAD_DIR, f"{image_id}_heatmap.jpg")
    if os.path.exists(path):
        return FileResponse(path)
    raise HTTPException(status_code=404, detail="Heatmap not found")

@app.post("/predict")
async def predict_image(image: UploadFile = File(...)):
    image_content = await image.read()
    
    # Defaults
    prediction = "Analysis Error"
    confidence = 0.0
    heatmap_url = None 
    model_name = "Model-Offline"
    status_msg = "Please ensure the AI model server is running on port 8005."

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            # 1. Get Prediction
            predict_response = await client.post(
                "http://localhost:8005/predict/pneumonia", 
                files={"file": (image.filename, image_content, "image/jpeg")}
            )
            
            if predict_response.status_code == 200:
                result = predict_response.json()
                prediction = result["prediction"]
                confidence = float(result["confidence"].strip('%')) / 100.0
                model_name = result["model"]
                status_msg = f"Inference run by {model_name}."
            else:
                print(f"Prediction server error: {predict_response.status_code} - {predict_response.text}")

            # 2. Get Grad-CAM Heatmap
            heatmap_gen_response = await client.post(
                "http://localhost:8005/generate-heatmap",
                files={"file": (image.filename, image_content, "image/jpeg")}
            )
            
            if heatmap_gen_response.status_code == 200:
                image_id = str(uuid.uuid4())
                heatmap_path = os.path.join(UPLOAD_DIR, f"{image_id}_heatmap.jpg")
                with open(heatmap_path, "wb") as f:
                    f.write(heatmap_gen_response.content)
                heatmap_url = f"http://localhost:8000/heatmap/{image_id}"
            else:
                print(f"Heatmap server error: {heatmap_gen_response.status_code} - {heatmap_gen_response.text}")

    except Exception as e:
        traceback.print_exc()
        print(f"Backend-to-Model connection failed: {e}")

<<<<<<< HEAD
    return {
        "prediction": prediction,
        "confidence": confidence,
        "heatmap_url": heatmap_url,
        "explanation": f"{status_msg} Analysis suggests indicators of {prediction}.",
        "diseaseId": "pneumonia",
        "nextSteps": [
            "Verify the AI model server (Port 8005) is active",
            "Consult a specialist for clinical confirmation",
            "Verify image quality/orientation"
        ],
        "severity": "medium" if prediction == "PNEUMONIA" else "low"
    }
=======
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
            "confidence": result["confidence"],
            "heatmap": result["heatmap"],          # 👈 send heatmap
            "affected_area": result["affected_area"]  # 👈 send severity data
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

>>>>>>> 711b9ddb24bee9afe280d96332ebe9a89cfb97bb
