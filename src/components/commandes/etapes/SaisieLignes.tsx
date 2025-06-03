'use client'

import React, { useState, useEffect } from 'react'
import type { Produit, LigneCommande, Client } from '@/types/commande'
import Image from 'next/image'

interface SaisieLignesProps {
  produits: Produit[]
  lignesCommande: LigneCommande[]
  client?: Client
  onLignesUpdate: (lignes: LigneCommande[]) => void
}

export default function SaisieLignes({ 
  produits, 
  lignesCommande, 
  client,
  onLignesUpdate 
}: SaisieLignesProps) {
  const [lignes, setLignes] = useState<LigneCommande[]>(
    lignesCommande.length > 0
      ? lignesCommande
      : produits.map(p => ({
          produitId: p.id,
          quantite: 0,
          prixUnitaire: p.prix,
          remise: client?.conditionsCommerciales?.remiseFixe || 0,
          sousTotal: 0
        }))
  )

  const calculerRemise = (quantite: number): number => {
    // Si pas de client, pas de remise
    if (!client) return 0

    let remise = client.conditionsCommerciales.remiseFixe || 0
    
    // Appliquer la remise volume si elle existe et si la quantité est suffisante
    if (client.conditionsCommerciales.remiseVolume && quantite >= 10) {
      remise += client.conditionsCommerciales.remiseVolume
    }
    
    return remise
  }

  const updateLigne = (index: number, quantite: number) => {
    const produit = produits.find(p => p.id === lignes[index].produitId)
    if (!produit) return

    setLignes(prev => {
      const newLignes = [...prev]
      const ligne = newLignes[index]
      ligne.quantite = quantite
      ligne.remise = calculerRemise(quantite)
      ligne.sousTotal = (produit.prix * quantite) * (1 - ligne.remise / 100)
      return newLignes
    })
  }

  const total = lignes.reduce((sum, ligne) => sum + ligne.sousTotal, 0)
  const hasValidLines = lignes.some(ligne => ligne.quantite > 0)

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold mb-4">Saisie des quantités</h2>

      <div className="space-y-4">
        {lignes.map((ligne, index) => {
          const produit = produits.find(p => p.id === ligne.produitId)
          if (!produit) return null

          return (
            <div
              key={ligne.produitId}
              className="flex items-center gap-4 p-4 border rounded-lg"
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
                <h3 className="font-medium">{produit.nom}</h3>
                <p className="text-sm text-gray-600">{produit.prix.toFixed(2)}€</p>
                {ligne.remise > 0 && (
                  <p className="text-sm text-indigo-600">
                    Remise appliquée : {ligne.remise}%
                  </p>
                )}
              </div>

              <div className="flex items-center gap-4">
                <div className="w-32">
                  <label className="block text-sm text-gray-600 mb-1">
                    Quantité
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={ligne.quantite}
                    onChange={(e) => updateLigne(index, Number(e.target.value))}
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div className="w-32 text-right">
                  <label className="block text-sm text-gray-600 mb-1">
                    Sous-total
                  </label>
                  <span className="font-medium">
                    {ligne.sousTotal.toFixed(2)}€
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex justify-between items-center">
        <div className="text-lg">
          Total: <span className="font-bold">{total.toFixed(2)}€</span>
        </div>
        <button
          onClick={() => onLignesUpdate(lignes.filter(l => l.quantite > 0))}
          disabled={!hasValidLines}
          className={`px-6 py-2 rounded-lg font-medium
            ${!hasValidLines
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
        >
          Suivant
        </button>
      </div>
    </div>
  )
} 