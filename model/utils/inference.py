import tensorflow as tf
import numpy as np
from PIL import Image
import io

class MedicalClassifier:
    def __init__(self, model_path, num_classes=2, model_type="resnet", class_names=None):

        # Load trained model
        self.model = tf.keras.models.load_model(model_path)

        # Class labels
        self.class_names = class_names if class_names else ["NORMAL", "PNEUMONIA"]

        # Store input size
        self.img_size = (224, 224)

    def preprocess(self, image_bytes):
        """
        Convert uploaded image to model-ready tensor
        """

        # Load image
        img = Image.open(io.BytesIO(image_bytes)).convert("RGB")

        # Resize to training size
        img = img.resize(self.img_size)

        # Convert to numpy
        img_array = np.array(img).astype("float32")

        # Normalize (same as training)
        img_array = img_array / 255.0

        img_array = np.expand_dims(img_array, axis=0)

        return img_array

    def predict(self, image_bytes):
        """
        Run inference on uploaded image
        """

        img_array = self.preprocess(image_bytes)

        # Run model prediction

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

                # Fix if predictions return as list
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

        img_array = self.preprocess(image_bytes)

        prediction = float(self.model.predict(img_array, verbose=0)[0][0])

        print("RAW MODEL OUTPUT:", prediction)

        # Determine label

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

