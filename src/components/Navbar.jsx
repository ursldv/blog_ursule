// src/components/Navbar.jsx
import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import api from '../api';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const linkStyle = ({ isActive }) =>
    `block p-1 rounded-md transition-colors duration-200 ${
      isActive
        ? 'bg-purple-200 border border-purple-400'
        : 'border-purple-300 hover:bg-purple-100 hover:text-purple-700'
    }`;

  const checkUser = async () => {
    try {
      const res = await api.get('/api/user');
      setUser(res.data);
    } catch {
      setUser(null);
      localStorage.removeItem('authToken');
    }
  };

  useEffect(() => {
    checkUser(); // au chargement

    // 🔁 écoute l’événement personnalisé
    window.addEventListener('authChanged', checkUser);
    return () => window.removeEventListener('authChanged', checkUser);
  }, []);

  const handleLogout = async () => {
    try {
      await api.post('/api/logout');
    } catch {}
    localStorage.removeItem('authToken');
    setUser(null);
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white text-gray-800 px-20 py-4 shadow-md">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-purple-700">Ursule</h1>

        <ul className="hidden md:flex space-x-6 mx-auto">
          <li><NavLink to="/" className={linkStyle}>Accueil</NavLink></li>
          <li><NavLink to="/articles" className={linkStyle}>Articles</NavLink></li>
          <li><NavLink to="/contact" className={linkStyle}>Contact</NavLink></li>
        </ul>

        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <button
              onClick={handleLogout}
              className="bg-purple-700 font-semibold text-white px-4 py-2 rounded hover:bg-purple-800 transition-colors"
            >
              Déconnexion
            </button>
          ) : (
            <NavLink
              to="/login"
              className="bg-purple-700 font-semibold text-white px-4 py-2 rounded hover:bg-purple-800 transition-colors"
            >
              Connexion
            </NavLink>
          )}
        </div>

        <button
          className="md:hidden focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg className="w-6 h-6 text-purple-700" fill="none" stroke="currentColor" strokeWidth="2"
            viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {isOpen && (
        <ul className="mt-4 md:hidden space-y-2 text-center">
          <li><NavLink to="/" className={linkStyle}>Accueil</NavLink></li>
          <li><NavLink to="/articles" className={linkStyle}>Articles</NavLink></li>
          <li><NavLink to="/contact" className={linkStyle}>Contact</NavLink></li>
          <li>
            {user ? (
              <button
                onClick={handleLogout}
                className="mt-2 bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800"
              >
                Déconnexion
              </button>
            ) : (
              <NavLink
                to="/login"
                className="mt-2 bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800 inline-block"
              >
                Connexion
              </NavLink>
            )}
          </li>
        </ul>
      )}
    </nav>
  );
}

export default Navbar;
