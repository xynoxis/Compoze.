export interface Author {
  id: string;
  username: string;
  name: string;
  avatar: string;
  bio: string;
  followers: number;
  following: number;
}

export interface Article {
  id: string;
  title: string;
  subtitle: string;
  content: string; // rich text represented as HTML string
  coverImage: string;
  authorId: string;
  date: string;
  readTime: string;
  topic: string;
  tags: string[];
  likes: number;
  commentsCount: number;
  views: number;
  status: 'published' | 'draft';
}

export interface Comment {
  id: string;
  articleId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  date: string;
  likes: number;
}

export interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'mention' | 'publish';
  actorName: string;
  actorAvatar: string;
  articleTitle?: string;
  articleId?: string;
  date: string;
  read: boolean;
}

export interface AnalyticsData {
  viewsOverTime: { date: string; views: number }[];
  followersOverTime: { date: string; followers: number }[];
  likesOverTime: { date: string; likes: number }[];
  topicDistribution: { topic: string; count: number }[];
}

export const mockAuthors: Author[] = [];

export const mockTopics: string[] = [
  'Technology',
  'Programming',
  'AI',
  'Design',
  'Business',
  'Productivity',
  'Science',
  'Lifestyle',
  'Finance',
  'Venture Capital'
];

export const mockArticles: Article[] = [];

export const mockComments: Comment[] = [
  {
    id: 'comm-1',
    articleId: 'article-1',
    authorName: 'Marcus Vance',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    content: 'Brilliant writeup, Alexandra! The signal-based approach truly makes React feel like a heavy behemoth. However, I wonder if the lack of standardized state-management patterns in Solid or Svelte might keep enterprises locked into React for a while longer.',
    date: 'Aug 19, 2026',
    likes: 12,
  },
  {
    id: 'comm-2',
    articleId: 'article-1',
    authorName: 'James K. Patterson',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    content: 'Fully agree on the compile-time gains. SolidJS compilation output is incredibly clean. It literally maps components to direct `document.createElement` calls, avoiding all that extra runtime library logic.',
    date: 'Aug 19, 2026',
    likes: 8,
  },
  {
    id: 'comm-3',
    articleId: 'article-3',
    authorName: 'Alexandra Chen',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    content: 'SSMs are definitely promising. The quadratic bottleneck is real. However, do you think SSMs will be able to handle complex coding tasks where global context relationships are highly non-linear and require strict token alignment?',
    date: 'Aug 20, 2026',
    likes: 15,
  },
  {
    id: 'comm-4',
    articleId: 'article-4',
    authorName: 'Sarah Jenkins',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    content: 'Great tips, Sarah. Keeping the stack boring is the most underrated advice in tech. I built my first product using basic Rails and SQLite and it did $10k in its first year without a single server issue.',
    date: 'Aug 17, 2026',
    likes: 24,
  }
];

export const mockNotifications: Notification[] = [];

export const mockAnalytics: AnalyticsData = {
  viewsOverTime: [
    { date: 'Mon', views: 240 },
    { date: 'Tue', views: 320 },
    { date: 'Wed', views: 450 },
    { date: 'Thu', views: 380 },
    { date: 'Fri', views: 520 },
    { date: 'Sat', views: 600 },
    { date: 'Sun', views: 780 }
  ],
  followersOverTime: [
    { date: 'Mon', followers: 1390 },
    { date: 'Tue', followers: 1395 },
    { date: 'Wed', followers: 1402 },
    { date: 'Thu', followers: 1408 },
    { date: 'Fri', followers: 1412 },
    { date: 'Sat', followers: 1415 },
    { date: 'Sun', followers: 1420 }
  ],
  likesOverTime: [
    { date: 'Mon', likes: 20 },
    { date: 'Tue', likes: 28 },
    { date: 'Wed', likes: 35 },
    { date: 'Thu', likes: 30 },
    { date: 'Fri', likes: 45 },
    { date: 'Sat', likes: 50 },
    { date: 'Sun', likes: 62 }
  ],
  topicDistribution: [
    { topic: 'Programming', count: 3 },
    { topic: 'AI', count: 2 },
    { topic: 'Design', count: 1 },
    { topic: 'Business', count: 1 },
    { topic: 'Productivity', count: 1 },
    { topic: 'Science', count: 1 }
  ]
};
