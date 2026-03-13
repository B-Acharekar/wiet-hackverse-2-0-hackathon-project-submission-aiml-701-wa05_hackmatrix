import tensorflow as tf
import os

model_path = os.path.join("models", "pneumonia_resnet50_model.h5")
print(f"Checking path: {os.path.abspath(model_path)}")
if os.path.exists(model_path):
    print("File found. Attempting to load...")
    try:
        model = tf.keras.models.load_model(model_path)
        print("Model loaded successfully!")
        print(model.summary())
    except Exception as e:
        print(f"Error loading model: {e}")
else:
    print("File NOT found at that path.")
