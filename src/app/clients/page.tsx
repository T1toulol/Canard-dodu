'use client'

import React, { useState, useEffect } from 'react'
import ClientModal from '@/components/clients/ClientModal'
import Button from '@/components/ui/Button'

interface Client {
  id: string
  nom: string
  email: string
  telephone: string
  adresse: string
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState<Client | undefined>()

  useEffect(() => {
    fetchClients()
  }, [])

  const fetchClients = async () => {
    try {
      const response = await fetch('/api/clients')
      const data = await response.json()
      setClients(data)
    } catch (error) {
      console.error('Erreur lors du chargement des clients:', error)
    }
  }

  const handleSaveClient = async (clientData: Omit<Client, 'id'>) => {
    try {
      const method = selectedClient ? 'PUT' : 'POST'
      const url = selectedClient ? `/api/clients/${selectedClient.id}` : '/api/clients'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clientData),
      })

      if (!response.ok) throw new Error('Erreur lors de la sauvegarde')

      fetchClients()
      handleCloseModal()
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du client:', error)
    }
  }

  const handleDeleteClient = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) return

    try {
      const response = await fetch(`/api/clients/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Erreur lors de la suppression')

      fetchClients()
    } catch (error) {
      console.error('Erreur lors de la suppression du client:', error)
    }
  }

  const handleEditClient = (client: Client) => {
    setSelectedClient(client)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setSelectedClient(undefined)
    setIsModalOpen(false)
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          Ajouter un client
        </Button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nom
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Téléphone
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Adresse
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {clients.map((client) => (
              <tr key={client.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{client.nom}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{client.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{client.telephone}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{client.adresse}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Button variant="secondary" size="sm" className="mr-2" onClick={() => handleEditClient(client)}>
                    Modifier
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDeleteClient(client.id)}>
                    Supprimer
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <ClientModal
          client={selectedClient}
          onClose={handleCloseModal}
          onSave={handleSaveClient}
        />
      )}
    </div>
  )
} 