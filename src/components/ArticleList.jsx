import React from 'react';
import { Link } from 'react-router-dom';

function ArticleList({ articles, variant = 'default' }) {
  // Fonction de tronquage
  const truncate = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  };

  if (!articles || articles.length === 0) {
    return <div className="text-gray-400">Aucun article à afficher.</div>;
  }

  if (variant === 'home') {
    const firstArticle = articles[0];
    const nextThree = articles.slice(1, 4);

    return (
      <div className="space-y-10">
        {/* Premier article en grand */}
        <div
          key={firstArticle.id}
          className="w-full gx-3 items-start rounded-lg flex flex-col md:flex-row"
        >
          <div className="md:w-1/2">
            <img
              src={`http://localhost:8000/storage/${firstArticle.image}`}
              alt={firstArticle.title}
              className="rounded-xl w-[95%] h-[333px] shadow-lg"
            />
          </div>
          <div className="md:w-1/2 mt-4 md:mt-0 md:pl-6 pt-3 flex flex-col justify-between">
            <div className="flex items-center mb-3">
              <span className="text-sm font-semibold mr-2">{firstArticle.category?.name}</span>
              <span className="text-xs text-gray-400">
                {new Date(firstArticle.published_at).toLocaleDateString('fr-FR', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </div>
            <h2 className="text-2xl font-bold mb-5">{firstArticle.title}</h2>
            <p className="text-sm mb-4">{truncate(firstArticle.content, 120)}</p>
            <div className="flex justify-start">
              <Link
                to={`/articles/${firstArticle.id}`}
                className="inline-block border border-purple-700 text-purple-700 bg-white font-semibold px-4 py-2 rounded-md transition-colors duration-300 hover:bg-purple-700 hover:text-white"
              >
                Lire Plus
              </Link>
            </div>
          </div>
        </div>

        {/* Articles suivants en grille */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {nextThree.map(article => (
            <div
              key={article.id}
              className="w-full max-w-sm mx-auto bg-white border border-gray-900 text-gray-900 rounded-lg transition-transform duration-300 hover:scale-95 flex flex-col overflow-hidden"
            >
              <img
                src={`http://localhost:8000/storage/${article.image}`}
                alt={article.title}
                className="w-full h-[250px] rounded-xl"
              />
              <div className="p-4 flex flex-col flex-grow">
                <div className="flex items-center mb-3">
                  <span className="text-sm font-semibold mr-2">{article.category?.name}</span>
                  <span className="text-xs text-gray-400">
                    {new Date(article.published_at).toLocaleDateString('fr-FR', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                <h3 className="text-lg font-bold mb-2">{article.title}</h3>
                <p className="text-sm text-gray-700 mb-4">{truncate(article.content, 120)}</p>
                <div className="mt-auto">
                  <Link
                    to={`/articles/${article.id}`}
                    className="text-purple-600 hover:text-purple-800 font-bold text-md no-underline"
                  >
                    Lire plus
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Variante par défaut
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {articles.map(article => {
        const imageUrl = `http://localhost:8000/storage/${article.image}`;
        return (
          <div
            key={article.id}
            className="w-full max-w-sm mx-auto bg-white rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:scale-95 flex flex-col"
          >
            <div className="relative">
              <img src={imageUrl} alt={article.title} className="w-full h-64" />
              <div className="absolute top-4 left-4 bg-black bg-opacity-60 text-white text-xs px-3 py-1 rounded-full uppercase tracking-wide">
                {article.category?.name}
              </div>
              <div className="absolute bottom-4 left-4 text-white text-sm font-medium bg-black bg-opacity-50 px-3 py-1 rounded">
                {new Date(article.published_at).toLocaleDateString('fr-FR', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}
              </div>
            </div>
            <div className="p-6 flex flex-col flex-grow">
              <h3 className="text-xl font-bold text-gray-900 mb-2 leading-snug">{article.title}</h3>
              <p className="text-sm text-gray-700 mb-4">{truncate(article.excerpt || article.content, 120)}</p>
              <div className="mt-auto">
                <Link
                  to={`/articles/${article.id}`}
                  className="text-purple-600 hover:text-purple-800 font-bold text-md no-underline"
                >
                  Lire plus
                </Link>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ArticleList;
