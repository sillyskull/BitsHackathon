import React from "react";
import {useNavigate} from "react-router-dom";
import "./styles.css";

function App() {
    const navigate = useNavigate();
    return (
        <div className="container">
            <header className="header">
                <h1 className="title">AI for Automated Medical Image Annotation</h1>
                <p className="description">
                    This AI tool helps radiologists by automatically highlighting important areas in medical images like
                    MRIs, CT scans, and X-rays. It can distinguish between healthy and abnormal tissues, detect early
                    signs of diseases, and mark areas for further examination. This reduces the workload for
                    radiologists and helps minimize errors.
                </p>
            </header>
            <div className="buttons">
                <button className="button login" onClick={() => navigate('/dashboard')}>Signin as Guest</button>
            </div>
        </div>
    );
}

export default App;

