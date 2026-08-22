import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { mockTopics } from '../data/mockData';
import { ArticleCard } from '../components/ArticleCard';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { EmptyState } from '../components/EmptyState';
import { Search, SlidersHorizontal, BookOpen } from 'lucide-react';

export const Explore: React.FC = () => {
  const { articles } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('All');
  const [sortBy, setSortBy] = useState<'recommended' | 'latest' | 'popular' | 'discussed'>('recommended');
  
  // Simulated pagination state
  const [visibleCount, setVisibleCount] = useState(4);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Filter published articles
  const publishedArticles = useMemo(() => {
    return articles.filter(a => a.status === 'published');
  }, [articles]);

  // Process sorting and filtering
  const processedArticles = useMemo(() => {
    let result = [...publishedArticles];

    // Filter by Topic
    if (selectedTopic !== 'All') {
      result = result.filter(a => a.topic.toLowerCase() === selectedTopic.toLowerCase());
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(a => 
        a.title.toLowerCase().includes(q) || 
        a.subtitle.toLowerCase().includes(q) ||
        a.topic.toLowerCase().includes(q)
      );
    }

    // Sort
    if (sortBy === 'latest') {
      result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else if (sortBy === 'popular') {
      result.sort((a, b) => b.views - a.views);
    } else if (sortBy === 'discussed') {
      result.sort((a, b) => b.commentsCount - a.commentsCount);
    } else {
      // Recommended: sorted by a weight of likes + views/10
      result.sort((a, b) => (b.likes + b.views/10) - (a.likes + a.views/10));
    }

    return result;
  }, [publishedArticles, selectedTopic, searchQuery, sortBy]);

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount(prev => prev + 4);
      setIsLoadingMore(false);
    }, 800);
  };

  const activeTopics = ['All', ...mockTopics];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      {/* Page Header */}
      <div className="mb-10 text-center md:text-left">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-zinc-950 mb-2">Explore Stories</h1>
        <p className="text-zinc-500 text-sm font-sans">
          Search the catalog, browse topic categories, and sort through the best writing on the web.
        </p>
      </div>

      {/* Controls Area */}
      <div className="space-y-6 mb-8 border-b border-zinc-100 pb-6">
        {/* Search & Sort Row */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          {/* Inner Search input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4.5 h-4.5 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setVisibleCount(4); // reset pagination on search change
              }}
              placeholder="Search by keyword, title, or summary..."
              className="w-full pl-10 pr-4 py-2 border border-zinc-200 rounded-lg text-sm text-zinc-900 focus:outline-none focus:border-brand-500 bg-zinc-50/50 focus:bg-white transition-all"
            />
          </div>

          {/* Sort Selector */}
          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            <SlidersHorizontal className="w-4 h-4 text-zinc-400" />
            <span className="text-xs text-zinc-500 font-medium">Sort:</span>
            <select
              value={sortBy}
              onChange={e => {
                setSortBy(e.target.value as any);
                setVisibleCount(4);
              }}
              className="py-1.5 px-3 border border-zinc-200 rounded-lg text-xs font-semibold bg-white text-zinc-700 focus:outline-none focus:border-brand-500"
            >
              <option value="recommended">Recommended</option>
              <option value="latest">Latest</option>
              <option value="popular">Popular</option>
              <option value="discussed">Most Discussed</option>
            </select>
          </div>
        </div>

        {/* Category Pills (Scrollable horizontally) */}
        <div className="flex items-center space-x-2 overflow-x-auto py-1 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
          {activeTopics.map(topic => {
            const isActive = selectedTopic === topic;
            return (
              <button
                key={topic}
                onClick={() => {
                  setSelectedTopic(topic);
                  setVisibleCount(4); // reset page limit on category swap
                }}
                className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  isActive
                    ? 'bg-brand-700 border-brand-700 text-white font-semibold'
                    : 'bg-zinc-50 border-zinc-200 text-zinc-650 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950'
                }`}
              >
                {topic}
              </button>
            );
          })}
        </div>
      </div>

      {/* Articles Feed */}
      <div className="space-y-6">
        {processedArticles.length === 0 ? (
          <EmptyState
            title="No articles found"
            description="We couldn't find any articles matching your search query or topic criteria. Try checking your spelling or clearing filters."
            icon={<BookOpen className="w-10 h-10 text-zinc-400" />}
            actionText="Reset Filters"
            onAction={() => {
              setSearchQuery('');
              setSelectedTopic('All');
              setSortBy('recommended');
            }}
          />
        ) : (
          <>
            <div className="divide-y divide-zinc-50">
              {processedArticles.slice(0, visibleCount).map(art => (
                <ArticleCard key={art.id} articleId={art.id} />
              ))}
            </div>

            {/* Pagination Skeletons */}
            {isLoadingMore && <LoadingSkeleton count={2} />}

            {/* Load More Button */}
            {!isLoadingMore && visibleCount < processedArticles.length && (
              <div className="text-center pt-8">
                <button
                  onClick={handleLoadMore}
                  className="px-6 py-2.5 border border-zinc-200 hover:border-zinc-800 text-sm font-semibold rounded-full text-zinc-700 hover:text-zinc-950 transition-colors bg-white shadow-sm"
                >
                  Load More Articles
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
