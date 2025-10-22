import React, { useState } from 'react'
import { ImageOff } from 'lucide-react'

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string
}

const SafeImage: React.FC<SafeImageProps> = ({ src, alt, className, fallbackSrc }) => {
  const [hasError, setHasError] = useState(false)

  const shouldShowFallback = !src || hasError || src.trim() === '' || src === 'null' || src === 'undefined'

  if (shouldShowFallback) {
    if (fallbackSrc) {
      return <img src={fallbackSrc} alt={alt} className={className} />
    }

    return (
      <div className={`flex items-center justify-center bg-gray-100 text-gray-400 ${className}`}>
        <ImageOff size={32} />
      </div>
    )
  }

  return <img src={src} alt={alt} className={className} onError={() => setHasError(true)} />
}

export default SafeImage
