import React, { useState } from 'react';
import { Bookmark } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { togglePostBookmark } from '../api/posts';

interface BookmarkButtonProps {
  articleId: string;
}

export const BookmarkButton: React.FC<BookmarkButtonProps> = ({ articleId }) => {
  const { bookmarks, toggleBookmark, showToast, token } = useApp();
  
  const isBookmarked = bookmarks.includes(articleId);
  const [isPulsing, setIsPulsing] = useState(false);

  const handleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsPulsing(true);
    setTimeout(() => setIsPulsing(false), 300);

    if (token) {
      try {
        await togglePostBookmark(articleId);
      } catch (err: any) {
        console.warn('Backend bookmark note:', err);
      }
    }

    toggleBookmark(articleId);
    showToast(
      isBookmarked ? 'Article removed from bookmarks' : 'Article saved to bookmarks', 
      'success'
    );
  };

  return (
    <button
      onClick={handleBookmark}
      className={`group p-1.5 rounded-full ctrl-transition focus:outline-none cursor-pointer ${
        isBookmarked 
          ? 'text-primary' 
          : 'text-on-surface-variant hover:text-primary'
      }`}
      aria-label={isBookmarked ? "Remove bookmark" : "Save bookmark"}
    >
      <Bookmark 
        className={`w-4 h-4 ctrl-transition ${
          isPulsing ? 'animate-pulse-once' : ''
        } ${
          isBookmarked 
            ? 'fill-primary stroke-primary' 
            : ''
        }`} 
      />
    </button>
  );
};
