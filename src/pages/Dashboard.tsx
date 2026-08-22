import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
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
  const { articles, currentUser, deleteArticle, showToast } = useApp();
  const navigate = useNavigate();
  const [activeListTab, setActiveListTab] = useState<'published' | 'drafts'>('published');

  // Filter articles written by the active user
  const userArticles = useMemo(() => {
    return articles.filter(a => a.authorId === currentUser.id);
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

  const handleDelete = (articleId: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) {
      deleteArticle(articleId);
      showToast('Article deleted successfully!', 'success');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10 pb-6 border-b border-zinc-150 dark:border-zinc-900">
        <div>
          <h1 className="font-serif text-3xl font-bold text-zinc-950 dark:text-zinc-50">Creator Dashboard</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 animate-bounce-in">
            Manage your draft and published stories, analyze traffic, and track your audience growth.
          </p>
        </div>
        <Link 
          to="/write" 
          className="px-5 py-2.5 bg-brand-700 hover:bg-brand-800 text-white rounded-full text-xs font-semibold shadow-sm transition-colors"
        >
          Create New Article
        </Link>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 mb-12">
        {/* Stat item */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-xl flex items-center space-x-4 shadow-sm">
          <div className="p-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-lg text-zinc-500 dark:text-zinc-400">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Total Views</p>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">{stats.views.toLocaleString()}</h3>
          </div>
        </div>

        {/* Stat item */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-xl flex items-center space-x-4 shadow-sm">
          <div className="p-2.5 bg-teal-50 dark:bg-teal-950/30 border border-teal-100 dark:border-teal-900/50 rounded-lg text-teal-600 dark:text-teal-400">
            <Heart className="w-5 h-5 fill-teal-50 dark:fill-teal-950/30 text-teal-600 dark:text-teal-400" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Total Likes</p>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">{stats.likes.toLocaleString()}</h3>
          </div>
        </div>

        {/* Stat item */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-xl flex items-center space-x-4 shadow-sm">
          <div className="p-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-lg text-zinc-500 dark:text-zinc-400">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Followers</p>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">{stats.followers.toLocaleString()}</h3>
          </div>
        </div>

        {/* Stat item */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-xl flex items-center space-x-4 shadow-sm">
          <div className="p-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-lg text-zinc-500 dark:text-zinc-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Published</p>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">{stats.publishedCount}</h3>
          </div>
        </div>

        {/* Stat item */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-xl flex items-center space-x-4 shadow-sm col-span-2 lg:col-span-1">
          <div className="p-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-lg text-zinc-500 dark:text-zinc-400">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Drafts</p>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">{stats.draftsCount}</h3>
          </div>
        </div>
      </div>

      {/* Stories Listing Area */}
      <div>
        <div className="flex items-center justify-between border-b border-zinc-150 dark:border-zinc-900 pb-2 mb-6">
          <div className="flex space-x-6">
            <button
              onClick={() => setActiveListTab('published')}
              className={`pb-3.5 text-sm font-medium border-b-2 transition-colors focus:outline-none ${
                activeListTab === 'published'
                  ? 'border-brand-700 text-brand-800 dark:text-brand-400 font-semibold'
                  : 'border-transparent text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-100'
              }`}
            >
              Published Stories ({publishedArticles.length})
            </button>
            <button
              onClick={() => setActiveListTab('drafts')}
              className={`pb-3.5 text-sm font-medium border-b-2 transition-colors focus:outline-none ${
                activeListTab === 'drafts'
                  ? 'border-brand-700 text-brand-800 dark:text-brand-400 font-semibold'
                  : 'border-transparent text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-100'
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
                icon={<BookOpen className="w-10 h-10 text-zinc-400" />}
                actionText="Write New Story"
                onAction={() => navigate('/write')}
              />
            ) : (
              /* Published list */
              <div className="overflow-x-auto border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 shadow-sm">
                <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800 text-left text-sm">
                  <thead className="bg-zinc-50 dark:bg-zinc-800/40 font-semibold text-zinc-500 dark:text-zinc-400 text-xs uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4">Title</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4 text-center">Views</th>
                      <th className="px-6 py-4 text-center">Likes</th>
                      <th className="px-6 py-4 text-center">Comments</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-150 dark:divide-zinc-800 text-zinc-800 dark:text-zinc-200">
                    {publishedArticles.map(art => (
                      <tr key={art.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors">
                        <td className="px-6 py-4 font-serif font-bold max-w-sm truncate text-zinc-950 dark:text-zinc-100">
                          <Link to={`/article/${art.id}`} className="hover:underline">
                            {art.title}
                          </Link>
                          <span className="block font-sans text-xs font-normal text-zinc-400 mt-1">{art.topic}</span>
                        </td>
                        <td className="px-6 py-4 text-xs font-medium text-zinc-500">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                            <span>{art.date}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center font-semibold text-zinc-700 dark:text-zinc-350">{art.views.toLocaleString()}</td>
                        <td className="px-6 py-4 text-center font-semibold text-teal-650 text-teal-600 dark:text-teal-400">{art.likes.toLocaleString()}</td>
                        <td className="px-6 py-4 text-center font-semibold text-zinc-700 dark:text-zinc-350">{art.commentsCount}</td>
                        <td className="px-6 py-4 text-right whitespace-nowrap space-x-2">
                          <button
                            onClick={() => navigate(`/write?edit=${art.id}`)}
                            className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors inline-flex items-center"
                            title="Edit story"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(art.id, art.title)}
                            className="p-1.5 hover:bg-red-50 dark:hover:bg-red-950/20 rounded text-zinc-400 hover:text-red-600 transition-colors inline-flex items-center"
                            title="Delete story"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
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
                icon={<FileText className="w-10 h-10 text-zinc-400" />}
                actionText="Create New Draft"
                onAction={() => navigate('/write')}
              />
            ) : (
              /* Drafts table list */
              <div className="overflow-x-auto border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 shadow-sm">
                <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800 text-left text-sm">
                  <thead className="bg-zinc-50 dark:bg-zinc-800/40 font-semibold text-zinc-500 dark:text-zinc-400 text-xs uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4">Title</th>
                      <th className="px-6 py-4">Saved Date</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-150 dark:divide-zinc-800 text-zinc-800 dark:text-zinc-200">
                    {draftArticles.map(art => (
                      <tr key={art.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors">
                        <td className="px-6 py-4 font-serif font-semibold text-zinc-950 dark:text-zinc-100">
                          <Link to={`/write?edit=${art.id}`} className="hover:underline">
                            {art.title || 'Untitled Draft'}
                          </Link>
                          <span className="block font-sans text-xs font-normal text-zinc-400 mt-1">{art.topic}</span>
                        </td>
                        <td className="px-6 py-4 text-xs font-medium text-zinc-500">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                            <span>{art.date}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-0.5 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 text-amber-800 dark:text-amber-400 text-[10px] font-bold uppercase rounded">
                            Draft
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right whitespace-nowrap space-x-2">
                          <button
                            onClick={() => navigate(`/write?edit=${art.id}`)}
                            className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors inline-flex items-center"
                            title="Edit draft"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(art.id, art.title)}
                            className="p-1.5 hover:bg-red-50 dark:hover:bg-red-950/20 rounded text-zinc-400 hover:text-red-600 transition-colors inline-flex items-center"
                            title="Delete draft"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
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
