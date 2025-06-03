'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { Client, Produit, Agence, LigneCommande, CommandeEnCours } from '@/types/commande'

// Composants d'étapes
import SelectionClient from '@/components/commandes/etapes/SelectionClient'
import ConsultationProduits from '@/components/commandes/etapes/ConsultationProduits'
import SaisieLignes from '@/components/commandes/etapes/SaisieLignes'
import AffectationAgence from '@/components/commandes/etapes/AffectationAgence'
import RecapitulatifCommande from '@/components/commandes/etapes/RecapitulatifCommande'
import ValidationFinale from '@/components/commandes/etapes/ValidationFinale'

const BROUILLON_KEY = 'commande_brouillon'
const SKIP_AGENCE_AFFECTATION = false // À remplacer par la vérification des droits utilisateur

const etatInitial: CommandeEnCours = {
  etape: 1,
  lignesCommande: [],
  erreurs: []
}

export default function NouvelleCommandePage() {
  const router = useRouter()
  const [commandeEnCours, setCommandeEnCours] = useState<CommandeEnCours>(etatInitial)

  // Nettoyer le localStorage au chargement initial
  useEffect(() => {
    localStorage.removeItem(BROUILLON_KEY)
  }, [])

  // Sauvegarder automatiquement en brouillon
  useEffect(() => {
    if (commandeEnCours.etape > 1 && commandeEnCours.etape < 6) {
      localStorage.setItem(BROUILLON_KEY, JSON.stringify(commandeEnCours))
    }
  }, [commandeEnCours])

  // Restaurer le brouillon si on revient sur la page
  useEffect(() => {
    const saved = localStorage.getItem(BROUILLON_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        // Ne restaurer que si on a au moins un client sélectionné
        if (parsed.client) {
          setCommandeEnCours(parsed)
        }
      } catch (e) {
        console.error('Erreur lors de la lecture du brouillon:', e)
      }
    }
  }, [])

  // Nettoyer le brouillon après validation
  const cleanupBrouillon = () => {
    localStorage.removeItem(BROUILLON_KEY)
    setCommandeEnCours(etatInitial)
  }

  // Gestion de la progression
  const passerEtapeSuivante = () => {
    if (commandeEnCours.etape < 6) {
      const nextEtape = (commandeEnCours.etape + 1) as CommandeEnCours['etape']
      
      // Skip l'étape d'affectation d'agence si l'utilisateur n'a pas les droits
      if (nextEtape === 4 && SKIP_AGENCE_AFFECTATION) {
        // Affecter automatiquement l'agence par défaut
        const agenceParDefaut: Agence = {
          id: 'default',
          nom: 'Agence par défaut',
          adresse: '',
          zone: commandeEnCours.client?.zoneGeographique || '',
          telephone: '',
          email: ''
        }
        setCommandeEnCours(prev => ({
          ...prev,
          agence: agenceParDefaut,
          etape: (nextEtape + 1) as CommandeEnCours['etape']
        }))
        return
      }

      setCommandeEnCours(prev => ({
        ...prev,
        etape: nextEtape
      }))
    }
  }

  const revenirEtapePrecedente = () => {
    if (commandeEnCours.etape > 1) {
      let prevEtape = commandeEnCours.etape - 1
      
      // Skip l'étape d'affectation d'agence si l'utilisateur n'a pas les droits
      if (prevEtape === 4 && SKIP_AGENCE_AFFECTATION) {
        prevEtape--
      }

      setCommandeEnCours(prev => ({
        ...prev,
        etape: prevEtape as CommandeEnCours['etape']
      }))
    }
  }

  // Rendu de l'étape courante
  const renderEtape = () => {
    switch (commandeEnCours.etape) {
      case 1:
        return (
          <SelectionClient
            onClientSelect={(client: Client) => {
              setCommandeEnCours(prev => ({ ...prev, client }))
              passerEtapeSuivante()
            }}
          />
        )
      case 2:
        return (
          <ConsultationProduits
            agenceId={commandeEnCours.agence?.id}
            onProduitSelect={(produits: Produit[]) => {
              setCommandeEnCours(prev => ({ ...prev, produitsFiltres: produits }))
              passerEtapeSuivante()
            }}
          />
        )
      case 3:
        return (
          <SaisieLignes
            produits={commandeEnCours.produitsFiltres || []}
            lignesCommande={commandeEnCours.lignesCommande}
            client={commandeEnCours.client}
            onLignesUpdate={(lignes: LigneCommande[]) => {
              setCommandeEnCours(prev => ({ ...prev, lignesCommande: lignes }))
              passerEtapeSuivante()
            }}
          />
        )
      case 4:
        return (
          <AffectationAgence
            client={commandeEnCours.client!}
            lignesCommande={commandeEnCours.lignesCommande}
            onAgenceSelect={(agence: Agence) => {
              setCommandeEnCours(prev => ({ ...prev, agence }))
              passerEtapeSuivante()
            }}
          />
        )
      case 5:
        return (
          <RecapitulatifCommande
            commandeEnCours={commandeEnCours}
            onModification={(commande) => {
              setCommandeEnCours(prev => ({ ...prev, commande }))
            }}
            onValidation={() => passerEtapeSuivante()}
          />
        )
      case 6:
        return (
          <ValidationFinale
            commandeEnCours={commandeEnCours}
            onValidation={async () => {
              try {
                console.log('Début de la validation finale')
                console.log('Données de la commande:', commandeEnCours)

                const response = await fetch('/api/commandes', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    client: commandeEnCours.client,
                    agence: commandeEnCours.agence,
                    lignesCommande: commandeEnCours.lignesCommande,
                    instructions: commandeEnCours.instructions
                  })
                })
                
                if (!response.ok) {
                  const errorData = await response.json()
                  console.error('Erreur serveur:', errorData)
                  throw new Error(errorData.message || 'Erreur lors de la création de la commande')
                }

                const commandeValidee = await response.json()
                console.log('Commande créée avec succès:', commandeValidee)

                cleanupBrouillon()
                router.push('/commandes')
              } catch (error) {
                console.error('Erreur lors de la validation:', error)
                setCommandeEnCours(prev => ({
                  ...prev,
                  erreurs: [...prev.erreurs, error instanceof Error ? error.message : 'Erreur lors de la validation finale']
                }))
              }
            }}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      {/* Progression */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[1, 2, 3, 4, 5, 6].map((etape) => (
            <div
              key={etape}
              className={`flex items-center ${etape !== 6 ? 'flex-1' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 
                  ${commandeEnCours.etape === etape
                    ? 'border-indigo-600 bg-indigo-600 text-white'
                    : commandeEnCours.etape > etape
                    ? 'border-indigo-600 bg-white text-indigo-600'
                    : 'border-gray-300 bg-white text-gray-300'
                  }`}
              >
                {etape}
              </div>
              {etape !== 6 && (
                <div
                  className={`flex-1 h-0.5 mx-2
                    ${commandeEnCours.etape > etape ? 'bg-indigo-600' : 'bg-gray-300'}`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-sm text-gray-600">
          <span>Sélection client</span>
          <span>Produits</span>
          <span>Quantités</span>
          <span>Agence</span>
          <span>Récapitulatif</span>
          <span>Validation</span>
        </div>
      </div>

      {/* Contenu de l'étape */}
      <div className="bg-white shadow-md rounded-lg p-6">
        {renderEtape()}
      </div>

      {/* Navigation */}
      <div className="mt-6 flex justify-between">
        <button
          onClick={revenirEtapePrecedente}
          className={`px-4 py-2 text-sm font-medium rounded-md
            ${commandeEnCours.etape === 1
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
            }`}
          disabled={commandeEnCours.etape === 1}
        >
          Précédent
        </button>

        {commandeEnCours.erreurs.length > 0 && (
          <div className="flex-1 mx-4">
            <div className="bg-red-50 text-red-700 p-2 rounded text-sm">
              {commandeEnCours.erreurs[commandeEnCours.erreurs.length - 1]}
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 