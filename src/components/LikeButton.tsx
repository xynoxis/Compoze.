import React from 'react';
import { Heart } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface LikeButtonProps {
  articleId: string;
  showCount?: boolean;
}

export const LikeButton: React.FC<LikeButtonProps> = ({ articleId, showCount = true }) => {
  const { likes, toggleLike, articles, showToast } = useApp();
  
  const isLiked = likes.includes(articleId);
  const article = articles.find(a => a.id === articleId);
  const count = article ? article.likes : 0;

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleLike(articleId);
    showToast(isLiked ? 'Removed from liked articles' : 'Added to liked articles', 'success');
  };

  return (
    <button
      onClick={handleLike}
      className={`group flex items-center space-x-1 text-sm transition-colors duration-200 focus:outline-none ${
        isLiked 
          ? 'text-teal-600 font-semibold' 
          : 'text-zinc-400 hover:text-teal-600'
      }`}
      aria-label={isLiked ? "Unlike article" : "Like article"}
    >
      <Heart 
        className={`w-4 h-4 transition-transform duration-200 active:scale-125 ${
          isLiked 
            ? 'fill-teal-600 stroke-teal-600' 
            : 'group-hover:scale-110'
        }`} 
      />
      {showCount && <span className="text-xs">{count}</span>}
    </button>
  );
};
