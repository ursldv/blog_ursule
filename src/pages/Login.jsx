// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrors({});
    try {
      const res = await api.post('/api/login', { email, password });
      const token = res.data.token;

      localStorage.setItem('authToken', token);
      window.dispatchEvent(new Event('authChanged')); // 🔁 déclenche la mise à jour du Navbar

      setMessage(`Bienvenue ${res.data.user.name}`);
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {});
      } else {
        setMessage('Identifiant incorrect');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-purple-700">Connexion</h2>

        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full p-3 mb-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
          required
        />
        {errors.email && <p className="text-sm text-red-500 mb-2">{errors.email[0]}</p>}

        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Mot de passe"
          className="w-full p-3 mb-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
          required
        />
        {errors.password && <p className="text-sm text-red-500 mb-2">{errors.password[0]}</p>}

        <button
          type="submit"
          className="w-full bg-purple-700 text-white py-2 rounded hover:bg-purple-800 transition"
        >
          Se connecter
        </button>

        {message && (
          <p className="mt-4 text-center text-sm text-purple-600">{message}</p>
        )}

        <p className="mt-6 text-center text-sm text-gray-600">
          Pas encore de compte ?{' '}
          <Link to="/register" className="text-purple-700 font-semibold hover:underline">
            S’inscrire
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
