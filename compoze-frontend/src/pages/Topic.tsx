import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { mockTopics } from '../data/mockData';
import { ArticleCard } from '../components/ArticleCard';
import { EmptyState } from '../components/EmptyState';
import { TopicPill } from '../components/TopicPill';
import { ArrowLeft, BookOpen } from 'lucide-react';

export const Topic: React.FC = () => {
  const { topic } = useParams<{ topic: string }>();
  const navigate = useNavigate();
  const { articles } = useApp();

  // Find articles matching the topic (case-insensitive)
  const filteredArticles = useMemo(() => {
    if (!topic) return [];
    const formattedTopic = topic.replace(/-/g, ' ');
    return articles.filter(
      a => a.status === 'published' && a.topic.toLowerCase() === formattedTopic.toLowerCase()
    );
  }, [articles, topic]);

  // Capitalize display name
  const topicDisplayName = useMemo(() => {
    if (!topic) return '';
    const formatted = topic.replace(/-/g, ' ');
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  }, [topic]);

  // Find other topics to recommend
  const otherTopics = useMemo(() => {
    if (!topic) return mockTopics;
    return mockTopics.filter((t: string) => t.toLowerCase() !== topic.toLowerCase()).slice(0, 6);
  }, [mockTopics, topic]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 text-zinc-500 hover:text-zinc-900 text-sm font-semibold transition-colors focus:outline-none mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back</span>
      </button>

      {/* Header */}
      <div className="mb-10 border-b border-zinc-100 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-brand-700 tracking-widest uppercase block mb-1">
            Topic Category
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-zinc-950">
            {topicDisplayName}
          </h1>
          <p className="text-zinc-500 text-xs mt-1.5">
            Discover articles, tutorials, and perspectives tagged under {topicDisplayName}.
          </p>
        </div>

        <div className="text-xs font-semibold text-zinc-500 bg-zinc-50 border border-zinc-200/50 px-3.5 py-1.5 rounded-lg flex items-center space-x-1.5 self-start">
          <BookOpen className="w-4 h-4 text-zinc-400" />
          <span>{filteredArticles.length} active stories</span>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        {/* Feed */}
        <div className="lg:col-span-2 space-y-6">
          {filteredArticles.length === 0 ? (
            <EmptyState
              title={`No stories in ${topicDisplayName} yet`}
              description={`There aren't any published articles in the ${topicDisplayName} category right now. Be the first to publish a piece!`}
              icon={<BookOpen className="w-10 h-10 text-zinc-400" />}
              actionText="Write Article"
              onAction={() => navigate('/write')}
            />
          ) : (
            <div className="divide-y divide-zinc-50">
              {filteredArticles.map(art => (
                <ArticleCard key={art.id} articleId={art.id} />
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6 lg:sticky lg:top-24">
          <div className="bg-zinc-50 border border-zinc-150 p-5 rounded-xl space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-550 text-zinc-500">
              Explore other topics
            </h3>
            <div className="flex flex-wrap gap-2">
              {otherTopics.map((t: string) => (
                <TopicPill key={t} topic={t} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
