'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Button from '@/components/ui/Button'

interface Client {
  id: string
  nom: string
}

interface Produit {
  id: string
  nom: string
  prix: number
}

interface LigneCommande {
  produitId: string
  quantite: number
}

interface Commande {
  id: string
  clientId: string
  agenceId: string
  date: string
  statut: 'en_cours' | 'validée' | 'expédiée' | 'livrée' | 'annulée'
  lignes: LigneCommande[]
  total: number
  remiseGlobale: number
  conditionsLivraison?: {
    instructions?: string
  }
}

export default function CommandesPage() {
  const [commandes, setCommandes] = useState<Commande[]>([])
  const [clients, setClients] = useState<{ [key: string]: Client }>({})
  const [produits, setProduits] = useState<{ [key: string]: Produit }>({})

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [commandesRes, clientsRes, produitsRes] = await Promise.all([
          fetch('/api/commandes'),
          fetch('/api/clients'),
          fetch('/api/produits')
        ])

        const commandesData = await commandesRes.json()
        const clientsData = await clientsRes.json()
        const produitsData = await produitsRes.json()

        setCommandes(commandesData)
        setClients(clientsData.reduce((acc: any, client: Client) => {
          acc[client.id] = client
          return acc
        }, {}))
        setProduits(produitsData.reduce((acc: any, produit: Produit) => {
          acc[produit.id] = produit
          return acc
        }, {}))
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error)
      }
    }

    fetchData()
  }, [])

  const getStatusBadgeClass = (statut: string) => {
    switch (statut) {
      case 'en_cours':
        return 'bg-yellow-100 text-yellow-800'
      case 'validée':
        return 'bg-blue-100 text-blue-800'
      case 'expédiée':
        return 'bg-purple-100 text-purple-800'
      case 'livrée':
        return 'bg-green-100 text-green-800'
      case 'annulée':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const getStatusLabel = (statut: string) => {
    switch (statut) {
      case 'en_cours':
        return 'En cours'
      case 'validée':
        return 'Validée'
      case 'expédiée':
        return 'Expédiée'
      case 'livrée':
        return 'Livrée'
      case 'annulée':
        return 'Annulée'
      default:
        return statut
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Commandes</h1>
        <Link href="/commandes/nouvelle">
          <Button>
            Nouvelle commande
          </Button>
        </Link>
      </div>

      {/* Vue desktop */}
      <div className="hidden md:block bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Client
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Produits
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {commandes.map((commande) => (
              <tr key={commande.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(commande.date)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {clients[commande.clientId]?.nom || 'Client inconnu'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  <ul>
                    {commande.lignes.map((ligne, index) => (
                      <li key={index}>
                        {produits[ligne.produitId]?.nom || 'Produit inconnu'} (x{ligne.quantite})
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {commande.total.toFixed(2)}€
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(commande.statut)}`}>
                    {getStatusLabel(commande.statut)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link href={`/commandes/${commande.id}`}>
                    <Button variant="secondary" size="sm">
                      Voir détails
                    </Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Vue mobile */}
      <div className="md:hidden space-y-4">
        {commandes.map((commande) => (
          <div key={commande.id} className="bg-white shadow-md rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="font-medium text-gray-900">
                  {clients[commande.clientId]?.nom || 'Client inconnu'}
                </div>
                <div className="text-sm text-gray-500">
                  {formatDate(commande.date)}
                </div>
              </div>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(commande.statut)}`}>
                {getStatusLabel(commande.statut)}
              </span>
            </div>
            
            <div className="mb-3">
              <div className="text-sm font-medium text-gray-500 mb-1">Produits:</div>
              <ul className="text-sm text-gray-900 space-y-1">
                {commande.lignes.map((ligne, index) => (
                  <li key={index} className="flex justify-between">
                    <span>{produits[ligne.produitId]?.nom || 'Produit inconnu'}</span>
                    <span className="text-gray-600">x{ligne.quantite}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="flex justify-between items-center border-t pt-3">
              <div className="font-medium">
                Total: {commande.total.toFixed(2)}€
              </div>
              <Link href={`/commandes/${commande.id}`}>
                <Button variant="secondary" size="sm">
                  Voir détails
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 