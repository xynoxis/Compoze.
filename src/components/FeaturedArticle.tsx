import React from 'react';
import { Link } from 'react-router-dom';
import type { Article } from '../data/mockData';
import { useApp } from '../context/AppContext';
import { LikeButton } from './LikeButton';
import { BookmarkButton } from './BookmarkButton';

interface FeaturedArticleProps {
  article: Article;
}

export const FeaturedArticle: React.FC<FeaturedArticleProps> = ({ article }) => {
  const { authors } = useApp();
  const author = authors.find(a => a.id === article.authorId);

  if (!author) return null;

  return (
    <div className="group bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 p-6 rounded-3xl shadow-premium hover-lift flex flex-col lg:flex-row gap-8 items-start">
      {/* Hero Image */}
      <Link 
        to={`/article/${article.id}`} 
        className="w-full lg:w-3/5 h-64 sm:h-80 md:h-96 rounded-xl overflow-hidden border border-zinc-200/50 block focus:outline-none"
      >
        <img 
          src={article.coverImage} 
          alt={article.title} 
          className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-700 ease-out"
        />
      </Link>

      {/* Info Block */}
      <div className="w-full lg:w-2/5 flex flex-col justify-between self-stretch py-2">
        <div>
          {/* Author info */}
          <div className="flex items-center space-x-2 mb-3">
            <Link to={`/profile/${author.username}`} className="flex items-center space-x-2">
              <img 
                src={author.avatar} 
                alt={author.name} 
                className="w-6 h-6 rounded-full object-cover border border-zinc-200"
              />
              <span className="text-xs font-semibold text-zinc-950 hover:underline">{author.name}</span>
            </Link>
            <span className="text-zinc-300 text-xs">•</span>
            <span className="text-xs text-zinc-500">{article.date}</span>
          </div>

          {/* Title */}
          <Link to={`/article/${article.id}`} className="group block focus:outline-none mb-3">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-zinc-950 group-hover:text-brand-700 transition-colors leading-tight mb-2">
              {article.title}
            </h2>
            <p className="text-sm text-zinc-550 text-zinc-500 font-sans leading-relaxed line-clamp-3">
              {article.subtitle}
            </p>
          </Link>
        </div>

        {/* Action Footer */}
        <div className="flex items-center justify-between mt-6 lg:mt-0 pt-4 border-t border-zinc-50">
          <div className="flex items-center space-x-3 text-xs text-zinc-500">
            <Link 
              to={`/topics/${encodeURIComponent(article.topic.toLowerCase())}`} 
              className="px-3 py-1 bg-zinc-550 bg-zinc-50 border border-zinc-200 text-zinc-700 rounded-full hover:bg-zinc-100 transition-colors"
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
    </div>
  );
};
