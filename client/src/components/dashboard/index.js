import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";
import { useServerUser } from "../../contextStore/serverUserContext";
import { deleteCookie } from "../../miniFunctions/cookie-parser";

export default function Dashboard() {
  const serverUser = useServerUser();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    gender: "",
    premedicalConditions: "",
    testType: "",
    image: null,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!serverUser) {
      navigate("/login");
    }
  }, [serverUser, navigate]);

  const handleLogout = () => {
    deleteCookie("token");
    navigate("/login");
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.fullName || /\d/.test(formData.fullName)) errors.fullName = "Full name cannot contain numbers";
    if (!formData.age || isNaN(formData.age) || formData.age <= 0) errors.age = "Please enter a valid age";
    if (!formData.gender) errors.gender = "Please select a gender";
    if (!formData.testType) errors.testType = "Please select a test type";
    return errors;
  };

  const handleChange = ({ target: { name, value } }) => {
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    resizeImage(file);
  };

  const handleImageDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    resizeImage(file);
  };

  // Function to resize the image before displaying it
  const resizeImage = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new Image();
      img.src = reader.result;

      img.onload = () => {
        // Create a canvas to resize the image
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // Set the new image dimensions
        const maxWidth = 300;  // Max width of the image container
        const maxHeight = 300; // Max height of the image container
        let width = img.width;
        let height = img.height;

        // Calculate the new dimensions while keeping the aspect ratio
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = width * ratio;
          height = height * ratio;
        }

        // Resize the image
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        // Convert the resized image to data URL and set it to formData
        const resizedImage = canvas.toDataURL("image/jpeg");
        setFormData((prevData) => ({
          ...prevData,
          image: resizedImage,  // Save the resized image as base64
        }));
      };
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => formDataToSend.append(key, value));
    formDataToSend.append("user", JSON.stringify(serverUser)); 
    
    try {
      const response = await fetch("http://localhost:8000/dashboard/uploads", {
        method: "POST",
        credentials: "include",
        body: formDataToSend, 
      });
      
      const data = await response.json();
      console.log("Server response:", data);
    } catch (error) {
      console.error("Error uploading data:", error);
    }
  };

  return (
    <div className="dashboard">
      <div className="navbar">
        <div className="title">Medical H5</div>
        <button className="logout" onClick={handleLogout}>Logout</button>
      </div>

      <h1 className="heading">Medical H5</h1>

      <form onSubmit={handleSubmit} className="medical-form">
        {[{ label: "Full Name", type: "text", name: "fullName", error: errors.fullName },
          { label: "Age", type: "number", name: "age", error: errors.age }].map(({ label, type, name, error }) => (
          <div className="form-group" key={name}>
            <label>{label}:</label>
            <input type={type} name={name} value={formData[name]} onChange={handleChange} required />
            {error && <span className="error">{error}</span>}
          </div>
        ))}

        <div className="form-group">
          <label>Gender:</label>
          {["Male", "Female", "Other"].map((gender) => (
            <label key={gender}>
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
          {["MRI", "CTSCAN", "X-Ray"].map((test) => (
            <label key={test}>
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

        <div className="form-group">
          <label>Upload Image:</label>
          <div
            className="image-upload-box"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleImageDrop}
            onClick={() => document.getElementById("fileInput").click()}
          >
            {formData.image ? (
              <img src={formData.image} alt="Uploaded" className="uploaded-image" />
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

        <button type="submit" className="btn">Submit</button>
      </form>
    </div>
  );
}
