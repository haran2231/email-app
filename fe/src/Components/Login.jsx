import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useHistory hook

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigate(); // Initialize useHistory hook

    const handleLogin = async () => {
        try {
            const res = await axios.post('https://bulk-email-oh0b.onrender.com/login', {
                username,
                password
            });

            if (res.data.success === true) {
                localStorage.setItem('token', res.data.token); // Store token in localStorage
                alert('Login successful');
                // Redirect or navigate to another page upon successful login
                navigation('/mailbox'); // Navigate to '/mailbox' after successful login
            } else {
                alert('Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('Login failed');
        }
    };

    return (
        <div>
            <div className="py-5 text-3xl font-bold text-center text-white bg-black">
                <h1>Bulk Email Send Application</h1>
            </div>
            <div className="flex flex-col items-center gap-6 my-14 h-4/5">
                <h1>Login to Bulk Email</h1>
                <input
                    type="text"
                    className="px-2 py-1 border border-black border-solid"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    className="px-2 py-1 border border-black border-solid"
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button
                    className="px-4 py-2 text-white bg-black"
                    onClick={handleLogin}
                >
                    Login
                </button>
            </div>
            <div className="py-5 text-xs font-medium text-center text-white bg-black">
                <h1>Copyrights @abc</h1>
            </div>
        </div>
    );
};

export default Login;
