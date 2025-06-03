'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import type { Commande, Client, Produit } from '@/types'

export default function CommandeDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [commande, setCommande] = useState<Commande | null>(null)
  const [client, setClient] = useState<Client | null>(null)
  const [produits, setProduits] = useState<Produit[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [commandeRes, clientsRes, produitsRes] = await Promise.all([
          fetch(`/api/commandes/${params.id}`),
          fetch('/api/clients'),
          fetch('/api/produits')
        ])

        if (!commandeRes.ok) {
          throw new Error('Commande non trouvée')
        }

        const commandeData = await commandeRes.json()
        const clientsData = await clientsRes.json()
        const produitsData = await produitsRes.json()

        setCommande(commandeData)
        setClient(clientsData.find((c: Client) => c.id === commandeData.clientId))
        setProduits(produitsData)
      } catch (error) {
        console.error('Erreur:', error)
        router.push('/commandes')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [params.id, router])

  const handleStatusChange = async (newStatus: Commande['statutCommande']) => {
    try {
      const response = await fetch(`/api/commandes/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ statutCommande: newStatus })
      })

      if (!response.ok) throw new Error('Erreur lors de la mise à jour')

      const updatedCommande = await response.json()
      setCommande(updatedCommande)
    } catch (error) {
      console.error('Erreur:', error)
      alert('Une erreur est survenue lors de la mise à jour du statut')
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500" />
      </div>
    )
  }

  if (!commande || !client) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Commande non trouvée</h1>
          <Button onClick={() => router.push('/commandes')}>
            Retour aux commandes
          </Button>
        </div>
      </div>
    )
  }

  const getStatusColor = (status: Commande['statutCommande']) => {
    switch (status) {
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

  const getStatusLabel = (status: Commande['statutCommande']) => {
    switch (status) {
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
        return status
    }
  }

  const getNextStatus = (currentStatus: Commande['statutCommande']) => {
    switch (currentStatus) {
      case 'en_cours':
        return 'validée'
      case 'validée':
        return 'expédiée'
      case 'expédiée':
        return 'livrée'
      default:
        return null
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h1 className="text-xl sm:text-2xl font-bold">Détail de la commande #{commande.id}</h1>
          <Button variant="outline" onClick={() => router.push('/commandes')} className="w-full sm:w-auto">
            Retour aux commandes
          </Button>
        </div>

        <div className="grid gap-4 sm:gap-6">
          {/* Informations client */}
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
            <h2 className="text-lg font-semibold mb-3 sm:mb-4">Client</h2>
            <div className="space-y-2 text-sm sm:text-base">
              <p><span className="font-medium">Nom:</span> {client.nom}</p>
              <p><span className="font-medium">Email:</span> {client.email}</p>
              <p><span className="font-medium">Téléphone:</span> {client.telephone}</p>
              <p className="break-words"><span className="font-medium">Adresse:</span> {client.adresse}</p>
            </div>
          </div>

          {/* Statut de la commande */}
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
            <h2 className="text-lg font-semibold mb-3 sm:mb-4">Statut</h2>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(commande.statutCommande)}`}>
                {getStatusLabel(commande.statutCommande)}
              </span>
              {getNextStatus(commande.statutCommande) && (
                <Button
                  onClick={() => handleStatusChange(getNextStatus(commande.statutCommande)!)}
                  className="w-full sm:w-auto"
                >
                  Passer au statut suivant
                </Button>
              )}
            </div>
          </div>

          {/* Produits commandés */}
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
            <h2 className="text-lg font-semibold mb-3 sm:mb-4">Produits commandés</h2>
            <div className="space-y-3 sm:space-y-4">
              {commande.produits.map((ligne, index) => {
                const produit = produits.find(p => p.id === ligne.produitId)
                return (
                  <div key={index} className="flex flex-col sm:flex-row justify-between sm:items-center p-3 sm:p-4 border rounded-lg">
                    <div className="mb-2 sm:mb-0">
                      <h3 className="font-medium">{produit?.nom}</h3>
                      <p className="text-sm text-gray-500">
                        Quantité: {ligne.quantite} x {produit?.prix.toFixed(2)}€
                      </p>
                      {ligne.montantRemise > 0 && (
                        <p className="text-sm text-green-600">
                          Remise: {ligne.montantRemise.toFixed(2)}€
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-bold">
                        {((produit?.prix || 0) * ligne.quantite - ligne.montantRemise).toFixed(2)}€
                      </p>
                    </div>
                  </div>
                )
              })}
              <div className="pt-3 sm:pt-4 border-t mt-3 sm:mt-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total</span>
                  <span className="text-lg font-bold">{commande.total.toFixed(2)}€</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 