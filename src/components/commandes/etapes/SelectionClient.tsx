'use client'

import React, { useState, useEffect } from 'react'
import type { Client } from '@/types/commande'

interface SelectionClientProps {
  onClientSelect: (client: Client) => void
}

export default function SelectionClient({ onClientSelect }: SelectionClientProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [clients, setClients] = useState<Client[]>([])
  const [filteredClients, setFilteredClients] = useState<Client[]>([])
  const [clientsHistorique, setClientsHistorique] = useState<{ [key: string]: any }>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientsRes, historiqueRes] = await Promise.all([
          fetch('/api/clients'),
          fetch('/api/commandes/historique')
        ])
        
        if (!clientsRes.ok) throw new Error('Erreur lors du chargement des clients')
        if (!historiqueRes.ok) throw new Error('Erreur lors du chargement de l\'historique')
        
        const clientsData = await clientsRes.json()
        const historiqueData = await historiqueRes.json()
        
        setClients(clientsData)
        setFilteredClients(clientsData)
        setClientsHistorique(historiqueData)
      } catch (error) {
        setError('Impossible de charger les données')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    const filtered = clients.filter(client =>
      client.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.id.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredClients(filtered)
  }, [searchTerm, clients])

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
      <div>
        <h2 className="text-lg font-semibold mb-4">Sélection du client</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Rechercher par nom, email ou ID..."
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
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        {filteredClients.map((client) => (
          <div
            key={client.id}
            className="border rounded-lg p-4 hover:border-indigo-600 cursor-pointer transition-colors"
            onClick={() => onClientSelect(client)}
          >
            <h3 className="font-medium text-lg">{client.nom}</h3>
            <p className="text-sm text-gray-600">{client.email}</p>
            <p className="text-sm text-gray-600">{client.adresse}</p>
            {client.conditionsCommerciales.remiseFixe && (
              <p className="text-sm text-indigo-600 mt-2">
                Remise fixe : {client.conditionsCommerciales.remiseFixe}%
              </p>
            )}
            
            {/* Historique des commandes */}
            {clientsHistorique[client.id] && (
              <div className="mt-4 border-t pt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Dernières commandes
                </h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {clientsHistorique[client.id].slice(0, 3).map((cmd: any) => (
                    <li key={cmd.id} className="flex justify-between">
                      <span>{new Date(cmd.date).toLocaleDateString('fr-FR')}</span>
                      <span className="font-medium">{cmd.total.toFixed(2)}€</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredClients.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          Aucun client ne correspond à votre recherche
        </div>
      )}
    </div>
  )
} 