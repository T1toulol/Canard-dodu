'use client'

import { useEffect, useState } from 'react'
import Button from '@/components/ui/Button'
import type { Remise, Client, Produit } from '@/types'

export default function RemisesPage() {
  const [remises, setRemises] = useState<Remise[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [produits, setProduits] = useState<Produit[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState<Partial<Remise>>({
    type: 'volume',
    taux: 0,
    dateValidite: new Date().toISOString().split('T')[0]
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [remisesRes, clientsRes, produitsRes] = await Promise.all([
          fetch('/api/remises'),
          fetch('/api/clients'),
          fetch('/api/produits')
        ])

        const [remisesData, clientsData, produitsData] = await Promise.all([
          remisesRes.json(),
          clientsRes.json(),
          produitsRes.json()
        ])

        setRemises(remisesData)
        setClients(clientsData)
        setProduits(produitsData)
      } catch (error) {
        console.error('Erreur:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/remises', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) throw new Error('Erreur lors de la création de la remise')

      const nouvelleRemise = await response.json()
      setRemises([...remises, nouvelleRemise])
      setShowForm(false)
      setFormData({
        type: 'volume',
        taux: 0,
        dateValidite: new Date().toISOString().split('T')[0]
      })
    } catch (error) {
      console.error('Erreur:', error)
      alert('Une erreur est survenue lors de la création de la remise')
    }
  }

  const getTypeLabel = (type: Remise['type']) => {
    switch (type) {
      case 'volume':
        return 'Remise sur volume'
      case 'fidelite':
        return 'Remise fidélité'
      case 'promotion':
        return 'Promotion'
      default:
        return type
    }
  }

  const getTypeColor = (type: Remise['type']) => {
    switch (type) {
      case 'volume':
        return 'bg-blue-100 text-blue-800'
      case 'fidelite':
        return 'bg-green-100 text-green-800'
      case 'promotion':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Gestion des remises</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Annuler' : 'Nouvelle remise'}
        </Button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
          <h2 className="text-lg font-semibold mb-4">Nouvelle remise</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type de remise
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as Remise['type'] })}
                className="w-full p-2 border rounded-md"
                required
              >
                <option value="volume">Remise sur volume</option>
                <option value="fidelite">Remise fidélité</option>
                <option value="promotion">Promotion</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Taux de remise (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.taux}
                onChange={(e) => setFormData({ ...formData, taux: Number(e.target.value) })}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date de validité
              </label>
              <input
                type="date"
                value={formData.dateValidite}
                onChange={(e) => setFormData({ ...formData, dateValidite: e.target.value })}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>

            {formData.type === 'volume' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Produit concerné
                </label>
                <select
                  value={formData.produitId}
                  onChange={(e) => setFormData({ ...formData, produitId: e.target.value })}
                  className="w-full p-2 border rounded-md"
                  required
                >
                  <option value="">Sélectionner un produit</option>
                  {produits.map(produit => (
                    <option key={produit.id} value={produit.id}>
                      {produit.nom}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {formData.type === 'fidelite' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Client concerné
                </label>
                <select
                  value={formData.clientId}
                  onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                  className="w-full p-2 border rounded-md"
                  required
                >
                  <option value="">Sélectionner un client</option>
                  {clients.map(client => (
                    <option key={client.id} value={client.id}>
                      {client.nom}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {formData.type === 'promotion' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Produit en promotion
                </label>
                <select
                  value={formData.produitId}
                  onChange={(e) => setFormData({ ...formData, produitId: e.target.value })}
                  className="w-full p-2 border rounded-md"
                  required
                >
                  <option value="">Sélectionner un produit</option>
                  {produits.map(produit => (
                    <option key={produit.id} value={produit.id}>
                      {produit.nom}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex justify-end">
              <Button type="submit">
                Créer la remise
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-4">
        {remises.map(remise => {
          const client = remise.clientId ? clients.find(c => c.id === remise.clientId) : null
          const produit = remise.produitId ? produits.find(p => p.id === remise.produitId) : null

          return (
            <div key={remise.id} className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex justify-between items-start">
                <div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(remise.type)}`}>
                    {getTypeLabel(remise.type)}
                  </span>
                  <p className="mt-2 text-2xl font-bold">{remise.taux}% de remise</p>
                  <p className="text-sm text-gray-500">
                    Valide jusqu'au {new Date(remise.dateValidite).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                <Button variant="outline">
                  Modifier
                </Button>
              </div>

              {client && (
                <div className="mt-4 p-4 bg-gray-50 rounded-md">
                  <p className="font-medium">Client concerné</p>
                  <p className="text-sm text-gray-600">{client.nom}</p>
                  <p className="text-sm text-gray-500">{client.email}</p>
                </div>
              )}

              {produit && (
                <div className="mt-4 p-4 bg-gray-50 rounded-md">
                  <p className="font-medium">Produit concerné</p>
                  <p className="text-sm text-gray-600">{produit.nom}</p>
                  <p className="text-sm text-gray-500">{produit.description}</p>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
} 