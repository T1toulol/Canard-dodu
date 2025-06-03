import React, { useState, useEffect } from 'react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

interface ClientModalProps {
  client?: {
    id: string
    nom: string
    email: string
    telephone: string
    adresse: string
  }
  onClose: () => void
  onSave: (clientData: { nom: string; email: string; telephone: string; adresse: string }) => void
}

export default function ClientModal({ client, onClose, onSave }: ClientModalProps) {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    telephone: '',
    adresse: '',
  })

  useEffect(() => {
    if (client) {
      setFormData({
        nom: client.nom,
        email: client.email,
        telephone: client.telephone,
        adresse: client.adresse,
      })
    }
  }, [client])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {client ? 'Modifier le client' : 'Nouveau client'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Nom"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              required
            />
            
            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            
            <Input
              label="Téléphone"
              name="telephone"
              type="tel"
              value={formData.telephone}
              onChange={handleChange}
              required
            />
            
            <Input
              label="Adresse"
              name="adresse"
              value={formData.adresse}
              onChange={handleChange}
              required
            />

            <div className="flex justify-end space-x-3 mt-6">
              <Button variant="outline" type="button" onClick={onClose}>
                Annuler
              </Button>
              <Button type="submit">
                {client ? 'Enregistrer' : 'Créer'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
} 