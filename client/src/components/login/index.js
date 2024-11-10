import React, { useState } from 'react';
import './index.css';
import 'boxicons/css/boxicons.min.css';
import { getCookie } from '../../miniFunctions/cookie-parser';
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const handleLogin = async (event) => {
        event.preventDefault();
        
        const username = document.querySelector("#login-field-username").value;
        const password = document.querySelector("#login-field-password").value;
        
        try {
            const response = await fetch('http://localhost:8000/login', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username, 
                    password: password 
                })
            });

            const data = await response.json();
            console.log(data);

            // Check for the token after the login attempt
            if (getCookie("token")) {
                navigate('/dashboard');  // Redirect to dashboard on successful login
            } else {
                setError("Login failed: Invalid credentials or server error.");
            }
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
            setError("There was an issue with the login request.");
        }
    };

    return (
        <div className="login-container">
            <form id="loginForm" className="login-form" onSubmit={handleLogin}>
                <h1>Login</h1>
                <div className="input-box">
                    <input
                        type="text"
                        id="login-field-username"
                        placeholder="Username"
                        required
                    />
                    <i className='bx bxs-user'></i>
                </div>
                <div className="input-box">
                    <input
                        type={passwordVisible ? "text" : "password"}
                        id="login-field-password"
                        placeholder="Password"
                        required
                    />
                    <span className="eye" onClick={togglePasswordVisibility}>
                        <i className={`bx ${passwordVisible ? 'bxs-hide' : 'bxs-show'}`}></i>
                    </span>
                </div>
                <button type="submit" className="btn">Login</button>
                {error && <div className="error-message">{error}</div>}  {/* Display error message if any */}
                <div className="register-link">
                    <p>Don't have an Account? <a href="#" onClick={(e) => {
                        e.preventDefault();
                        window.location.href = '/signup';
                    }}>Signup</a></p>
                </div>
            </form>
        </div>
    );
};

export default Login;
