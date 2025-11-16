import React, { useState, useEffect } from 'react';
import './Home.css';
import Loader from '../components/Loader';
import ArticleList from '../components/ArticleList';
import CategoryModal from '../components/CategoryModal';
import api from '../api';

function Home() {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [articles, setArticles] = useState([]);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
  api.get('/api/user')
    .then(res => setUser(res.data))
    .catch(() => setUser(null));
}, []);

  // 🔄 Chargement global
  const fetchAll = async () => {
    try {
      const [catRes, artRes] = await Promise.all([
        api.get('/api/categories'),
        api.get('/api/articles'),
      ]);

      setCategories(catRes.data);

      const sorted = artRes.data.data.sort(
        (a, b) => new Date(b.published_at) - new Date(a.published_at)
      );
      setArticles(sorted.slice(0, 5));
    } catch (err) {
      console.error('Erreur chargement données', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleEditCategory = (category) => {
    setSelectedCategory(category);
    setShowCategoryModal(true);
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm('Supprimer cette catégorie ?')) {
      try {
        await api.delete(`/api/categories/${id}`);
        fetchAll();
      } catch (err) {
        console.error('Erreur suppression catégorie', err);
      }
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      {/* En-tête du blog */}
      <header className="mt-10 home-header relative text-white flex items-center px-4 sm:px-6 md:px-10 lg:px-20 py-10">
        <div className="overlay absolute inset-0"></div>

        <div className="relative z-10 p-4 sm:p-6 md:p-8 rounded-lg max-w-5xl md:text-left">
          <h2 className="text-4xl sm:text-4xl md:text-5xl lg:text-7xl font-extrabold text-white mb-7 leading-tight">
            Bienvenue sur mon blog personnel !
          </h2>

          <div className="text-lg sm:text-xl md:text-xl mb-4">
            By <span className="text-purple-600 font-bold">Ursule Aizannon</span> | Nov 12, 2025
          </div>

          <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-8">
            Je partage ici mes expériences en développement web, mes tutoriels, et mes projets React & Laravel.
          </p>

          <div className="flex md:justify-start">
            <a
              href="/articles"
              className="bg-purple-700 font-bold text-white px-6 py-3 rounded-md hover:bg-purple-800 transition-colors"
            >
              Lire plus
            </a>
          </div>
        </div>
      </header>

      {/* Section des articles récents */}
      <section id="article" className="mt-16 px-6 md:px-20">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h2 className="text-4xl md:text-5xl font-semibold mb-4 md:mb-0">Nos articles récents</h2>
          <a
            href="/articles"
            className="bg-purple-700 text-lg font-bold text-white px-4 py-2 rounded-md hover:bg-purple-800 transition-colors"
          >
            Tout voir
          </a>
        </div>

        <ArticleList articles={articles} variant="home" />
      </section>

      {/* Section des types de catégories */}
      <section className="mt-16 px-6 md:px-20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-4xl md:text-5xl font-semibold text-gray-800">Types de catégories</h2>
          {user?.name === 'Ursule' && user?.email === 'aizanonursule@gmail.com' && (
            <button
              onClick={() => {
                setSelectedCategory(null);
                setShowCategoryModal(true);
              }}
              className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800 transition"
            >
              + Ajouter une catégorie
            </button>
          )}

        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {categories.map(cat => (
            <div
              key={cat.id}
              className="bg-violet-50 border border-violet-300 p-6 rounded-lg shadow-sm hover:shadow-md transform hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-800">{cat.name}</h3>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize
                  ${
                    cat.type === 'frontend' ? 'bg-green-200 text-green-900' :
                    cat.type === 'backend' ? 'bg-blue-200 text-blue-900' :
                    'bg-yellow-200 text-yellow-900'
                  }`}>
                  {cat.type}
                </span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed mb-4">{cat.description}</p>

              {user?.name === 'Ursule' && user?.email === 'aizannonursule@gmail.com' && (
                <div className="flex gap-3">
                  <button onClick={() => handleEditCategory(cat)} className="text-sm text-blue-600 hover:underline">
                    Modifier
                  </button>
                  <button onClick={() => handleDeleteCategory(cat.id)} className="text-sm text-red-600 hover:underline">
                    Supprimer
                  </button>
                </div>
              )}

            </div>
          ))}
        </div>
      </section>

      {/* Modale de création/modification de catégorie */}
      <CategoryModal
        isOpen={showCategoryModal}
        onClose={() => {
          setShowCategoryModal(false);
          setSelectedCategory(null);
        }}
        onCategoryCreated={() => {
          fetchAll();
          setShowCategoryModal(false);
          setSelectedCategory(null);
        }}
        category={selectedCategory}
      />
    </div>
  );
}

export default Home;
