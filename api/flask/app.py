from flask import Flask, request, jsonify
import os
import base64
from flask_cors import CORS
from api.flask.report import generate_brain_tumor_mri_report
from mi import image_processing_mri, image_processing_ctscan, image_processing_xray
from flask import send_file

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
PROCESSED_FOLDER = 'processed'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(PROCESSED_FOLDER, exist_ok=True)


@app.route('/api/process-image', methods=['POST'])
def process_image():
    try:
        data = request.get_json()
        full_name = data.get('fullName')
        age = data.get('age')
        gender = data.get('gender')
        premedical_conditions = data.get('premedicalConditions')
        test_type = data.get('testType')
        image_data = data.get('image')

        if not image_data or not test_type:
            return jsonify({'error': 'Invalid input data'}), 400

        # Decode the base64 image data
        image_bytes = base64.b64decode(image_data)
        image_path = os.path.join(UPLOAD_FOLDER, f"{full_name}_{test_type}.png")
        with open(image_path, "wb") as img_file:
            img_file.write(image_bytes)

        # Process the image based on the test type
        if test_type.lower() == 'mri':
            processed_image_path = image_processing_mri(image_path)
        elif test_type.lower() == 'ctscan':
            processed_image_path = image_processing_ctscan(image_path)
        elif test_type.lower() == 'x-ray':
            processed_image_path = image_processing_xray(image_path)
        else:
            return jsonify({'error': 'Unsupported test type'}), 400

        # Encode the processed image in base64 to send back
        with open(processed_image_path, "rb") as img_file:
            processed_image_base64 = base64.b64encode(img_file.read()).decode('utf-8')

        return jsonify({'processedImage': processed_image_base64})

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/download-pdf', methods=['POST'])
def download_pdf():
    try:
        # Extract form data from the request
        data = request.get_json()
        full_name = data.get('fullName')
        age = data.get('age')
        gender = data.get('gender')
        premedical_conditions = data.get('premedicalConditions')
        test_type = data.get('testType')
        processed_image_path = os.path.join(PROCESSED_FOLDER, f"{full_name}_{test_type}_processed.png")
        # Ensure that the processed image path exists
        if not os.path.exists(processed_image_path):
            return jsonify({'error': 'Processed image not found'}), 404

        # Generate the PDF report
        pdf_filename = f"{full_name}_MRI_Report.pdf"
        generate_brain_tumor_mri_report(
            filename=pdf_filename,
            report_title_text="Brain Tumor MRI Report",
            patient_name=full_name,
            patient_info_data=[
                ["Age:", age],
                ["Gender:", gender],
                ["Relevant Medical History:", premedical_conditions]
            ],
            mri_findings_data=[
                ["Test Type:", test_type],
                ["Findings:", "Example MRI findings."]
            ],
            mri_image_path=processed_image_path,
            impressions_text="The MRI scan shows...",
            recommendations_text="Follow-up recommendations.",
            conclusion_text="Conclusion of the report.",
            logo_path="logo.png"
        )

        # Return the generated PDF file for download
        return send_file(pdf_filename, as_attachment=True)

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
