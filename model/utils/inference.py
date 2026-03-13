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
        # For GradCAM
        self.last_conv_layer_name = "conv5_block3_out" # Default for ResNet50

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

    def generate_heatmap(self, img_array):
        try:
            img_tensor = tf.convert_to_tensor(img_array)
            grad_model = tf.keras.models.Model(
                inputs=self.model.input,
                outputs=[
                    self.model.get_layer(self.last_conv_layer_name).output,
                    self.model.output
                ]
            )

            with tf.GradientTape() as tape:
                conv_outputs, predictions = grad_model(img_tensor)
                if isinstance(predictions, list):
                    predictions = predictions[0]
                loss = predictions[:, 0]

            grads = tape.gradient(loss, conv_outputs)
            pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))
            conv_outputs = conv_outputs[0]
            heatmap = tf.reduce_sum(conv_outputs * pooled_grads, axis=-1)
            heatmap = tf.maximum(heatmap, 0)
            heatmap = heatmap / (tf.reduce_max(heatmap) + 1e-8)
            return heatmap.numpy()
        except Exception as e:
            print("GradCAM ERROR:", e)
            return None

    def overlay_heatmap(self, original_img, heatmap):
        heatmap = cv2.resize(heatmap, (original_img.shape[1], original_img.shape[0]))
        heatmap = np.uint8(255 * heatmap)
        heatmap = cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)
        overlay = cv2.addWeighted(original_img, 0.6, heatmap, 0.4, 0)
        return overlay

    def predict(self, image_bytes):
        """
        Run inference on uploaded image after preprocessing
        """
        img_array = self.preprocess(image_bytes)

        # Run model prediction
        raw_output = self.model.predict(img_array, verbose=0)
        prediction = float(raw_output[0][0])

        print("RAW MODEL OUTPUT:", prediction)

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
