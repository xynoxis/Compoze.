import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { mockTopics } from '../data/mockData';
import { fetchAllTags } from '../api/tags';
import type { TagDto } from '../api/tags';
import { fetchPosts } from '../api/posts';
import type { PostDto } from '../api/posts';
import { ArticleCard } from '../components/ArticleCard';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { EmptyState } from '../components/EmptyState';
import { Search, SlidersHorizontal, BookOpen, Layers, Users, ChevronDown, Check } from 'lucide-react';

export const Explore: React.FC = () => {
  const { articles, authors, isAuthenticated, token } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('All');
  const [sortBy, setSortBy] = useState<'recommended' | 'latest' | 'popular' | 'discussed'>('recommended');
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [apiTags, setApiTags] = useState<TagDto[]>([]);
  const [fetchedApiPosts, setFetchedApiPosts] = useState<PostDto[] | null>(null);
  
  // Simulated pagination state
  const [visibleCount, setVisibleCount] = useState(4);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  if (!isAuthenticated || !token) {
    return (
      <div className="max-w-xl mx-auto py-24 text-center px-4">
        <EmptyState
          title="Sign in to Explore Stories"
          description="You are currently signed out. Please sign in to search the catalog, browse topic categories, and discover stories."
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

  const sortOptions = [
    { value: 'recommended', label: 'Recommended' },
    { value: 'latest', label: 'Latest' },
    { value: 'popular', label: 'Popular' },
    { value: 'discussed', label: 'Most Discussed' },
  ];

  // Fetch real tags from backend GET /api/tags
  useEffect(() => {
    fetchAllTags()
      .then(tags => setApiTags(Array.isArray(tags) ? tags : []))
      .catch(() => setApiTags([]));
  }, []);

  // Fetch posts from GET /api/posts?tag=...&query=...
  useEffect(() => {
    const cleanTag = selectedTopic !== 'All' ? selectedTopic.toLowerCase() : undefined;
    const cleanQuery = searchQuery.trim() ? searchQuery.trim() : undefined;

    fetchPosts(0, 50, cleanTag, cleanQuery)
      .then(res => {
        if (res && Array.isArray(res.posts)) {
          setFetchedApiPosts(res.posts);
        } else {
          setFetchedApiPosts(null);
        }
      })
      .catch(() => setFetchedApiPosts(null));
  }, [selectedTopic, searchQuery]);

  // Filter published local articles fallback
  const publishedArticles = useMemo(() => {
    return articles.filter(a => a.status === 'published');
  }, [articles]);

  // Process sorting and filtering
  const processedArticles = useMemo(() => {
    let result: any[] = [];

    if (fetchedApiPosts !== null) {
      result = fetchedApiPosts.map(p => ({
        id: p.id,
        title: p.title,
        subtitle: p.excerpt || '',
        content: p.content,
        coverImage: p.coverImageUrl || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
        authorId: p.authorId,
        date: p.publishedAt || p.createdAt ? new Date(p.publishedAt || p.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently',
        readTime: `${Math.max(1, Math.ceil((p.content || '').replace(/<[^>]*>/g, '').split(/\s+/).length / 200))} min read`,
        topic: 'Technology',
        tags: ['Technology', 'Programming'],
        likes: 0,
        commentsCount: 0,
        views: 0,
        status: (p.status || 'PUBLISHED').toLowerCase(),
      }));
    } else {
      result = [...publishedArticles];
    }

    // Filter by Search Query (strictly by title)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(a => (a.title || '').toLowerCase().includes(q));
    }

    // Sort
    if (sortBy === 'latest') {
      result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else if (sortBy === 'popular') {
      result.sort((a, b) => b.views - a.views);
    } else if (sortBy === 'discussed') {
      result.sort((a, b) => b.commentsCount - a.commentsCount);
    } else {
      result.sort((a, b) => (b.likes + b.views/10) - (a.likes + a.views/10));
    }

    return result;
  }, [fetchedApiPosts, publishedArticles, searchQuery, sortBy]);

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount(prev => prev + 4);
      setIsLoadingMore(false);
    }, 800);
  };

  // Combine real backend tags with fallback mock topics
  const displayTags = useMemo(() => {
    if (apiTags && apiTags.length > 0) {
      const uniqueNames = Array.from(new Set(apiTags.map(t => t.name)));
      return ['All', ...uniqueNames];
    }
    return ['All', ...mockTopics];
  }, [apiTags]);

  return (
    <div className="max-w-[1440px] mx-auto w-full px-8 lg:px-16 pt-6 pb-16">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-on-surface mb-1.5">Explore Stories</h1>
        <p className="text-on-surface-variant/70 text-xs font-sans max-w-2xl leading-relaxed">
          Search the catalog, browse topic categories, and sort through the best writing on the web.
        </p>
      </div>

      {/* Full-Width Search & Sort Controls Row */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
        {/* Inner Search input */}
        <div className="relative flex-1 w-full search-recessed rounded-full ctrl-transition">
          <Search className="w-4 h-4 text-on-surface-variant absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => {
              setSearchQuery(e.target.value);
              setVisibleCount(4);
            }}
            placeholder="Search by keyword, title, or summary..."
            className="w-full pl-11 pr-4 py-2.5 bg-transparent border-none rounded-full text-xs text-on-surface placeholder-on-surface-variant focus:ring-0 focus:outline-none"
          />
        </div>

        {/* Custom Neumorphic Sort Dropdown Selector */}
        <div className="relative flex items-center space-x-2 w-full sm:w-auto justify-end">
          <SlidersHorizontal className="w-3.5 h-3.5 text-on-surface-variant" />
          <span className="text-xs text-on-surface-variant font-medium">Sort:</span>
          <button
            type="button"
            onClick={() => setSortDropdownOpen(v => !v)}
            className="py-2 px-4 depth-level-1 border-none rounded-full text-xs font-semibold text-on-surface flex items-center gap-2 cursor-pointer ctrl-transition"
          >
            <span>{sortOptions.find(o => o.value === sortBy)?.label}</span>
            <ChevronDown className={`w-3.5 h-3.5 text-on-surface-variant ctrl-transition ${sortDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {sortDropdownOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setSortDropdownOpen(false)} />
              <div className="absolute right-0 top-full mt-2 w-48 depth-panel border border-border-subtle/30 rounded-2xl p-2 z-50 animate-dropdown-enter">
                {sortOptions.map(option => {
                  const isSelected = option.value === sortBy;
                  return (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSortBy(option.value as any);
                        setVisibleCount(4);
                        setSortDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs rounded-xl font-medium transition-all flex items-center justify-between my-0.5 cursor-pointer ${
                        isSelected
                          ? 'bg-primary/10 text-primary font-semibold'
                          : 'text-on-surface hover:bg-surface-container hover:text-primary'
                      }`}
                    >
                      <span>{option.label}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-primary" />}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      {/* 12-Column Responsive Layout (4:2 Ratio / 8:4 Grid Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Main Feed Column (4/6 Ratio = 8 Cols) */}
        <div className="lg:col-span-8 flex flex-col space-y-6">

          {/* Active Filter Indicator */}
          {selectedTopic !== 'All' && (
            <div className="flex items-center justify-between depth-level-1 px-4 py-2 rounded-2xl text-xs">
              <span className="text-on-surface-variant">
                Filtering by tag: <strong className="text-primary">{selectedTopic}</strong>
              </span>
              <button 
                onClick={() => setSelectedTopic('All')}
                className="text-primary hover:underline font-medium cursor-pointer"
              >
                Clear filter
              </button>
            </div>
          )}

          {/* Articles Feed */}
          <div className="space-y-6">
            {processedArticles.length === 0 ? (
              <EmptyState
                title="No articles found"
                description="We couldn't find any articles matching your search query or topic criteria. Try checking your spelling or clearing filters."
                icon={<BookOpen className="w-10 h-10 text-on-surface-variant" />}
                actionText="Reset Filters"
                onAction={() => {
                  setSearchQuery('');
                  setSelectedTopic('All');
                  setSortBy('recommended');
                }}
              />
            ) : (
              <>
                <div className="space-y-6">
                  {processedArticles.slice(0, visibleCount).map(art => (
                    <ArticleCard key={art.id} articleId={art.id} />
                  ))}
                </div>

                {/* Pagination Skeletons */}
                {isLoadingMore && <LoadingSkeleton count={2} />}

                {/* Load More Button */}
                {!isLoadingMore && visibleCount < processedArticles.length && (
                  <div className="text-center pt-4">
                    <button
                      onClick={handleLoadMore}
                      className="px-6 py-2.5 depth-level-1 text-xs font-semibold rounded-full text-on-surface ctrl-transition cursor-pointer"
                    >
                      Load More Articles
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Right Sidebar Column (2/6 Ratio = 4 Cols, Shifted Down beside Stories) */}
        <div className="lg:col-span-4 lg:sticky lg:top-24 w-full flex flex-col gap-6">
          {/* Categories / Tags Card */}
          <div className="w-full depth-panel rounded-3xl p-6 lg:p-7 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-border-subtle/20 pb-3">
              <h3 className="font-serif text-lg font-bold text-on-surface flex items-center gap-2">
                <Layers className="w-4 h-4 text-primary" />
                <span>Topic Tags</span>
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                {displayTags.length - 1} Tags
              </span>
            </div>

            <p className="text-xs text-on-surface-variant leading-relaxed">
              Browse stories by topic tags fetched from the community:
            </p>

            <div className="flex flex-wrap gap-2.5">
              {displayTags.map(topic => {
                const isActive = selectedTopic.toLowerCase() === topic.toLowerCase();
                return (
                  <button
                    key={topic}
                    onClick={() => {
                      setSelectedTopic(topic);
                      setVisibleCount(4);
                    }}
                    className={`px-4 py-2 rounded-full text-xs font-medium ctrl-transition cursor-pointer ${
                      isActive
                        ? 'btn-primary-3d text-on-primary font-semibold'
                        : 'depth-level-1 text-on-surface-variant hover:text-primary'
                    }`}
                  >
                    {topic}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Popular Writers Sidebar Card */}
          <div className="w-full depth-panel rounded-3xl p-6 lg:p-7 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-border-subtle/20 pb-3">
              <h3 className="font-serif text-lg font-bold text-on-surface flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                <span>Popular Writers</span>
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                Community
              </span>
            </div>

            {authors.length === 0 ? (
              <p className="text-xs text-on-surface-variant/70 italic py-2">
                No registered community writers yet. Be the first to join and publish!
              </p>
            ) : (
              <div className="flex flex-col divide-y divide-border-subtle/20">
                {authors.slice(0, 5).map(author => (
                  <div key={author.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between">
                    <Link to={`/profile/${author.username}`} className="flex items-center space-x-3 group min-w-0">
                      <img 
                        src={author.avatar} 
                        alt={author.name} 
                        className="w-9 h-9 rounded-full object-cover shadow-sm group-hover:scale-105 transition-transform flex-shrink-0" 
                      />
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-bold text-on-surface group-hover:text-primary transition-colors truncate">
                          {author.name}
                        </span>
                        <span className="text-[11px] text-on-surface-variant truncate">
                          @{author.username}
                        </span>
                      </div>
                    </Link>
                    <button className="px-3.5 py-1.5 bg-surface shadow-neumorphic hover:shadow-neumorphic-float text-on-surface text-[11px] font-semibold rounded-full transition-all flex-shrink-0 cursor-pointer">
                      Follow
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
