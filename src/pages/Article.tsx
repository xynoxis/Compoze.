import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { FollowButton } from '../components/FollowButton';
import { LikeButton } from '../components/LikeButton';
import { BookmarkButton } from '../components/BookmarkButton';
import { ShareButton } from '../components/ShareButton';
import { CommentSection } from '../components/CommentSection';
import { MessageSquare, ArrowLeft } from 'lucide-react';

export const Article: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { articles, authors } = useApp();
  const [commentDrawerOpen, setCommentDrawerOpen] = useState(false);

  // Find article
  const article = articles.find(a => a.id === id);

  // Scroll to top on mount / article change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!article) {
    return (
      <div className="max-w-xl mx-auto py-24 text-center px-4">
        <h2 className="font-serif text-2xl font-bold text-zinc-900 mb-4">Story not found</h2>
        <p className="text-zinc-500 mb-8">The article you are looking for does not exist or has been deleted.</p>
        <Link to="/" className="px-5 py-2.5 bg-brand-700 text-white font-semibold rounded-full hover:bg-brand-800 transition-colors">
          Return Home
        </Link>
      </div>
    );
  }

  const author = authors.find(a => a.id === article.authorId);
  if (!author) return null;

  // Find related articles (same topic, excluding current article)
  const relatedArticles = articles
    .filter(a => a.status === 'published' && a.topic === article.topic && a.id !== article.id)
    .slice(0, 3);

  // Fallback: If no related articles match the topic, pick random ones
  const displayedRelated = relatedArticles.length > 0 
    ? relatedArticles 
    : articles.filter(a => a.status === 'published' && a.id !== article.id).slice(0, 3);

  return (
    <div className="relative pb-24">
      {/* Back button (Only visible on desktop) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 hidden lg:block">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-zinc-500 hover:text-zinc-900 text-sm font-semibold transition-colors focus:outline-none"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
      </div>

      <article className="max-w-2xl mx-auto px-4 sm:px-6 pt-6 lg:pt-4">
        {/* Topic Pill */}
        <div className="mb-4">
          <Link
            to={`/topics/${encodeURIComponent(article.topic.toLowerCase())}`}
            className="text-xs font-bold uppercase tracking-widest text-brand-700 hover:text-brand-800 transition-colors"
          >
            {article.topic}
          </Link>
        </div>

        {/* Title */}
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-zinc-950 mb-3">
          {article.title}
        </h1>

        {/* Subtitle / Excerpt */}
        <p className="text-lg sm:text-xl text-zinc-500 leading-relaxed font-sans mb-8">
          {article.subtitle}
        </p>

        {/* Author Bio Header Row */}
        <div className="flex items-center justify-between border-y border-zinc-100 py-4 mb-8">
          <div className="flex items-center space-x-3">
            <Link to={`/profile/${author.username}`}>
              <img 
                src={author.avatar} 
                alt={author.name} 
                className="w-10 h-10 rounded-full object-cover border border-zinc-200"
              />
            </Link>
            <div className="text-xs">
              <div className="flex items-center space-x-2">
                <Link to={`/profile/${author.username}`} className="font-bold text-zinc-950 hover:underline">
                  {author.name}
                </Link>
                <span className="text-zinc-300">•</span>
                <FollowButton authorId={author.id} className="scale-90" />
              </div>
              <p className="text-zinc-500 mt-0.5">
                <span>Published in {article.topic}</span>
                <span className="mx-1.5">•</span>
                <span>{article.readTime}</span>
                <span className="mx-1.5">•</span>
                <span>{article.date}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Hero Cover Image */}
        {article.coverImage && (
          <div className="w-full h-64 sm:h-96 md:h-[420px] rounded-xl overflow-hidden border border-zinc-100 mb-10 shadow-sm">
            <img 
              src={article.coverImage} 
              alt={article.title} 
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Formatted Article Body */}
        <div 
          className="article-body font-serif text-lg leading-relaxed text-zinc-800 tracking-wide space-y-6"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* Article Body Specific Inline Styles */}
        <style dangerouslySetInnerHTML={{__html: `
          .article-body h2 {
            font-family: Lora, Georgia, serif;
            font-size: 1.625rem;
            font-weight: 700;
            line-height: 1.35;
            color: #09090b;
            margin-top: 2.5rem;
            margin-bottom: 0.75rem;
          }
          .article-body h3 {
            font-family: Lora, Georgia, serif;
            font-size: 1.375rem;
            font-weight: 700;
            line-height: 1.35;
            color: #09090b;
            margin-top: 2rem;
            margin-bottom: 0.5rem;
          }
          .article-body p {
            margin-bottom: 1.5rem;
            color: #27272a;
            line-height: 1.8;
          }
          .article-body blockquote {
            font-style: italic;
            border-left: 3px solid #0f766e;
            padding-left: 1.5rem;
            margin: 2.5rem 0;
            color: #3f3f46;
            font-size: 1.25rem;
            line-height: 1.6;
          }
          .article-body ul {
            list-style-type: disc;
            margin-left: 1.75rem;
            margin-bottom: 1.5rem;
            space-y: 0.5rem;
            color: #27272a;
          }
          .article-body ol {
            list-style-type: decimal;
            margin-left: 1.75rem;
            margin-bottom: 1.5rem;
            space-y: 0.5rem;
            color: #27272a;
          }
          .article-body li {
            margin-bottom: 0.5rem;
            line-height: 1.8;
          }
          .article-body pre {
            background-color: #f4f4f5;
            border: 1px solid #e4e4e7;
            border-radius: 8px;
            padding: 1.25rem;
            overflow-x: auto;
            margin: 2rem 0;
            font-size: 0.875rem;
          }
          .article-body code {
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
            background-color: #f4f4f5;
            color: #0f766e;
            padding: 0.2rem 0.4rem;
            border-radius: 4px;
            font-size: 0.85em;
          }
          .article-body pre code {
            background-color: transparent;
            color: inherit;
            padding: 0;
            border-radius: 0;
            font-size: inherit;
          }
        `}} />

        {/* Tags Block */}
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-12 border-t border-zinc-100 pt-6">
            {article.tags.map(tag => (
              <span 
                key={tag} 
                className="px-3 py-1 bg-zinc-50 border border-zinc-200 text-xs font-semibold text-zinc-650 text-zinc-600 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Bottom Author Profile Card */}
        <div className="mt-16 bg-zinc-50 border border-zinc-150 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6">
          <Link to={`/profile/${author.username}`} className="flex-shrink-0">
            <img 
              src={author.avatar} 
              alt={author.name} 
              className="w-16 h-16 rounded-full object-cover border border-zinc-200"
            />
          </Link>
          <div className="flex-1 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <Link to={`/profile/${author.username}`} className="font-serif text-lg font-bold text-zinc-950 hover:underline">
                  Written by {author.name}
                </Link>
                <p className="text-xs text-zinc-500">@{author.username}</p>
              </div>
              <FollowButton authorId={author.id} />
            </div>
            <p className="text-sm text-zinc-500 font-sans leading-relaxed">
              {author.bio}
            </p>
            <p className="text-xs font-semibold text-zinc-400">
              {author.followers.toLocaleString()} followers
            </p>
          </div>
        </div>
      </article>

      {/* Floating Sticky Actions Bar */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/95 border border-zinc-250 border-zinc-200/80 shadow-lg px-6 py-2 rounded-full flex items-center space-x-6 z-30 backdrop-blur-sm transition-all duration-300">
        <LikeButton articleId={article.id} showCount={true} />
        
        {/* Divider */}
        <div className="w-px h-5 bg-zinc-200" />
        
        {/* Comment trigger */}
        <button
          onClick={() => setCommentDrawerOpen(true)}
          className="flex items-center space-x-1 text-sm text-zinc-500 hover:text-zinc-950 transition-colors focus:outline-none"
          aria-label="Open responses drawer"
        >
          <MessageSquare className="w-4 h-4" />
          <span className="text-xs">{article.commentsCount}</span>
        </button>

        {/* Divider */}
        <div className="w-px h-5 bg-zinc-200" />

        <BookmarkButton articleId={article.id} />
        
        {/* Divider */}
        <div className="w-px h-5 bg-zinc-200" />
        
        <ShareButton articleId={article.id} />
      </div>

      {/* Related Stories Footer Section */}
      {displayedRelated.length > 0 && (
        <section className="bg-zinc-50/50 border-t border-zinc-150 py-16 mt-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h3 className="font-serif text-xl font-bold text-zinc-950 mb-8 text-center sm:text-left">
              More from Compoze
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {displayedRelated.map(art => {
                const artAuthor = authors.find(au => au.id === art.authorId);
                return (
                  <div key={art.id} className="bg-white border border-zinc-200/60 p-4 rounded-xl flex flex-col justify-between hover:shadow-md transition-shadow group">
                    <div>
                      {/* Cover Thumbnail */}
                      <Link to={`/article/${art.id}`} className="block h-32 rounded-lg overflow-hidden border border-zinc-100 mb-3">
                        <img 
                          src={art.coverImage} 
                          alt={art.title} 
                          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                        />
                      </Link>
                      
                      {/* Topic Tag */}
                      <span className="text-[10px] font-bold text-brand-700 tracking-wider uppercase mb-1.5 block">
                        {art.topic}
                      </span>
                      
                      {/* Title */}
                      <Link to={`/article/${art.id}`} className="block focus:outline-none">
                        <h4 className="font-serif text-sm font-bold text-zinc-900 group-hover:text-brand-700 transition-colors line-clamp-2 leading-snug">
                          {art.title}
                        </h4>
                      </Link>
                    </div>

                    {/* Metadata Footer */}
                    <div className="flex items-center space-x-2 mt-4 pt-3 border-t border-zinc-50 text-[10px] text-zinc-500">
                      <img 
                        src={artAuthor?.avatar} 
                        alt={artAuthor?.name} 
                        className="w-4 h-4 rounded-full object-cover"
                      />
                      <span className="font-semibold text-zinc-800 truncate">{artAuthor?.name}</span>
                      <span>•</span>
                      <span>{art.readTime}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Side drawer for comments */}
      <CommentSection
        articleId={article.id}
        isOpen={commentDrawerOpen}
        onClose={() => setCommentDrawerOpen(false)}
      />
    </div>
  );
};
