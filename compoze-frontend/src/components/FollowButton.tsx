import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

interface FollowButtonProps {
  authorId: string;
  className?: string;
}

export const FollowButton: React.FC<FollowButtonProps> = ({ authorId, className = '' }) => {
  const { follows, toggleFollow, currentUser, showToast } = useApp();
  const [hovered, setHovered] = useState(false);

  // Users cannot follow themselves
  if (authorId === currentUser.id) return null;

  const isFollowing = follows.includes(authorId);

  const handleFollow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFollow(authorId);
    showToast(
      isFollowing ? 'Unfollowed author' : 'Following author', 
      'success'
    );
  };

  return (
    <button
      onClick={handleFollow}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`px-3 py-1 text-xs font-semibold rounded-full transition-all duration-200 focus:outline-none ${
        isFollowing
          ? hovered
            ? 'bg-red-50 border border-red-200 text-red-600 hover:bg-red-100/50'
            : 'bg-zinc-100 text-zinc-700 border border-zinc-200'
          : 'bg-brand-700 hover:bg-brand-800 text-white'
      } ${className}`}
    >
      {isFollowing ? (hovered ? 'Unfollow' : 'Following') : 'Follow'}
    </button>
  );
};
