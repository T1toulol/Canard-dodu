'use client'

import React, { useState } from 'react'
import type { CommandeEnCours } from '@/types/commande'

interface ValidationFinaleProps {
  commandeEnCours: CommandeEnCours
  onValidation: () => void
}

export default function ValidationFinale({
  commandeEnCours,
  onValidation
}: ValidationFinaleProps) {
  const [isConfirming, setIsConfirming] = useState(false)
  const [isValidating, setIsValidating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleValidation = async () => {
    try {
      setIsValidating(true)
      setError(null)
      await onValidation()
    } catch (error) {
      setError('Erreur lors de la validation de la commande')
      setIsConfirming(false)
    } finally {
      setIsValidating(false)
    }
  }

  if (!commandeEnCours.client || !commandeEnCours.agence || commandeEnCours.lignesCommande.length === 0) {
    return (
      <div className="text-center text-red-600 p-4">
        <p>Données de commande incomplètes</p>
      </div>
    )
  }

  const total = commandeEnCours.lignesCommande.reduce((sum, ligne) => sum + ligne.sousTotal, 0)

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Confirmation de la commande</h2>
        <p className="mt-2 text-gray-600">
          Veuillez vérifier une dernière fois les informations avant de valider définitivement la commande
        </p>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-green-800 mb-4">
          Résumé de la commande
        </h3>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-green-700">Client</p>
            <p className="font-medium">{commandeEnCours.client.nom}</p>
          </div>

          <div>
            <p className="text-sm text-green-700">Agence de livraison</p>
            <p className="font-medium">{commandeEnCours.agence.nom}</p>
          </div>

          <div>
            <p className="text-sm text-green-700">Nombre de produits</p>
            <p className="font-medium">{commandeEnCours.lignesCommande.length} produit(s)</p>
          </div>

          <div>
            <p className="text-sm text-green-700">Total de la commande</p>
            <p className="font-medium text-lg">
              {total.toFixed(2)}€
            </p>
          </div>

          {commandeEnCours.instructions && (
            <div>
              <p className="text-sm text-green-700">Instructions de livraison</p>
              <p className="font-medium">
                {commandeEnCours.instructions}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-yellow-800 mb-4">
          Points de vérification
        </h3>

        <ul className="space-y-2">
          <li className="flex items-start gap-2">
            <svg
              className="w-5 h-5 text-yellow-600 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span className="text-yellow-800">
              Cette action est irréversible. Une fois validée, la commande sera transmise à l'agence logistique.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <svg
              className="w-5 h-5 text-yellow-600 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span className="text-yellow-800">
              Les stocks seront automatiquement mis à jour dans l'agence sélectionnée.
            </span>
          </li>
        </ul>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
        <div className="max-w-4xl mx-auto">
          {error && (
            <div className="mb-4 text-center text-red-600">
              {error}
            </div>
          )}

          {!isConfirming ? (
            <button
              onClick={() => setIsConfirming(true)}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700"
            >
              Valider définitivement la commande
            </button>
          ) : (
            <div className="w-full space-y-4">
              <p className="text-center text-gray-600">
                Êtes-vous sûr de vouloir valider cette commande ?
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setIsConfirming(false)}
                  disabled={isValidating}
                  className={`px-6 py-2 border border-gray-300 rounded-lg font-medium
                    ${isValidating
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:bg-gray-50'
                    }`}
                >
                  Annuler
                </button>
                <button
                  onClick={handleValidation}
                  disabled={isValidating}
                  className={`px-6 py-2 bg-green-600 text-white rounded-lg font-medium
                    ${isValidating
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:bg-green-700'
                    }`}
                >
                  {isValidating ? 'Validation en cours...' : 'Confirmer'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 