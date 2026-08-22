import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Bookmark, ArrowRight, Trash2 } from 'lucide-react';
import { EmptyState } from '../components/EmptyState';

export const Bookmarks: React.FC = () => {
  const { bookmarks, articles, authors, toggleBookmark, showToast } = useApp();

  // Find bookmarked articles
  const bookmarkedArticles = useMemo(() => {
    return articles.filter(a => bookmarks.includes(a.id) && a.status === 'published');
  }, [bookmarks, articles]);

  const handleRemove = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    toggleBookmark(id);
    showToast('Removed from bookmarked articles', 'success');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="mb-10 text-center sm:text-left">
        <h1 className="font-serif text-3xl font-bold text-zinc-950 flex items-center justify-center sm:justify-start gap-2">
          <Bookmark className="w-7 h-7 text-brand-700 fill-brand-50" />
          <span>Bookmarked Stories</span>
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          Your curated list of articles to read, reference, and keep close.
        </p>
      </div>

      {/* Bookmarks List */}
      <div>
        {bookmarkedArticles.length === 0 ? (
          <EmptyState
            title="Your bookmark list is empty"
            description="Explore Compoze to find interesting stories, then click the bookmark icon on any card to save it here for later reading."
            icon={<Bookmark className="w-10 h-10 text-zinc-400" />}
            actionText="Find Stories to Read"
            onAction={() => window.location.assign('/explore')}
          />
        ) : (
          <div className="space-y-6">
            {bookmarkedArticles.map(art => {
              const author = authors.find(a => a.id === art.authorId);
              return (
                <div 
                  key={art.id} 
                  className="bg-white border border-zinc-200 hover:border-zinc-300 rounded-2xl p-5 shadow-sm hover:shadow-md flex flex-col sm:flex-row items-start justify-between gap-6 group transition-all duration-200"
                >
                  <div className="flex-1 space-y-3 min-w-0">
                    {/* Header Author block */}
                    <div className="flex items-center space-x-2 text-xs">
                      <img 
                        src={author?.avatar} 
                        alt={author?.name} 
                        className="w-5 h-5 rounded-full object-cover border border-zinc-200"
                      />
                      <span className="font-semibold text-zinc-900">{author?.name}</span>
                      <span className="text-zinc-300">•</span>
                      <span className="text-zinc-500">{art.date}</span>
                    </div>

                    {/* Title */}
                    <div>
                      <Link to={`/article/${art.id}`} className="block focus:outline-none">
                        <h3 className="font-serif text-lg font-bold text-zinc-950 group-hover:text-brand-700 transition-colors leading-snug mb-1">
                          {art.title}
                        </h3>
                      </Link>
                      <p className="text-xs text-zinc-550 text-zinc-500 line-clamp-2 leading-relaxed font-sans">
                        {art.subtitle}
                      </p>
                    </div>

                    {/* Metadata Actions */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center space-x-3 text-[11px] text-zinc-500 font-medium">
                        <span className="px-2 py-0.5 bg-zinc-50 border border-zinc-150 rounded-full text-zinc-600">
                          {art.topic}
                        </span>
                        <span>{art.readTime}</span>
                      </div>
                      <Link 
                        to={`/article/${art.id}`}
                        className="flex items-center space-x-1 text-xs font-semibold text-brand-700 hover:text-brand-800"
                      >
                        <span>Read article</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>

                  {/* Right: Cover & Remove button */}
                  <div className="flex flex-row sm:flex-col items-center justify-between sm:justify-start gap-4 w-full sm:w-auto self-stretch">
                    {art.coverImage && (
                      <Link 
                        to={`/article/${art.id}`}
                        className="w-24 h-16 rounded-lg overflow-hidden border border-zinc-200 flex-shrink-0"
                      >
                        <img 
                          src={art.coverImage} 
                          alt={art.title} 
                          className="w-full h-full object-cover"
                        />
                      </Link>
                    )}
                    <button
                      onClick={(e) => handleRemove(e, art.id)}
                      className="p-1.5 border border-zinc-200 hover:border-red-200 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors focus:outline-none ml-auto sm:ml-0"
                      title="Remove Bookmark"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
