import React from 'react';
import { Link } from 'react-router-dom';
import type { Author } from '../data/mockData';
import { FollowButton } from './FollowButton';

interface AuthorCardProps {
  author: Author;
}

export const AuthorCard: React.FC<AuthorCardProps> = ({ author }) => {
  return (
    <div className="flex items-start justify-between py-4 border-b border-zinc-100 last:border-0 group">
      <div className="flex items-start space-x-3 mr-4 flex-1">
        <Link to={`/profile/${author.username}`} className="flex-shrink-0">
          <img 
            src={author.avatar} 
            alt={author.name} 
            className="w-10 h-10 rounded-full object-cover border border-zinc-200"
          />
        </Link>
        <div className="flex-1 min-w-0">
          <Link to={`/profile/${author.username}`} className="group focus:outline-none">
            <h4 className="text-sm font-semibold text-zinc-900 group-hover:text-brand-700 transition-colors truncate">
              {author.name}
            </h4>
          </Link>
          <p className="text-xs text-zinc-450 text-zinc-500 line-clamp-2 mt-0.5 leading-relaxed">
            {author.bio}
          </p>
          <span className="text-[10px] text-zinc-450 text-zinc-400 mt-1 block">
            {author.followers.toLocaleString()} followers
          </span>
        </div>
      </div>

      <FollowButton authorId={author.id} className="flex-shrink-0 mt-0.5" />
    </div>
  );
};
