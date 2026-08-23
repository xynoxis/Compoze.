import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { createPost, updatePost, publishPost, fetchPostBySlug } from '../api/posts';
import { attachTagToPost } from '../api/tags';
import { 
  Bold, 
  Italic, 
  Underline, 
  Heading1, 
  Heading2, 
  List, 
  ListOrdered, 
  Quote, 
  Code2, 
  Link2, 
  Image as ImageIcon, 
  Undo, 
  Redo, 
  Eye, 
  Edit2, 
  Settings, 
  X,
  Sparkles
} from 'lucide-react';

export const Write: React.FC = () => {
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  const navigate = useNavigate();
  const { articles, publishArticle, saveDraft, showToast, token } = useApp();

  // Core Editor State
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [content, setContent] = useState('');
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // Publishing Configuration State
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState('Technology');
  const [tagsInput, setTagsInput] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Image Modal Configuration State
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [imgUrl, setImgUrl] = useState('');
  const [imgAlt, setImgAlt] = useState('');
  const [imgCaption, setImgCaption] = useState('');
  const [imgWidth, setImgWidth] = useState<'full' | 'medium' | 'small'>('full');
  const [imgBorder, setImgBorder] = useState<'rounded' | 'sharp' | 'pill'>('rounded');

  // History for Undo/Redo
  const [history, setHistory] = useState<string[]>(['']);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Preset Cover Images
  const presetCovers = [
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80', // Code
    'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=600&q=80', // AI
    'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=600&q=80', // Design
    'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=600&q=80', // Productivity
  ];

  // Load existing article if editing
  useEffect(() => {
    if (editId) {
      const art = articles.find(a => a.id === editId);
      if (art) {
        setTitle(art.title);
        setSubtitle(art.subtitle);
        setContent(art.content);
        setSelectedTopic(art.topic);
        setTagsInput(art.tags ? art.tags.join(', ') : '');
        setCoverImageUrl(art.coverImage);
        setShortDescription(art.subtitle);
        setHistory([art.content]);
        setHistoryIndex(0);
      } else if (editId.includes('-')) {
        fetchPostBySlug(editId)
          .then(post => {
            setTitle(post.title);
            setSubtitle(post.excerpt || '');
            setContent(post.content);
            setCoverImageUrl(post.coverImageUrl || '');
            setShortDescription(post.excerpt || '');
            setHistory([post.content]);
            setHistoryIndex(0);
          })
          .catch(() => {
            // Ignore if not found via API
          });
      }
    }
  }, [editId, articles]);

  // Track history for Undo/Redo
  const updateContentWithHistory = (newVal: string) => {
    setContent(newVal);
    if (newVal !== history[historyIndex]) {
      const newHistory = history.slice(0, historyIndex + 1);
      setHistory([...newHistory, newVal]);
      setHistoryIndex(newHistory.length);
    }
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(prev => prev - 1);
      setContent(history[historyIndex - 1]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prev => prev + 1);
      setContent(history[historyIndex + 1]);
    }
  };

  // Text formatting helper
  const insertFormatting = (before: string, after: string) => {
    const textarea = document.getElementById('editor-textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);
    const replacement = before + selectedText + after;
    
    const newContent = text.substring(0, start) + replacement + text.substring(end);
    updateContentWithHistory(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length);
    }, 50);
  };

  const generateSlug = (rawTitle: string) => {
    const clean = rawTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    return clean || `post-${Date.now()}`;
  };

  const syncTagsToBackend = async (postId: string) => {
    if (!token || !postId || !postId.includes('-')) return;
    const tagList = tagsInput.split(',').map(t => t.trim()).filter(Boolean);
    for (const tagName of tagList) {
      try {
        await attachTagToPost(postId, tagName);
      } catch (err) {
        // Tag attach handled
      }
    }
  };

  const handleInsertImage = (e: React.FormEvent) => {
    e.preventDefault();
    const urlToUse = imgUrl.trim() || presetCovers[0];
    
    let widthClass = 'w-full';
    if (imgWidth === 'medium') widthClass = 'max-w-xl mx-auto block';
    if (imgWidth === 'small') widthClass = 'max-w-xs mx-auto block';

    let borderClass = 'rounded-2xl';
    if (imgBorder === 'sharp') borderClass = 'rounded-none';
    if (imgBorder === 'pill') borderClass = 'rounded-3xl';

    const altAttr = imgAlt.trim() ? ` alt="${imgAlt.trim()}"` : ' alt="Story image"';
    const captionHtml = imgCaption.trim() ? `<figcaption class="text-center text-xs text-zinc-500 mt-2 font-sans">${imgCaption.trim()}</figcaption>` : '';

    const imgHtml = `\n<figure class="my-6">\n  <img src="${urlToUse}"${altAttr} class="${widthClass} ${borderClass} shadow-sm object-cover" />\n  ${captionHtml}\n</figure>\n`;

    updateContentWithHistory(content + imgHtml);
    showToast('Image inserted into story!', 'success');
    
    setImgUrl('');
    setImgAlt('');
    setImgCaption('');
    setImgWidth('full');
    setImgBorder('rounded');
    setIsImageModalOpen(false);
  };

  const handleSaveDraft = async () => {
    if (!title.trim() || !content.trim()) {
      showToast('Please provide a title and content before saving.', 'warning');
      return;
    }

    setIsSaving(true);
    const slug = generateSlug(title);
    const payload = {
      title,
      slug,
      excerpt: subtitle,
      content,
      coverImageUrl,
    };

    if (token) {
      try {
        let postId = editId;
        if (postId && postId.includes('-')) {
          await updatePost(postId, payload);
        } else {
          const created = await createPost(payload);
          postId = created.id;
        }
        await syncTagsToBackend(postId);
        showToast('Draft saved successfully to backend!', 'success');
        setIsSaving(false);
        navigate('/dashboard');
        return;
      } catch (err: any) {
        showToast(err.message || 'Saved draft locally.', 'info');
      }
    }

    saveDraft({
      id: editId || undefined,
      title,
      subtitle,
      content,
      coverImage: coverImageUrl || presetCovers[0],
      topic: selectedTopic,
      tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean),
    });
    setIsSaving(false);
    showToast('Draft saved successfully!', 'success');
    navigate('/dashboard');
  };

  const handleOpenPublishModal = () => {
    if (!title.trim() || !content.trim()) {
      showToast('Please provide a title and content before publishing.', 'warning');
      return;
    }
    if (!shortDescription) {
      setShortDescription(subtitle);
    }
    setIsPublishModalOpen(true);
  };

  const handlePublish = async () => {
    setIsSaving(true);
    const slug = generateSlug(title);
    const payload = {
      title,
      slug,
      excerpt: shortDescription || subtitle,
      content,
      coverImageUrl,
    };

    if (token) {
      try {
        let postId = editId;
        if (!postId || !postId.includes('-')) {
          const created = await createPost(payload);
          postId = created.id;
        } else {
          await updatePost(postId, payload);
        }
        await syncTagsToBackend(postId);
        const published = await publishPost(postId);
        showToast('Article published successfully!', 'success');
        setIsSaving(false);
        navigate(`/article/${published.slug || published.id}`);
        return;
      } catch (err: any) {
        showToast(err.message || 'Backend publish error. Using local state fallback.', 'warning');
      }
    }

    const pubId = publishArticle({
      id: editId || undefined,
      title,
      subtitle: shortDescription || subtitle,
      content,
      coverImage: coverImageUrl,
      topic: selectedTopic,
      tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean),
    });
    setIsSaving(false);
    showToast('Article published successfully!', 'success');
    navigate(`/article/${pubId}`);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Editor Controls Sub-Header */}
      <div className="sticky top-16 bg-white border-b border-zinc-100 py-3 px-4 sm:px-6 lg:px-8 z-30 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold text-zinc-400">
            {editId ? 'Editing story' : 'New draft'}
          </span>
          <span className="text-zinc-300 text-xs">•</span>
          <button
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className="flex items-center space-x-1 text-xs font-semibold text-zinc-600 hover:text-zinc-950 px-2.5 py-1 border border-zinc-200 rounded-md focus:outline-none cursor-pointer"
          >
            {isPreviewMode ? (
              <>
                <Edit2 className="w-3.5 h-3.5 text-zinc-500" />
                <span>Editor</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5 text-zinc-500" />
                <span>Preview</span>
              </>
            )}
          </button>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleSaveDraft}
            disabled={isSaving}
            className="text-xs font-semibold text-zinc-500 hover:text-zinc-950 transition-colors focus:outline-none cursor-pointer disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save Draft'}
          </button>
          <button
            onClick={handleOpenPublishModal}
            disabled={isSaving}
            className="px-5 py-1.5 btn-primary-3d text-on-primary text-xs font-semibold rounded-full ctrl-transition focus:outline-none cursor-pointer disabled:opacity-50"
          >
            Publish
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {!isPreviewMode ? (
          /* Editor UI */
          <div className="space-y-6">
            {/* Formatting Toolbar */}
            <div className="flex flex-wrap items-center gap-1 bg-zinc-50 border border-zinc-200 rounded-lg p-1.5 sticky top-28 z-20 shadow-sm">
              <button 
                onClick={() => insertFormatting('<b>', '</b>')}
                className="p-1.5 rounded hover:bg-white hover:shadow-sm text-zinc-650 hover:text-zinc-950 focus:outline-none cursor-pointer"
                title="Bold"
              >
                <Bold className="w-4 h-4" />
              </button>
              <button 
                onClick={() => insertFormatting('<i>', '</i>')}
                className="p-1.5 rounded hover:bg-white hover:shadow-sm text-zinc-650 hover:text-zinc-950 focus:outline-none cursor-pointer"
                title="Italic"
              >
                <Italic className="w-4 h-4" />
              </button>
              <button 
                onClick={() => insertFormatting('<u>', '</u>')}
                className="p-1.5 rounded hover:bg-white hover:shadow-sm text-zinc-650 hover:text-zinc-950 focus:outline-none cursor-pointer"
                title="Underline"
              >
                <Underline className="w-4 h-4" />
              </button>
              
              <div className="w-px h-5 bg-zinc-200 mx-1" />

              <button 
                onClick={() => insertFormatting('<h2>', '</h2>')}
                className="p-1.5 rounded hover:bg-white hover:shadow-sm text-zinc-650 hover:text-zinc-950 focus:outline-none cursor-pointer"
                title="H2 Header"
              >
                <Heading1 className="w-4 h-4" />
              </button>
              <button 
                onClick={() => insertFormatting('<h3>', '</h3>')}
                className="p-1.5 rounded hover:bg-white hover:shadow-sm text-zinc-650 hover:text-zinc-950 focus:outline-none cursor-pointer"
                title="H3 Header"
              >
                <Heading2 className="w-4 h-4" />
              </button>

              <div className="w-px h-5 bg-zinc-200 mx-1" />

              <button 
                onClick={() => insertFormatting('<ul>\n  <li>', '</li>\n</ul>')}
                className="p-1.5 rounded hover:bg-white hover:shadow-sm text-zinc-650 hover:text-zinc-950 focus:outline-none cursor-pointer"
                title="Bullet List"
              >
                <List className="w-4 h-4" />
              </button>
              <button 
                onClick={() => insertFormatting('<ol>\n  <li>', '</li>\n</ol>')}
                className="p-1.5 rounded hover:bg-white hover:shadow-sm text-zinc-650 hover:text-zinc-950 focus:outline-none cursor-pointer"
                title="Numbered List"
              >
                <ListOrdered className="w-4 h-4" />
              </button>
              <button 
                onClick={() => insertFormatting('<blockquote>\n  ', '\n</blockquote>')}
                className="p-1.5 rounded hover:bg-white hover:shadow-sm text-zinc-650 hover:text-zinc-950 focus:outline-none cursor-pointer"
                title="Quote"
              >
                <Quote className="w-4 h-4" />
              </button>
              <button 
                onClick={() => insertFormatting('<pre><code>\n', '\n</code></pre>')}
                className="p-1.5 rounded hover:bg-white hover:shadow-sm text-zinc-650 hover:text-zinc-950 focus:outline-none cursor-pointer"
                title="Code Block"
              >
                <Code2 className="w-4 h-4" />
              </button>

              <div className="w-px h-5 bg-zinc-200 mx-1" />

              <button 
                onClick={() => insertFormatting('<a href="https://example.com" class="text-primary underline">', '</a>')}
                className="p-1.5 rounded hover:bg-white hover:shadow-sm text-zinc-650 hover:text-zinc-950 focus:outline-none cursor-pointer"
                title="Insert Link"
              >
                <Link2 className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setIsImageModalOpen(true)}
                className="p-1.5 rounded hover:bg-white hover:shadow-sm text-zinc-650 hover:text-primary focus:outline-none cursor-pointer transition-colors"
                title="Insert Image (Configurable)"
              >
                <ImageIcon className="w-4 h-4" />
              </button>

              <div className="w-px h-5 bg-zinc-200 mx-1" />

              <button 
                onClick={handleUndo}
                disabled={historyIndex <= 0}
                className="p-1.5 rounded hover:bg-white hover:shadow-sm text-zinc-650 hover:text-zinc-950 disabled:opacity-30 disabled:hover:bg-transparent focus:outline-none cursor-pointer"
                title="Undo"
              >
                <Undo className="w-4 h-4" />
              </button>
              <button 
                onClick={handleRedo}
                disabled={historyIndex >= history.length - 1}
                className="p-1.5 rounded hover:bg-white hover:shadow-sm text-zinc-650 hover:text-zinc-950 disabled:opacity-30 disabled:hover:bg-transparent focus:outline-none cursor-pointer"
                title="Redo"
              >
                <Redo className="w-4 h-4" />
              </button>
            </div>

            {/* Inputs */}
            <div className="space-y-4">
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Title"
                className="w-full font-serif text-3xl sm:text-4xl font-bold text-zinc-900 border-0 p-0 placeholder-zinc-300 focus:ring-0 focus:outline-none"
              />
              <input
                type="text"
                value={subtitle}
                onChange={e => setSubtitle(e.target.value)}
                placeholder="Story description or subtitle..."
                className="w-full font-sans text-base text-zinc-500 border-0 p-0 placeholder-zinc-350 focus:ring-0 focus:outline-none"
              />
              <textarea
                id="editor-textarea"
                value={content}
                onChange={e => updateContentWithHistory(e.target.value)}
                placeholder="Write your story here..."
                rows={18}
                className="w-full font-serif text-base sm:text-lg text-zinc-800 leading-relaxed border-0 p-0 placeholder-zinc-300 focus:ring-0 focus:outline-none resize-none focus:border-0"
              />
            </div>
          </div>
        ) : (
          /* Realtime Preview Mode */
          <div className="space-y-8">
            <div className="border-b border-zinc-100 pb-6">
              <h1 className="font-serif text-3xl sm:text-4xl font-bold leading-tight text-zinc-950 mb-3">
                {title || 'Untitled Article'}
              </h1>
              {subtitle && (
                <p className="text-lg sm:text-xl text-zinc-500 leading-relaxed font-sans">
                  {subtitle}
                </p>
              )}
            </div>

            {/* Cover image mock in preview */}
            {coverImageUrl && (
              <div className="w-full h-64 sm:h-96 rounded-xl overflow-hidden border border-zinc-100 mb-8">
                <img 
                  src={coverImageUrl} 
                  alt={title} 
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div 
              className="article-body font-serif text-lg leading-relaxed text-zinc-850 tracking-wide space-y-6"
              dangerouslySetInnerHTML={{ __html: content || '<p class="text-zinc-400 italic">No content written yet.</p>' }}
            />

            {/* Injected Preview Styles */}
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
                color: #27272a;
              }
              .article-body ol {
                list-style-type: decimal;
                margin-left: 1.75rem;
                margin-bottom: 1.5rem;
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
          </div>
        )}
      </div>

      {/* Image Configuration Modal */}
      {isImageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-on-surface/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsImageModalOpen(false)}
          />

          <div className="relative bg-surface shadow-2xl rounded-3xl border border-border-subtle/40 max-w-lg w-full p-6 sm:p-8 z-50 text-on-surface animate-bounce-in">
            <div className="flex items-center justify-between pb-4 border-b border-border-subtle/30 mb-6">
              <h2 className="text-lg font-serif font-bold text-on-surface flex items-center space-x-2">
                <ImageIcon className="w-5 h-5 text-primary" />
                <span>Insert & Configure Image</span>
              </h2>
              <button 
                onClick={() => setIsImageModalOpen(false)}
                className="p-2 hover:bg-surface-container rounded-full text-on-surface-variant hover:text-primary transition-colors focus:outline-none cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleInsertImage} className="space-y-5 text-left">
              {/* Image URL Input */}
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">
                  Image URL
                </label>
                <div className="bg-surface-container/60 border border-border-subtle/30 focus-within:border-primary/50 rounded-2xl transition-colors">
                  <input
                    type="url"
                    value={imgUrl}
                    onChange={e => setImgUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full px-4 py-3 bg-transparent border-none rounded-2xl text-xs text-on-surface placeholder-on-surface-variant/60 focus:ring-0 focus:outline-none"
                  />
                </div>
                <p className="text-[10px] text-on-surface-variant/70 mt-1.5">
                  Paste any public image web link to embed into your story.
                </p>
              </div>

              {/* Alt Description & Caption */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">
                    Alt Text (Description)
                  </label>
                  <div className="bg-surface-container/60 border border-border-subtle/30 focus-within:border-primary/50 rounded-2xl transition-colors">
                    <input
                      type="text"
                      value={imgAlt}
                      onChange={e => setImgAlt(e.target.value)}
                      placeholder="e.g. Architecture diagram"
                      className="w-full px-3.5 py-2.5 bg-transparent border-none rounded-2xl text-xs text-on-surface placeholder-on-surface-variant/60 focus:ring-0 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">
                    Caption (Optional)
                  </label>
                  <div className="bg-surface-container/60 border border-border-subtle/30 focus-within:border-primary/50 rounded-2xl transition-colors">
                    <input
                      type="text"
                      value={imgCaption}
                      onChange={e => setImgCaption(e.target.value)}
                      placeholder="e.g. Photo by Unsplash"
                      className="w-full px-3.5 py-2.5 bg-transparent border-none rounded-2xl text-xs text-on-surface placeholder-on-surface-variant/60 focus:ring-0 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Configuration Settings: Size & Corner Radius */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">
                    Display Width
                  </label>
                  <div className="grid grid-cols-3 gap-1.5 p-1 bg-surface-container/60 border border-border-subtle/30 rounded-2xl text-xs">
                    <button
                      type="button"
                      onClick={() => setImgWidth('full')}
                      className={`py-1.5 rounded-xl font-medium transition-all text-[11px] cursor-pointer ${
                        imgWidth === 'full' ? 'bg-surface shadow-sm text-primary font-semibold' : 'text-on-surface-variant hover:text-primary'
                      }`}
                    >
                      Full
                    </button>
                    <button
                      type="button"
                      onClick={() => setImgWidth('medium')}
                      className={`py-1.5 rounded-xl font-medium transition-all text-[11px] cursor-pointer ${
                        imgWidth === 'medium' ? 'bg-surface shadow-sm text-primary font-semibold' : 'text-on-surface-variant hover:text-primary'
                      }`}
                    >
                      Medium
                    </button>
                    <button
                      type="button"
                      onClick={() => setImgWidth('small')}
                      className={`py-1.5 rounded-xl font-medium transition-all text-[11px] cursor-pointer ${
                        imgWidth === 'small' ? 'bg-surface shadow-sm text-primary font-semibold' : 'text-on-surface-variant hover:text-primary'
                      }`}
                    >
                      Small
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">
                    Corner Style
                  </label>
                  <div className="grid grid-cols-3 gap-1.5 p-1 bg-surface-container/60 border border-border-subtle/30 rounded-2xl text-xs">
                    <button
                      type="button"
                      onClick={() => setImgBorder('rounded')}
                      className={`py-1.5 rounded-xl font-medium transition-all text-[11px] cursor-pointer ${
                        imgBorder === 'rounded' ? 'bg-surface shadow-sm text-primary font-semibold' : 'text-on-surface-variant hover:text-primary'
                      }`}
                    >
                      Rounded
                    </button>
                    <button
                      type="button"
                      onClick={() => setImgBorder('sharp')}
                      className={`py-1.5 rounded-xl font-medium transition-all text-[11px] cursor-pointer ${
                        imgBorder === 'sharp' ? 'bg-surface shadow-sm text-primary font-semibold' : 'text-on-surface-variant hover:text-primary'
                      }`}
                    >
                      Sharp
                    </button>
                    <button
                      type="button"
                      onClick={() => setImgBorder('pill')}
                      className={`py-1.5 rounded-xl font-medium transition-all text-[11px] cursor-pointer ${
                        imgBorder === 'pill' ? 'bg-surface shadow-sm text-primary font-semibold' : 'text-on-surface-variant hover:text-primary'
                      }`}
                    >
                      Pill
                    </button>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 border-t border-border-subtle/30 pt-4 mt-6">
                <button
                  type="button"
                  onClick={() => setIsImageModalOpen(false)}
                  className="px-5 py-2.5 shadow-neumorphic hover:shadow-neumorphic-float rounded-full text-xs font-semibold text-on-surface bg-surface transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 btn-primary-3d text-on-primary rounded-full text-xs font-semibold ctrl-transition cursor-pointer flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Insert Image</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Publish Overlay Modal */}
      {isPublishModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-on-surface/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsPublishModalOpen(false)}
          />

          <div className="relative bg-surface shadow-2xl rounded-3xl border border-border-subtle/40 max-w-2xl w-full max-h-[90vh] overflow-y-auto z-10 flex flex-col p-6 sm:p-8 animate-bounce-in">
            <div className="flex items-center justify-between pb-4 border-b border-border-subtle/30 mb-6">
              <h2 className="text-xl font-bold text-on-surface flex items-center space-x-2">
                <Settings className="w-5 h-5 text-on-surface-variant" />
                <span>Story Settings & Publish</span>
              </h2>
              <button 
                onClick={() => setIsPublishModalOpen(false)}
                className="p-2 hover:bg-surface-container rounded-full text-on-surface-variant hover:text-primary transition-colors focus:outline-none cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1">
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Story Preview</h3>
                <div className="border border-border-subtle/30 rounded-2xl overflow-hidden bg-surface shadow-neumorphic-raised p-2">
                  <div className="h-32 rounded-xl overflow-hidden relative flex items-center justify-center bg-surface-container shadow-neumorphic-inset">
                    {coverImageUrl ? (
                      <img 
                        src={coverImageUrl} 
                        alt="Preview cover" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xs text-on-surface-variant">No cover image selected</span>
                    )}
                  </div>
                  <div className="p-4 space-y-2">
                    <span className="px-3 py-1 bg-surface-container text-on-surface-variant text-[10px] font-bold uppercase rounded-full">
                      {selectedTopic}
                    </span>
                    <h4 className="font-serif text-sm font-bold text-on-surface truncate leading-snug">
                      {title || 'Untitled story'}
                    </h4>
                    <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed">
                      {shortDescription || subtitle || 'No preview description added. This snippet will show in lists.'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 text-left">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-on-surface-variant">Category Topic</label>
                  <select
                    value={selectedTopic}
                    onChange={e => setSelectedTopic(e.target.value)}
                    className="w-full py-2 px-3 border border-border-subtle/30 rounded-xl text-sm bg-surface text-on-surface focus:outline-none focus:border-primary cursor-pointer"
                  >
                    <option value="Technology">Technology</option>
                    <option value="Programming">Programming</option>
                    <option value="AI">AI</option>
                    <option value="Design">Design</option>
                    <option value="Business">Business</option>
                    <option value="Productivity">Productivity</option>
                    <option value="Science">Science</option>
                    <option value="Lifestyle">Lifestyle</option>
                    <option value="Finance">Finance</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-on-surface-variant">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={e => setTagsInput(e.target.value)}
                    placeholder="react, webdev, setup"
                    className="w-full py-2 px-3 border border-border-subtle/30 rounded-xl text-sm text-on-surface bg-surface focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-on-surface-variant">Cover Image URL</label>
                  <input
                    type="text"
                    value={coverImageUrl}
                    onChange={e => setCoverImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full py-2 px-3 border border-border-subtle/30 rounded-xl text-sm text-on-surface bg-surface focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-on-surface-variant">Preview Description</label>
                  <textarea
                    value={shortDescription}
                    onChange={e => setShortDescription(e.target.value)}
                    rows={2}
                    placeholder="A brief snippet..."
                    className="w-full py-2 px-3 border border-border-subtle/30 rounded-xl text-sm text-on-surface bg-surface focus:outline-none focus:border-primary resize-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-border-subtle/30 pt-4 mt-8">
              <button
                onClick={() => setIsPublishModalOpen(false)}
                className="px-5 py-2.5 shadow-neumorphic hover:shadow-neumorphic-float rounded-full text-xs font-semibold text-on-surface bg-surface transition-all cursor-pointer"
              >
                Go Back
              </button>
              <button
                onClick={handlePublish}
                disabled={isSaving}
                className="px-6 py-2.5 btn-primary-3d text-on-primary rounded-full text-xs font-semibold ctrl-transition cursor-pointer disabled:opacity-50"
              >
                {isSaving ? 'Publishing...' : 'Publish Now'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
