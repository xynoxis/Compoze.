import React from 'react';
import { Bookmark } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface BookmarkButtonProps {
  articleId: string;
}

export const BookmarkButton: React.FC<BookmarkButtonProps> = ({ articleId }) => {
  const { bookmarks, toggleBookmark, showToast } = useApp();
  
  const isBookmarked = bookmarks.includes(articleId);

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleBookmark(articleId);
    showToast(
      isBookmarked ? 'Article removed from bookmarks' : 'Article saved to bookmarks', 
      'success'
    );
  };

  return (
    <button
      onClick={handleBookmark}
      className={`group p-1.5 rounded-full hover:bg-zinc-50 transition-colors focus:outline-none ${
        isBookmarked 
          ? 'text-teal-600' 
          : 'text-zinc-400 hover:text-zinc-950'
      }`}
      aria-label={isBookmarked ? "Remove bookmark" : "Save bookmark"}
    >
      <Bookmark 
        className={`w-4 h-4 transition-transform duration-200 active:scale-125 ${
          isBookmarked 
            ? 'fill-teal-600 stroke-teal-600' 
            : 'group-hover:scale-110'
        }`} 
      />
    </button>
  );
};
