'use client'

import React, { useState, useEffect } from 'react'
import type { Client, LigneCommande, Agence } from '@/types/commande'

interface AffectationAgenceProps {
  client: Client
  lignesCommande: LigneCommande[]
  onAgenceSelect: (agence: Agence) => void
}

export default function AffectationAgence({
  client,
  lignesCommande,
  onAgenceSelect
}: AffectationAgenceProps) {
  const [agences, setAgences] = useState<Agence[]>([])
  const [agencesSuggested, setAgencesSuggested] = useState<Agence[]>([])
  const [selectedAgence, setSelectedAgence] = useState<Agence | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAgences = async () => {
      try {
        const response = await fetch('/api/agences')
        if (!response.ok) throw new Error('Erreur lors du chargement des agences')
        const data = await response.json()
        setAgences(data)
        
        // Filtrer les agences qui ont le stock nécessaire
        const agencesAvecStock = data.filter((agence: Agence) => {
          return lignesCommande.every(ligne => {
            const stockDisponible = agence.stockDisponible[ligne.produitId] || 0
            return stockDisponible >= ligne.quantite
          })
        })

        // Trier par proximité géographique avec le client
        const agencesTriees = agencesAvecStock.sort((a: Agence, b: Agence) => {
          if (a.zoneGeographique === client.zoneGeographique) return -1
          if (b.zoneGeographique === client.zoneGeographique) return 1
          return 0
        })

        setAgencesSuggested(agencesTriees)
        if (agencesTriees.length > 0) {
          setSelectedAgence(agencesTriees[0])
        }
      } catch (error) {
        setError('Impossible de charger la liste des agences')
      } finally {
        setIsLoading(false)
      }
    }

    fetchAgences()
  }, [client.zoneGeographique, lignesCommande])

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

  if (agencesSuggested.length === 0) {
    return (
      <div className="text-center text-red-600 p-4">
        <p>Aucune agence ne dispose du stock nécessaire pour cette commande.</p>
        <p className="mt-2 text-sm text-gray-600">
          Veuillez modifier les quantités ou contacter le service commercial.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-4">Affectation de l'agence logistique</h2>
        <p className="text-sm text-gray-600">
          L'agence la plus proche de la zone géographique du client ({client.zoneGeographique}) 
          avec le stock disponible a été automatiquement sélectionnée.
        </p>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        {agencesSuggested.map((agence) => (
          <div
            key={agence.id}
            className={`border rounded-lg p-4 cursor-pointer transition-colors
              ${selectedAgence?.id === agence.id
                ? 'border-indigo-600 ring-2 ring-indigo-600'
                : 'hover:border-indigo-600'
              }`}
            onClick={() => setSelectedAgence(agence)}
          >
            <h3 className="font-medium">{agence.nom}</h3>
            <p className="text-sm text-gray-600 mt-1">{agence.adresse}</p>
            <p className="text-sm text-gray-600">Zone: {agence.zoneGeographique}</p>
            
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Stock disponible:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                {lignesCommande.map(ligne => (
                  <li key={ligne.produitId} className="flex justify-between">
                    <span>Produit #{ligne.produitId}:</span>
                    <span className={agence.stockDisponible[ligne.produitId] >= ligne.quantite
                      ? 'text-green-600'
                      : 'text-red-600'
                    }>
                      {agence.stockDisponible[ligne.produitId] || 0}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex justify-between items-center">
        <div>
          {selectedAgence && (
            <p className="text-sm text-gray-600">
              Agence sélectionnée: <span className="font-medium">{selectedAgence.nom}</span>
            </p>
          )}
        </div>
        <button
          onClick={() => selectedAgence && onAgenceSelect(selectedAgence)}
          disabled={!selectedAgence}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700"
        >
          Continuer
        </button>
      </div>
    </div>
  )
} 