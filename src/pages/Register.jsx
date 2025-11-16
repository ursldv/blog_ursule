import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.get('/sanctum/csrf-cookie');
      await api.post('/api/register', { name, email, password });
      setMessage('Inscription réussie ! Redirection...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      if (err.response) {
    console.error('Erreur Laravel :', err.response.data);
    if (err.response.status === 422) {
      const messages = Object.values(err.response.data.errors).flat().join(', ');
      setMessage(messages);
    } else {
      setMessage(err.response.data.message || 'Erreur lors de l’inscription');
    }
  } else {
    console.error('Erreur inconnue :', err);
    setMessage('Erreur réseau ou serveur');
  }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleRegister}
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-purple-700">Inscription</h2>

        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Nom"
          className="w-full p-3 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
          required
        />

        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full p-3 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
          required
        />

        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Mot de passe"
          className="w-full p-3 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
          required
        />

        <button
          type="submit"
          className="w-full bg-purple-700 text-white py-2 rounded hover:bg-purple-800 transition"
        >
          S’inscrire
        </button>

        {message && (
          <p className="mt-4 text-center text-sm text-purple-600">{message}</p>
        )}

        <p className="mt-6 text-center text-sm text-gray-600">
          Déjà inscrit ?{' '}
          <Link to="/login" className="text-purple-700 font-semibold hover:underline">
            Se connecter
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
