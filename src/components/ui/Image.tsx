'use client'

import React, { useState } from 'react'
import Image from 'next/image'

interface CustomImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
}

const DEFAULT_IMAGE = '/images/produits/default.jpg'

export default function CustomImage({ src, alt, width = 300, height = 200, className = '', priority = false }: CustomImageProps) {
  const [error, setError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const handleError = () => {
    setError(true)
    setIsLoading(false)
  }

  const handleLoad = () => {
    setIsLoading(false)
  }

  if (error) {
    return (
      <div className={`bg-gray-100 flex items-center justify-center ${className}`} style={{ width, height }}>
        <div className="text-center">
          <svg
            className="w-12 h-12 text-gray-400 mx-auto mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span className="text-gray-400 text-sm">Image non disponible</span>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500" />
        </div>
      )}
      <div className="relative w-full h-full">
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          style={{ 
            objectFit: 'cover',
            width: '100%',
            height: '100%'
          }}
          className={`rounded-lg transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          onError={handleError}
          onLoadingComplete={handleLoad}
          priority={priority}
          loading={priority ? 'eager' : 'lazy'}
        />
      </div>
    </div>
  )
} 