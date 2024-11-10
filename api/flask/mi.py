import cv2
import numpy as np
from tensorflow.keras.models import load_model
import os

model = load_model('mri.h5')


def preprocess_image(img_path, target_size=(256, 256)):
    img = cv2.imread(img_path, cv2.IMREAD_GRAYSCALE)
    if img is None:
        raise FileNotFoundError(f"Image not found at the path: {img_path}")
    img = cv2.resize(img, target_size)
    img = img / 255.0
    img_rgb = np.repeat(img[..., np.newaxis], 3, axis=-1)
    img_rgb = np.expand_dims(img_rgb, axis=0)
    return img_rgb


def image_processing_mri(image_path):
    try:
        input_image = preprocess_image(image_path)
        predicted_mask = model.predict(input_image)[0]
        predicted_mask = (predicted_mask > 0.5).astype(np.uint8)

        if predicted_mask.ndim == 3 and predicted_mask.shape[-1] > 1:
            predicted_mask = predicted_mask[:, :, 0]

        predicted_mask = np.squeeze(predicted_mask)
        original_image = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
        original_image = cv2.resize(original_image, (256, 256))
        original_image_color = cv2.cvtColor(original_image, cv2.COLOR_GRAY2BGR)

        y_coords, x_coords = np.where(predicted_mask == 1)

        if y_coords.size > 0 and x_coords.size > 0:
            top_left = (x_coords.min(), y_coords.min())
            bottom_right = (x_coords.max(), y_coords.max())
            expansion_pixels = 10
            top_left = (max(0, top_left[0] - expansion_pixels), max(0, top_left[1] - expansion_pixels))
            bottom_right = (min(original_image.shape[1], bottom_right[0] + expansion_pixels),
                            min(original_image.shape[0], bottom_right[1] + expansion_pixels))
            cv2.rectangle(original_image_color, top_left, bottom_right, (0, 0, 255), 2)

        processed_image_path = os.path.join('processed', f"processed_{os.path.basename(image_path)}")
        os.makedirs('processed', exist_ok=True)
        cv2.imwrite(processed_image_path, original_image_color)

        return processed_image_path

    except Exception as e:
        raise RuntimeError(f"Error during MRI image processing: {str(e)}")


def image_processing_ctscan(image_path):
    processed_image_path = f"processed_{image_path}"
    return processed_image_path


def image_processing_xray(image_path):
    processed_image_path = f"processed_{image_path}"
    return processed_image_path
