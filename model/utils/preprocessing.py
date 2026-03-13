import cv2
import numpy as np
from PIL import Image
from skimage import exposure

def preprocess_xray(image_np):
    """
    Advanced X-ray preprocessing:
    1. CLAHE for contrast enhancement
    2. Histogram Normalization
    3. Bone suppression (Heuristic masking)
    4. Denoising
    """
    # Ensure image is grayscale for processing
    if len(image_np.shape) == 3:
        gray = cv2.cvtColor(image_np, cv2.COLOR_RGB2GRAY)
    else:
        gray = image_np

    # 1. CLAHE (Contrast Limited Adaptive Histogram Equalization)
    # Enhances lung micro-structures
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    enhanced = clahe.apply(gray)

    # 2. Histogram-based Intensity Normalization
    # Stretching the intensity to full range [0, 255]
    normalized = cv2.normalize(enhanced, None, 0, 255, cv2.NORM_MINMAX)

    # 3. Bone Interference Reduction (Bilateral Filtering)
    # Smooths out rib edges while preserving lung boundaries
    denoised = cv2.bilateralFilter(normalized, d=9, sigmaColor=75, sigmaSpace=75)

    # 4. Generate Lung-Centric Mask (Anatomical Intelligence)
    # This helps Grad-CAM focus on lung parenchyma and ignore shoulders
    mask = np.ones_like(denoised, dtype=np.float32)
    h, w = denoised.shape
    
    # Hide Shoulders (top corners)
    quarter_h = int(h * 0.25)
    quarter_w = int(w * 0.25)
    cv2.rectangle(mask, (0, 0), (quarter_w, quarter_h), 0, -1)
    cv2.rectangle(mask, (w - quarter_w, 0), (w, quarter_h), 0, -1)
    
    # Hide Spine/Sternum (vertical center)
    sp_w = int(w * 0.15)
    center = w // 2
    cv2.rectangle(mask, (center - sp_w//2, 0), (center + sp_w//2, h), 0.2, -1)
    
    # Smooth the mask to avoid sharp edges in heatmap
    mask = cv2.GaussianBlur(mask, (51, 51), 0)
    
    # Apply mask to the processed image for visualization/inference
    final_processed = (denoised.astype(np.float32) * mask).astype(np.uint8)
    
    # Convert back to RGB for ResNet/EfficientNet compatibility
    return cv2.cvtColor(final_processed, cv2.COLOR_GRAY2RGB)
