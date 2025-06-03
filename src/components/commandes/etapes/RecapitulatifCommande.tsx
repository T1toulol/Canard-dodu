'use client'

import React, { useState, useEffect } from 'react'
import type { CommandeEnCours, Commande } from '@/types/commande'
import Image from 'next/image'

interface RecapitulatifCommandeProps {
  commandeEnCours: CommandeEnCours
  onModification: (commande: Commande) => void
  onValidation: () => void
}

export default function RecapitulatifCommande({
  commandeEnCours,
  onModification,
  onValidation
}: RecapitulatifCommandeProps) {
  const [produits, setProduits] = useState<{ [key: string]: any }>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [instructions, setInstructions] = useState('')

  useEffect(() => {
    const fetchProduits = async () => {
      try {
        const response = await fetch('/api/produits')
        if (!response.ok) throw new Error('Erreur lors du chargement des produits')
        const data = await response.json()
        const produitsMap = data.reduce((acc: any, produit: any) => {
          acc[produit.id] = produit
          return acc
        }, {})
        setProduits(produitsMap)
      } catch (error) {
        setError('Impossible de charger les détails des produits')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProduits()
  }, [])

  const handleValidation = () => {
    if (!commandeEnCours.client || !commandeEnCours.agence) return

    const commande: Commande = {
      id: '', // Sera généré par le serveur
      clientId: commandeEnCours.client.id,
      agenceId: commandeEnCours.agence.id,
      date: new Date().toISOString(),
      lignes: commandeEnCours.lignesCommande,
      remiseGlobale: 0, // À implémenter si nécessaire
      total: commandeEnCours.lignesCommande.reduce((sum, ligne) => sum + ligne.sousTotal, 0),
      statut: 'en_cours',
      conditionsLivraison: instructions.trim() ? {
        instructions: instructions.trim()
      } : undefined
    }

    onModification(commande)
    onValidation()
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

  if (!commandeEnCours.client || !commandeEnCours.agence) {
    return (
      <div className="text-center text-red-600 p-4">
        <p>Données de commande incomplètes</p>
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-20">
      {/* Client */}
      <section>
        <h3 className="text-lg font-semibold mb-4">Informations client</h3>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="font-medium">{commandeEnCours.client.nom}</p>
          <p className="text-sm text-gray-600">{commandeEnCours.client.email}</p>
          <p className="text-sm text-gray-600">{commandeEnCours.client.adresse}</p>
          {commandeEnCours.client.conditionsCommerciales.remiseFixe && (
            <p className="text-sm text-indigo-600 mt-2">
              Remise client: {commandeEnCours.client.conditionsCommerciales.remiseFixe}%
            </p>
          )}
        </div>
      </section>

      {/* Agence */}
      <section>
        <h3 className="text-lg font-semibold mb-4">Agence logistique</h3>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="font-medium">{commandeEnCours.agence.nom}</p>
          <p className="text-sm text-gray-600">{commandeEnCours.agence.adresse}</p>
          <p className="text-sm text-gray-600">Zone: {commandeEnCours.agence.zoneGeographique}</p>
        </div>
      </section>

      {/* Produits */}
      <section>
        <h3 className="text-lg font-semibold mb-4">Produits commandés</h3>
        <div className="space-y-4">
          {commandeEnCours.lignesCommande.map((ligne) => {
            const produit = produits[ligne.produitId]
            if (!produit) return null

            return (
              <div
                key={ligne.produitId}
                className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
              >
                {produit.image && (
                  <div className="relative w-16 h-16 flex-shrink-0">
                    <Image
                      src={produit.image}
                      alt={produit.nom}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                )}

                <div className="flex-grow">
                  <h4 className="font-medium">{produit.nom}</h4>
                  <p className="text-sm text-gray-600">
                    {ligne.quantite} x {produit.prix.toFixed(2)}€
                    {ligne.remise > 0 && ` (-${ligne.remise}%)`}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-medium">{ligne.sousTotal.toFixed(2)}€</p>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-4 text-right">
          <p className="text-lg font-bold">
            Total: {commandeEnCours.lignesCommande.reduce((sum, ligne) => sum + ligne.sousTotal, 0).toFixed(2)}€
          </p>
        </div>
      </section>

      {/* Livraison */}
      <section>
        <h3 className="text-lg font-semibold mb-4">Instructions de livraison</h3>
        <div>
          <textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            className="w-full p-2 border rounded-lg"
            rows={3}
            placeholder="Instructions particulières pour la livraison..."
          />
        </div>
      </section>

      {/* Bouton de validation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={handleValidation}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700"
          >
            Passer à la validation finale
          </button>
        </div>
      </div>
    </div>
  )
} 