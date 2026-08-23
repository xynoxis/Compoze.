import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { deletePost as apiDeletePost } from '../api/posts';
import { EmptyState } from '../components/EmptyState';
import { 
  Eye, 
  Heart, 
  Users, 
  BookOpen, 
  FileText, 
  Edit, 
  Trash2, 
  Calendar
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { articles, currentUser, deleteArticle, showToast, token, isAuthenticated } = useApp();
  const navigate = useNavigate();
  const [activeListTab, setActiveListTab] = useState<'published' | 'drafts'>('published');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  if (!isAuthenticated || !token) {
    return (
      <div className="max-w-xl mx-auto py-24 text-center px-4">
        <EmptyState
          title="Sign in to your Creator Dashboard"
          description="You are currently signed out. Please sign in to manage your published stories, edit drafts, and track audience analytics."
          icon={<BookOpen className="w-10 h-10 text-on-surface-variant" />}
          actionText="Sign In"
          onAction={() => {
            const authBtn = document.querySelector('button') as HTMLButtonElement;
            if (authBtn) authBtn.click();
          }}
        />
      </div>
    );
  }

  // Filter articles written by the active user (Owner Check UX)
  const userArticles = useMemo(() => {
    return articles.filter(a => a.authorId === currentUser.id || !a.authorId);
  }, [articles, currentUser.id]);

  const publishedArticles = useMemo(() => {
    return userArticles.filter(a => a.status === 'published');
  }, [userArticles]);

  const draftArticles = useMemo(() => {
    return userArticles.filter(a => a.status === 'draft');
  }, [userArticles]);

  // Aggregate stats
  const stats = useMemo(() => {
    const totalViews = publishedArticles.reduce((sum, a) => sum + a.views, 0);
    const totalLikes = publishedArticles.reduce((sum, a) => sum + a.likes, 0);
    return {
      views: totalViews,
      likes: totalLikes,
      followers: currentUser.followers,
      publishedCount: publishedArticles.length,
      draftsCount: draftArticles.length,
    };
  }, [publishedArticles, draftArticles, currentUser.followers]);

  const handleDelete = async (articleId: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) {
      setDeletingId(articleId);
      setTimeout(async () => {
        if (token) {
          try {
            await apiDeletePost(articleId);
          } catch (err: any) {
            console.warn('Backend delete note:', err);
          }
        }
        deleteArticle(articleId);
        setDeletingId(null);
        showToast('Article deleted successfully!', 'success');
      }, 260);
    }
  };

  return (
    <div className="max-w-7xl mx-auto w-full px-6 lg:px-12 pt-4 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-border-subtle/30">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-on-surface mb-1">Creator Dashboard</h1>
          <p className="text-sm text-on-surface-variant font-sans">
            Manage your draft and published stories, analyze traffic, and track your audience growth.
          </p>
        </div>
        <Link 
          to="/write" 
          className="px-6 py-2.5 btn-primary-3d text-on-primary rounded-full text-xs font-semibold inline-block"
        >
          Create New Article
        </Link>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 mb-10">
        {/* Stat item */}
        <div className="depth-panel rounded-3xl p-5 flex items-center space-x-4 ctrl-transition">
          <div className="p-3 search-recessed rounded-2xl text-primary">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Total Views</p>
            <h3 className="text-xl font-bold text-on-surface mt-0.5">{stats.views.toLocaleString()}</h3>
          </div>
        </div>

        {/* Stat item */}
        <div className="depth-panel rounded-3xl p-5 flex items-center space-x-4 ctrl-transition">
          <div className="p-3 search-recessed rounded-2xl text-primary">
            <Heart className="w-5 h-5 fill-primary stroke-primary" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Total Likes</p>
            <h3 className="text-xl font-bold text-on-surface mt-0.5">{stats.likes.toLocaleString()}</h3>
          </div>
        </div>

        {/* Stat item */}
        <div className="depth-panel rounded-3xl p-5 flex items-center space-x-4 ctrl-transition">
          <div className="p-3 search-recessed rounded-2xl text-primary">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Followers</p>
            <h3 className="text-xl font-bold text-on-surface mt-0.5">{stats.followers.toLocaleString()}</h3>
          </div>
        </div>

        {/* Stat item */}
        <div className="depth-panel rounded-3xl p-5 flex items-center space-x-4 ctrl-transition">
          <div className="p-3 search-recessed rounded-2xl text-primary">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Published</p>
            <h3 className="text-xl font-bold text-on-surface mt-0.5">{stats.publishedCount}</h3>
          </div>
        </div>

        {/* Stat item */}
        <div className="depth-panel rounded-3xl p-5 flex items-center space-x-4 ctrl-transition col-span-2 lg:col-span-1">
          <div className="p-3 search-recessed rounded-2xl text-primary">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Drafts</p>
            <h3 className="text-xl font-bold text-on-surface mt-0.5">{stats.draftsCount}</h3>
          </div>
        </div>
      </div>

      {/* Stories Listing Area */}
      <div>
        <div className="flex items-center justify-between border-b border-border-subtle/30 pb-2 mb-6">
          <div className="flex space-x-6">
            <button
              onClick={() => setActiveListTab('published')}
              className={`pb-3 text-xs font-medium border-b-2 ctrl-transition focus:outline-none cursor-pointer ${
                activeListTab === 'published'
                  ? 'border-primary text-primary font-semibold'
                  : 'border-transparent text-on-surface-variant hover:text-primary'
              }`}
            >
              Published Stories ({publishedArticles.length})
            </button>
            <button
              onClick={() => setActiveListTab('drafts')}
              className={`pb-3 text-xs font-medium border-b-2 ctrl-transition focus:outline-none cursor-pointer ${
                activeListTab === 'drafts'
                  ? 'border-primary text-primary font-semibold'
                  : 'border-transparent text-on-surface-variant hover:text-primary'
              }`}
            >
              Drafts ({draftArticles.length})
            </button>
          </div>
        </div>

        {/* Stories list rendering */}
        <div>
          {activeListTab === 'published' ? (
            publishedArticles.length === 0 ? (
              <EmptyState
                title="No published stories"
                description="You haven't shared any published stories yet. Draft and publish an article to showcase it here."
                icon={<BookOpen className="w-10 h-10 text-on-surface-variant" />}
                actionText="Write New Story"
                onAction={() => navigate('/write')}
              />
            ) : (
              /* Published list */
              <div className="overflow-x-auto depth-panel rounded-3xl p-4">
                <table className="min-w-full divide-y divide-border-subtle/20 text-left text-sm">
                  <thead className="bg-surface-container/50 font-semibold text-on-surface-variant text-xs uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4 rounded-l-2xl">Title</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4 text-center">Views</th>
                      <th className="px-6 py-4 text-center">Likes</th>
                      <th className="px-6 py-4 text-center">Comments</th>
                      <th className="px-6 py-4 text-right rounded-r-2xl">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-subtle/20 text-on-surface">
                    {publishedArticles.map(art => {
                      const isDeleting = deletingId === art.id;
                      return (
                        <tr 
                          key={art.id} 
                          className={`hover:bg-surface-container/30 ctrl-transition ${
                            isDeleting ? 'opacity-0 scale-95 duration-240' : ''
                          }`}
                        >
                          <td className="px-6 py-4 font-serif font-bold max-w-sm truncate text-on-surface">
                            <Link to={`/article/${art.id}`} className="hover:text-primary ctrl-transition">
                              {art.title}
                            </Link>
                            <span className="block font-sans text-xs font-normal text-on-surface-variant mt-1">{art.topic}</span>
                          </td>
                          <td className="px-6 py-4 text-xs font-medium text-on-surface-variant">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-3.5 h-3.5 text-on-surface-variant" />
                              <span>{art.date}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center font-semibold text-on-surface">{art.views.toLocaleString()}</td>
                          <td className="px-6 py-4 text-center font-semibold text-primary">{art.likes.toLocaleString()}</td>
                          <td className="px-6 py-4 text-center font-semibold text-on-surface">{art.commentsCount}</td>
                          <td className="px-6 py-4 text-right whitespace-nowrap space-x-2">
                            <button
                              onClick={() => navigate(`/write?edit=${art.id}`)}
                              className="p-2 depth-level-1 rounded-xl text-on-surface-variant hover:text-primary ctrl-transition inline-flex items-center cursor-pointer"
                              title="Edit story"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(art.id, art.title)}
                              className="p-2 depth-level-1 rounded-xl text-on-surface-variant hover:text-red-600 ctrl-transition inline-flex items-center cursor-pointer"
                              title="Delete story"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )
          ) : (
            /* Drafts list tab */
            draftArticles.length === 0 ? (
              <EmptyState
                title="No draft stories"
                description="Your draft workspace is clean. Create a new draft and resume writing whenever you are ready."
                icon={<FileText className="w-10 h-10 text-on-surface-variant" />}
                actionText="Start a Draft"
                onAction={() => navigate('/write')}
              />
            ) : (
              /* Drafts list */
              <div className="overflow-x-auto depth-panel rounded-3xl p-4">
                <table className="min-w-full divide-y divide-border-subtle/20 text-left text-sm">
                  <thead className="bg-surface-container/50 font-semibold text-on-surface-variant text-xs uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4 rounded-l-2xl">Title</th>
                      <th className="px-6 py-4">Saved Date</th>
                      <th className="px-6 py-4">Topic</th>
                      <th className="px-6 py-4 text-right rounded-r-2xl">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-subtle/20 text-on-surface">
                    {draftArticles.map(art => {
                      const isDeleting = deletingId === art.id;
                      return (
                        <tr 
                          key={art.id} 
                          className={`hover:bg-surface-container/30 ctrl-transition ${
                            isDeleting ? 'opacity-0 scale-95 duration-240' : ''
                          }`}
                        >
                          <td className="px-6 py-4 font-serif font-bold max-w-sm truncate text-on-surface">
                            <Link to={`/write?edit=${art.id}`} className="hover:text-primary ctrl-transition">
                              {art.title || 'Untitled Draft'}
                            </Link>
                          </td>
                          <td className="px-6 py-4 text-xs font-medium text-on-surface-variant">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-3.5 h-3.5 text-on-surface-variant" />
                              <span>{art.date}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-xs font-medium text-on-surface-variant">{art.topic}</td>
                          <td className="px-6 py-4 text-right whitespace-nowrap space-x-2">
                            <button
                              onClick={() => navigate(`/write?edit=${art.id}`)}
                              className="p-2 depth-level-1 rounded-xl text-on-surface-variant hover:text-primary ctrl-transition inline-flex items-center cursor-pointer"
                              title="Edit draft"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(art.id, art.title || 'Untitled Draft')}
                              className="p-2 depth-level-1 rounded-xl text-on-surface-variant hover:text-red-600 ctrl-transition inline-flex items-center cursor-pointer"
                              title="Delete draft"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};
