import tensorflow as tf
import numpy as np
import cv2


def make_gradcam_heatmap(img_array, model, last_conv_layer_name="conv5_block3_out"):

    grad_model = tf.keras.models.Model(
        [model.inputs],
        [model.get_layer(last_conv_layer_name).output, model.output]
    )

    with tf.GradientTape() as tape:

        conv_outputs, predictions = grad_model(img_array)

        loss = predictions[:, 0]

    grads = tape.gradient(loss, conv_outputs)

    pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))

    conv_outputs = conv_outputs[0]

    heatmap = conv_outputs @ pooled_grads[..., tf.newaxis]

    heatmap = tf.squeeze(heatmap)

    heatmap = np.maximum(heatmap, 0)

    # Normalize safely
    heatmap /= (np.max(heatmap) + 1e-8)

    # Remove weak activations (noise reduction)
    heatmap = np.where(heatmap > 0.4, heatmap, 0)

    return heatmap.numpy()


def create_lung_mask(image):

    """
    Creates a rough lung region mask using threshold + morphology
    """

    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Binary threshold
    _, mask = cv2.threshold(gray, 40, 255, cv2.THRESH_BINARY)

    # Blur to smooth edges
    mask = cv2.GaussianBlur(mask, (25, 25), 0)

    # Normalize
    mask = mask / 255.0

    return mask


def overlay_heatmap(original_img, heatmap, alpha=0.7):

    h, w = original_img.shape[:2]

    heatmap = cv2.resize(heatmap, (w, h))

    # normalize heatmap
    heatmap = heatmap / (np.max(heatmap) + 1e-8)

    # remove weak activations (noise)
    heatmap = np.where(heatmap > 0.6, heatmap, 0)

    # convert to grayscale for masking
    gray = cv2.cvtColor(original_img, cv2.COLOR_BGR2GRAY)

    # stronger threshold to isolate chest
    _, lung_mask = cv2.threshold(gray, 30, 255, cv2.THRESH_BINARY)

    # remove small regions
    kernel = np.ones((15,15), np.uint8)
    lung_mask = cv2.morphologyEx(lung_mask, cv2.MORPH_CLOSE, kernel)

    lung_mask = lung_mask / 255.0

    # apply lung mask
    heatmap = heatmap * lung_mask

    heatmap = np.uint8(255 * heatmap)

    heatmap = cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)

    overlay = cv2.addWeighted(original_img, 0.5, heatmap, alpha, 0)

    return overlay


    h, w = original_img.shape[:2]

    heatmap = cv2.resize(heatmap, (w, h))

    # Normalize heatmap
    heatmap = heatmap / (np.max(heatmap) + 1e-8)

    # Keep only strong activations (infection areas)
    heatmap = np.where(heatmap > 0.55, heatmap, 0)

    heatmap = np.uint8(255 * heatmap)

    heatmap = cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)

    overlay = cv2.addWeighted(original_img, 0.5, heatmap, alpha, 0)

    return overlay

    h, w = original_img.shape[:2]

    heatmap = cv2.resize(heatmap, (w, h))

    # Apply lung mask
    lung_mask = create_lung_mask(original_img)

    heatmap = heatmap * lung_mask

    heatmap = np.uint8(255 * heatmap)

    heatmap = cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)

    # Stronger overlay
    overlay = cv2.addWeighted(original_img, 0.5, heatmap, alpha, 0)

    # ---- Optional: draw infection contour ----
    gray_heatmap = cv2.cvtColor(heatmap, cv2.COLOR_BGR2GRAY)

    _, thresh = cv2.threshold(gray_heatmap, 150, 255, cv2.THRESH_BINARY)

    contours, _ = cv2.findContours(
        thresh,
        cv2.RETR_EXTERNAL,
        cv2.CHAIN_APPROX_SIMPLE
    )

    for c in contours:
        if cv2.contourArea(c) > 300:
            cv2.drawContours(overlay, [c], -1, (0, 0, 255), 2)

    return overlay
