import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import Loader from '../components/Loader';
import CommentForm from '../components/CommentForm';
import CommentList from '../components/CommentList';
import ArticleModal from '../components/ArticleModal';

function ArticleDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [article, setArticle] = useState(null);
  const [loading, setLoader] = useState(true);
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // ✅ Récupère l'utilisateur connecté
  useEffect(() => {
    api.get('/api/user')
      .then(res => {
        console.log('Utilisateur connecté :', res.data);
        setUser(res.data);
      })
      .catch((err) => {
        console.error('Erreur récupération utilisateur :', err);
        setUser(null);
      });
  }, []);

  // ✅ Récupère l’article
  const fetchArticle = useCallback(async () => {
    try {
      const res = await api.get(`/api/articles/${id}`);
      console.log('Article reçu :', res.data);
      setArticle(res.data.data);
    } catch (error) {
      console.error('Erreur lors du chargement de l’article', error);
      setErrorMessage(
        error.response?.data?.message || 'Erreur réseau ou article introuvable.'
      );
    } finally {
      setLoader(false);
    }
  }, [id]);

  useEffect(() => {
    fetchArticle();
  }, [fetchArticle]);

  const handleEdit = () => setShowModal(true);

  const handleDelete = async () => {
    if (window.confirm('Voulez-vous vraiment supprimer cet article ?')) {
      try {
        await api.delete(`/api/articles/${id}`);
        navigate('/articles');
      } catch (err) {
        console.error('Erreur suppression', err);
      }
    }
  };

  // ✅ Vérifie si l'utilisateur est Ursule
  const isUrsule = Boolean(
    user?.name?.trim().toLowerCase() === 'ursule' &&
    user?.email?.trim().toLowerCase() === 'aizannonursule@gmail.com'
  );

  console.log('isUrsule ?', isUrsule);

  if (loading) return <Loader />;
  if (errorMessage)
    return (
      <div className="text-center text-red-600 mt-10">
        <p className="text-lg font-semibold">❌ {errorMessage}</p>
        <p className="text-sm text-gray-500">Vérifie que l’article existe et que le serveur répond.</p>
      </div>
    );
  if (!article) return <p className="text-center text-gray-500">Article introuvable.</p>;

  const imageUrl = article.image ? `http://localhost:8000/storage/${article.image}` : null;

  return (
    <div className="md:mt-[8%] md:px-20 px-10 mt-[19%] pb-20">
      <h1 className='text-2xl font-semibold pb-5'>Détail sur {article.title}</h1>

      <div className="flex flex-col md:flex-row gap-6 md:gap-x-8 bg-gray-100 items-start rounded-xl shadow-sm">
        {imageUrl && (
          <img
            src={imageUrl}
            alt={article.title}
            className="w-full md:w-[48%] h-[250px] md:h-[350px] object-cover rounded-xl"
          />
        )}

        <div className="flex-1 flex flex-col justify-between p-4">
          <div className="mb-4 flex items-center gap-x-4 text-sm text-gray-600">
            <span className="font-semibold text-indigo-700">{article.category?.name}</span>
            <span className="text-gray-500">
              {new Date(article.published_at).toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              })}
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">{article.title}</h1>
          <p className="text-gray-700 leading-relaxed">{article.content}</p>

          {/* ✅ Boutons réservés à Ursule */}
          {isUrsule && (
            <div className="mt-6 flex gap-4">
              <button onClick={handleEdit} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Modifier
              </button>
              <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                Supprimer
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ✅ Zone de commentaires */}
      <div className='mt-10 w-full md:flex md:w-full md:justify-between'>
        <div className='md:w-4/6 w-full'>
          <h2 className="text-xl font-semibold mb-4">Commentaires</h2>
          <CommentList articleId={article.id} />
        </div>
        <div className='md:mt-6'>
        {user ? (
          <CommentForm articleId={article.id} onCommentAdded={fetchArticle} />
        ) : (
          <p className="text-gray-500 italic">
            Connectez-vous pour ajouter un commentaire.
          </p>
        )}
        </div>
      </div>

      {/* ✅ Modale de mise à jour de l’article */}
      <ArticleModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onArticleSaved={() => {
          fetchArticle();
          setShowModal(false);
        }}
        article={article}
      />
    </div>
  );
}

export default ArticleDetails;
