from flask import Flask, request, jsonify, redirect
from werkzeug.utils import secure_filename
import os
import traceback

# Import image processing functions based on test type
from mi import image_processing_mri, image_processing_ctscan, image_processing_xray

app = Flask(__name__)

# Configure upload folders
UPLOAD_FOLDER = 'uploads/'
PROCESSED_FOLDER = 'processed/'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['PROCESSED_FOLDER'] = PROCESSED_FOLDER

# Ensure upload folders exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(PROCESSED_FOLDER, exist_ok=True)

# Allowed file extensions for uploaded files
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in {'jpg', 'jpeg', 'png'}

@app.route('/api/upload', methods=['POST'])
def upload():
    try:
        # Extract form data
        full_name = request.form.get('fullName')
        age = request.form.get('age')
        gender = request.form.get('gender')
        premedical_conditions = request.form.get('premedicalConditions')
        test_type = request.form.get('testType')

        # Extract and save the image file
        if 'image' not in request.files:
            print("Error: No image file provided")
            return jsonify({'error': 'No image file provided'}), 400
        image_file = request.files['image']

        if image_file and allowed_file(image_file.filename):
            filename = secure_filename(image_file.filename)
            image_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            image_file.save(image_path)
        else:
            print("Error: Invalid image file type")
            return jsonify({'error': 'Invalid image file type'}), 400

        # Select appropriate image processing function based on test type
        if test_type == "MRI":
            processed_image = image_processing_mri(image_path)
        elif test_type == "CTSCAN":
            processed_image = image_processing_ctscan(image_path)
        elif test_type == "X-Ray":
            processed_image = image_processing_xray(image_path)
        else:
            print("Error: Invalid test type")
            return jsonify({'error': 'Invalid test type'}), 400

        # Check if processed image path is returned
        if not processed_image:
            print("Error: Image processing failed")
            return jsonify({'error': 'Image processing failed'}), 500

        # Save the processed image to the processed folder
        processed_filename = f"processed_{filename}"
        processed_image_path = os.path.join(app.config['PROCESSED_FOLDER'], processed_filename)
        os.rename(processed_image, processed_image_path)

        # Redirect to the result page
        return redirect('http://localhost:3000/dashboard/results')

    except Exception as e:
        print("Exception occurred:")
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
