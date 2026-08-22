import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
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
  X
} from 'lucide-react';

export const Write: React.FC = () => {
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  const navigate = useNavigate();
  const { articles, publishArticle, saveDraft, showToast } = useApp();

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
        setTagsInput(art.tags.join(', '));
        setCoverImageUrl(art.coverImage);
        setShortDescription(art.subtitle);
        
        // Reset history
        setHistory([art.content]);
        setHistoryIndex(0);
      }
    }
  }, [editId, articles]);

  // Track history for Undo/Redo
  const updateContentWithHistory = (newVal: string) => {
    setContent(newVal);
    
    // Add to history if different from current top
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

    // Re-focus and select
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length);
    }, 50);
  };

  const handleSaveDraft = () => {
    saveDraft({
      id: editId || undefined,
      title,
      subtitle,
      content,
      coverImage: coverImageUrl || presetCovers[0],
      topic: selectedTopic,
      tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean),
    });
    showToast('Draft saved successfully!', 'success');
    navigate('/dashboard');
  };

  const handleOpenPublishModal = () => {
    if (!title.trim() || !content.trim()) {
      showToast('Please provide a title and content before publishing.', 'warning');
      return;
    }
    // Pre-populate short description if blank
    if (!shortDescription) {
      setShortDescription(subtitle);
    }
    // Pre-populate cover image if blank
    if (!coverImageUrl) {
      setCoverImageUrl(presetCovers[0]);
    }
    setIsPublishModalOpen(true);
  };

  const handlePublish = () => {
    const pubId = publishArticle({
      id: editId || undefined,
      title,
      subtitle: shortDescription || subtitle,
      content,
      coverImage: coverImageUrl,
      topic: selectedTopic,
      tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean),
    });
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
            className="flex items-center space-x-1 text-xs font-semibold text-zinc-600 hover:text-zinc-950 px-2.5 py-1 border border-zinc-200 rounded-md focus:outline-none"
          >
            {isPreviewMode ? (
              <>
                <Edit2 className="w-3..5 h-3.5 text-zinc-500" />
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
            className="text-xs font-semibold text-zinc-500 hover:text-zinc-950 transition-colors focus:outline-none"
          >
            Save Draft
          </button>
          <button
            onClick={handleOpenPublishModal}
            className="px-4 py-1.5 bg-brand-700 hover:bg-brand-800 text-white text-xs font-semibold rounded-full shadow-sm transition-colors focus:outline-none"
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
                className="p-1.5 rounded hover:bg-white hover:shadow-sm text-zinc-650 hover:text-zinc-950 focus:outline-none"
                title="Bold"
              >
                <Bold className="w-4 h-4" />
              </button>
              <button 
                onClick={() => insertFormatting('<i>', '</i>')}
                className="p-1.5 rounded hover:bg-white hover:shadow-sm text-zinc-650 hover:text-zinc-950 focus:outline-none"
                title="Italic"
              >
                <Italic className="w-4 h-4" />
              </button>
              <button 
                onClick={() => insertFormatting('<u>', '</u>')}
                className="p-1.5 rounded hover:bg-white hover:shadow-sm text-zinc-650 hover:text-zinc-950 focus:outline-none"
                title="Underline"
              >
                <Underline className="w-4 h-4" />
              </button>
              
              <div className="w-px h-5 bg-zinc-200 mx-1" />

              <button 
                onClick={() => insertFormatting('<h2>', '</h2>')}
                className="p-1.5 rounded hover:bg-white hover:shadow-sm text-zinc-650 hover:text-zinc-950 focus:outline-none"
                title="H2 Header"
              >
                <Heading1 className="w-4 h-4" />
              </button>
              <button 
                onClick={() => insertFormatting('<h3>', '</h3>')}
                className="p-1.5 rounded hover:bg-white hover:shadow-sm text-zinc-650 hover:text-zinc-950 focus:outline-none"
                title="H3 Header"
              >
                <Heading2 className="w-4 h-4" />
              </button>

              <div className="w-px h-5 bg-zinc-200 mx-1" />

              <button 
                onClick={() => insertFormatting('<ul>\n  <li>', '</li>\n</ul>')}
                className="p-1.5 rounded hover:bg-white hover:shadow-sm text-zinc-650 hover:text-zinc-950 focus:outline-none"
                title="Bullet List"
              >
                <List className="w-4 h-4" />
              </button>
              <button 
                onClick={() => insertFormatting('<ol>\n  <li>', '</li>\n</ol>')}
                className="p-1.5 rounded hover:bg-white hover:shadow-sm text-zinc-650 hover:text-zinc-950 focus:outline-none"
                title="Numbered List"
              >
                <ListOrdered className="w-4 h-4" />
              </button>
              <button 
                onClick={() => insertFormatting('<blockquote>\n  ', '\n</blockquote>')}
                className="p-1.5 rounded hover:bg-white hover:shadow-sm text-zinc-650 hover:text-zinc-950 focus:outline-none"
                title="Quote"
              >
                <Quote className="w-4 h-4" />
              </button>
              <button 
                onClick={() => insertFormatting('<pre><code>\n', '\n</code></pre>')}
                className="p-1.5 rounded hover:bg-white hover:shadow-sm text-zinc-650 hover:text-zinc-950 focus:outline-none"
                title="Code Block"
              >
                <Code2 className="w-4 h-4" />
              </button>

              <div className="w-px h-5 bg-zinc-200 mx-1" />

              <button 
                onClick={() => insertFormatting('<a href="https://example.com" class="text-teal-700 underline">', '</a>')}
                className="p-1.5 rounded hover:bg-white hover:shadow-sm text-zinc-650 hover:text-zinc-950 focus:outline-none"
                title="Insert Link"
              >
                <Link2 className="w-4 h-4" />
              </button>
              <button 
                onClick={() => insertFormatting('<img src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80" alt="Embed cover" className="my-6 rounded-lg w-full object-cover" />', '')}
                className="p-1.5 rounded hover:bg-white hover:shadow-sm text-zinc-650 hover:text-zinc-950 focus:outline-none"
                title="Insert Image"
              >
                <ImageIcon className="w-4 h-4" />
              </button>

              <div className="w-px h-5 bg-zinc-200 mx-1" />

              <button 
                onClick={handleUndo}
                disabled={historyIndex <= 0}
                className="p-1.5 rounded hover:bg-white hover:shadow-sm text-zinc-650 hover:text-zinc-950 disabled:opacity-30 disabled:hover:bg-transparent focus:outline-none"
                title="Undo"
              >
                <Undo className="w-4 h-4" />
              </button>
              <button 
                onClick={handleRedo}
                disabled={historyIndex >= history.length - 1}
                className="p-1.5 rounded hover:bg-white hover:shadow-sm text-zinc-650 hover:text-zinc-950 disabled:opacity-30 disabled:hover:bg-transparent focus:outline-none"
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

      {/* Publish Overlay Modal */}
      {isPublishModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-zinc-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsPublishModalOpen(false)}
          />

          {/* Modal Card */}
          <div className="relative bg-white rounded-2xl shadow-2xl border border-zinc-200 max-w-2xl w-full max-h-[90vh] overflow-y-auto z-10 flex flex-col p-6 sm:p-8 animate-bounce-in">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-zinc-150 mb-6">
              <h2 className="text-xl font-bold text-zinc-950 flex items-center space-x-2">
                <Settings className="w-5 h-5 text-zinc-500" />
                <span>Story Settings & Publish</span>
              </h2>
              <button 
                onClick={() => setIsPublishModalOpen(false)}
                className="p-1 rounded-full hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 transition-colors focus:outline-none"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1">
              {/* Left Column: Story Preview */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Story Preview</h3>
                <div className="border border-zinc-200 rounded-xl overflow-hidden bg-zinc-50">
                  <div className="h-32 bg-zinc-200 relative overflow-hidden flex items-center justify-center border-b border-zinc-200">
                    {coverImageUrl ? (
                      <img 
                        src={coverImageUrl} 
                        alt="Preview cover" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xs text-zinc-450 text-zinc-500">No cover image selected</span>
                    )}
                  </div>
                  <div className="p-4 space-y-2">
                    <span className="px-2 py-0.5 bg-zinc-200 text-zinc-700 text-[10px] font-bold uppercase rounded">
                      {selectedTopic}
                    </span>
                    <h4 className="font-serif text-sm font-bold text-zinc-900 truncate leading-snug">
                      {title || 'Untitled story'}
                    </h4>
                    <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">
                      {shortDescription || subtitle || 'No preview description added. This snippet will show in lists.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: Publish Configs */}
              <div className="space-y-4 text-left">
                {/* Topic selection */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-700">Category Topic</label>
                  <select
                    value={selectedTopic}
                    onChange={e => setSelectedTopic(e.target.value)}
                    className="w-full py-2 px-3 border border-zinc-200 rounded-lg text-sm bg-white text-zinc-800 focus:outline-none focus:border-brand-500"
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

                {/* Tags input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-700">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={e => setTagsInput(e.target.value)}
                    placeholder="react, webdev, setup"
                    className="w-full py-2 px-3 border border-zinc-200 rounded-lg text-sm text-zinc-800 placeholder-zinc-350 focus:outline-none focus:border-brand-500"
                  />
                </div>

                {/* Cover Image Preset Selection */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-700">Cover Image URL</label>
                  <input
                    type="text"
                    value={coverImageUrl}
                    onChange={e => setCoverImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full py-2 px-3 border border-zinc-200 rounded-lg text-sm text-zinc-850 placeholder-zinc-350 focus:outline-none focus:border-brand-500"
                  />
                  <div className="space-y-1 mt-2">
                    <p className="text-[10px] text-zinc-400 font-semibold">Or pick a matching preset:</p>
                    <div className="flex gap-2">
                      {presetCovers.map((src, i) => (
                        <button
                          key={i}
                          onClick={() => setCoverImageUrl(src)}
                          className={`w-12 h-8 rounded border overflow-hidden ${
                            coverImageUrl === src ? 'border-brand-600 ring-2 ring-brand-100' : 'border-zinc-200'
                          }`}
                        >
                          <img src={src} className="w-full h-full object-cover" alt="" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Short Description */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-700">Preview Description</label>
                  <textarea
                    value={shortDescription}
                    onChange={e => setShortDescription(e.target.value)}
                    rows={2}
                    placeholder="A brief snippet..."
                    className="w-full py-2 px-3 border border-zinc-200 rounded-lg text-sm text-zinc-800 placeholder-zinc-350 focus:outline-none focus:border-brand-500 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-end gap-3 border-t border-zinc-150 pt-4 mt-8">
              <button
                onClick={() => setIsPublishModalOpen(false)}
                className="px-4 py-2 border border-zinc-200 rounded-full text-xs font-semibold text-zinc-650 hover:text-zinc-950 transition-colors"
              >
                Go Back
              </button>
              <button
                onClick={handlePublish}
                className="px-5 py-2 bg-brand-700 hover:bg-brand-800 text-white rounded-full text-xs font-semibold shadow-sm transition-colors"
              >
                Publish Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
