import React, { useState, useEffect } from 'react';
import api from '../api';

function ArticleModal({ isOpen, onClose, onArticleSaved, article }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [publishedAt, setPublishedAt] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (article) {
      setTitle(article.title || '');
      setContent(article.content || '');
      setCategoryId(article.category_id || '');
      setPublishedAt(article.published_at?.slice(0, 10) || '');
      setImageFile(null); // reset image on edit
    } else {
      setTitle('');
      setContent('');
      setCategoryId('');
      setPublishedAt('');
      setImageFile(null);
    }
  }, [article]);

  useEffect(() => {
    api.get('/api/categories')
      .then(res => setCategories(res.data))
      .catch(err => console.error('Erreur chargement catégories', err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('category_id', categoryId);
    formData.append('published_at', publishedAt);
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      if (article) {
        await api.post(`/api/articles/${article.id}?_method=PUT`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setMessage('Article mis à jour avec succès.');
      } else {
        await api.post('/api/articles', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setMessage('Article créé avec succès.');
      }

      onArticleSaved?.();
    } catch (err) {
      console.error('Erreur sauvegarde article', err);
      setMessage('Erreur lors de la sauvegarde.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow max-w-lg w-full">
        <h2 className="text-xl font-bold mb-4 text-purple-700">
          {article ? 'Modifier l’article' : 'Créer un article'}
        </h2>

        {message && <p className="text-sm text-purple-600 mb-2">{message}</p>}

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Titre"
            className="w-full p-2 border rounded mb-4"
            required
          />
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Contenu"
            className="w-full p-2 border rounded mb-4"
            rows="4"
            required
          />
          <select
            value={categoryId}
            onChange={e => setCategoryId(e.target.value)}
            className="w-full p-2 border rounded mb-4"
            required
          >
            <option value="">-- Catégorie --</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          <input
            type="date"
            value={publishedAt}
            onChange={e => setPublishedAt(e.target.value)}
            className="w-full p-2 border rounded mb-4"
          />

          {/* ✅ Champ image */}
          <input
            type="file"
            accept="image/*"
            onChange={e => setImageFile(e.target.files[0])}
            className="w-full p-2 border rounded mb-4"
          />

          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
              Annuler
            </button>
            <button type="submit" className="px-4 py-2 bg-purple-700 text-white rounded hover:bg-purple-800">
              {article ? 'Mettre à jour' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ArticleModal;
