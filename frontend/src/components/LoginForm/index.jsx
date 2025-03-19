import React from 'react';

export default function LoginForm() {
    return (
        <form action='http://localhost:8080/user' method="post" className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 max-w-sm mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-center">Veuillez vous authentifier</h1>

            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">Email :</label>
                <input 
                    type="email" 
                    name="_username" 
                    id="username" 
                    autoComplete="email" 
                    required 
                    autoFocus 
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>

            <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Mot de passe :</label>
                <input 
                    type="password" 
                    name="_password" 
                    id="password" 
                    autoComplete="current-password" 
                    required 
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>

            <div className="flex items-center justify-between">
                <button 
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
                    type="submit" 
                >
                    Connexion
                </button>
            </div>
        </form>
    );
}