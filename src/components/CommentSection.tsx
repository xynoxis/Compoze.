import React, { useState } from 'react';
import { X, MessageSquare, ThumbsUp } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface CommentSectionProps {
  articleId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const CommentSection: React.FC<CommentSectionProps> = ({ articleId, isOpen, onClose }) => {
  const { comments, addComment, showToast } = useApp();
  const [commentText, setCommentText] = useState('');

  // Filter comments for this article
  const articleComments = comments.filter(c => c.articleId === articleId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    addComment(articleId, commentText.trim());
    setCommentText('');
    showToast('Response published!', 'success');
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-full sm:w-96 max-w-md bg-white border-l border-zinc-200 shadow-2xl z-50 flex flex-col animate-bounce-in">
        {/* Drawer Header */}
        <div className="p-4 border-b border-zinc-150 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-zinc-800" />
            <h3 className="font-bold text-zinc-900">Responses ({articleComments.length})</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 transition-colors focus:outline-none"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Responses Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 no-scrollbar">
          {/* Write comment form */}
          <form onSubmit={handleSubmit} className="border border-zinc-200 rounded-lg p-3 bg-zinc-50 focus-within:border-brand-500 focus-within:bg-white transition-all">
            <textarea
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              placeholder="What are your thoughts?"
              rows={3}
              className="w-full bg-transparent border-0 p-0 text-sm placeholder-zinc-400 focus:ring-0 focus:outline-none resize-none text-zinc-800"
            />
            <div className="flex justify-end pt-2 border-t border-zinc-200/50 mt-2">
              <button
                type="submit"
                disabled={!commentText.trim()}
                className="px-3.5 py-1.5 bg-brand-700 hover:bg-brand-800 text-white rounded-full text-xs font-semibold shadow-sm transition-colors disabled:opacity-40 disabled:hover:bg-brand-700"
              >
                Respond
              </button>
            </div>
          </form>

          {/* Comment List */}
          {articleComments.length === 0 ? (
            <div className="text-center py-12 text-zinc-450 text-zinc-400 text-sm font-sans">
              No responses yet. Be the first to share your thoughts!
            </div>
          ) : (
            <div className="space-y-5">
              {[...articleComments].reverse().map(comment => (
                <div key={comment.id} className="border-b border-zinc-100 pb-4 last:border-0 last:pb-0">
                  {/* User profile row */}
                  <div className="flex items-center space-x-2 mb-2">
                    <img 
                      src={comment.authorAvatar} 
                      alt={comment.authorName} 
                      className="w-6 h-6 rounded-full object-cover border border-zinc-150"
                    />
                    <div>
                      <span className="text-xs font-semibold text-zinc-900 block">{comment.authorName}</span>
                      <span className="text-[10px] text-zinc-455 text-zinc-400">{comment.date}</span>
                    </div>
                  </div>

                  {/* Comment text */}
                  <p className="text-xs text-zinc-850 text-zinc-700 font-sans leading-relaxed break-words whitespace-pre-wrap pl-1 mb-2">
                    {comment.content}
                  </p>

                  {/* Actions */}
                  <div className="flex items-center space-x-3 text-zinc-455 text-zinc-400 text-[11px] pl-1">
                    <button 
                      onClick={() => showToast('Simulated comment like', 'success')} 
                      className="flex items-center space-x-1 hover:text-brand-700 transition-colors focus:outline-none"
                    >
                      <ThumbsUp className="w-3 h-3" />
                      <span>{comment.likes}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
