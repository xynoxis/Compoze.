import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { FeaturedArticle } from '../components/FeaturedArticle';
import { TrendingArticle } from '../components/TrendingArticle';
import { TopicPill } from '../components/TopicPill';
import { mockTopics } from '../data/mockData';

export const Home: React.FC = () => {
  const { articles } = useApp();

  // Filter published articles
  const publishedArticles = articles.filter(a => a.status === 'published');

  // Featured article (choose article-1 or first matching)
  const featuredArticle = publishedArticles.find(a => a.id === 'article-1') || publishedArticles[0];

  // Trending articles (sorted by likes desc, top 6)
  const trendingArticles = [...publishedArticles]
    .sort((a, b) => b.likes - a.likes)
    .slice(0, 6);

  // Recommended Topics (first 8 topics)
  const recommendedTopics = mockTopics || [
    'Technology', 'Programming', 'AI', 'Design', 'Business', 'Productivity', 'Science', 'Lifestyle'
  ];

  return (
    <div className="bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 min-h-screen transition-colors duration-200">
      {/* Hero Section */}
      <section className="bg-zinc-50 dark:bg-zinc-900/30 py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center md:text-left md:flex md:items-center md:justify-between gap-12">
          <div className="max-w-2xl">
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 leading-tight mb-6 animate-bounce-in">
              Keep composing.<br />
              Ideas <span className="text-brand-700 dark:text-brand-500">flow</span>, stories <span className="text-brand-700 dark:text-brand-500">build.</span>
            </h1>
            <p className="text-base sm:text-lg text-zinc-500 dark:text-zinc-400 font-sans leading-relaxed mb-8 max-w-xl">
              Compoze is a distraction-free, typography-first publishing canvas. Discover sharp thoughts, deep dives, and expert perspectives in programming, design, AI, and business.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
              <Link
                to="/explore"
                className="w-full sm:w-auto px-6 py-3 bg-brand-700 hover:bg-brand-800 text-white font-semibold rounded-full text-center transition-all btn-primary-depth shadow-sm"
              >
                Start Reading
              </Link>
              <Link
                to="/write"
                className="w-full sm:w-auto px-6 py-3 bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 font-semibold rounded-full text-center transition-all btn-secondary-depth shadow-sm"
              >
                Start Writing
              </Link>
            </div>
          </div>
          <div className="hidden md:block w-1/3 max-w-xs self-center">
            {/* Visual branding element, a clean typographic stamp */}
            <div className="p-6 font-serif select-none flex flex-col justify-between h-48 w-48 rounded-3xl rotate-6 bg-white dark:bg-zinc-900 compoze-stamp-card">
              <span className="text-5xl font-black text-brand-700 dark:text-brand-500">C.</span>
              <span className="text-sm font-semibold text-zinc-550 text-zinc-500 dark:text-zinc-400 text-right">EST. 2026</span>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto animate-bounce-in">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 p-6 sm:p-8 rounded-3xl shadow-premium hover-lift">
          <div className="flex items-center space-x-2 mb-8">
            <span className="w-2 h-2 bg-brand-700 dark:bg-brand-500 rounded-full"></span>
            <h2 className="text-xs font-bold tracking-widest text-zinc-900 dark:text-zinc-300 uppercase">
              Trending on Compoze
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-8 gap-x-12">
            {trendingArticles.map((art, index) => (
              <TrendingArticle key={art.id} articleId={art.id} rank={index + 1} />
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Layout (Featured Story + Sidebar Recommended Topics Grid) */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          {/* Left Column: Featured Article */}
          {featuredArticle && (
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-2 mb-6">
                <span className="w-2.5 h-2.5 bg-brand-700 dark:bg-brand-500 rounded-full"></span>
                <h2 className="text-xs font-bold tracking-widest text-zinc-900 dark:text-zinc-300 uppercase">
                  Featured Story
                </h2>
              </div>
              <FeaturedArticle article={featuredArticle} />
            </div>
          )}

          {/* Right Column: Sticky Recommended Topics Card */}
          <div className="lg:col-span-1 lg:sticky lg:top-24">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 p-6 rounded-3xl shadow-premium hover-lift">
              <h3 className="text-xs font-bold tracking-widest text-zinc-900 dark:text-zinc-200 uppercase mb-3">
                Recommended Topics
              </h3>
              <p className="text-xs text-zinc-550 dark:text-zinc-400 mb-5 leading-relaxed">
                Explore and search for articles across categorized subjects. Click any pill to browse published content.
              </p>
              <div className="flex flex-wrap gap-2.5">
                {recommendedTopics.map((topic: string) => (
                  <TopicPill key={topic} topic={topic} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
