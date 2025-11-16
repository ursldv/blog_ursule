import React, { useState, useEffect } from 'react';
import api from '../api';

function ArticleForm({ onSuccess }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [authorId, setAuthorId] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api.get('/api/categories')
      .then(res => setCategories(res.data))
      .catch(err => console.error('Erreur chargement catégories', err));
  }, []);

  const handleImageChange = e => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('category_id', categoryId);
    formData.append('author_id', authorId);
    if (image) formData.append('image', image);

    try {
      await api.post('/api/articles', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setTitle('');
      setContent('');
      setCategoryId('');
      setAuthorId('');
      setImage(null);
      setPreview(null);
      setMessage('✅ Article ajouté avec succès !');
      onSuccess();
    } catch (error) {
      console.error('Erreur ajout article', error);
      setMessage("❌ Échec de l'ajout.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
      <h2 className="text-2xl font-semibold text-gray-800">Ajouter un article</h2>

      {message && <p className="text-sm text-green-600">{message}</p>}

      <input
        type="text"
        placeholder="Titre"
        value={title}
        onChange={e => setTitle(e.target.value)}
        className="w-full border border-gray-300 p-2 rounded"
        required
      />

      <textarea
        placeholder="Contenu"
        value={content}
        onChange={e => setContent(e.target.value)}
        className="w-full border border-gray-300 p-2 rounded h-32"
        required
      />

      <select
        value={categoryId}
        onChange={e => setCategoryId(e.target.value)}
        className="w-full border border-gray-300 p-2 rounded"
        required
      >
        <option value="">-- Choisir une catégorie --</option>
        {categories.map(cat => (
          <option key={cat.id} value={cat.id}>
            {cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}
          </option>
        ))}
      </select>

      <input
        type="number"
        placeholder="ID de l’auteur"
        value={authorId}
        onChange={e => setAuthorId(e.target.value)}
        className="w-full border border-gray-300 p-2 rounded"
        required
      />

      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="w-full border border-gray-300 p-2 rounded"
      />

      {preview && (
        <img src={preview} alt="Prévisualisation" className="w-full h-auto rounded shadow" />
      )}

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Publier l’article
      </button>
    </form>
  );
}

export default ArticleForm;
