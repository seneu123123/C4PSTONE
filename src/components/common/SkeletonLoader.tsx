import React from 'react';

interface SkeletonProps {
  type?: 'card' | 'table' | 'banner' | 'metrics' | 'list';
  count?: number;
}

export const SkeletonLoader: React.FC<SkeletonProps> = ({ type = 'card', count = 3 }) => {
  if (type === 'banner') {
    return (
      <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl animate-pulse space-y-4">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <div className="h-4 w-28 bg-slate-800 rounded-lg" />
            <div className="h-7 w-80 bg-slate-800 rounded-xl" />
            <div className="h-3.5 w-96 bg-slate-800/80 rounded-lg" />
          </div>
          <div className="h-10 w-36 bg-slate-800 rounded-xl" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-800">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 bg-slate-950 rounded-xl p-3 border border-slate-800/60" />
          ))}
        </div>
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 animate-pulse">
        <div className="h-6 w-48 bg-slate-800 rounded-lg mb-4" />
        <div className="space-y-3">
          {Array.from({ length: count }).map((_, idx) => (
            <div key={idx} className="h-12 bg-slate-950 rounded-xl border border-slate-800/60" />
          ))}
        </div>
      </div>
    );
  }

  if (type === 'metrics') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="h-3 w-24 bg-slate-800 rounded-md" />
            <div className="h-8 w-32 bg-slate-800 rounded-lg" />
            <div className="h-3 w-20 bg-slate-800/60 rounded-md" />
          </div>
        ))}
      </div>
    );
  }

  // Default: Card Grid Skeleton
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl space-y-4">
          <div className="h-48 bg-slate-800/80 w-full relative">
            <div className="absolute top-3 left-3 h-5 w-20 bg-slate-700/60 rounded-full" />
            <div className="absolute bottom-3 right-3 h-6 w-24 bg-slate-700/80 rounded-lg" />
          </div>
          <div className="p-5 space-y-3">
            <div className="h-5 w-3/4 bg-slate-800 rounded-lg" />
            <div className="h-3 w-1/2 bg-slate-800/70 rounded-md" />
            <div className="h-10 w-full bg-slate-950 rounded-xl border border-slate-800/80" />
            <div className="pt-3 border-t border-slate-800/80 flex justify-between items-center">
              <div className="h-6 w-24 bg-slate-800 rounded-lg" />
              <div className="h-8 w-28 bg-slate-800 rounded-xl" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
