import cv2
import numpy as np
from tensorflow.keras.models import load_model
import os

# Load the pre-trained segmentation model
model = load_model('mri.h5')


# Function to load and preprocess the image
def preprocess_image(img_path, target_size=(256, 256)):
    img = cv2.imread(img_path, cv2.IMREAD_GRAYSCALE)
    if img is None:
        raise FileNotFoundError(f"Image not found at the path: {img_path}")
    img = cv2.resize(img, target_size)
    img = img / 255.0
    img_rgb = np.repeat(img[..., np.newaxis], 3, axis=-1)  # Make it 3 channels (RGB)
    img_rgb = np.expand_dims(img_rgb, axis=0)
    return img_rgb


# Function for processing MRI images
def image_processing_mri(image_path):
    try:
        # Load and preprocess the brain MRI image
        input_image = preprocess_image(image_path)

        # Generate the predicted mask
        predicted_mask = model.predict(input_image)[0]
        predicted_mask = (predicted_mask > 0.5).astype(np.uint8)

        # Convert predicted mask to single channel if it has multiple channels
        if predicted_mask.ndim == 3 and predicted_mask.shape[-1] > 1:
            predicted_mask = predicted_mask[:, :, 0]

        # Squeeze any remaining singleton dimensions
        predicted_mask = np.squeeze(predicted_mask)

        # Load the original image for visualization
        original_image = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
        original_image = cv2.resize(original_image, (256, 256))
        original_image_color = cv2.cvtColor(original_image, cv2.COLOR_GRAY2BGR)

        # Find the coordinates of the tumor in the mask
        y_coords, x_coords = np.where(predicted_mask == 1)

        # Only draw the bounding box if tumor pixels are found
        if y_coords.size > 0 and x_coords.size > 0:
            # Calculate the bounding box coordinates
            top_left = (x_coords.min(), y_coords.min())
            bottom_right = (x_coords.max(), y_coords.max())

            # Expand the bounding box size
            expansion_pixels = 10  # Increase this number to make the box larger
            top_left = (max(0, top_left[0] - expansion_pixels), max(0, top_left[1] - expansion_pixels))
            bottom_right = (min(original_image.shape[1], bottom_right[0] + expansion_pixels),
                            min(original_image.shape[0], bottom_right[1] + expansion_pixels))

            # Draw a red bounding box
            cv2.rectangle(original_image_color, top_left, bottom_right, (0, 0, 255), 2)

        # Save the processed image with the bounding box
        processed_image_path = os.path.join('processed', f"processed_{os.path.basename(image_path)}")
        os.makedirs('processed', exist_ok=True)
        cv2.imwrite(processed_image_path, original_image_color)

        return processed_image_path

    except Exception as e:
        raise RuntimeError(f"Error during MRI image processing: {str(e)}")


def image_processing_ctscan(image_path):
    # Placeholder for CT scan image processing logic
    processed_image_path = f"processed_{image_path}"
    return processed_image_path


def image_processing_xray(image_path):
    # Placeholder for X-Ray image processing logic
    processed_image_path = f"processed_{image_path}"
    return processed_image_path