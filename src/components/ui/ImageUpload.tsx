'use client'

import React, { useState, useRef } from 'react'
import Button from './Button'

interface ImageUploadProps {
  onImageSelect: (imageUrl: string) => void
  currentImage?: string
}

export default function ImageUpload({ onImageSelect, currentImage }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [preview, setPreview] = useState<string | null>(currentImage || null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      handleFile(file)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFile(file)
    }
  }

  const handleFile = async (file: File) => {
    try {
      setIsUploading(true)
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Erreur lors du téléchargement')
      }

      const data = await response.json()
      setPreview(data.url)
      onImageSelect(data.url)
    } catch (error) {
      console.error('Erreur:', error)
      alert('Une erreur est survenue lors du téléchargement de l\'image')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
          isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-gray-400'
        } ${isUploading ? 'opacity-50 cursor-wait' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept="image/*"
          className="hidden"
          disabled={isUploading}
        />
        <div className="space-y-2">
          <div className="flex justify-center">
            {isUploading ? (
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500" />
            ) : (
              <svg
                className="w-12 h-12 text-gray-400"
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
            )}
          </div>
          <p className="text-sm text-gray-600">
            {isUploading
              ? 'Téléchargement en cours...'
              : 'Glissez-déposez une image ici ou cliquez pour en sélectionner une'}
          </p>
        </div>
      </div>

      {preview && (
        <div className="relative">
          <img
            src={preview}
            alt="Aperçu"
            className="w-full h-48 object-cover rounded-lg"
          />
          <Button
            variant="secondary"
            size="sm"
            className="absolute top-2 right-2"
            onClick={() => {
              setPreview(null)
              onImageSelect('')
              if (fileInputRef.current) {
                fileInputRef.current.value = ''
              }
            }}
            disabled={isUploading}
          >
            Supprimer
          </Button>
        </div>
      )}
    </div>
  )
} 