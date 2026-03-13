from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from utils.inference import MedicalClassifier
import uvicorn

app = FastAPI(title="Pneumonia Detection API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

PNEUMONIA_CLASSES = ["NORMAL", "PNEUMONIA"]

pneumonia_model = MedicalClassifier(
    model_path="models/pneumonia_resnet50_model.h5",
    class_names=PNEUMONIA_CLASSES
)


@app.post("/predict/pneumonia")
async def predict_pneumonia(file: UploadFile = File(...)):
    
    image_content = await file.read()

    result = pneumonia_model.predict(image_content)

    return {
        "model": "Pneumonia-ResNet50",
        "filename": file.filename,
        "prediction": result["prediction"],
        "confidence": f"{result['confidence'] * 100:.2f}%"
    }


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)