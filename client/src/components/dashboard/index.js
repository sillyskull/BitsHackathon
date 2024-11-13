import { useState } from "react";
import "./styles.css";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";

function Dashboard() {
    const [formData, setFormData] = useState({
        fullName: "",
        age: "",
        gender: "",
        premedicalConditions: "",
        testType: "",
        image: null,
    });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();


    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, image: reader.result.split(',')[1] }); // Store base64 data without the prefix
            };
            reader.readAsDataURL(file);  // Convert image to base64
        }
    };

    const handleImageDrop = (event) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        if (file && file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, image: reader.result.split(',')[1] }); // Store base64 data without the prefix
            };
            reader.readAsDataURL(file);  // Convert image to base64
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Construct the data object for JSON
        const data = {
            fullName: formData.fullName,
            age: formData.age,
            gender: formData.gender,
            premedicalConditions: formData.premedicalConditions,
            testType: formData.testType,
            image: formData.image,  // base64 image string
        };

        try {
            console.log("Sending image for processing...");
            const response = await fetch("http://localhost:5000/api/process-image", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const responseData = await response.json();
            console.log("Image processed successfully.");
            setProcessedImage(responseData.processedImage);
            setIsModalOpen(true);
        } catch (err) {
            console.error("Error while processing image:", err);
            setErrors({ submit: "An error occurred while processing the image. Please try again." });
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="container">
            <div className="dashboard">
                <div className="navbar">
                    <div className="title">Medical H5</div>
                </div>
                <h1 className="heading">Medical H5</h1>
                <div className="form-and-image-container">
                    <form onSubmit={handleSubmit} className="medical-form">
                        <div className="form-group">
                            <label>Full Name:</label>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                required
                            />
                            {errors.fullName && <span className="error">{errors.fullName}</span>}
                        </div>
                        <div className="form-group">
                            <label>Age:</label>
                            <input
                                type="number"
                                name="age"
                                value={formData.age}
                                onChange={handleChange}
                                required
                            />
                            {errors.age && <span className="error">{errors.age}</span>}
                        </div>
                        <div className="form-group">
                            <label>Gender:</label>
                            {["Male", "Female", "Other"].map(gender => (
                                <label key={gender} className="radio-group">
                                    <input
                                        type="radio"
                                        name="gender"
                                        value={gender}
                                        onChange={handleChange}
                                        checked={formData.gender === gender}
                                    />
                                    {gender}
                                </label>
                            ))}
                            {errors.gender && <span className="error">{errors.gender}</span>}
                        </div>
                        <div className="form-group">
                            <label>Premedical Conditions:</label>
                            <input
                                type="text"
                                name="premedicalConditions"
                                value={formData.premedicalConditions}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Test Type:</label>
                            {["MRI", "CTSCAN", "X-Ray"].map(test => (
                                <label key={test} className="radio-group">
                                    <input
                                        type="radio"
                                        name="testType"
                                        value={test}
                                        onChange={handleChange}
                                        checked={formData.testType === test}
                                    />
                                    {test}
                                </label>
                            ))}
                            {errors.testType && <span className="error">{errors.testType}</span>}
                        </div>
                    </form>
                    <div className="image-upload-container">
                        <div
                            className="image-upload-box"
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={handleImageDrop}
                            onClick={() => document.getElementById("fileInput").click()}
                        >
                            {formData.image ? (
                                <img src={`data:image/jpeg;base64,${formData.image}`} alt="Uploaded" className="uploaded-image" />
                            ) : (
                                <p>Drag and drop an image, or click to select one</p>
                            )}
                            <input
                                type="file"
                                id="fileInput"
                                accept="image/*"
                                onChange={handleImageChange}
                                style={{ display: "none" }}
                            />
                        </div>
                    </div>
                </div>
                <button type="submit" onClick={handleSubmit} className="btn submit-btn">Submit</button>
            </div>

            <Modal isOpen={isModalOpen} onRequestClose={closeModal} className="modal" overlayClassName="modal-overlay">
                <h2>Processed Image</h2>
                <div className="modal-content">
                    {processedImage && (
                        <img src={`data:image/jpeg;base64,${processedImage}`} alt="Processed" className="processed-image" />
                    )}
                    <div className="client-info">
                        <p><strong>Full Name:</strong> {formData.fullName}</p>
                        <p><strong>Age:</strong> {formData.age}</p>
                        <p><strong>Gender:</strong> {formData.gender}</p>
                        <p><strong>Premedical Conditions:</strong> {formData.premedicalConditions}</p>
                        <p><strong>Test Type:</strong> {formData.testType}</p>
                    </div>
                    <button onClick={closeModal} className="btn">Close</button>
                </div>
            </Modal>
        </div>
    );
}

export default Dashboard;
