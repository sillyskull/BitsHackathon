import cv2
import numpy as np
from tensorflow.keras.models import load_model
import os
import torch
import torchvision.models as models
import torchvision.transforms as transforms
from PIL import Image

UPLOAD_FOLDER = 'uploads'
PROCESSED_FOLDER = 'processed'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(PROCESSED_FOLDER, exist_ok=True)

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
        model = load_model('mri.h5')
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
            message = "Tumor Detected"
        else:
            message = "No Tumor Detected"

        # Resize the original image slightly to create space for the message
        new_height = original_image_color.shape[0] + 30
        processed_image_with_text = np.full((new_height, original_image_color.shape[1], 3), 255, dtype=np.uint8)
        processed_image_with_text[:original_image_color.shape[0], :, :] = original_image_color

        # Add the message in the white space below the image
        font = cv2.FONT_HERSHEY_SIMPLEX
        text_size = cv2.getTextSize(message, font, 0.7, 2)[0]
        text_x = (processed_image_with_text.shape[1] - text_size[0]) // 2
        text_y = original_image_color.shape[0] + 20
        cv2.putText(processed_image_with_text, message, (text_x, text_y), font, 0.7, (0, 0, 0), 2, cv2.LINE_AA)

        processed_image_path = os.path.join(PROCESSED_FOLDER, f"processed_{os.path.basename(image_path)}")
        cv2.imwrite(processed_image_path, processed_image_with_text)

        return processed_image_path

    except Exception as e:
        raise RuntimeError(f"Error during MRI image processing: {str(e)}")

def image_processing_ctscan(image_path):
    processed_image_path = os.path.join(PROCESSED_FOLDER, f"processed_{os.path.basename(image_path)}")
    return processed_image_path

def image_processing_xray(image_path):
    try:
        # Load a pretrained model for TB detection
        model_path = 'tuber.pth'  # Replace with your model path
        model = load_resnet_model(model_path)
        image_tensor = preprocess_xray_image(image_path)
        prediction = predict_tb(model, image_tensor)

        original_image = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
        original_image = cv2.resize(original_image, (256, 256))
        original_image_color = cv2.cvtColor(original_image, cv2.COLOR_GRAY2BGR)

        if prediction == 1:
            message = "Tuberculosis Detected"
        else:
            message = "No Tuberculosis Detected"

        # Resize the original image slightly to create space for the message
        new_height = original_image_color.shape[0] + 30
        processed_image_with_text = np.full((new_height, original_image_color.shape[1], 3), 255, dtype=np.uint8)
        processed_image_with_text[:original_image_color.shape[0], :, :] = original_image_color

        # Adjust font size if the message is too long to fit in one line
        font = cv2.FONT_HERSHEY_SIMPLEX
        font_scale = 0.7
        thickness = 2
        text_size = cv2.getTextSize(message, font, font_scale, thickness)[0]
        while text_size[0] > processed_image_with_text.shape[1] - 10:
            font_scale -= 0.1
            text_size = cv2.getTextSize(message, font, font_scale, thickness)[0]

        # Add the message in the white space below the image
        text_x = (processed_image_with_text.shape[1] - text_size[0]) // 2
        text_y = original_image_color.shape[0] + 20
        cv2.putText(processed_image_with_text, message, (text_x, text_y), font, font_scale, (0, 0, 0), thickness, cv2.LINE_AA)

        processed_image_path = os.path.join(PROCESSED_FOLDER, f"processed_{os.path.basename(image_path)}")
        os.makedirs(PROCESSED_FOLDER, exist_ok=True)
        cv2.imwrite(processed_image_path, processed_image_with_text)

        return processed_image_path

    except Exception as e:
        raise RuntimeError(f"Error during X-ray image processing: {str(e)}")

def load_resnet_model(model_path):
    model = models.resnet18(weights=None)  # Initialize ResNet18 without pretrained weights
    num_features = model.fc.in_features  # Get the number of features for the fully connected layer
    model.fc = torch.nn.Linear(num_features, 3)  # Set it to 3 classes
    state_dict = torch.load(model_path, map_location=torch.device('cpu'))
    model.load_state_dict(state_dict)  # Load model weights
    model.eval()  # Set to evaluation mode
    return model

def preprocess_xray_image(image_path):
    transform = transforms.Compose([
        transforms.Resize((224, 224)),  # Resize to match model input
        transforms.ToTensor(),  # Convert to Tensor
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])  # Normalize with mean and std
    ])
    image = Image.open(image_path).convert('RGB')  # Open and ensure it's in RGB mode
    image = transform(image)  # Apply transformations
    image = image.unsqueeze(0)  # Add batch dimension
    return image

def predict_tb(model, image_tensor):
    with torch.no_grad():  # Disable gradient calculation
        outputs = model(image_tensor)
        _, predicted = torch.max(outputs, 1)  # Get predicted class
    return predicted.item()  # Convert tensor to integer
