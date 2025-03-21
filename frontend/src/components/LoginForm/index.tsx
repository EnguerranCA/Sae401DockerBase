import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            const response = await fetch('http://localhost:8080/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const data = await response.json();
            localStorage.setItem('apiToken', data.token);
            console.log(data.token);
            navigate('/home');
        } catch (error) {
            setError('Invalid username or password');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded px-8 pt-6 pb-8 mb-4 w-full max-w-lg mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-center text-blue-500">Connexion</h1>

            <div className={`mb-6 relative border rounded-md pt-2 ${username ? 'text-blue-500' : ''}`}>
                <label className="absolute left-2 text-gray-700 text-xs font-bold" htmlFor="username">Nom d'utilisateur</label>
                <input
                    name="username"
                    id="username"
                    autoComplete="username"
                    required
                    autoFocus
                    className="appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500 mt-4"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>

            <div className={`mb-6 relative border rounded-md pt-2 ${password ? 'text-blue-500' : ''}`}>
                <label className="absolute left-2 text-gray-600 text-xs font-bold" htmlFor="password">Mot de passe </label>
                <input
                    type="password"
                    name="password"
                    id="password"
                    autoComplete="current-password"
                    required
                    className="appearance-none  rounded w-full py-1 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:border-blue-500 mt-4"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>

            {error && <div className="text-red-500 text-xs italic">{error}</div>}

            <div className="flex items-center justify-between">
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:border-blue-500 w-full"
                    type="submit"
                >
                    Connexion
                </button>
            </div>

            <div className="text-center mt-4">
                <Link to="/signin" className="text-blue-500 hover:text-blue-700">
                    Pas de compte ? Inscrivez-vous
                </Link>
            </div>
        </form>
    );
};

export default LoginForm;