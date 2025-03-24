import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Users from '../../data/data-users';

const VerificationForm = () => {
    const [verification_code, setVerificationCode] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [username, setUsername] = useState(localStorage.getItem('tempUsername') || '');

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const response = await fetch('http://localhost:8080/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ verification_code, username }),
            });

            if (!response.ok) {
                throw new Error('Verification failed');
            }

            const data = await response.json();
            localStorage.setItem('apiToken', data.token);
            console.log(data.token);
            navigate('/home');
        } catch (error) {
            setError('Invalid verification code');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded px-8 pt-6 pb-8 mb-4 w-full max-w-lg mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-center text-blue-500">Verification</h1>
            <div className={`mb-6 relative border rounded-md pt-2 ${username ? 'text-blue-500' : ''}`}>
                <label className="absolute left-2 text-gray-700 text-xs font-bold" htmlFor="username">Username</label>
                <input
                    name="username"
                    id="username"
                    autoComplete="username"
                    required
                    className="appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500 mt-4"
                    value={username || ''}
                    onChange={(e) => {
                        setUsername(e.target.value);
                        localStorage.setItem('tempUsername', e.target.value);
                    }}
                />
            </div>
            <div className={`mb-6 relative border rounded-md pt-2 ${verification_code ? 'text-blue-500' : ''}`}>
                <label className="absolute left-2 text-gray-700 text-xs font-bold" htmlFor="verification_code">Verification Code</label>
                <input
                    name="verification_code"
                    id="verification_code"
                    autoComplete="verification_code"
                    required
                    autoFocus
                    className="appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500 mt-4"
                    value={verification_code}
                    onChange={(e) => setVerificationCode(e.target.value)}
                />
            </div>
            {error && <div className="text-red-500 text-xs italic">{error}</div>}

            <div className="flex items-center justify-between">
                <button
                    type="button"
                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:border-gray-500"
                    onClick={() => Users.resendVerification(username)}
                >
                    Resend
                </button>
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:border-blue-500 w-full"
                    type="submit"
                >
                    Verify
                </button>
            </div>
        </form>
    );
};

export default VerificationForm;
