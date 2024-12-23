import React, { useState } from 'react';
import axios from '../api/api';
import './Login.css'; // Import CSS file

const Login = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async () => {
        if (!email) {
            setError('Email is required');
            return;
        }

        try {
            const response = await axios.post('/users/create', { email });

            window.location.href = response.data.oauthUrl; // Redirect to Microsoft login
        } catch (error) {
            console.error('Login error:', error);
            setError('Failed to initiate login. Please try again.');
        }
    };

    return (
        <div className="login-container">
            <div className="app-heading">
                <h1>EMAIL ENGINE CORE</h1> {/* App Heading */}
            </div>
            <div className="login-card">
                <h1>Login</h1>
                <input
                    type="email"
                    className="login-input"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                {error && <p className="error-text">{error}</p>}
                <button className="login-button" onClick={handleLogin}>
                    Login with Outlook
                </button>
            </div>
        </div>
    );
};

export default Login;
