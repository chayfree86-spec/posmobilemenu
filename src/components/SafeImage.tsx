import React, { useState } from 'react';
import { Coffee, UtensilsCrossed, Sparkles } from 'lucide-react';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackType?: 'food' | 'drink' | 'general';
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  className,
  fallbackType = 'food',
  ...props
}) => {
  const [hasError, setHasError] = useState(false);

  const handleOnError = () => {
    setHasError(true);
  };

  if (hasError || !src) {
    return (
      <div className={`flex flex-col items-center justify-center bg-[#FAF6F0] border border-[#EFECE6] text-[#C27A3F] ${className}`}>
        {fallbackType === 'drink' ? (
          <Coffee className="w-6 h-6 stroke-[1.8] opacity-80 animate-pulse" />
        ) : fallbackType === 'food' ? (
          <UtensilsCrossed className="w-6 h-6 stroke-[1.8] opacity-80 animate-pulse" />
        ) : (
          <Sparkles className="w-6 h-6 stroke-[1.8] opacity-80 animate-pulse" />
        )}
        <span className="text-[8px] font-bold text-[#8E8075] mt-1.5 px-2 text-center truncate w-full uppercase">
          {alt || 'Artisan Selection'}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={handleOnError}
      {...props}
    />
  );
};
