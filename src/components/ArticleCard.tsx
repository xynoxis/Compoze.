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
    <article className="mb-5 bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 p-6 rounded-3xl shadow-premium hover-lift flex flex-col md:flex-row items-start justify-between group transition-all duration-200">
      <div className="flex-1 pr-0 md:pr-8 flex flex-col justify-between h-full w-full">
        {/* Author Line */}
        <div className="flex items-center space-x-2 mb-2.5">
          <Link to={`/profile/${author.username}`} className="flex items-center space-x-2 focus:outline-none">
            <img 
              src={author.avatar} 
              alt={author.name} 
              className="w-5 h-5 rounded-full object-cover border border-zinc-200"
            />
            <span className="text-xs font-semibold text-zinc-950 hover:underline">{author.name}</span>
          </Link>
          <span className="text-zinc-300 text-xs">•</span>
          <span className="text-xs text-zinc-500">{article.date}</span>
        </div>

        {/* Title and Subtitle */}
        <Link to={`/article/${article.id}`} className="group focus:outline-none mb-3 block">
          <h3 className="font-serif text-xl font-bold text-zinc-900 group-hover:text-brand-700 transition-colors leading-snug mb-1">
            {article.title}
          </h3>
          <p className="text-sm text-zinc-500 line-clamp-2 leading-relaxed font-sans">
            {article.subtitle}
          </p>
        </Link>

        {/* Footer Actions / Info */}
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center space-x-3 text-xs text-zinc-500">
            <Link 
              to={`/topics/${encodeURIComponent(article.topic.toLowerCase())}`} 
              className="px-2.5 py-0.5 bg-zinc-50 border border-zinc-200 text-zinc-600 rounded-full hover:bg-zinc-100 hover:text-zinc-900 transition-colors"
            >
              {article.topic}
            </Link>
            <span>{article.readTime}</span>
          </div>

          <div className="flex items-center space-x-2">
            <LikeButton articleId={article.id} />
            <BookmarkButton articleId={article.id} />
          </div>
        </div>
      </div>

      {/* Thumbnail Image */}
      {article.coverImage && (
        <Link 
          to={`/article/${article.id}`}
          className="mt-4 md:mt-0 w-full md:w-36 h-40 md:h-24 rounded-lg overflow-hidden border border-zinc-200/50 flex-shrink-0 focus:outline-none order-first md:order-last mb-4 md:mb-0"
        >
          <img 
            src={article.coverImage} 
            alt={article.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </Link>
      )}
    </article>
  );
};
