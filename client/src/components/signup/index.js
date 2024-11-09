import React, {useState} from 'react';
import '../login/index.css';
import 'boxicons/css/boxicons.min.css';

const Signup = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    return (
        <div className="login-container">
            <form id="signupForm" className="login-form">
                <h1>Signup</h1>
                <div className="input-box">
                    <input type="text" placeholder="Username" required/>
                    <i className='bx bxs-user'></i>
                </div>
                <div className="input-box">
                    <input type="email" placeholder="Email" required/>
                    <i className='bx bxs-envelope'></i>
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
