import React, { useState } from 'react';
import '../login/index.css';
import 'boxicons/css/boxicons.min.css';

const Signup = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const handleSignup = async (event) => {
        event.preventDefault();

        const username = document.querySelector("#signup-field-username").value;
        const email = document.querySelector("#signup-field-email").value;
        const password = document.querySelector("#signup-field-password").value;

        try {
            const response = await fetch('http://localhost:8000/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    email: email,
                    password: password,
                }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const msg = await response.json();
            console.log(msg);
            alert(msg.msg); // Display the message returned by the server
            window.location.href = '/login'; // Redirect to login page after successful signup

        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    };

    return (
        <div className="login-container">
            <form id="signupForm" className="login-form" onSubmit={handleSignup}>
                <h1>Signup</h1>
                <div className="input-box">
                    <input
                        type="text"
                        id="signup-field-username"
                        placeholder="Username"
                        required
                    />
                    <i className='bx bxs-user'></i>
                </div>
                <div className="input-box">
                    <input
                        type="email"
                        id="signup-field-email"
                        placeholder="Email"
                        required
                    />
                    <i className='bx bxs-envelope'></i>
                </div>
                <div className="input-box">
                    <input
                        type={passwordVisible ? "text" : "password"}
                        id="signup-field-password"
                        placeholder="Password"
                        required
                    />
                    <span className="eye" onClick={togglePasswordVisibility}>
                        <i className={`bx ${passwordVisible ? 'bxs-hide' : 'bxs-show'}`}></i>
                    </span>
                </div>
                <button type="submit" className="btn">Signup</button>
                <div className="register-link">
                    <p>Already have an Account? <a href="#" onClick={(e) => {
                        e.preventDefault();
                        window.location.href = '/login';
                    }}>Login</a></p>
                </div>
            </form>
        </div>
    );
};

export default Signup;
