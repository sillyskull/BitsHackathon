import React from "react";
import { useNavigate } from "react-router-dom";
import backgroundImage from '../../assets/backHome.jpeg';
import "./styles.css";

function App() {
    const navigate = useNavigate();
    return (
        <div className="container" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '100vh' }}>
            <header className="header">
                <h1 className="title">AI-Powered Medical Image Analysis</h1>
                <p className="description">
                    Simplify and enhance medical image interpretation with AI. Our tool highlights key areas in MRI and X-ray images, detecting abnormalities and providing insights for efficient diagnosis.
                </p>
            </header>
            <div className="buttons">
                <button className="button login" onClick={() => navigate('/login')}>Login</button>
                <button className="button signup" onClick={() => navigate('/signup')}>Sign Up</button>
            </div>
        </div>
    );
}

export default App;
