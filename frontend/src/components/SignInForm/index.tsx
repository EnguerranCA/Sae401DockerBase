import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import SubmitButton from "../../ui/Buttons/SubmitButton"

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
      const formData = new FormData();
      formData.append('name', name);
      formData.append('username', username);
      formData.append('email', email);
      formData.append('password', password);

      const avatarInput = document.getElementById('avatar') as HTMLInputElement;
      if (avatarInput?.files?.[0]) {
        formData.append('avatar', avatarInput.files[0]);
      }

      const response = await fetch('http://localhost:8080/register', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Sign in failed');
      }

      localStorage.setItem('tempUsername', username);

      console.log('Sign in successful');
      navigate('/verify');
    } catch (error: any) {
      setError(error.message || 'Sign in failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded px-8 pt-6 pb-8 mb-4 w-full max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center text-primary">Inscription</h1>

      <div className={`mb-6 relative border rounded-md pt-2 ${name ? 'text-primary' : ''}`}>
        <label className="absolute left-2 text-gray-700 text-xs font-bold" htmlFor="name">Nom</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-hidden focus:border-primary mt-4"
          required
        />
      </div>

      <div className={`mb-6 relative border rounded-md pt-2 ${username ? 'text-primary' : ''}`}>
        <label className="absolute left-2 text-gray-700 text-xs font-bold" htmlFor="username">Nom d'utilisateur</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-hidden focus:border-primary mt-4"
          required
        />
      </div>

      <div className={`mb-6 relative border rounded-md pt-2 ${email ? 'text-primary' : ''}`}>
        <label className="absolute left-2 text-gray-700 text-xs font-bold" htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-hidden focus:border-primary mt-4"
          required
        />
      </div>

      <div className={`mb-6 relative border rounded-md pt-2 ${password ? 'text-primary' : ''}`}>
        <label className="absolute left-2 text-gray-700 text-xs font-bold" htmlFor="password">Mot de passe</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-hidden focus:border-primary mt-4"
          required
        />
      </div>

      <div className={`mb-6 relative border rounded-md pt-2 ${confirmPassword ? 'text-primary' : ''}`}>
        <label className="absolute left-2 text-gray-700 text-xs font-bold" htmlFor="confirmPassword">Confirmez le mot de passe</label>
        <input
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-hidden focus:border-primary mt-4"
          required
        />
      </div>lu

      <div className="mb-6 relative border rounded-md pt-2</div>">
        <label className="absolute left-2 text-gray-600 text-xs font-bold" htmlFor="avatar">Avatar</label>
        <input
          type="file"
          name="avatar"
          id="avatar"
          accept="image/*"
          className="appearance-none rounded w-full py-1 px-3 text-gray-700 mb-3 leading-tight focus:outline-hidden focus:border-primary mt-4"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              console.log('Selected avatar:', file);
            }
          }}
        />
      </div>

      {error && <div className="text-red-500 text-xs italic">{error}</div>}

      <div className="flex items-center justify-between">
        <SubmitButton text="Inscription" variant='primary' />

      </div>

      <div className="text-center mt-4">
        <Link to="/login" className="text-primary hover:text-primary">
          Déjà un compte ? Connectez-vous
        </Link>
      </div>
    </form>
  );
}
