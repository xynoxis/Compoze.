import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { fetchPosts } from '../api/posts';
import type { PostDto } from '../api/posts';

export const Home: React.FC = () => {
  const { authors } = useApp();
  const navigate = useNavigate();

  const [topPosts, setTopPosts] = useState<PostDto[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Transition state for C. tile expansion
  const tileRef = useRef<HTMLDivElement>(null);
  const [isExpanding, setIsExpanding] = useState(false);
  const [expandingStyles, setExpandingStyles] = useState<React.CSSProperties | null>(null);

  const recommendedTopics = [
    'Data Science',
    'Relationships',
    'Self Improvement',
    'Technology',
    'Politics',
    'Cryptocurrency',
    'Productivity',
  ];

  // Fetch real top 5 trending published posts
  useEffect(() => {
    fetchPosts(0, 50)
      .then(res => {
        if (res && Array.isArray(res.posts)) {
          const published = res.posts.filter(p => (p.status || 'PUBLISHED').toUpperCase() === 'PUBLISHED' && p.title.toLowerCase() !== 'published');
          const uniqueMap = new Map<string, PostDto>();
          published.forEach(p => uniqueMap.set(p.id, p));
          const uniquePosts = Array.from(uniqueMap.values());
          setTopPosts(uniquePosts.slice(0, 5));
        } else {
          setTopPosts([]);
        }
      })
      .catch(() => setTopPosts([]));
  }, []);

  // 5-second automatic sliding timer if topPosts has more than 1 post
  useEffect(() => {
    if (topPosts.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % topPosts.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [topPosts.length]);

  const activeFeaturedPost = topPosts[currentIndex];

  // Signature C. Tile Expansion Handler
  const handleCTileClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isExpanding) return;

    // Respect prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      navigate('/write');
      return;
    }

    if (!tileRef.current) {
      navigate('/write');
      return;
    }

    const rect = tileRef.current.getBoundingClientRect();
    
    // Initial style matching exact position, size, rotation and 3D shadow of C. tile
    const initialStyles: React.CSSProperties = {
      position: 'fixed',
      left: `${rect.left}px`,
      top: `${rect.top}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`,
      transform: 'rotate(6deg)',
      borderRadius: '2rem',
      boxShadow: 'inset 1.5px 1.5px 0px #ffffff, inset -2.5px -2.5px 0px rgba(25,28,27,0.08), 0 4px 10px rgba(25,28,27,0.07), 0 24px 52px rgba(25,28,27,0.09)',
      background: 'linear-gradient(155deg, #FCFCFB 0%, #F2F1EC 100%)',
      zIndex: 9999,
      transition: 'all 600ms cubic-bezier(0.22, 1, 0.36, 1)',
      pointerEvents: 'none',
      overflow: 'hidden',
    };

    setExpandingStyles(initialStyles);
    setIsExpanding(true);

    // Trigger frame expansion outward
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setExpandingStyles({
          position: 'fixed',
          left: '0px',
          top: '0px',
          width: '100vw',
          height: '100vh',
          transform: 'rotate(0deg)',
          borderRadius: '0px',
          boxShadow: '0 0 0 rgba(0,0,0,0)',
          background: '#F7F7F5',
          zIndex: 9999,
          transition: 'all 600ms cubic-bezier(0.22, 1, 0.36, 1)',
          pointerEvents: 'none',
          overflow: 'hidden',
        });
      });
    });

    // Navigate to /write at 500ms when expansion fills viewport
    setTimeout(() => {
      navigate('/write');
    }, 500);

    // Clean up overlay state after navigation completes
    setTimeout(() => {
      setIsExpanding(false);
      setExpandingStyles(null);
    }, 750);
  };

  return (
    /* BEGIN: Main Content Area */
    <main className="max-w-7xl mx-auto w-full flex-grow flex flex-col px-6 lg:px-12 py-10 gap-12 relative">
      {/* BEGIN: Hero Section */}
      <section className="flex flex-col lg:flex-row justify-between items-center w-full relative z-10 py-6">
        {/* Hero Text */}
        <div className="max-w-xl flex flex-col gap-5">
          <h1 className="font-serif text-5xl lg:text-6xl font-semibold leading-[1.15] text-on-surface tracking-tight">
            Keep composing.<br />
            <span className="text-primary">Ideas flow, stories build.</span>
          </h1>
          <p className="text-on-surface-variant text-base font-medium leading-relaxed max-w-md">
            Compoze is a distraction-free, typography-first publishing canvas. Discover sharp thoughts, deep dives, and expert perspectives in programming, design, AI, and business.
          </p>
          <div className="flex items-center gap-4 mt-2">
            <Link to="/explore" className="btn-primary-3d text-on-primary px-7 py-3.5 rounded-full font-semibold text-sm inline-block text-center">
              Start Reading
            </Link>
          </div>
        </div>

        {/* Hero Floating Object (Level 4 Physical Object - Signature Expand Shortcut) */}
        <div 
          ref={tileRef}
          onClick={handleCTileClick}
          className={`hidden lg:block relative right-6 group cursor-pointer ${isExpanding ? 'opacity-0' : ''}`} 
          title="Start Writing a Story"
        >
          <div className="w-52 h-72 c-hero-card-3d rounded-3xl rotate-[6deg] flex flex-col justify-between items-center p-8 text-center relative ctrl-transition">
            <span className="font-serif text-7xl font-bold text-primary ctrl-transition">C.</span>
            <span className="text-xs font-semibold text-on-surface-variant/80 group-hover:text-primary ctrl-transition leading-snug px-2">
              Click here to start writing!
            </span>
            <span className="font-serif text-[10px] font-medium tracking-widest text-on-surface-variant uppercase">
              EST. 2026
            </span>
          </div>
        </div>
      </section>
      {/* END: Hero Section */}

      {/* Signature C. Tile Expansion Transition Portal Overlay */}
      {isExpanding && expandingStyles && (
        <div 
          style={expandingStyles}
          className="fixed z-[9999] pointer-events-none flex flex-col justify-between items-center p-8 text-center"
        >
          <div 
            className="w-full h-full flex flex-col justify-between items-center ctrl-transition" 
            style={{ 
              opacity: expandingStyles.width === '100vw' ? 0 : 1,
              transition: 'opacity 250ms ease-out' 
            }}
          >
            <span className="font-serif text-7xl font-bold text-primary">C.</span>
            <span className="text-xs font-semibold text-on-surface-variant/80 leading-snug px-2">
              Click here to start writing!
            </span>
            <span className="font-serif text-[10px] font-medium tracking-widest text-on-surface-variant uppercase">
              EST. 2026
            </span>
          </div>
        </div>
      )}

      {/* BEGIN: Trending Section */}
      {topPosts.length > 0 && (
        <section className="w-full depth-panel rounded-3xl p-8 lg:p-10 relative z-10">
          <div className="flex items-center gap-2.5 mb-8">
            <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>
            <h2 className="text-xs font-bold tracking-[0.2em] text-on-surface-variant uppercase">Trending on Compoze</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-8">
            {topPosts.slice(0, 6).map((post, idx) => {
              const author = authors.find(a => a.id === post.authorId);
              return (
                <Link key={post.id} to={`/article/${post.slug || post.id}`} className="flex gap-4 items-start group cursor-pointer">
                  <div className="flex-shrink-0 w-14 h-12 flex items-center justify-center rounded-2xl search-recessed">
                    <span className="font-serif text-xl font-bold text-border-subtle/80 group-hover:text-primary transition-colors">
                      0{idx + 1}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <img 
                        alt="Author" 
                        className="w-5 h-5 rounded-full object-cover" 
                        src={author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'} 
                      />
                      <span className="text-xs font-semibold text-on-surface truncate">{author?.name || 'Community Creator'}</span>
                    </div>
                    <h3 className="font-serif text-base font-bold leading-snug text-on-surface group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <div className="text-[11px] text-on-surface-variant flex items-center gap-1.5 mt-0.5">
                      <span>{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Recently'}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}
      {/* END: Trending Section */}

      {/* BEGIN: Featured Story & Recommended Topics Section (3:2 Ratio Layout) */}
      <section className="w-full grid grid-cols-1 lg:grid-cols-5 gap-8 items-stretch relative z-10 mb-8">
        {/* Featured Story Card (3/5 ratio = col-span-3) */}
        <div className="lg:col-span-3 depth-panel rounded-3xl p-6 lg:p-8 flex flex-col justify-between relative overflow-hidden">
          <div className="flex justify-between items-center mb-6 z-10">
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></div>
              <h2 className="text-xs font-bold tracking-[0.2em] text-on-surface-variant uppercase">
                Featured Story {topPosts.length > 1 ? `(${currentIndex + 1}/${topPosts.length})` : ''}
              </h2>
            </div>
            <Link to="/explore" className="depth-level-1 text-on-surface-variant hover:text-primary px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 ctrl-transition">
              View all
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 8l4 4m0 0l-4 4m4-4H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
            </Link>
          </div>

          {activeFeaturedPost ? (
            <Link to={`/article/${activeFeaturedPost.slug || activeFeaturedPost.id}`} className="group block space-y-4">
              <div className="w-full h-[220px] sm:h-[260px] rounded-3xl overflow-hidden search-recessed relative">
                {activeFeaturedPost.coverImageUrl ? (
                  <img 
                    alt={activeFeaturedPost.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" 
                    src={activeFeaturedPost.coverImageUrl} 
                  />
                ) : (
                  <div className="w-full h-full bg-surface-container flex items-center justify-center text-on-surface-variant text-xs italic">
                    Compoze Story
                  </div>
                )}
              </div>

              <div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-on-surface group-hover:text-primary transition-colors leading-snug mb-2">
                  {activeFeaturedPost.title}
                </h3>
                <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-2">
                  {activeFeaturedPost.excerpt || 'Read the full story on Compoze.'}
                </p>
              </div>
            </Link>
          ) : (
            <div className="py-12 text-center text-xs text-on-surface-variant/70 italic">
              No published stories featured yet. Write your first story!
            </div>
          )}

          {/* Sliding indicators if multiple top posts */}
          {topPosts.length > 1 && (
            <div className="flex gap-1.5 mt-4 justify-center">
              {topPosts.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    i === currentIndex ? 'w-6 bg-primary' : 'w-1.5 bg-border-subtle/50 hover:bg-primary/50'
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Recommended Topics Card (2/5 ratio = col-span-2) */}
        <div className="lg:col-span-2 depth-panel rounded-3xl p-6 lg:p-8 flex flex-col justify-between">
          <div>
            <h3 className="font-serif text-xl font-bold text-on-surface mb-5">Recommended topics</h3>
            <div className="flex flex-wrap gap-2.5">
              {recommendedTopics.map((topic) => (
                <Link
                  key={topic}
                  to={`/explore?topic=${encodeURIComponent(topic.toLowerCase())}`}
                  className="px-4 py-2 depth-level-1 rounded-full text-xs font-semibold text-on-surface hover:text-primary flex items-center gap-1.5 ctrl-transition"
                >
                  <span>{topic}</span>
                  <span className="text-on-surface-variant font-normal text-sm">+</span>
                </Link>
              ))}
            </div>
          </div>
          <div className="pt-6 border-t border-border-subtle/20 mt-6">
            <Link 
              to="/explore" 
              className="text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1"
            >
              See more topics
            </Link>
          </div>
        </div>
      </section>
      {/* END: Featured Story & Recommended Topics Section */}
    </main>
    /* END: Main Content Area */
  );
};
