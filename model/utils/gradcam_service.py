import torch
from torchvision import models, transforms
import cv2
import numpy as np
from pytorch_grad_cam import GradCAM
from pytorch_grad_cam.utils.image import show_cam_on_image
from PIL import Image
import io
from utils.preprocessing import preprocess_xray

class AdvancedDensityService:
    def __init__(self, model_type='resnet50'):
        # PyTorch model for Heatmap generation
        self.model = models.resnet50(weights='IMAGENET1K_V1')
        self.target_layers = [self.model.layer4[-1]]
        self.model.eval()
        self.cam = GradCAM(model=self.model, target_layers=self.target_layers)

    def generate_advanced_heatmap(self, image_bytes):
        # 1. Load Original Image
        img_pil = Image.open(io.BytesIO(image_bytes)).convert('RGB')
        img_np = np.array(img_pil.resize((224, 224)))
        
        # 2. Apply Modular Preprocessing (CLAHE + Masking)
        processed_img = preprocess_xray(img_np)
        
        # 3. Prepare tensor for Grad-CAM
        input_transform = transforms.Compose([
            transforms.ToPILImage(),
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
        ])
        input_tensor = input_transform(processed_img).unsqueeze(0)
        
        # 4. Generate Neural Interest Map
        grayscale_cam = self.cam(input_tensor=input_tensor, targets=None)[0, :]

        # 5. Extract Feature Density from preprocessed image
        gray_processed = cv2.cvtColor(processed_img, cv2.COLOR_RGB2GRAY)
        density_map = gray_processed.astype(np.float32) / 255.0
        
        # 6. Hybrid Fusion: Neural Analysis + Pixel-level Density
        # Weighted higher towards Neural (0.7) to identify pneumonia vs normal bone density
        combined_map = (grayscale_cam * 0.7) + (density_map * 0.3)
        combined_map = (combined_map - combined_map.min()) / (combined_map.max() - combined_map.min() + 1e-8)

        # 7. Final Overlay on the ORIGINAL image (so user recognizes it)
        rgb_img_norm = img_np.astype(np.float32) / 255.0
        visualization = show_cam_on_image(rgb_img_norm, combined_map, use_rgb=True)
        
        # BGR for OpenCV encoding
        visualization_bgr = cv2.cvtColor(visualization, cv2.COLOR_RGB2BGR)
        _, buffer = cv2.imencode('.jpg', visualization_bgr)
        return buffer.tobytes()

# Global singleton
density_service = None

def get_density_service():
    global density_service
    if density_service is None:
        density_service = AdvancedDensityService()
    return density_service
