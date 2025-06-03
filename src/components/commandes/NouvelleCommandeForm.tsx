'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import type { Client, Produit, LigneCommande, Commande, Agence } from '@/types'

// Étapes du formulaire
const ETAPES = {
  SELECTION_CLIENT: 0,
  SELECTION_PRODUITS: 1,
  SAISIE_LIGNES: 2,
  AFFECTATION_AGENCE: 3,
  RECAPITULATIF: 4,
  VALIDATION: 5
}

export default function NouvelleCommandeForm() {
  const router = useRouter()
  const [etapeActuelle, setEtapeActuelle] = useState(ETAPES.SELECTION_CLIENT)
  const [clients, setClients] = useState<Client[]>([])
  const [produits, setProduits] = useState<Produit[]>([])
  const [agences, setAgences] = useState<Agence[]>([])
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [lignes, setLignes] = useState<LigneCommande[]>([])
  const [agenceAffectee, setAgenceAffectee] = useState<Agence | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientsRes, produitsRes, agencesRes] = await Promise.all([
          fetch('/api/clients'),
          fetch('/api/produits'),
          fetch('/api/agences')
        ])
        
        const clientsData = await clientsRes.json()
        const produitsData = await produitsRes.json()
        const agencesData = await agencesRes.json()

        setClients(clientsData)
        setProduits(produitsData)
        setAgences(agencesData)
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error)
      }
    }
    fetchData()
  }, [])

  const handleClientSelect = (client: Client) => {
    setSelectedClient(client)
    setEtapeActuelle(ETAPES.SELECTION_PRODUITS)
  }

  const handleAddProduit = (produit: Produit) => {
    const existingLigne = lignes.find(l => l.produitId === produit.id)
    if (existingLigne) {
      setLignes(lignes.map(l => 
        l.produitId === produit.id 
          ? { ...l, quantite: l.quantite + 1 }
          : l
      ))
    } else {
      setLignes([...lignes, { 
        produitId: produit.id,
        quantite: 1,
        montantRemise: 0,
        produit
      }])
    }
  }

  const handleQuantiteChange = (produitId: string, quantite: number) => {
    if (quantite < 1) return
    
    const produit = produits.find(p => p.id === produitId)
    if (!produit || quantite > produit.stockDisponible) {
      alert('Stock insuffisant')
      return
    }

    setLignes(lignes.map(l => 
      l.produitId === produitId ? { ...l, quantite } : l
    ))
  }

  const handleRemoveLigne = (produitId: string) => {
    setLignes(lignes.filter(l => l.produitId !== produitId))
  }

  const calculateTotal = () => {
    return lignes.reduce((total, ligne) => {
      const produit = produits.find(p => p.id === ligne.produitId)
      return total + ((produit?.prix || 0) * ligne.quantite) - ligne.montantRemise
    }, 0)
  }

  const determinerAgence = () => {
    // Logique d'affectation d'agence basée sur la localisation du client
    // et la disponibilité des produits
    if (!selectedClient || agences.length === 0) return null

    // Pour l'exemple, on prend la première agence
    // TODO: Implémenter la vraie logique d'affectation
    setAgenceAffectee(agences[0])
    setEtapeActuelle(ETAPES.RECAPITULATIF)
  }

  const handleSubmit = async () => {
    if (!selectedClient || lignes.length === 0) return

    setIsLoading(true)
    try {
      const commandeData = {
        clientId: selectedClient.id,
        produits: lignes.map(ligne => ({
          produitId: ligne.produitId,
          quantite: ligne.quantite,
          montantRemise: ligne.montantRemise || 0
        })),
        total: calculateTotal(),
        agenceAffectee: agenceAffectee?.id || '',
        statutCommande: 'en_cours',
        date: new Date().toISOString(),
        dateCréation: new Date().toISOString()
      }

      const response = await fetch('/api/commandes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(commandeData)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Erreur lors de la création de la commande')
      }
      
      router.push('/commandes')
    } catch (error) {
      console.error('Erreur:', error)
      alert('Une erreur est survenue lors de la création de la commande')
    } finally {
      setIsLoading(false)
    }
  }

  const renderEtapeSelectionClient = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Rechercher un client
        </label>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
          placeholder="Nom, email ou téléphone..."
        />
      </div>

      <div className="grid gap-4">
        {clients
          .filter(client => 
            client.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
            client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            client.telephone.includes(searchTerm)
          )
          .map(client => (
            <div
              key={client.id}
              className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
              onClick={() => handleClientSelect(client)}
            >
              <h3 className="font-medium">{client.nom}</h3>
              <p className="text-sm text-gray-500">{client.email}</p>
              <p className="text-sm text-gray-500">{client.telephone}</p>
              <p className="text-sm text-gray-500">{client.adresse}</p>
            </div>
          ))}
      </div>
    </div>
  )

  const renderEtapeSelectionProduits = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Sélection des produits</h2>
        <Button
          onClick={() => setEtapeActuelle(ETAPES.SAISIE_LIGNES)}
          disabled={lignes.length === 0}
        >
          Continuer
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {produits.map(produit => (
          <div key={produit.id} className="p-4 border rounded-lg">
            <h3 className="font-medium">{produit.nom}</h3>
            <p className="text-sm text-gray-500">{produit.description}</p>
            <p className="text-lg font-bold text-indigo-600">{produit.prix.toFixed(2)}€</p>
            <p className="text-sm text-gray-500">
              Stock: {produit.stockDisponible}
            </p>
            <Button
              onClick={() => handleAddProduit(produit)}
              disabled={produit.stockDisponible === 0}
              className="mt-2"
            >
              Ajouter
            </Button>
          </div>
        ))}
      </div>
    </div>
  )

  const renderEtapeSaisieLignes = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Détail de la commande</h2>
        <div className="space-x-4">
          <Button
            variant="outline"
            onClick={() => setEtapeActuelle(ETAPES.SELECTION_PRODUITS)}
          >
            Retour
          </Button>
          <Button
            onClick={() => {
              determinerAgence()
              setEtapeActuelle(ETAPES.AFFECTATION_AGENCE)
            }}
            disabled={lignes.length === 0}
          >
            Continuer
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {lignes.map((ligne, index) => (
          <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
            <div className="flex-grow">
              <h3 className="font-medium">{ligne.produit?.nom}</h3>
              <p className="text-sm text-gray-500">{ligne.produit?.prix.toFixed(2)}€ / unité</p>
            </div>
            
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                value={ligne.quantite}
                onChange={(e) => handleQuantiteChange(ligne.produitId, parseInt(e.target.value))}
                className="w-20 p-2 border rounded-md"
              />
              <Button
                variant="outline"
                onClick={() => handleRemoveLigne(ligne.produitId)}
              >
                Supprimer
              </Button>
            </div>
          </div>
        ))}

        <div className="text-right text-xl font-bold">
          Total: {calculateTotal().toFixed(2)}€
        </div>
      </div>
    </div>
  )

  const renderEtapeAffectationAgence = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Affectation de l'agence</h2>
        <div className="space-x-4">
          <Button
            variant="outline"
            onClick={() => setEtapeActuelle(ETAPES.SAISIE_LIGNES)}
          >
            Retour
          </Button>
          <Button
            onClick={() => setEtapeActuelle(ETAPES.RECAPITULATIF)}
            disabled={!agenceAffectee}
          >
            Continuer
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {agences.map(agence => (
          <div
            key={agence.id}
            className={`p-4 border rounded-lg cursor-pointer ${
              agenceAffectee?.id === agence.id ? 'border-indigo-500 bg-indigo-50' : ''
            }`}
            onClick={() => setAgenceAffectee(agence)}
          >
            <h3 className="font-medium">{agence.nom}</h3>
            <p className="text-sm text-gray-500">{agence.adresse}</p>
            <p className="text-sm text-gray-500">Zone: {agence.zone}</p>
          </div>
        ))}
      </div>
    </div>
  )

  const renderEtapeRecapitulatif = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Récapitulatif de la commande</h2>
        <div className="space-x-4">
          <Button
            variant="outline"
            onClick={() => setEtapeActuelle(ETAPES.AFFECTATION_AGENCE)}
          >
            Retour
          </Button>
          <Button
            onClick={() => setEtapeActuelle(ETAPES.VALIDATION)}
          >
            Valider la commande
          </Button>
        </div>
      </div>

      {selectedClient && (
        <div className="p-4 border rounded-lg">
          <h3 className="font-medium mb-2">Client</h3>
          <p>{selectedClient.nom}</p>
          <p className="text-sm text-gray-500">{selectedClient.email}</p>
          <p className="text-sm text-gray-500">{selectedClient.telephone}</p>
          <p className="text-sm text-gray-500">{selectedClient.adresse}</p>
        </div>
      )}

      <div className="p-4 border rounded-lg">
        <h3 className="font-medium mb-2">Produits commandés</h3>
        <div className="space-y-2">
          {lignes.map((ligne, index) => (
            <div key={index} className="flex justify-between">
              <span>{ligne.produit?.nom} (x{ligne.quantite})</span>
              <span>{((ligne.produit?.prix || 0) * ligne.quantite).toFixed(2)}€</span>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t">
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>{calculateTotal().toFixed(2)}€</span>
          </div>
        </div>
      </div>

      {agenceAffectee && (
        <div className="p-4 border rounded-lg">
          <h3 className="font-medium mb-2">Agence affectée</h3>
          <p>{agenceAffectee.nom}</p>
          <p className="text-sm text-gray-500">{agenceAffectee.adresse}</p>
        </div>
      )}
    </div>
  )

  const renderEtapeValidation = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-4">Confirmation de la commande</h2>
        <p className="text-gray-600 mb-8">
          Voulez-vous vraiment valider cette commande ?
        </p>
        <div className="space-x-4">
          <Button
            variant="outline"
            onClick={() => setEtapeActuelle(ETAPES.RECAPITULATIF)}
          >
            Retour
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? 'Validation...' : 'Confirmer la commande'}
          </Button>
        </div>
      </div>
    </div>
  )

  const renderEtapeActuelle = () => {
    switch (etapeActuelle) {
      case ETAPES.SELECTION_CLIENT:
        return renderEtapeSelectionClient()
      case ETAPES.SELECTION_PRODUITS:
        return renderEtapeSelectionProduits()
      case ETAPES.SAISIE_LIGNES:
        return renderEtapeSaisieLignes()
      case ETAPES.AFFECTATION_AGENCE:
        return renderEtapeAffectationAgence()
      case ETAPES.RECAPITULATIF:
        return renderEtapeRecapitulatif()
      case ETAPES.VALIDATION:
        return renderEtapeValidation()
      default:
        return null
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Nouvelle Commande</h1>
          <Button variant="outline" onClick={() => router.push('/commandes')}>
            Annuler
          </Button>
        </div>

        <div className="flex justify-between items-center">
          {Object.values(ETAPES).map((etape, index) => (
            <div
              key={etape}
              className={`flex items-center ${
                index < Object.values(ETAPES).length - 1 ? 'flex-1' : ''
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  etape <= etapeActuelle
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {index + 1}
              </div>
              {index < Object.values(ETAPES).length - 1 && (
                <div
                  className={`flex-1 h-1 mx-2 ${
                    etape < etapeActuelle ? 'bg-indigo-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {renderEtapeActuelle()}
    </div>
  )
} 