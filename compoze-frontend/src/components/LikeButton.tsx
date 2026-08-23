import React, { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getLikeStatus, likePost as apiLikePost, unlikePost as apiUnlikePost } from '../api/likes';

interface LikeButtonProps {
  articleId: string;
  showCount?: boolean;
}

export const LikeButton: React.FC<LikeButtonProps> = ({ articleId, showCount = true }) => {
  const { likes, toggleLike, articles, showToast, token } = useApp();
  
  const isLocalLiked = likes.includes(articleId);
  const article = articles.find(a => a.id === articleId);
  const [likeCount, setLikeCount] = useState(article ? article.likes : 0);
  const [isLiked, setIsLiked] = useState(isLocalLiked);
  const [isPulsing, setIsPulsing] = useState(false);

  useEffect(() => {
    setIsLiked(isLocalLiked);
  }, [isLocalLiked]);

  useEffect(() => {
    if (token && articleId && articleId.includes('-')) {
      getLikeStatus(articleId)
        .then(res => {
          setIsLiked(res.liked);
          setLikeCount(Number(res.count));
        })
        .catch(() => {
          // ignore if non-UUID mock id
        });
    }
  }, [token, articleId]);

  const triggerPulse = () => {
    setIsPulsing(true);
    setTimeout(() => setIsPulsing(false), 300);
  };

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    triggerPulse();

    if (token && articleId && articleId.includes('-')) {
      try {
        if (isLiked) {
          const res = await apiUnlikePost(articleId);
          setIsLiked(res.liked);
          setLikeCount(Number(res.count));
          showToast('Removed from liked articles', 'success');
        } else {
          const res = await apiLikePost(articleId);
          setIsLiked(res.liked);
          setLikeCount(Number(res.count));
          showToast('Added to liked articles', 'success');
        }
        return;
      } catch (err) {
        // Fallback to context toggle
      }
    }

    toggleLike(articleId);
    showToast(isLiked ? 'Removed from liked articles' : 'Added to liked articles', 'success');
  };

  return (
    <button
      onClick={handleLike}
      className={`group flex items-center space-x-1 text-sm ctrl-transition focus:outline-none cursor-pointer ${
        isLiked 
          ? 'text-primary font-semibold' 
          : 'text-on-surface-variant hover:text-primary'
      }`}
      aria-label={isLiked ? "Unlike article" : "Like article"}
    >
      <Heart 
        className={`w-4 h-4 ctrl-transition ${
          isPulsing ? 'animate-pulse-once' : ''
        } ${
          isLiked 
            ? 'fill-primary stroke-primary' 
            : ''
        }`} 
      />
      {showCount && <span className="text-xs">{likeCount}</span>}
    </button>
  );
};
