import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { mockTopics } from '../data/mockData';
import { ArticleCard } from '../components/ArticleCard';
import { AuthorCard } from '../components/AuthorCard';
import { TopicPill } from '../components/TopicPill';
import { EmptyState } from '../components/EmptyState';
import { Search as SearchIcon, BookOpen, Users, Hash } from 'lucide-react';

export const Search: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const { articles, authors } = useApp();
  const [query, setQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState<'articles' | 'writers' | 'topics'>('articles');

  // Update URL search query on input changes
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setSearchParams(query ? { q: query } : {});
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query, setSearchParams]);

  // Sync state if URL changes directly
  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  // Filter Articles
  const filteredArticles = useMemo(() => {
    const q = query.toLowerCase().trim();
    const published = articles.filter(a => a.status === 'published');
    if (!q) return published;

    return published.filter(a => 
      a.title.toLowerCase().includes(q) || 
      a.subtitle.toLowerCase().includes(q) ||
      a.topic.toLowerCase().includes(q)
    );
  }, [articles, query]);

  // Filter Authors
  const filteredAuthors = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return authors;

    return authors.filter(a => 
      a.name.toLowerCase().includes(q) || 
      a.username.toLowerCase().includes(q) ||
      a.bio.toLowerCase().includes(q)
    );
  }, [authors, query]);

  // Filter Topics
  const filteredTopics = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return mockTopics;

    return mockTopics.filter((t: string) => t.toLowerCase().includes(q));
  }, [mockTopics, query]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      {/* Search Header Input */}
      <div className="relative mb-10">
        <SearchIcon className="w-6 h-6 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search Compoze..."
          className="w-full pl-12 pr-4 py-4 border border-zinc-200 rounded-2xl text-lg text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-brand-500 bg-zinc-50/30 focus:bg-white shadow-sm transition-all"
        />
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-100 mb-8">
        <button
          onClick={() => setActiveTab('articles')}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors focus:outline-none flex items-center space-x-1.5 ${
            activeTab === 'articles'
              ? 'border-brand-700 text-brand-800 font-semibold'
              : 'border-transparent text-zinc-500 hover:text-zinc-950'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Stories ({filteredArticles.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('writers')}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors focus:outline-none flex items-center space-x-1.5 ${
            activeTab === 'writers'
              ? 'border-brand-700 text-brand-800 font-semibold'
              : 'border-transparent text-zinc-500 hover:text-zinc-950'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Writers ({filteredAuthors.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('topics')}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors focus:outline-none flex items-center space-x-1.5 ${
            activeTab === 'topics'
              ? 'border-brand-700 text-brand-800 font-semibold'
              : 'border-transparent text-zinc-500 hover:text-zinc-950'
          }`}
        >
          <Hash className="w-4 h-4" />
          <span>Topics ({filteredTopics.length})</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div>
        {activeTab === 'articles' && (
          <div className="space-y-6">
            {filteredArticles.length === 0 ? (
              <EmptyState
                title="No stories match your search"
                description="Try rewriting your query using generic words or looking under different categories."
                icon={<BookOpen className="w-10 h-10 text-zinc-400" />}
              />
            ) : (
              <div className="divide-y divide-zinc-50">
                {filteredArticles.map(art => (
                  <ArticleCard key={art.id} articleId={art.id} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'writers' && (
          <div className="space-y-4">
            {filteredAuthors.length === 0 ? (
              <EmptyState
                title="No writers match your search"
                description="We couldn't find any writers with that name or username."
                icon={<Users className="w-10 h-10 text-zinc-400" />}
              />
            ) : (
              <div className="divide-y divide-zinc-50">
                {filteredAuthors.map(writer => (
                  <AuthorCard key={writer.id} author={writer} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'topics' && (
          <div>
            {filteredTopics.length === 0 ? (
              <EmptyState
                title="No topics match your search"
                description="Try typing general category words like technology, AI, design, or lifestyle."
                icon={<Hash className="w-10 h-10 text-zinc-400" />}
              />
            ) : (
              <div className="flex flex-wrap gap-3">
                {filteredTopics.map((topic: string) => (
                  <TopicPill key={topic} topic={topic} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
