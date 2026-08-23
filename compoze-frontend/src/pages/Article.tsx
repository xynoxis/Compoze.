import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { fetchPostBySlug } from '../api/posts';
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

  const [apiArticle, setApiArticle] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  // Find local article first by id or slug
  const localArticle = articles.find(a => a.id === id || (a as any).slug === id);

  // Scroll to top on mount / article change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Fetch article from backend API if not in local state
  useEffect(() => {
    if (!localArticle && id) {
      setLoading(true);
      fetchPostBySlug(id)
        .then(post => {
          const wordCount = (post.content || '').replace(/<[^>]*>/g, '').split(/\s+/).length;
          const readTime = `${Math.max(1, Math.ceil(wordCount / 200))} min read`;
          const dateFormatted = post.publishedAt || post.createdAt
            ? new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            : 'Recently';

          setApiArticle({
            id: post.id,
            title: post.title,
            subtitle: post.excerpt || '',
            content: post.content,
            coverImage: post.coverImageUrl || '',
            authorId: post.authorId,
            authorName: 'Community Author',
            date: dateFormatted,
            readTime,
            topic: 'Technology',
            tags: ['Technology', 'Programming'],
            likes: 0,
            commentsCount: 0,
            views: 0,
            status: (post.status || 'PUBLISHED').toLowerCase(),
          });
        })
        .catch(() => {
          setApiArticle(null);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id, localArticle]);

  const article = localArticle || apiArticle;

  if (loading) {
    return (
      <div className="max-w-xl mx-auto py-24 text-center px-4 text-on-surface-variant font-sans text-sm italic">
        Loading story...
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-xl mx-auto py-24 text-center px-4">
        <h2 className="font-serif text-2xl font-bold text-on-surface mb-4">Story not found</h2>
        <p className="text-on-surface-variant mb-8">The article you are looking for does not exist or has been deleted.</p>
        <Link to="/" className="px-5 py-2.5 bg-primary text-on-primary font-semibold rounded-full hover:bg-opacity-95 transition-colors">
          Return Home
        </Link>
      </div>
    );
  }

  const author = authors.find(a => a.id === article.authorId) || {
    id: article.authorId || 'author-1',
    name: article.authorName || 'Community Author',
    username: article.authorName || 'author',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    bio: 'Author on Compoze',
    followers: 0,
    following: 0,
  };

  // Display top-liked published stories (excluding current article)
  const displayedRelated = articles
    .filter(a => a.status === 'published' && a.id !== article.id && a.likes > 0)
    .sort((a, b) => b.likes - a.likes)
    .slice(0, 3);

  return (
    <div className="relative pb-24 text-on-surface">
      {/* Back button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 hidden lg:block">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-on-surface-variant hover:text-primary text-sm font-semibold transition-colors focus:outline-none cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
      </div>

      <article className="max-w-2xl mx-auto px-4 sm:px-6 pt-6 lg:pt-4">
        {/* Topic Pill */}
        <div className="mb-4">
          <Link
            to={`/explore?topic=${encodeURIComponent(article.topic.toLowerCase())}`}
            className="text-xs font-bold uppercase tracking-widest text-primary hover:underline ctrl-transition"
          >
            {article.topic}
          </Link>
        </div>

        {/* Title */}
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-on-surface mb-3">
          {article.title}
        </h1>

        {/* Subtitle / Excerpt */}
        <p className="text-lg sm:text-xl text-on-surface-variant/80 leading-relaxed font-sans mb-8">
          {article.subtitle}
        </p>

        {/* Author Bio Header Row */}
        <div className="flex items-center justify-between border-y border-border-subtle/30 py-4 mb-8">
          <div className="flex items-center space-x-3">
            <Link to={`/profile/${author.username}`}>
              <img 
                src={author.avatar} 
                alt={author.name} 
                className="w-10 h-10 rounded-full object-cover border border-border-subtle/30"
              />
            </Link>
            <div className="text-xs">
              <div className="flex items-center space-x-2">
                <Link to={`/profile/${author.username}`} className="font-bold text-on-surface hover:underline">
                  {author.name}
                </Link>
                <span className="text-on-surface-variant/40">•</span>
                <FollowButton authorId={author.id} className="scale-90" />
              </div>
              <p className="text-on-surface-variant/70 mt-0.5">
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
          <div className="w-full h-64 sm:h-96 md:h-[420px] rounded-2xl overflow-hidden border border-border-subtle/30 mb-10 shadow-sm">
            <img 
              src={article.coverImage} 
              alt={article.title} 
              className="w-full h-full object-cover ctrl-transition opacity-0"
              onLoad={(e) => e.currentTarget.classList.remove('opacity-0')}
            />
          </div>
        )}

        {/* Formatted Article Body */}
        <div 
          className="article-body font-serif text-lg leading-relaxed text-on-surface tracking-wide space-y-6"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* Article Body Specific Inline Styles */}
        <style dangerouslySetInnerHTML={{__html: `
          .article-body h2 {
            font-family: Lora, Georgia, serif;
            font-size: 1.625rem;
            font-weight: 700;
            line-height: 1.35;
            color: inherit;
            margin-top: 2.5rem;
            margin-bottom: 0.75rem;
          }
          .article-body h3 {
            font-family: Lora, Georgia, serif;
            font-size: 1.375rem;
            font-weight: 700;
            line-height: 1.35;
            color: inherit;
            margin-top: 2rem;
            margin-bottom: 0.5rem;
          }
          .article-body p {
            margin-bottom: 1.5rem;
            line-height: 1.8;
          }
          .article-body blockquote {
            font-style: italic;
            border-left: 3px solid #006a60;
            padding-left: 1.5rem;
            margin: 2.5rem 0;
            opacity: 0.9;
            font-size: 1.25rem;
            line-height: 1.6;
          }
          .article-body ul {
            list-style-type: disc;
            margin-left: 1.75rem;
            margin-bottom: 1.5rem;
          }
          .article-body ol {
            list-style-type: decimal;
            margin-left: 1.75rem;
            margin-bottom: 1.5rem;
          }
          .article-body li {
            margin-bottom: 0.5rem;
            line-height: 1.8;
          }
          .article-body pre {
            background-color: rgba(0, 0, 0, 0.04);
            border: 1px solid rgba(0, 0, 0, 0.08);
            border-radius: 12px;
            padding: 1.25rem;
            overflow-x: auto;
            margin: 2rem 0;
            font-size: 0.875rem;
          }
          .article-body code {
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
            background-color: rgba(0, 0, 0, 0.04);
            color: #006a60;
            padding: 0.2rem 0.4rem;
            border-radius: 6px;
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

        {/* Floating Action Bar */}
        <div className="sticky bottom-6 mt-12 bg-surface rounded-full border border-border-subtle/40 px-6 py-3 flex items-center justify-between z-30">
          <div className="flex items-center space-x-6">
            <LikeButton articleId={article.id} />
            <button
              onClick={() => setCommentDrawerOpen(true)}
              className="flex items-center space-x-1.5 text-on-surface-variant hover:text-primary transition-colors text-sm font-semibold cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>{article.commentsCount}</span>
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <BookmarkButton articleId={article.id} />
            <ShareButton articleId={article.id} />
          </div>
        </div>
      </article>

      {/* Related Articles Section */}
      {displayedRelated.length > 0 && (
        <section className="bg-surface-container/30 border-t border-border-subtle/30 py-16 mt-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h3 className="font-serif text-xl font-bold text-on-surface mb-8 text-center sm:text-left">
              More from Compoze
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {displayedRelated.map(art => {
                const artAuthor = authors.find(au => au.id === art.authorId);
                return (
                  <div key={art.id} className="bg-surface border border-border-subtle/30 p-4 rounded-2xl flex flex-col justify-between hover:shadow-neumorphic transition-shadow group">
                    <div>
                      {/* Cover Thumbnail */}
                      <Link to={`/article/${art.id}`} className="block h-32 rounded-xl overflow-hidden border border-border-subtle/30 mb-3">
                        <img 
                          src={art.coverImage} 
                          alt={art.title} 
                          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                        />
                      </Link>
                      
                      {/* Topic Tag */}
                      <span className="text-[10px] font-bold text-primary tracking-wider uppercase mb-1.5 block">
                        {art.topic}
                      </span>
                      
                      {/* Title */}
                      <Link to={`/article/${art.id}`} className="block focus:outline-none">
                        <h4 className="font-serif text-sm font-bold text-on-surface group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                          {art.title}
                        </h4>
                      </Link>
                    </div>

                    {/* Metadata Footer */}
                    <div className="flex items-center space-x-2 mt-4 pt-3 border-t border-border-subtle/20 text-[10px] text-on-surface-variant">
                      <img 
                        src={artAuthor?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'} 
                        alt={artAuthor?.name} 
                        className="w-4 h-4 rounded-full object-cover"
                      />
                      <span className="font-semibold text-on-surface truncate">{artAuthor?.name || 'Author'}</span>
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
