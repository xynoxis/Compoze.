import React from 'react';
import { Link } from 'react-router-dom';

interface TopicPillProps {
  topic: string;
}

export const TopicPill: React.FC<TopicPillProps> = ({ topic }) => {
  return (
    <Link
      to={`/topics/${encodeURIComponent(topic.toLowerCase())}`}
      className="inline-block px-3 py-1.5 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-xs font-medium text-zinc-700 hover:text-zinc-900 rounded-full transition-all duration-200"
    >
      {topic}
    </Link>
  );
};
