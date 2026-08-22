import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  mockArticles, 
  mockAuthors, 
  mockComments, 
  mockNotifications 
} from '../data/mockData';
import type { 
  Article, 
  Author, 
  Comment, 
  Notification 
} from '../data/mockData';

export interface ToastType {
  message: string;
  type: 'success' | 'info' | 'warning';
  id: number;
}

interface AppContextType {
  articles: Article[];
  authors: Author[];
  currentUser: Author;
  likes: string[]; // List of article IDs
  bookmarks: string[]; // List of article IDs
  follows: string[]; // List of author IDs
  comments: Comment[];
  notifications: Notification[];
  toast: ToastType | null;
  switchUser: (authorId: string) => void;
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
  toggleLike: (articleId: string) => void;
  toggleBookmark: (articleId: string) => void;
  toggleFollow: (authorId: string) => void;
  addComment: (articleId: string, content: string) => void;
  publishArticle: (article: Omit<Article, 'id' | 'authorId' | 'date' | 'readTime' | 'likes' | 'commentsCount' | 'views' | 'status'> & { id?: string }) => string;
  saveDraft: (article: Omit<Article, 'id' | 'authorId' | 'date' | 'readTime' | 'likes' | 'commentsCount' | 'views' | 'status'> & { id?: string }) => string;
  deleteArticle: (articleId: string) => void;
  updateProfile: (profile: Partial<Author>) => void;
  markNotificationRead: (notifId: string) => void;
  markAllNotificationsRead: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Helper to load from localStorage or fallback
  const getStoredState = <T,>(key: string, fallback: T): T => {
    try {
      const stored = localStorage.getItem(`compoze_${key}`);
      return stored ? JSON.parse(stored) : fallback;
    } catch (e) {
      console.error(`Error reading key "${key}" from localStorage:`, e);
      return fallback;
    }
  };

