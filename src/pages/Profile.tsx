import React, { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { FollowButton } from '../components/FollowButton';
import { ArticleCard } from '../components/ArticleCard';
import { EmptyState } from '../components/EmptyState';
import { BookOpen, MessageSquare, Info, Edit, X } from 'lucide-react';

export const Profile: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { 
    currentUser, 
    authors, 
    articles, 
    comments, 
    updateProfile, 
    showToast 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'articles' | 'responses' | 'about'>('articles');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Edit Form State
  const [editName, setEditName] = useState(currentUser.name);
  const [editBio, setEditBio] = useState(currentUser.bio);
  const [editAvatar, setEditAvatar] = useState(currentUser.avatar);

  // Determine if this is the logged-in user's profile
  const isSelf = useMemo(() => {
    return !username || username.toLowerCase() === currentUser.username.toLowerCase();
  }, [username, currentUser.username]);

  // Find target author
  const author = useMemo(() => {
    if (isSelf) return currentUser;
    return authors.find(a => a.username.toLowerCase() === username?.toLowerCase());
  }, [isSelf, currentUser, authors, username]);

  // Target author articles
  const authorArticles = useMemo(() => {
    if (!author) return [];
    return articles.filter(a => a.authorId === author.id && a.status === 'published');
  }, [author, articles]);

  // Target author responses
  const authorComments = useMemo(() => {
    if (!author) return [];
    // Filter comments where the user is the author
    return comments.filter(c => c.authorName === author.name);
  }, [author, comments]);

  if (!author) {
    return (
      <div className="max-w-xl mx-auto py-24 text-center px-4">
        <h2 className="font-serif text-2xl font-bold text-zinc-900 mb-4">User not found</h2>
        <p className="text-zinc-500 mb-8">The profile you are looking for does not exist on Compoze.</p>
        <Link to="/" className="px-5 py-2.5 bg-brand-700 text-white font-semibold rounded-full hover:bg-brand-800 transition-colors">
          Return Home
        </Link>
      </div>
    );
  }

  const handleEditProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: editName.trim() || currentUser.name,
      bio: editBio.trim() || currentUser.bio,
      avatar: editAvatar.trim() || currentUser.avatar,
    });
    setIsEditModalOpen(false);
    showToast('Profile updated successfully!', 'success');
  };

  const openEditModal = () => {
    setEditName(currentUser.name);
    setEditBio(currentUser.bio);
    setEditAvatar(currentUser.avatar);
    setIsEditModalOpen(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      {/* Profile Header Block */}
      <div className="flex flex-col md:flex-row items-center md:items-start justify-between border-b border-zinc-100 pb-10 mb-8 gap-6 text-center md:text-left">
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
          <img 
            src={author.avatar} 
            alt={author.name} 
            className="w-24 h-24 rounded-full object-cover border-2 border-zinc-100 shadow-sm"
          />
          <div className="space-y-2 max-w-lg">
            <h1 className="font-serif text-3xl font-bold text-zinc-950 leading-tight">
              {author.name}
            </h1>
            <p className="text-sm text-zinc-500">@{author.username}</p>
            <p className="text-sm text-zinc-650 text-zinc-600 font-sans leading-relaxed">
              {author.bio}
            </p>
            
            {/* Stats count */}
            <div className="flex items-center justify-center md:justify-start space-x-4 text-xs font-semibold text-zinc-500 pt-1">
              <span>{author.followers.toLocaleString()} followers</span>
              <span className="text-zinc-300">•</span>
              <span>{author.following.toLocaleString()} following</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex-shrink-0 pt-2">
          {isSelf ? (
            <button
              onClick={openEditModal}
              className="flex items-center space-x-1.5 px-4 py-2 border border-zinc-250 border-zinc-300 hover:border-zinc-900 rounded-full text-xs font-semibold text-zinc-700 hover:text-zinc-950 transition-colors focus:outline-none"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>Edit Profile</span>
            </button>
          ) : (
            <FollowButton authorId={author.id} className="px-5 py-2 text-sm font-semibold" />
          )}
        </div>
      </div>

      {/* Tabs list */}
      <div className="flex border-b border-zinc-100 mb-6">
        <button
          onClick={() => setActiveTab('articles')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors focus:outline-none ${
            activeTab === 'articles'
              ? 'border-brand-700 text-brand-800 font-semibold'
              : 'border-transparent text-zinc-500 hover:text-zinc-900'
          }`}
        >
          Articles ({authorArticles.length})
        </button>
        <button
          onClick={() => setActiveTab('responses')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors focus:outline-none ${
            activeTab === 'responses'
              ? 'border-brand-700 text-brand-800 font-semibold'
              : 'border-transparent text-zinc-500 hover:text-zinc-900'
          }`}
        >
          Responses ({authorComments.length})
        </button>
        <button
          onClick={() => setActiveTab('about')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors focus:outline-none ${
            activeTab === 'about'
              ? 'border-brand-700 text-brand-800 font-semibold'
              : 'border-transparent text-zinc-500 hover:text-zinc-900'
          }`}
        >
          About
        </button>
      </div>

      {/* Tab Panels */}
      <div>
        {activeTab === 'articles' && (
          <div className="space-y-6">
            {authorArticles.length === 0 ? (
              <EmptyState
                title="No articles published yet"
                description={isSelf 
                  ? "You haven't published any articles yet. Create your first piece today!" 
                  : `${author.name} hasn't published any articles on Compoze yet.`
                }
                icon={<BookOpen className="w-10 h-10 text-zinc-400" />}
                actionText={isSelf ? "Write an Article" : undefined}
                onAction={isSelf ? () => navigate('/write') : undefined}
              />
            ) : (
              <div className="divide-y divide-zinc-50">
                {authorArticles.map(art => (
                  <ArticleCard key={art.id} articleId={art.id} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'responses' && (
          <div className="space-y-4">
            {authorComments.length === 0 ? (
              <EmptyState
                title="No responses yet"
                description={isSelf 
                  ? "You haven't responded to any articles yet. Discover interesting stories and join the conversation!" 
                  : `${author.name} hasn't written any responses.`
                }
                icon={<MessageSquare className="w-10 h-10 text-zinc-400" />}
                actionText={isSelf ? "Explore Stories" : undefined}
                onAction={isSelf ? () => navigate('/explore') : undefined}
              />
            ) : (
              <div className="space-y-4">
                {[...authorComments].reverse().map(comment => {
                  const targetArt = articles.find(a => a.id === comment.articleId);
                  return (
                    <div key={comment.id} className="border border-zinc-150 rounded-xl p-5 hover:border-zinc-300 transition-colors">
                      <div className="text-[10px] text-zinc-450 text-zinc-400 font-semibold mb-2">
                        Responded to{' '}
                        {targetArt ? (
                          <Link to={`/article/${targetArt.id}`} className="text-zinc-700 hover:text-brand-700 underline">
                            "{targetArt.title}"
                          </Link>
                        ) : (
                          'an article'
                        )}{' '}
                        • {comment.date}
                      </div>
                      <p className="text-sm font-sans text-zinc-800 leading-relaxed italic border-l-2 border-zinc-200 pl-3">
                        "{comment.content}"
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'about' && (
          <div className="bg-zinc-50 border border-zinc-150 rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center space-x-3">
              <Info className="w-5 h-5 text-brand-700" />
              <h3 className="font-serif text-lg font-bold text-zinc-900">About {author.name}</h3>
            </div>
            
            <p className="text-sm sm:text-base font-sans text-zinc-650 text-zinc-700 leading-relaxed whitespace-pre-wrap">
              {author.bio || "No description provided."}
            </p>

            <div className="pt-4 border-t border-zinc-200/50 flex flex-wrap gap-x-12 gap-y-4 text-xs text-zinc-500">
              <div>
                <p className="text-[10px] uppercase font-bold text-zinc-400">Compoze Member</p>
                <p className="text-sm text-zinc-800 font-semibold mt-0.5">Alexandra Chen</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-zinc-400">Total Followers</p>
                <p className="text-sm text-zinc-800 font-semibold mt-0.5">{author.followers.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-zinc-400">Total Articles</p>
                <p className="text-sm text-zinc-800 font-semibold mt-0.5">{authorArticles.length}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Edit Profile Modal overlay */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-zinc-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsEditModalOpen(false)}
          />

          {/* Modal Container */}
          <form 
            onSubmit={handleEditProfileSave}
            className="relative bg-white rounded-2xl shadow-2xl border border-zinc-200 max-w-md w-full p-6 sm:p-8 z-10 space-y-6 animate-bounce-in"
          >
            <div className="flex items-center justify-between pb-3 border-b border-zinc-150">
              <h2 className="text-lg font-bold text-zinc-950">Edit Profile Info</h2>
              <button 
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 rounded-full hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 transition-colors focus:outline-none"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Avatar URL Input */}
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-bold text-zinc-700">Profile Image URL</label>
              <input
                type="text"
                value={editAvatar}
                onChange={e => setEditAvatar(e.target.value)}
                className="w-full py-2 px-3 border border-zinc-200 rounded-lg text-sm text-zinc-850 focus:outline-none focus:border-brand-500"
              />
              <div className="flex items-center space-x-3 mt-2">
                <img src={editAvatar} className="w-10 h-10 rounded-full object-cover border border-zinc-200" alt="" />
                <span className="text-[10px] text-zinc-400">Preview of your profile avatar</span>
              </div>
            </div>

            {/* Display Name Input */}
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-bold text-zinc-700">Display Name</label>
              <input
                type="text"
                value={editName}
                onChange={e => setEditName(e.target.value)}
                required
                className="w-full py-2 px-3 border border-zinc-200 rounded-lg text-sm text-zinc-850 focus:outline-none focus:border-brand-500"
              />
            </div>

            {/* Biography Textarea */}
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-bold text-zinc-700">Short Bio</label>
              <textarea
                value={editBio}
                onChange={e => setEditBio(e.target.value)}
                rows={3}
                maxLength={200}
                className="w-full py-2 px-3 border border-zinc-200 rounded-lg text-sm text-zinc-850 focus:outline-none focus:border-brand-500 resize-none font-sans"
              />
              <div className="text-right text-[10px] text-zinc-400">
                {editBio.length}/200 characters
              </div>
            </div>

            {/* Footer buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 border border-zinc-200 rounded-full text-xs font-semibold text-zinc-650 hover:text-zinc-950 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-brand-700 hover:bg-brand-800 text-white rounded-full text-xs font-semibold shadow-sm transition-colors"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
