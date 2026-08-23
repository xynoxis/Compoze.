import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  mockArticles, 
  mockComments 
} from '../data/mockData';
import type { 
  Article, 
  Author, 
  Comment, 
  Notification 
} from '../data/mockData';
import { loginUser, registerUser, getCurrentUser } from '../api/auth';
import type { RegisterPayload, UserDto } from '../api/auth';
import { fetchPosts, createPost as apiCreatePost, publishPost as apiPublishPost } from '../api/posts';
import type { PostDto } from '../api/posts';

export interface ToastType {
  message: string;
  type: 'success' | 'info' | 'warning';
  id: number;
}

interface AppContextType {
  articles: Article[];
  authors: Author[];
  currentUser: Author;
  isAuthenticated: boolean;
  token: string | null;
  apiConnected: boolean;
  likes: string[]; // List of article IDs
  bookmarks: string[]; // List of article IDs
  follows: string[]; // List of author IDs
  comments: Comment[];
  notifications: Notification[];
  toast: ToastType | null;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
  switchUser: (authorId: string) => void;
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
  toggleLike: (articleId: string) => void;
  toggleBookmark: (articleId: string) => void;
  toggleFollow: (authorId: string) => void;
  addComment: (articleId: string, content: string) => void;
  publishArticle: (article: Omit<Article, 'id' | 'authorId' | 'date' | 'readTime' | 'likes' | 'commentsCount' | 'views' | 'status'> & { id?: string }) => Promise<string> | string;
  saveDraft: (article: Omit<Article, 'id' | 'authorId' | 'date' | 'readTime' | 'likes' | 'commentsCount' | 'views' | 'status'> & { id?: string }) => string;
  deleteArticle: (articleId: string) => void;
  updateProfile: (profile: Partial<Author>) => void;
  markNotificationRead: (notifId: string) => void;
  markAllNotificationsRead: () => void;
  clearAllNotifications: () => void;
  refreshBackendData: () => Promise<void>;
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
  const [authors, setAuthors] = useState<Author[]>(() => {
    const stored = getStoredState<Author[]>('authors', []);
    return stored.filter(a => a && a.id && !a.id.startsWith('author-'));
  });
  const [currentUser, setCurrentUser] = useState<Author>(() => {
    const stored = getStoredState<Author | null>('currentUser', null);
    if (stored && stored.id && !stored.id.startsWith('author-')) return stored;
    return {
      id: '',
      name: 'Guest User',
      username: 'guest',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
      bio: 'Guest Reader',
      followers: 0,
      following: 0,
    };
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('compoze_token'));
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!token);
  const [apiConnected, setApiConnected] = useState<boolean>(false);

