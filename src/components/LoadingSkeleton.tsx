import React from 'react';

export const LoadingSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <div className="space-y-6 w-full">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="py-6 flex flex-col md:flex-row justify-between border-b border-zinc-100 animate-pulse">
          <div className="flex-1 pr-0 md:pr-8 space-y-3">
            {/* Author Line */}
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 rounded-full bg-zinc-200" />
              <div className="w-24 h-3 bg-zinc-200 rounded" />
              <div className="w-16 h-3 bg-zinc-100 rounded" />
            </div>
            
            {/* Title */}
            <div className="w-3/4 h-5 bg-zinc-200 rounded" />
            
            {/* Subtitle */}
            <div className="space-y-2">
              <div className="w-full h-3.5 bg-zinc-150 bg-zinc-200/60 rounded" />
              <div className="w-5/6 h-3.5 bg-zinc-150 bg-zinc-200/60 rounded" />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex space-x-2">
                <div className="w-16 h-5 bg-zinc-100 rounded-full" />
                <div className="w-12 h-3 bg-zinc-100 rounded self-center" />
              </div>
              <div className="flex space-x-2">
                <div className="w-8 h-4 bg-zinc-100 rounded" />
                <div className="w-8 h-4 bg-zinc-100 rounded" />
              </div>
            </div>
          </div>
          
          {/* Cover image placeholder */}
          <div className="mt-4 md:mt-0 w-full md:w-36 h-40 md:h-24 bg-zinc-200 rounded-lg flex-shrink-0 order-first md:order-last mb-4 md:mb-0" />
        </div>
      ))}
    </div>
  );
};
