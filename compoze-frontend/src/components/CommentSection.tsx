import React, { useState, useEffect, useCallback } from 'react';
import { X, MessageSquare, Trash2, Reply, Send } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { fetchPostComments, addComment, replyToComment, deleteComment } from '../api/comments';
import type { CommentDto } from '../api/comments';

interface CommentSectionProps {
  articleId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const CommentSection: React.FC<CommentSectionProps> = ({ articleId, isOpen, onClose }) => {
  const { currentUser, isAuthenticated, showToast } = useApp();
  
  const [commentsList, setCommentsList] = useState<CommentDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Active reply box state: stores top-level comment ID being replied to
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  // Fetch comments for this article from backend API
  const loadComments = useCallback(async () => {
    if (!articleId) return;
    setLoading(true);
    try {
      const data = await fetchPostComments(articleId);
      setCommentsList(Array.isArray(data) ? data : []);
    } catch (err: any) {
      // Keep empty if failed or offline
      setCommentsList([]);
    } finally {
      setLoading(false);
    }
  }, [articleId]);

  useEffect(() => {
    if (isOpen) {
      loadComments();
    }
  }, [isOpen, loadComments]);

  // Submit top-level comment
  const handleTopLevelSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    if (!isAuthenticated) {
      showToast('Please sign in to post a comment.', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      const newComment = await addComment(articleId, commentText.trim());
      setCommentsList(prev => [newComment, ...prev]);
      setCommentText('');
      showToast('Response published!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to post comment.', 'warning');
    } finally {
      setSubmitting(false);
    }
  };

  // Submit reply to a top-level comment
  const handleReplySubmit = async (parentCommentId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    if (!isAuthenticated) {
      showToast('Please sign in to reply.', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      const newReply = await replyToComment(parentCommentId, replyText.trim());
      setCommentsList(prev => [...prev, newReply]);
      setReplyText('');
      setReplyingToId(null);
      showToast('Reply published!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to post reply.', 'warning');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle comment deletion (Owner check enforced by backend authorization)
  const handleDeleteComment = async (commentId: string) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;
    try {
      await deleteComment(commentId);
      setCommentsList(prev => prev.filter(c => c.id !== commentId));
      showToast('Comment deleted successfully!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to delete comment.', 'warning');
    }
  };

  if (!isOpen) return null;

  // Filter top-level comments and map replies
  const topLevelComments = commentsList.filter(c => !c.parentId);
  const getRepliesForComment = (parentId: string) => commentsList.filter(c => c.parentId === parentId);

  const formatDate = (isoString: string) => {
    if (!isoString) return 'Recently';
    return new Date(isoString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-on-surface/40 backdrop-blur-sm z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Neumorphic Drawer */}
      <div className="fixed top-0 right-0 h-full w-full sm:w-96 max-w-md bg-surface shadow-2xl border-l border-border-subtle/40 z-50 flex flex-col text-on-surface animate-bounce-in">
        {/* Drawer Header */}
        <div className="p-5 border-b border-border-subtle/30 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <MessageSquare className="w-5 h-5 text-primary" />
            <h3 className="font-serif font-bold text-lg text-on-surface">Responses ({commentsList.length})</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-surface-container rounded-full text-on-surface-variant hover:text-primary transition-colors focus:outline-none cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Responses Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Write comment form */}
          {isAuthenticated ? (
            <form onSubmit={handleTopLevelSubmit} className="bg-surface shadow-neumorphic-raised rounded-2xl p-4 border border-border-subtle/20">
              <div className="shadow-neumorphic-inset rounded-xl bg-surface p-3 mb-3">
                <textarea
                  value={commentText}
                  onChange={e => setCommentText(e.target.value)}
                  placeholder="What are your thoughts?"
                  rows={3}
                  className="w-full bg-transparent border-0 p-0 text-xs placeholder-on-surface-variant/60 focus:ring-0 focus:outline-none resize-none text-on-surface"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!commentText.trim() || submitting}
                  className="px-4 py-2 btn-primary-3d text-on-primary rounded-full text-xs font-semibold ctrl-transition disabled:opacity-40 cursor-pointer"
                >
                  {submitting ? 'Posting...' : 'Respond'}
                </button>
              </div>
            </form>
          ) : (
            <div className="bg-surface shadow-neumorphic-raised rounded-2xl p-4 text-center border border-border-subtle/20">
              <p className="text-xs text-on-surface-variant leading-relaxed mb-1">
                Join the conversation to share your thoughts.
              </p>
              <p className="text-[11px] font-semibold text-primary">
                Sign in to leave a response
              </p>
            </div>
          )}

          {/* Comment List */}
          {loading ? (
            <div className="text-center py-12 text-on-surface-variant text-xs font-sans italic">
              Loading responses...
            </div>
          ) : topLevelComments.length === 0 ? (
            <div className="text-center py-12 text-on-surface-variant/70 text-xs font-sans italic">
              No responses yet. Be the first to share your thoughts!
            </div>
          ) : (
            <div className="space-y-6">
              {topLevelComments.map(comment => {
                const replies = getRepliesForComment(comment.id);
                const isOwner = isAuthenticated && currentUser && comment.authorId === currentUser.id;

                return (
                  <div key={comment.id} className="border-b border-border-subtle/20 pb-5 last:border-0 last:pb-0">
                    {/* User Profile Header */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-7 h-7 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center border border-primary/20">
                          {comment.authorUsername ? comment.authorUsername.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div>
                          <span className="text-xs font-bold text-on-surface block">@{comment.authorUsername}</span>
                          <span className="text-[10px] text-on-surface-variant/70">{formatDate(comment.createdAt)}</span>
                        </div>
                      </div>

                      {/* Delete action for comment owner only */}
                      {isOwner && (
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="p-1 text-on-surface-variant hover:text-red-600 transition-colors focus:outline-none cursor-pointer"
                          title="Delete response"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Top-Level Comment Content */}
                    <p className="text-xs text-on-surface font-sans leading-relaxed break-words whitespace-pre-wrap pl-1 mb-2">
                      {comment.content}
                    </p>

                    {/* Top-Level Action Buttons (Reply button offered ONLY on top-level comments) */}
                    <div className="flex items-center space-x-3 text-on-surface-variant text-[11px] pl-1">
                      {isAuthenticated && (
                        <button
                          onClick={() => {
                            setReplyingToId(replyingToId === comment.id ? null : comment.id);
                            setReplyText('');
                          }}
                          className="flex items-center space-x-1 text-xs text-primary font-medium hover:underline focus:outline-none cursor-pointer"
                        >
                          <Reply className="w-3 h-3" />
                          <span>{replyingToId === comment.id ? 'Cancel' : 'Reply'}</span>
                        </button>
                      )}
                    </div>

                    {/* Reply Input Box (When replying to top-level comment) */}
                    {replyingToId === comment.id && (
                      <form onSubmit={e => handleReplySubmit(comment.id, e)} className="mt-3 ml-4 p-3 bg-surface shadow-neumorphic-inset rounded-xl border border-border-subtle/20">
                        <textarea
                          value={replyText}
                          onChange={e => setReplyText(e.target.value)}
                          placeholder={`Reply to @${comment.authorUsername}...`}
                          rows={2}
                          className="w-full bg-transparent border-0 p-0 text-xs placeholder-on-surface-variant/60 focus:ring-0 focus:outline-none resize-none text-on-surface"
                        />
                        <div className="flex justify-end pt-2">
                          <button
                            type="submit"
                            disabled={!replyText.trim() || submitting}
                            className="px-3 py-1.5 btn-primary-3d text-on-primary rounded-full text-[11px] font-semibold ctrl-transition disabled:opacity-40 flex items-center space-x-1 cursor-pointer"
                          >
                            <Send className="w-3 h-3" />
                            <span>{submitting ? 'Sending...' : 'Post Reply'}</span>
                          </button>
                        </div>
                      </form>
                    )}

                    {/* Render Child Replies (Single Level - NO reply-to-reply button rendered) */}
                    {replies.length > 0 && (
                      <div className="ml-5 mt-4 pl-3 border-l-2 border-primary/20 space-y-3">
                        {replies.map(reply => {
                          const isReplyOwner = isAuthenticated && currentUser && reply.authorId === currentUser.id;

                          return (
                            <div key={reply.id} className="bg-surface-container/30 p-3 rounded-xl border border-border-subtle/20">
                              <div className="flex items-center justify-between mb-1.5">
                                <div className="flex items-center space-x-2">
                                  <div className="w-5 h-5 rounded-full bg-primary/10 text-primary font-bold text-[10px] flex items-center justify-center">
                                    {reply.authorUsername ? reply.authorUsername.charAt(0).toUpperCase() : 'U'}
                                  </div>
                                  <span className="text-xs font-semibold text-on-surface">@{reply.authorUsername}</span>
                                  <span className="text-[10px] text-on-surface-variant/70">• {formatDate(reply.createdAt)}</span>
                                </div>

                                {isReplyOwner && (
                                  <button
                                    onClick={() => handleDeleteComment(reply.id)}
                                    className="p-1 text-on-surface-variant hover:text-red-600 transition-colors focus:outline-none cursor-pointer"
                                    title="Delete reply"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                )}
                              </div>

                              <p className="text-xs text-on-surface font-sans leading-relaxed break-words whitespace-pre-wrap">
                                {reply.content}
                              </p>
                              {/* NOTE: No reply button offered on replies to enforce backend single-level constraint */}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
