import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { LikeButton } from './LikeButton';
import { BookmarkButton } from './BookmarkButton';

interface ArticleCardProps {
  articleId: string;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ articleId }) => {
  const { articles, authors } = useApp();
  
  const article = articles.find(a => a.id === articleId);
  if (!article) return null;

  const author = authors.find(a => a.id === article.authorId);
  if (!author) return null;

  return (
    <article className="depth-card-interactive rounded-3xl p-6 lg:p-8 flex flex-col md:flex-row items-start justify-between group ctrl-transition mb-6">
      <div className="flex-1 pr-0 md:pr-8 flex flex-col justify-between h-full w-full">
        {/* Author Header */}
        <div className="flex items-center space-x-2 mb-3">
          <Link to={`/profile/${author.username}`} className="flex items-center space-x-2 focus:outline-none">
            <img 
              src={author.avatar} 
              alt={author.name} 
              className="w-5 h-5 rounded-full object-cover"
            />
            <span className="text-xs font-semibold text-on-surface hover:underline">{author.name}</span>
          </Link>
          <span className="text-on-surface-variant text-xs">•</span>
          <span className="text-xs text-on-surface-variant font-medium">{article.date}</span>
        </div>

        {/* Title and Subtitle */}
        <Link to={`/article/${article.id}`} className="group focus:outline-none mb-4 block">
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-on-surface group-hover:text-primary ctrl-transition leading-snug mb-2">
            {article.title}
          </h3>
          <p className="text-sm text-on-surface-variant line-clamp-2 leading-relaxed font-sans">
            {article.subtitle}
          </p>
        </Link>

        {/* Footer Actions / Info */}
        <div className="flex items-center justify-between mt-auto pt-2">
          <div className="flex items-center space-x-3 text-xs text-on-surface-variant">
            <Link 
              to={`/topics/${encodeURIComponent(article.topic.toLowerCase())}`} 
              className="px-3 py-1 bg-surface-container text-on-surface-variant rounded-full text-xs font-medium ctrl-transition hover:text-primary"
            >
              {article.topic}
            </Link>
            <span>{article.readTime}</span>
          </div>

          <div className="flex items-center space-x-3">
            <LikeButton articleId={article.id} />
            <BookmarkButton articleId={article.id} />
          </div>
        </div>
      </div>

      {/* Thumbnail Image */}
      {article.coverImage && (
        <Link 
          to={`/article/${article.id}`}
          className="mt-4 md:mt-0 w-full md:w-44 h-32 rounded-2xl overflow-hidden search-recessed flex-shrink-0 focus:outline-none order-first md:order-last mb-4 md:mb-0"
        >
          <img 
            src={article.coverImage} 
            alt={article.title} 
            className="w-full h-full object-cover ctrl-transition opacity-0"
            onLoad={(e) => e.currentTarget.classList.remove('opacity-0')}
          />
        </Link>
      )}
    </article>
  );
};
