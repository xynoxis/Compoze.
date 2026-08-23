import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Bookmark, ArrowRight, Trash2 } from 'lucide-react';
import { EmptyState } from '../components/EmptyState';

export const Bookmarks: React.FC = () => {
  const { bookmarks, articles, authors, toggleBookmark, showToast, isAuthenticated, token } = useApp();
  const [removingId, setRemovingId] = useState<string | null>(null);

  if (!isAuthenticated || !token) {
    return (
      <div className="max-w-xl mx-auto py-24 text-center px-4">
        <EmptyState
          title="Sign in to view your Bookmarks"
          description="You are currently signed out. Please sign in to view and manage your saved stories and reading list."
          icon={<Bookmark className="w-10 h-10 text-on-surface-variant" />}
          actionText="Sign In"
          onAction={() => {
            const authBtn = document.querySelector('button') as HTMLButtonElement;
            if (authBtn) authBtn.click();
          }}
        />
      </div>
    );
  }

  // Find bookmarked articles
  const bookmarkedArticles = useMemo(() => {
    return articles.filter(a => bookmarks.includes(a.id) && a.status === 'published');
  }, [bookmarks, articles]);

  const handleRemove = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    setRemovingId(id);
    setTimeout(() => {
      toggleBookmark(id);
      setRemovingId(null);
      showToast('Removed from bookmarked articles', 'success');
    }, 240);
  };

  return (
    <div className="max-w-[1440px] mx-auto w-full px-8 lg:px-16 pt-6 pb-16">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-on-surface flex items-center gap-2 mb-1.5">
          <Bookmark className="w-8 h-8 text-primary fill-primary/10" />
          <span>Bookmarked Stories</span>
        </h1>
        <p className="text-on-surface-variant/70 text-xs font-sans max-w-2xl leading-relaxed">
          Your curated list of articles to read, reference, and keep close.
        </p>
      </div>

      {/* 12-Column Responsive Layout (4:2 Ratio / 8:4 Grid Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left / Main Bookmarks Feed Column (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col space-y-6">
          {bookmarkedArticles.length === 0 ? (
            <EmptyState
              title="Your bookmark list is empty"
              description="Explore Compoze to find interesting stories, then click the bookmark icon on any card to save it here for later reading."
              icon={<Bookmark className="w-10 h-10 text-on-surface-variant" />}
              actionText="Find Stories to Read"
              onAction={() => window.location.assign('/explore')}
            />
          ) : (
            <div className="space-y-6">
              {bookmarkedArticles.map(art => {
                const author = authors.find(a => a.id === art.authorId);
                const isRemoving = removingId === art.id;

                return (
                  <div 
                    key={art.id} 
                    className={`depth-card-interactive rounded-3xl p-6 lg:p-8 flex flex-col md:flex-row items-start justify-between gap-6 group ctrl-transition ${
                      isRemoving ? 'opacity-0 translate-x-3 scale-95 duration-200' : ''
                    }`}
                  >
                    <div className="flex-1 flex flex-col justify-between h-full w-full">
                      {/* Author Header */}
                      <div className="flex items-center space-x-2 mb-3">
                        {author && (
                          <Link to={`/profile/${author.username}`} className="flex items-center space-x-2 focus:outline-none">
                            <img 
                              src={author.avatar} 
                              alt={author.name} 
                              className="w-5 h-5 rounded-full object-cover"
                            />
                            <span className="text-xs font-semibold text-on-surface hover:underline">{author.name}</span>
                          </Link>
                        )}
                        <span className="text-on-surface-variant text-xs">•</span>
                        <span className="text-xs text-on-surface-variant font-medium">{art.date}</span>
                      </div>

                      {/* Title & Subtitle */}
                      <Link to={`/article/${art.id}`} className="group focus:outline-none mb-4 block">
                        <h3 className="font-serif text-xl sm:text-2xl font-bold text-on-surface group-hover:text-primary ctrl-transition leading-snug mb-2">
                          {art.title}
                        </h3>
                        <p className="text-sm text-on-surface-variant line-clamp-2 leading-relaxed font-sans">
                          {art.subtitle}
                        </p>
                      </Link>

                      {/* Footer Actions */}
                      <div className="flex items-center justify-between mt-auto pt-2">
                        <div className="flex items-center space-x-3 text-xs text-on-surface-variant">
                          <span className="px-3 py-1 bg-surface-container text-on-surface-variant rounded-full text-xs font-medium">
                            {art.topic}
                          </span>
                          <span>{art.readTime}</span>
                        </div>

                        <div className="flex items-center space-x-3">
                          <Link 
                            to={`/article/${art.id}`}
                            className="flex items-center space-x-1 text-xs font-semibold text-primary hover:underline ctrl-transition"
                          >
                            <span>Read article</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            onClick={(e) => handleRemove(e, art.id)}
                            className="p-2 depth-level-1 rounded-xl text-on-surface-variant hover:text-red-600 ctrl-transition cursor-pointer"
                            title="Remove Bookmark"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Right Cover Image */}
                    {art.coverImage && (
                      <Link 
                        to={`/article/${art.id}`}
                        className="w-full md:w-44 h-32 rounded-2xl overflow-hidden search-recessed flex-shrink-0 order-first md:order-last mb-4 md:mb-0"
                      >
                        <img 
                          src={art.coverImage} 
                          alt={art.title} 
                          className="w-full h-full object-cover ctrl-transition opacity-0"
                          onLoad={(e) => e.currentTarget.classList.remove('opacity-0')}
                        />
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Sidebar Column (4 Cols, Sticky on Desktop) */}
        <div className="lg:col-span-4 lg:sticky lg:top-24 w-full flex flex-col gap-6">
          {/* Summary Card */}
          <div className="w-full depth-panel rounded-3xl p-6 lg:p-7 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-border-subtle/20 pb-3">
              <h3 className="font-serif text-lg font-bold text-on-surface flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-primary" />
                <span>Saved Stories</span>
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                {bookmarkedArticles.length} Saved
              </span>
            </div>

            <p className="text-xs text-on-surface-variant leading-relaxed">
              Articles saved to your library stay accessible anytime across your devices for quick reference.
            </p>

            {bookmarkedArticles.length > 0 && (
              <div className="pt-2 border-t border-border-subtle/20">
                <Link
                  to="/explore"
                  className="w-full text-center px-4 py-2.5 depth-level-1 text-xs font-semibold rounded-full text-on-surface block ctrl-transition"
                >
                  Explore More Articles
                </Link>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
