import { useState, useEffect } from 'react';
import api from '../api';

function CommentForm({ articleId, onCommentAdded }) {
  const [author_name, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [userLoaded, setUserLoaded] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await api.get('/api/user');
        if (res.data?.name) {
          setAuthor(res.data.name); // ou res.data.username selon ton backend
        }
      } catch (error) {
        console.warn('Utilisateur non connecté ou erreur API');
      } finally {
        setUserLoaded(true);
      }
    }

    fetchUser();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/api/comments', {
        article_id: articleId,
        author_name,
        content,
      });
      setContent('');
      onCommentAdded(); // recharge les commentaires
    } catch (error) {
      console.error('Erreur lors de l’envoi du commentaire', error);
    } finally {
      setLoading(false);
    }
  };

  if (!userLoaded) {
    return <p className="text-gray-500">Chargement du formulaire...</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-6">
      <input
        type="text"
        placeholder="Votre nom"
        value={author_name}
        onChange={(e) => setAuthor(e.target.value)}
        className="w-full border px-3 py-2 rounded hidden"
        readOnly={!!author_name} // verrouille si prérempli
      />
      <textarea
        placeholder="Votre commentaire"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full border px-3 py-2 rounded"
        required
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800"
      >
        {loading ? 'Envoi...' : 'Envoyer'}
      </button>
    </form>
  );
}

export default CommentForm;