  // State initialization
  const [articles, setArticles] = useState<Article[]>(() => getStoredState('articles', mockArticles));
  const [authors, setAuthors] = useState<Author[]>(() => getStoredState('authors', mockAuthors));
  const [currentUser, setCurrentUser] = useState<Author>(() => getStoredState('currentUser', mockAuthors[0]));
  const [likes, setLikes] = useState<string[]>(() => getStoredState('likes', ['article-2', 'article-4']));
  const [bookmarks, setBookmarks] = useState<string[]>(() => getStoredState('bookmarks', ['article-3']));
  const [follows, setFollows] = useState<string[]>(() => getStoredState('follows', ['author-3', 'author-5']));
  const [comments, setComments] = useState<Comment[]>(() => getStoredState('comments', mockComments));
  const [notifications, setNotifications] = useState<Notification[]>(() => getStoredState('notifications', mockNotifications));
  const [toast, setToast] = useState<ToastType | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = Date.now();
    setToast({ message, type, id });
  };

  // Auto-hide toast after 3 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Sync to localStorage
  useEffect(() => { localStorage.setItem('compoze_articles', JSON.stringify(articles)); }, [articles]);
  useEffect(() => { localStorage.setItem('compoze_authors', JSON.stringify(authors)); }, [authors]);
  useEffect(() => { localStorage.setItem('compoze_currentUser', JSON.stringify(currentUser)); }, [currentUser]);
  useEffect(() => { localStorage.setItem('compoze_likes', JSON.stringify(likes)); }, [likes]);
  useEffect(() => { localStorage.setItem('compoze_bookmarks', JSON.stringify(bookmarks)); }, [bookmarks]);
  useEffect(() => { localStorage.setItem('compoze_follows', JSON.stringify(follows)); }, [follows]);
  useEffect(() => { localStorage.setItem('compoze_comments', JSON.stringify(comments)); }, [comments]);
  useEffect(() => { localStorage.setItem('compoze_notifications', JSON.stringify(notifications)); }, [notifications]);

  // Always clean up any previously saved dark theme class to stay in light mode
  useEffect(() => {
    document.documentElement.classList.remove('dark');
    localStorage.removeItem('compoze_theme');
  }, []);

  // Actions
  const toggleLike = (articleId: string) => {
    let isLiked = false;
    setLikes(prev => {
      if (prev.includes(articleId)) {
        return prev.filter(id => id !== articleId);
      } else {
        isLiked = true;
        return [...prev, articleId];
      }
    });

    // Update individual article count
    setArticles(prev => prev.map(art => {
      if (art.id === articleId) {
        const diff = isLiked ? 1 : -1;
        return { ...art, likes: Math.max(0, art.likes + diff) };
      }
      return art;
    }));

    // Trigger notification if liked (and not self-like)
    const targetArticle = articles.find(a => a.id === articleId);
    if (isLiked && targetArticle && targetArticle.authorId !== currentUser.id) {
      const author = authors.find(a => a.id === targetArticle.authorId);
      if (author) {
        const newNotif: Notification = {
          id: `notif-${Date.now()}`,
          type: 'like',
          actorName: currentUser.name,
          actorAvatar: currentUser.avatar,
          articleTitle: targetArticle.title,
          articleId: targetArticle.id,
          date: 'Just now',
          read: false
        };
        setNotifications(prev => [newNotif, ...prev]);
      }
    }
  };

  const toggleBookmark = (articleId: string) => {
    setBookmarks(prev => {
      if (prev.includes(articleId)) {
        return prev.filter(id => id !== articleId);
      } else {
        return [...prev, articleId];
      }
    });
  };

  const toggleFollow = (authorId: string) => {
    let isFollowing = false;
    setFollows(prev => {
      if (prev.includes(authorId)) {
        return prev.filter(id => id !== authorId);
      } else {
        isFollowing = true;
        return [...prev, authorId];
      }
    });

    // Update author follower count
    setAuthors(prev => prev.map(auth => {
      if (auth.id === authorId) {
        const diff = isFollowing ? 1 : -1;
        return { ...auth, followers: Math.max(0, auth.followers + diff) };
      }
      return auth;
    }));

    // Trigger notification if followed
    if (isFollowing) {
      const targetAuthor = authors.find(a => a.id === authorId);
      if (targetAuthor) {
        const newNotif: Notification = {
          id: `notif-${Date.now()}`,
          type: 'follow',
          actorName: currentUser.name,
          actorAvatar: currentUser.avatar,
          date: 'Just now',
          read: false
        };
        setNotifications(prev => [newNotif, ...prev]);
      }
    }
  };

  const addComment = (articleId: string, content: string) => {
    const newComment: Comment = {
      id: `comm-${Date.now()}`,
      articleId,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      content,
      date: 'Just now',
      likes: 0
    };
    setComments(prev => [...prev, newComment]);

    // Update article comment count
    setArticles(prev => prev.map(art => {
      if (art.id === articleId) {
        return { ...art, commentsCount: art.commentsCount + 1 };
      }
      return art;
    }));

    // Trigger notification if commented (and not self-comment)
    const targetArticle = articles.find(a => a.id === articleId);
    if (targetArticle && targetArticle.authorId !== currentUser.id) {
      const newNotif: Notification = {
        id: `notif-${Date.now()}`,
        type: 'comment',
        actorName: currentUser.name,
        actorAvatar: currentUser.avatar,
        articleTitle: targetArticle.title,
        articleId: targetArticle.id,
        date: 'Just now',
        read: false
      };
      setNotifications(prev => [newNotif, ...prev]);
    }
  };

  const publishArticle = (articleData: Omit<Article, 'id' | 'authorId' | 'date' | 'readTime' | 'likes' | 'commentsCount' | 'views' | 'status'> & { id?: string }) => {
    const id = articleData.id || `article-${Date.now()}`;
    const wordCount = articleData.content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    const readTime = `${Math.max(1, Math.ceil(wordCount / 200))} min read`;

    const newArticle: Article = {
      id,
      title: articleData.title,
      subtitle: articleData.subtitle,
      content: articleData.content,
      coverImage: articleData.coverImage || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
      authorId: currentUser.id,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      readTime,
      topic: articleData.topic,
      tags: articleData.tags.length > 0 ? articleData.tags : [articleData.topic],
      likes: articles.find(a => a.id === id)?.likes || 0,
      commentsCount: articles.find(a => a.id === id)?.commentsCount || 0,
      views: articles.find(a => a.id === id)?.views || 10, // starting with a small number
      status: 'published'
    };

    setArticles(prev => {
      const exists = prev.some(a => a.id === id);
      if (exists) {
        return prev.map(a => a.id === id ? newArticle : a);
      } else {
        return [newArticle, ...prev];
      }
    });

    return id;
  };

  const saveDraft = (articleData: Omit<Article, 'id' | 'authorId' | 'date' | 'readTime' | 'likes' | 'commentsCount' | 'views' | 'status'> & { id?: string }) => {
    const id = articleData.id || `article-${Date.now()}`;
    const wordCount = articleData.content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    const readTime = `${Math.max(1, Math.ceil(wordCount / 200))} min read`;

    const newArticle: Article = {
      id,
      title: articleData.title || 'Untitled Draft',
      subtitle: articleData.subtitle || '',
      content: articleData.content || '',
      coverImage: articleData.coverImage || 'https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?auto=format&fit=crop&w=800&q=80',
      authorId: currentUser.id,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      readTime,
      topic: articleData.topic || 'Technology',
      tags: articleData.tags || [],
      likes: 0,
      commentsCount: 0,
      views: 0,
      status: 'draft'
    };

    setArticles(prev => {
      const exists = prev.some(a => a.id === id);
      if (exists) {
        return prev.map(a => a.id === id ? newArticle : a);
      } else {
        return [newArticle, ...prev];
      }
    });

    return id;
  };

  const deleteArticle = (articleId: string) => {
    setArticles(prev => prev.filter(art => art.id !== articleId));
    setLikes(prev => prev.filter(id => id !== articleId));
    setBookmarks(prev => prev.filter(id => id !== articleId));
  };

  const updateProfile = (profileData: Partial<Author>) => {
    setCurrentUser(prev => {
      const updated = { ...prev, ...profileData };
      // Also update this author in the authors list
      setAuthors(prevAuthors => prevAuthors.map(auth => auth.id === prev.id ? updated : auth));
      return updated;
    });
  };

  const markNotificationRead = (notifId: string) => {
    setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const switchUser = (authorId: string) => {
    const nextUser = authors.find(a => a.id === authorId);
    if (nextUser) {
      setCurrentUser(nextUser);
      showToast(`Switched user to ${nextUser.name}`, 'success');
    }
  };

  return (
    <AppContext.Provider value={{
      articles,
      authors,
      currentUser,
      likes,
      bookmarks,
      follows,
      comments,
      notifications,
      toast,
      switchUser,
      showToast,
      toggleLike,
      toggleBookmark,
      toggleFollow,
      addComment,
      publishArticle,
      saveDraft,
      deleteArticle,
      updateProfile,
      markNotificationRead,
      markAllNotificationsRead,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