  const [likes, setLikes] = useState<string[]>(() => getStoredState('likes', ['article-2', 'article-4']));
  const [bookmarks, setBookmarks] = useState<string[]>(() => getStoredState('bookmarks', ['article-3']));
  const [follows, setFollows] = useState<string[]>(() => getStoredState('follows', []));
  const [comments, setComments] = useState<Comment[]>(() => getStoredState('comments', mockComments));
  const [notifications, setNotifications] = useState<Notification[]>(() => getStoredState('notifications', []));
  const [toast, setToast] = useState<ToastType | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = Date.now();
    setToast({ message, type, id });
  };

  // Helper to transform backend PostDto to frontend Article
  const mapPostDtoToArticle = (post: PostDto): Article => {
    const wordCount = (post.content || '').replace(/<[^>]*>/g, '').split(/\s+/).length;
    const readTime = `${Math.max(1, Math.ceil(wordCount / 200))} min read`;
    const dateFormatted = post.publishedAt || post.createdAt
      ? new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      : 'Recently';

    return {
      id: post.id,
      title: post.title,
      subtitle: post.excerpt || '',
      content: post.content,
      coverImage: post.coverImageUrl || '',
      authorId: post.authorId || currentUser.id,
      date: dateFormatted,
      readTime,
      topic: 'Technology',
      tags: ['Technology', 'Programming'],
      likes: 0,
      commentsCount: 0,
      views: 0,
      status: (post.status || 'PUBLISHED').toLowerCase() as 'published' | 'draft',
    };
  };

  // Sync state to backend API if available
  const refreshBackendData = useCallback(async () => {
    try {
      const postPage = await fetchPosts(0, 20);
      if (postPage && Array.isArray(postPage.posts)) {
        const fetchedArticles = postPage.posts.map(mapPostDtoToArticle);
        setArticles(fetchedArticles);
        localStorage.setItem('compoze_articles', JSON.stringify(fetchedArticles));
        setApiConnected(true);
      }
    } catch (err) {
      // Backend not running or offline, keep using local mock data seamlessly
      setApiConnected(false);
    }
  }, [currentUser.id]);

  // Check auth user on mount or token change
  useEffect(() => {
    if (token) {
      getCurrentUser()
        .then((user: UserDto) => {
          setIsAuthenticated(true);
          setApiConnected(true);
          const authorUser: Author = {
            id: user.id,
            name: user.displayName || user.username,
            username: user.username,
            avatar: user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
            bio: 'Active Compoze Creator',
            followers: 0,
            following: 0,
          };
          setCurrentUser(authorUser);
          setAuthors(prev => prev.some(a => a.id === authorUser.id) ? prev : [authorUser, ...prev]);
        })
        .catch(() => {
          // Invalid or expired token
          setToken(null);
          setIsAuthenticated(false);
          localStorage.removeItem('compoze_token');
        });
    } else {
      setIsAuthenticated(false);
    }
  }, [token]);

  // Initial load
  useEffect(() => {
    refreshBackendData();
  }, [refreshBackendData]);

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

  // Auth Actions
  const login = async (email: string, password: string) => {
    const res = await loginUser({ email, password });
    localStorage.setItem('compoze_token', res.accessToken);
    if (res.refreshToken) {
      localStorage.setItem('compoze_refresh_token', res.refreshToken);
    }
    setToken(res.accessToken);
    setIsAuthenticated(true);
    const userRes = await getCurrentUser();
    const loggedUser: Author = {
      id: userRes.id,
      name: userRes.displayName || userRes.username,
      username: userRes.username,
      avatar: userRes.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
      bio: 'Author on Compoze',
      followers: 0,
      following: 0,
    };
    setCurrentUser(loggedUser);
    setAuthors(prev => prev.some(a => a.id === loggedUser.id) ? prev : [loggedUser, ...prev]);
  };

  const register = async (payload: RegisterPayload) => {
    await registerUser(payload);
  };

  const logout = () => {
    localStorage.removeItem('compoze_token');
    localStorage.removeItem('compoze_refresh_token');
    setToken(null);
    setIsAuthenticated(false);
    showToast('Logged out successfully', 'info');
  };

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

  const publishArticle = async (articleData: Omit<Article, 'id' | 'authorId' | 'date' | 'readTime' | 'likes' | 'commentsCount' | 'views' | 'status'> & { id?: string }) => {
    const slug = articleData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    
    // Attempt backend creation if authenticated
    if (token) {
      try {
        const createdPost = await apiCreatePost({
          title: articleData.title,
          slug: `${slug}-${Date.now().toString().slice(-4)}`,
          excerpt: articleData.subtitle,
          content: articleData.content,
          coverImageUrl: articleData.coverImage,
        });
        await apiPublishPost(createdPost.id);
        await refreshBackendData();
        return createdPost.id;
      } catch (e) {
        console.warn('Backend creation failed, saving locally:', e);
      }
    }

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
      views: articles.find(a => a.id === id)?.views || 10,
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

  const clearAllNotifications = () => {
    setNotifications([]);
    localStorage.removeItem('compoze_notifications');
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
      isAuthenticated,
      token,
      apiConnected,
      likes,
      bookmarks,
      follows,
      comments,
      notifications,
      toast,
      login,
      register,
      logout,
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
      clearAllNotifications,
      refreshBackendData,
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
