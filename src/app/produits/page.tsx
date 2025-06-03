'use client'

import React, { useState, useEffect } from 'react'
import Button from '@/components/ui/Button'
import ProduitModal from '@/components/produits/ProduitModal'
import CustomImage from '@/components/ui/Image'

interface Produit {
  id: string
  nom: string
  description: string
  prix: number
  image?: string
}

export default function ProduitsPage() {
  const [produits, setProduits] = useState<Produit[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedProduit, setSelectedProduit] = useState<Produit | undefined>()

  useEffect(() => {
    fetchProduits()
  }, [])

  const fetchProduits = async () => {
    try {
      const response = await fetch('/api/produits')
      const data = await response.json()
      setProduits(data)
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error)
    }
  }

  const handleSaveProduit = async (produitData: Omit<Produit, 'id'>) => {
    try {
      const method = selectedProduit ? 'PUT' : 'POST'
      const url = selectedProduit ? `/api/produits/${selectedProduit.id}` : '/api/produits'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(produitData),
      })

      if (!response.ok) throw new Error('Erreur lors de la sauvegarde')

      fetchProduits()
      handleCloseModal()
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du produit:', error)
    }
  }

  const handleDeleteProduit = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) return

    try {
      const response = await fetch(`/api/produits/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Erreur lors de la suppression')

      fetchProduits()
    } catch (error) {
      console.error('Erreur lors de la suppression du produit:', error)
    }
  }

  const handleEditProduit = (produit: Produit) => {
    setSelectedProduit(produit)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setSelectedProduit(undefined)
    setIsModalOpen(false)
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Produits</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          Ajouter un produit
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {produits.map((produit) => (
          <div key={produit.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            {produit.image ? (
              <CustomImage
                src={produit.image}
                alt={produit.nom}
                width={400}
                height={300}
                className="w-full"
                priority
              />
            ) : (
              <div className="bg-gray-100 w-full h-[300px] flex items-center justify-center">
                <span className="text-gray-400">Pas d'image</span>
              </div>
            )}
            
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{produit.nom}</h2>
                  <p className="text-2xl font-bold text-indigo-600 mt-1">
                    {produit.prix.toFixed(2)}€
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleEditProduit(produit)}
                  >
                    Modifier
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteProduit(produit.id)}
                  >
                    Supprimer
                  </Button>
                </div>
              </div>
              <p className="text-gray-600">{produit.description}</p>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <ProduitModal
          produit={selectedProduit}
          onClose={handleCloseModal}
          onSave={handleSaveProduit}
        />
      )}
    </div>
  )
} 