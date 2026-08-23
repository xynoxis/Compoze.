import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

interface TrendingArticleProps {
  articleId: string;
  rank: number;
}

export const TrendingArticle: React.FC<TrendingArticleProps> = ({ articleId, rank }) => {
  const { articles, authors } = useApp();
  const article = articles.find(a => a.id === articleId);
  if (!article) return null;

  const author = authors.find(a => a.id === article.authorId);
  if (!author) return null;

  const formattedRank = rank < 10 ? `0${rank}` : `${rank}`;

  return (
    <article className="trending-item">
      <div className="trending-rank">{formattedRank}</div>
      <div className="trending-content">
        <Link to={`/profile/${author.username}`} className="trending-author">
          <img src={author.avatar} alt="" />
          <span>{author.name}</span>
        </Link>
        <Link to={`/article/${article.id}`} className="trending-title">
          {article.title}
        </Link>
        <div className="trending-meta">
          <span>{article.date}</span>
          <i>•</i>
          <span>{article.readTime}</span>
        </div>
      </div>
    </article>
  );
};
