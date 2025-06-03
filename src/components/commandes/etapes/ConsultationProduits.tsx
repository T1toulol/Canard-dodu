'use client'

import React, { useState, useEffect } from 'react'
import type { Produit } from '@/types/commande'
import Image from 'next/image'

interface ConsultationProduitsProps {
  agenceId?: string
  onProduitSelect: (produits: Produit[]) => void
}

export default function ConsultationProduits({ agenceId, onProduitSelect }: ConsultationProduitsProps) {
  const [produits, setProduits] = useState<Produit[]>([])
  const [filteredProduits, setFilteredProduits] = useState<Produit[]>([])
  const [selectedProduits, setSelectedProduits] = useState<Produit[]>([])
  const [agenceRattachement, setAgenceRattachement] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategorie, setSelectedCategorie] = useState<string>('all')
  const [categories, setCategories] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [produitsRes, agenceRes] = await Promise.all([
          fetch('/api/produits'),
          fetch('/api/agences/rattachement')
        ])

        if (!produitsRes.ok) throw new Error('Erreur lors du chargement des produits')
        if (!agenceRes.ok) throw new Error('Erreur lors du chargement de l\'agence')

        const produitsData = await produitsRes.json()
        const { agenceId: defaultAgenceId } = await agenceRes.json()

        setProduits(produitsData)
        setFilteredProduits(produitsData)
        setAgenceRattachement(defaultAgenceId)
        
        // Extraire les catégories uniques
        const uniqueCategories = Array.from(new Set(produitsData.map((p: Produit) => p.categorie)))
        setCategories(uniqueCategories as string[])
      } catch (error) {
        setError('Impossible de charger les données')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    let filtered = produits

    // Filtrer par catégorie
    if (selectedCategorie !== 'all') {
      filtered = filtered.filter(p => p.categorie === selectedCategorie)
    }

    // Filtrer par recherche
    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filtrer par stock disponible selon l'agence
    const currentAgenceId = agenceId || agenceRattachement
    if (currentAgenceId) {
      filtered = filtered.filter(p => p.stock[currentAgenceId] > 0)
    }

    setFilteredProduits(filtered)
  }, [searchTerm, selectedCategorie, produits, agenceId, agenceRattachement])

  const toggleProduitSelection = (produit: Produit) => {
    setSelectedProduits(prev => {
      const isSelected = prev.some(p => p.id === produit.id)
      if (isSelected) {
        return prev.filter(p => p.id !== produit.id)
      } else {
        return [...prev, produit]
      }
    })
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Réessayer
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Rechercher un produit..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg pl-10"
          />
          <svg
            className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <select
          value={selectedCategorie}
          onChange={(e) => setSelectedCategorie(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg bg-white"
        >
          <option value="all">Toutes les catégories</option>
          {categories.map(categorie => (
            <option key={categorie} value={categorie}>
              {categorie}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProduits.map((produit) => {
          const isSelected = selectedProduits.some(p => p.id === produit.id)
          const stockDisponible = agenceId ? produit.stock[agenceId] : null

          return (
            <div
              key={produit.id}
              className={`border rounded-lg overflow-hidden cursor-pointer transition-all
                ${isSelected ? 'border-indigo-600 ring-2 ring-indigo-600' : 'hover:border-indigo-600'}`}
              onClick={() => toggleProduitSelection(produit)}
            >
              {produit.image && (
                <div className="relative h-48 bg-gray-100">
                  <Image
                    src={produit.image}
                    alt={produit.nom}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-4">
                <h3 className="font-medium text-lg">{produit.nom}</h3>
                <p className="text-sm text-gray-600 mt-1">{produit.description}</p>
                <div className="mt-2 flex justify-between items-center">
                  <span className="font-semibold text-lg">
                    {produit.prix.toFixed(2)}€
                  </span>
                  {stockDisponible !== null && (
                    <span className={`text-sm ${stockDisponible > 10 ? 'text-green-600' : 'text-orange-600'}`}>
                      Stock: {stockDisponible}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {filteredProduits.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          Aucun produit ne correspond à votre recherche
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex justify-between items-center">
        <div>
          <span className="font-medium">{selectedProduits.length}</span> produit(s) sélectionné(s)
        </div>
        <button
          onClick={() => onProduitSelect(selectedProduits)}
          disabled={selectedProduits.length === 0}
          className={`px-6 py-2 rounded-lg font-medium
            ${selectedProduits.length === 0
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
        >
          Continuer
        </button>
      </div>
    </div>
  )
} 