import React, { useState } from 'react';
import { Download, Image as ImageIcon, Sparkles, Check } from 'lucide-react';

interface ImageWithLoaderProps {
  src: string;
  alt: string;
  className?: string;
  allowDownload?: boolean;
  aspectRatio?: string;
}

export const ImageWithLoader: React.FC<ImageWithLoaderProps> = ({
  src,
  alt,
  className = '',
  allowDownload = true,
  aspectRatio = 'aspect-video'
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  // Fallback high quality SVG Data URL generator for local persistent rendering
  const generateFallbackSvg = () => {
    const titleText = alt || 'Tour Destination';
    const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0f172a" />
          <stop offset="50%" stop-color="#1e293b" />
          <stop offset="100%" stop-color="#0891b2" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#bg)" />
      <circle cx="400" cy="180" r="70" fill="#06b6d4" opacity="0.15" />
      <text x="50%" y="45%" dominant-baseline="middle" text-anchor="middle" fill="#ffffff" font-family="sans-serif" font-size="28" font-weight="bold">${titleText}</text>
      <text x="50%" y="58%" dominant-baseline="middle" text-anchor="middle" fill="#38bdf8" font-family="sans-serif" font-size="16">Holiday Travelers Travel & Tours Inc Asset</text>
    </svg>`;
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString)}`;
  };

  const handleDownloadImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    const imageToDownload = isError ? generateFallbackSvg() : src;
    
    // Create temporary download link
    const link = document.createElement('a');
    link.href = imageToDownload;
    link.download = `${alt.toLowerCase().replace(/[^a-z0-9]/g, '_')}_photo.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  return (
    <div className={`relative overflow-hidden bg-slate-900 group ${aspectRatio} ${className}`}>
      {/* Skeleton Shimmer overlay during image loading */}
      {isLoading && (
        <div className="absolute inset-0 bg-slate-800 animate-pulse flex items-center justify-center z-10">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-mono">
            <ImageIcon className="w-4 h-4 animate-spin text-cyan-400" />
            <span>Loading photo...</span>
          </div>
        </div>
      )}

      {/* Actual Image Element */}
      <img
        src={isError ? generateFallbackSvg() : src}
        alt={alt || 'Holiday Archipelago expedition destination'}
        loading="lazy"
        referrerPolicy="no-referrer"
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setIsError(true);
        }}
        className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
      />

      {/* Save / Download Photo Quick Button Overlay */}
      {allowDownload && !isLoading && (
        <button
          onClick={handleDownloadImage}
          title="Save Photo to Device"
          className="absolute top-3 right-3 z-20 px-2.5 py-1.5 bg-slate-950/80 hover:bg-slate-900 text-slate-200 text-[11px] font-semibold rounded-lg border border-slate-700/80 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center gap-1.5 shadow-lg"
        >
          {downloaded ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Saved!</span>
            </>
          ) : (
            <>
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Save Photo</span>
            </>
          )}
        </button>
      )}
    </div>
  );
};
