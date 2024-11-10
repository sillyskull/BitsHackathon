import { useEffect, useState } from "react";
import "./styles.css";
import { useServerUser } from "../../contextStore/serverUserContext";
import { useNavigate } from "react-router-dom";

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
    const serverUser = useServerUser();
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (serverUser) {
            setUser(serverUser);
        } else {
            navigate('/');
        }
    }, [serverUser, navigate]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, image: reader.result });
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
                setFormData({ ...formData, image: reader.result });
            };
            reader.readAsDataURL(file);  // Convert image to base64
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        // Construct the data object for JSON
        const data = {
            fullName: formData.fullName,
            age: formData.age,
            gender: formData.gender,
            premedicalConditions: formData.premedicalConditions,
            testType: formData.testType,
            image: formData.image,  // base64 image string
            user,
        };

        console.log(data);

        fetch("http://localhost:8000/dashboard/uploads", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("Success:", data);
                alert("Form submitted successfully!");
            })
            .catch((err) => console.error("Error:", err));
    };

    return (
        <div className="container">
            <div className="dashboard">
                <div className="navbar">
                    <div className="title">Medical H5</div>
                    <button className="logout" onClick={() => navigate('/')}>Logout</button>
                </div>
                <h1 className="heading">Medical H5</h1>
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
                        {["MRI", "CTSCAN", "X-Ray"].map(test => (
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
        </div>
    );
}

export default Dashboard;
