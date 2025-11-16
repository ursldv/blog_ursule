import React, { useState, useEffect } from 'react';
import api from '../api';

function CategoryModal({ isOpen, onClose, onCategoryCreated, category }) {
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');

  // Pré-remplir les champs si on modifie une catégorie
  useEffect(() => {
    if (category) {
      setName(category.name || '');
      setType(category.type || '');
      setDescription(category.description || '');
    } else {
      setName('');
      setType('');
      setDescription('');
    }
  }, [category]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = { name, type, description };

    try {
      if (category && category.id) {
        // ✅ Mise à jour
        await api.put(`/api/categories/${category.id}`, payload);
        setMessage(`Catégorie "${name}" mise à jour !`);
      } else {
        // ✅ Création
        await api.post('/api/categories', payload);
        setMessage(`Catégorie "${name}" créée !`);
      }

      onCategoryCreated?.();
    } catch (err) {
      console.error('Erreur lors de la sauvegarde', err);
      setMessage('Erreur lors de la sauvegarde.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow max-w-md w-full">
        <h2 className="text-xl font-bold mb-4 text-purple-700">
          {category ? 'Modifier la catégorie' : 'Créer une catégorie'}
        </h2>

        {message && <p className="text-sm text-purple-600 mb-2">{message}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Nom"
            className="w-full p-2 border rounded mb-4"
            required
          />
          <select
            value={type}
            onChange={e => setType(e.target.value)}
            className="w-full p-2 border rounded mb-4"
            required
          >
            <option value="">-- Type --</option>
            <option value="frontend">Frontend</option>
            <option value="backend">Backend</option>
            <option value="fullstack">Fullstack</option>
          </select>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Description"
            className="w-full p-2 border rounded mb-4"
            rows="3"
          />
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
              Annuler
            </button>
            <button type="submit" className="px-4 py-2 bg-purple-700 text-white rounded hover:bg-purple-800">
              {category ? 'Mettre à jour' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CategoryModal;
