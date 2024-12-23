import React, { useEffect } from 'react';
import axios from '../api/api'; // Make sure your axios instance is correctly configured

const OAuthCallback = () => {
    useEffect(() => {
        const processOAuthCallback = async () => {
            // Extract the code parameter from the URL query string
            const queryParams = new URLSearchParams(window.location.search);
            const code = queryParams.get('code');

            if (!code) {
                console.error('No code found in query parameters.');
                return;
            }
            console.log("Received code:", code);

            try {
                // Make a request to the backend /auth/callback with the code
                const response = await axios.get('/auth/callback', { params: { code } });

                // Extract the tokens from the response
                const { accessToken, email, userId } = response.data;

                // Store tokens in localStorage for further use
                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('email', email);
                localStorage.setItem('userId', userId);

                // Optionally, redirect to another page
                window.location.href = 'http://localhost:3000/dashboard'; // Replace with your desired redirect path

            } catch (error) {
                alert('An error occurred during login. Please try again.');
            }
        };

        // Call the function to process the OAuth callback
        processOAuthCallback();
    }, []);

    return (
        <div>
            Processing login... Please wait.
        </div>
    );
};

export default OAuthCallback;
