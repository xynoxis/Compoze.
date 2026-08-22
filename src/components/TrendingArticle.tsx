import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

interface TrendingArticleProps {
  articleId: string;
  rank: number;
}

export const TrendingArticle: React.FC<TrendingArticleProps> = ({ articleId, rank }) => {
  const { articles, authors } = useApp();
  
  const article = articles.find(a => a.id === articleId);
  if (!article) return null;

  const author = authors.find(a => a.id === article.authorId);
  if (!author) return null;

  // Format rank as 01, 02, 03...
  const formattedRank = rank < 10 ? `0${rank}` : `${rank}`;

  return (
    <div className="flex items-start space-x-4">
      {/* Rank Number Container */}
      <div className="flex-shrink-0 w-12 h-10 flex items-center justify-center bg-zinc-50 dark:bg-zinc-800 border border-zinc-200/60 dark:border-zinc-750 rounded-2xl shadow-sm">
        <span className="font-serif text-lg font-black text-zinc-400 dark:text-zinc-500 trending-rank-num">
          {formattedRank}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Author Line */}
        <div className="flex items-center space-x-1.5 mb-1.5">
          <Link to={`/profile/${author.username}`} className="flex items-center space-x-1 focus:outline-none">
            <img 
              src={author.avatar} 
              alt={author.name} 
              className="w-4 h-4 rounded-full object-cover"
            />
            <span className="text-[11px] font-semibold text-zinc-950 hover:underline">{author.name}</span>
          </Link>
        </div>

        {/* Title */}
        <Link to={`/article/${article.id}`} className="group focus:outline-none block mb-1">
          <h4 className="font-serif text-sm font-bold text-zinc-900 group-hover:text-brand-700 leading-snug line-clamp-2">
            {article.title}
          </h4>
        </Link>

        {/* Metadata */}
        <div className="flex items-center space-x-2 text-[10px] text-zinc-500">
          <span>{article.date}</span>
          <span>•</span>
          <span>{article.readTime}</span>
        </div>
      </div>
    </div>
  );
};
