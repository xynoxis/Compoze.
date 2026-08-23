import React from 'react';
import { Share2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface ShareButtonProps {
  articleId: string;
}

export const ShareButton: React.FC<ShareButtonProps> = ({ articleId }) => {
  const { showToast } = useApp();

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const dummyUrl = `${window.location.origin}/article/${articleId}`;
    
    try {
      navigator.clipboard.writeText(dummyUrl);
      showToast('Link copied to clipboard!', 'success');
    } catch (err) {
      showToast('Failed to copy link', 'warning');
    }
  };

  return (
    <button
      onClick={handleShare}
      className="p-1.5 rounded-full hover:bg-zinc-50 text-zinc-400 hover:text-zinc-950 transition-colors focus:outline-none"
      aria-label="Share article"
    >
      <Share2 className="w-4 h-4 hover:scale-110 transition-transform active:scale-125" />
    </button>
  );
};
