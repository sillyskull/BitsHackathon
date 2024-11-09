import React, { useState } from 'react';
import './index.css';
import 'boxicons/css/boxicons.min.css';

const Login = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    return (
        <div className="login-container">
            <form id="loginForm" className="login-form">
                <h1>Login</h1>
                <div className="input-box">
                    <input type="text" placeholder="Username" required />
                    <i className='bx bxs-user'></i>
                </div>
                <div className="input-box">
                    <input
                        type={passwordVisible ? "text" : "password"}
                        id="password"
                        placeholder="Password"
                        required
                    />
                    <span className="eye" onClick={togglePasswordVisibility}>
            <i className={`bx ${passwordVisible ? 'bxs-hide' : 'bxs-show'}`}></i>
          </span>
                </div>
                <button type="submit" className="btn">Login</button>
                <div className="register-link">
                    <p>Don't have an Account? <a href="#" onClick={(e) => { e.preventDefault(); window.location.href = '/signup'; }}>Signup</a></p>
                </div>
            </form>
        </div>
    );
};

export default Login;

