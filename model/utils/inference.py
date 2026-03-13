import tensorflow as tf
import numpy as np
from PIL import Image
import io
import cv2
from utils.preprocessing import preprocess_xray

class MedicalClassifier:
    def __init__(self, model_path, num_classes=2, model_type="resnet", class_names=None):
        # Load trained TensorFlow model
        self.model = tf.keras.models.load_model(model_path)
        self.class_names = class_names if class_names else ["NORMAL", "PNEUMONIA"]
        self.img_size = (224, 224)

    def preprocess(self, image_bytes):
        """
        Convert uploaded image to model-ready tensor with advanced medical preprocessing
        """
        # 1. Load image
        img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        img_np = np.array(img.resize(self.img_size))

        # 2. Apply Modular Preprocessing (CLAHE, Normalization, Bone Suppression)
        processed_img = preprocess_xray(img_np)

        # 3. Final normalization for model input
        img_array = processed_img.astype("float32") / 255.0

        # 4. Add batch dimension
        return np.expand_dims(img_array, axis=0)

    def predict(self, image_bytes):
        """
        Run inference on uploaded image after preprocessing
        """
        img_array = self.preprocess(image_bytes)

        # Run model prediction
        # Assuming binary classification with a single sigmoid output
        raw_output = self.model.predict(img_array, verbose=0)
        prediction = float(raw_output[0][0])

        # Determine label and confidence
        if prediction >= 0.5:
            label = "PNEUMONIA"
            confidence = prediction
        else:
            label = "NORMAL"
            confidence = 1 - prediction

        return {
            "prediction": label,
            "confidence": float(confidence)
        }