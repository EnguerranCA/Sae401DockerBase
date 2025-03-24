import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

export default function SignInForm() {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, username, email, password }),
      });

      if (!response.ok) {
        throw new Error('Sign in failed');
      }

      localStorage.setItem('tempUsername', username);

      console.log('Sign in successful');
      navigate('/verify');
    } catch (error) {
      setError('Sign in failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded px-8 pt-6 pb-8 mb-4 w-full max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center text-blue-500">Inscription</h1>

      <div className={`mb-6 relative border rounded-md pt-2 ${name ? 'text-blue-500' : ''}`}>
        <label className="absolute left-2 text-gray-700 text-xs font-bold" htmlFor="name">Nom</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500 mt-4"
          required
        />
      </div>

      <div className={`mb-6 relative border rounded-md pt-2 ${username ? 'text-blue-500' : ''}`}>
        <label className="absolute left-2 text-gray-700 text-xs font-bold" htmlFor="username">Nom d'utilisateur</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500 mt-4"
          required
        />
      </div>

      <div className={`mb-6 relative border rounded-md pt-2 ${email ? 'text-blue-500' : ''}`}>
        <label className="absolute left-2 text-gray-700 text-xs font-bold" htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500 mt-4"
          required
        />
      </div>

      <div className={`mb-6 relative border rounded-md pt-2 ${password ? 'text-blue-500' : ''}`}>
        <label className="absolute left-2 text-gray-700 text-xs font-bold" htmlFor="password">Mot de passe</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500 mt-4"
          required
        />
      </div>

      <div className={`mb-6 relative border rounded-md pt-2 ${confirmPassword ? 'text-blue-500' : ''}`}>
        <label className="absolute left-2 text-gray-700 text-xs font-bold" htmlFor="confirmPassword">Confirmez le mot de passe</label>
        <input
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500 mt-4"
          required
        />
      </div>

      {error && <div className="text-red-500 text-xs italic">{error}</div>}

      <div className="flex items-center justify-between">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:border-blue-500 w-full"
          type="submit"
        >
          Inscription
        </button>
      </div>

      <div className="text-center mt-4">
        <Link to="/login" className="text-blue-500 hover:text-blue-700">
        Déjà un compte ? Connectez-vous
        </Link>
      </div>
    </form>
  );
}
