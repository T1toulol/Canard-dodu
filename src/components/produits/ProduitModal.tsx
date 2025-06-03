import React, { useState, useEffect } from 'react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import CustomImage from '@/components/ui/Image'
import ImageUpload from '@/components/ui/ImageUpload'

interface ProduitModalProps {
  produit?: {
    id: string
    nom: string
    description: string
    prix: number
    image?: string
  }
  onClose: () => void
  onSave: (produitData: { nom: string; description: string; prix: number; image?: string }) => void
}

// Images par défaut pour les différents types de produits
const DEFAULT_IMAGES = {
  'foie': 'https://images.unsplash.com/photo-1625943553852-781c6dd46faa?auto=format&fit=crop&w=800&q=80',
  'canard': 'https://images.unsplash.com/photo-1572097662444-9f9f0827a134?auto=format&fit=crop&w=800&q=80',
  'magret': 'https://images.unsplash.com/photo-1544025162-c2fdfd67bc86?auto=format&fit=crop&w=800&q=80',
  'confit': 'https://images.unsplash.com/photo-1518492104633-130d0cc84637?auto=format&fit=crop&w=800&q=80'
}

export default function ProduitModal({ produit, onClose, onSave }: ProduitModalProps) {
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    prix: '',
    image: ''
  })

  // Trouve l'image par défaut en fonction du nom du produit
  const findDefaultImage = (nom: string) => {
    const nomLower = nom.toLowerCase()
    return Object.entries(DEFAULT_IMAGES).find(([key]) => nomLower.includes(key))?.[1]
  }

  useEffect(() => {
    if (produit) {
      setFormData({
        nom: produit.nom,
        description: produit.description,
        prix: produit.prix.toString(),
        image: produit.image || ''
      })
    }
  }, [produit])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Si aucune image n'est spécifiée, on cherche une image par défaut
    const defaultImage = !formData.image ? findDefaultImage(formData.nom) : undefined
    onSave({
      nom: formData.nom,
      description: formData.description,
      prix: parseFloat(formData.prix),
      image: formData.image || defaultImage
    })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => {
      // Si on change le nom et qu'il n'y a pas d'image, on cherche une image par défaut
      if (name === 'nom' && !prev.image) {
        const defaultImage = findDefaultImage(value)
        if (defaultImage) {
          return { ...prev, [name]: value, image: defaultImage }
        }
      }
      return { ...prev, [name]: value }
    })
  }

  const handleImageSelect = (imageUrl: string) => {
    setFormData(prev => ({ ...prev, image: imageUrl }))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {produit ? 'Modifier le produit' : 'Nouveau produit'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Nom"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              required
            />
            
            <Input
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
            
            <Input
              label="Prix (€)"
              name="prix"
              type="number"
              step="0.01"
              min="0"
              value={formData.prix}
              onChange={handleChange}
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image
              </label>
              <ImageUpload
                onImageSelect={handleImageSelect}
                currentImage={formData.image}
              />
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <Button variant="outline" type="button" onClick={onClose}>
                Annuler
              </Button>
              <Button type="submit">
                {produit ? 'Enregistrer' : 'Créer'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
} 