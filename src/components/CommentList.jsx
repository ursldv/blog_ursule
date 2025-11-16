import { useEffect, useState } from 'react';
import api from '../api';

function CommentList({ articleId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchComments = async () => {
    try {
      const res = await api.get(`/api/articles/${articleId}/comments`);
      setComments(res.data.data);
    } catch (error) {
      console.error('Erreur lors du chargement des commentaires', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [articleId]);

  if (loading) return <p className="text-gray-500">Chargement des commentaires...</p>;

  if (comments.length === 0) return <p className="text-gray-400">Aucun commentaire pour cet article.</p>;

  return (
    <div className="space-y-1">
    {comments.map((c) => (
        <div
        key={c.id}
        className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition duration-300"
        >
        <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-purple-700">{c.author_name || 'Anonyme'}</p>
            {c.created_at && (
            <span className="text-xs text-gray-400 italic">
                {new Date(c.created_at).toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
                })}
            </span>
            )}
        </div>
        <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
            {c.content}
        </div>
        </div>
    ))}
    </div>


  );
}

export default CommentList;
