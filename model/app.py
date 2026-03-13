from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from utils.inference import MedicalClassifier
import uvicorn
import os

app = FastAPI(title="Pneumonia Detection & Heatmap API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

PNEUMONIA_CLASSES = ["NORMAL", "PNEUMONIA"]

# Actual path: model/models/pneumonia_resnet50_model.h5
model_path = os.path.join("models", "pneumonia_resnet50_model.h5")

pneumonia_model = MedicalClassifier(
    model_path=model_path,
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

@app.post("/generate-heatmap")
async def generate_heatmap_endpoint(file: UploadFile = File(...)):
    """
    Generates an advanced Pixel-Accurate Density Map using Grad-CAM and Histogram Equalization.
    """
    try:
        from utils.gradcam_service import get_density_service
        from fastapi.responses import Response
        
        # Load service
        service = get_density_service()
        
        # Read image
        image_bytes = await file.read()
        
        # Process advanced density heatmap
        heatmap_bytes = service.generate_advanced_heatmap(image_bytes)
        
        return Response(content=heatmap_bytes, media_type="image/jpeg")
        
    except Exception as e:
        print(f"Heatmap generation error: {e}")
        raise HTTPException(status_code=500, detail=f"Advanced Mapping Failed: {str(e)}")


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8005)