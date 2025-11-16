import React, { useEffect, useState } from 'react';
import ArticleList from '../components/ArticleList';
import ArticleForm from '../components/ArticleForm';
import Loader from '../components/Loader';
import api from '../api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

function Articles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [showModal, setShowModal] = useState(false); // ✅ état du modal

  const fetchArticles = async () => {
    try {
      const res = await api.get('/api/articles');
      const sorted = res.data.data.sort(
        (a, b) => new Date(b.published_at) - new Date(a.published_at)
      );
      setArticles(sorted);
    } catch (error) {
      console.error('Erreur lors du chargement des articles', error);
      setErrorMessage(
        error.response?.data?.message || 'Erreur réseau : impossible de contacter le serveur.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleSuccess = () => {
    fetchArticles();
    setShowModal(false); // ✅ fermer le modal après ajout
  };

  if (loading) return <Loader />;
  if (errorMessage)
    return (
      <div className="text-center text-red-600 mt-10">
        <p className="text-lg font-semibold">❌ {errorMessage}</p>
        <p className="text-sm text-gray-500">Vérifie que le serveur est bien lancé </p>
      </div>
    );

  return (
    <main className="min-h-screen mt-10 bg-gray-100 text-gray-900 px-20 py-10">
      

      <div className="flex items-center justify-between mb-8 mt-5">
        <h1 className="text-4xl font-bold mb-6 ">Tous les articles</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          <FontAwesomeIcon icon={faPlus} />Ajouter un article
        </button>
      </div>

      {showModal && (
        <div className="fixed overflow-y-auto inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
            >
              &times;
            </button>
            <ArticleForm onSuccess={handleSuccess} />
          </div>
        </div>
      )}

      <ArticleList articles={articles} />
    </main>
  );
}

export default Articles;
