'use client'

import React, { useState } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

interface ContactForm {
  nom: string
  email: string
  telephone: string
  sujet: string
  message: string
}

const equipeDirection = [
  {
    nom: 'Pierre Pélissier',
    titre: 'PDG',
    description: 'Fondateur de l\'entreprise, expert en charcuterie fine et produits gastronomiques.'
  },
  {
    nom: 'François Delgas',
    titre: 'Directeur Général',
    description: 'Diplômé de l\'École Hôtelière, responsable du développement de l\'entreprise et de l\'innovation produits.'
  },
  {
    nom: 'Françoise Delgas-Pélissier',
    titre: 'Directrice Commerciale',
    description: 'Diplômée HEC, en charge des relations commerciales avec nos clients.'
  }
]

const servicesContacts = [
  {
    service: 'Service Prise de Commande',
    responsable: 'Alain Birmont',
    telephone: '01 XX XX XX XX',
    email: 'commandes@canarddodu.fr'
  },
  {
    service: 'Service Comptabilité Client',
    responsable: 'Hélène Mirabelle',
    telephone: '01 XX XX XX XX',
    email: 'comptabilite@canarddodu.fr'
  },
  {
    service: 'Service Livraison (St Quentin)',
    responsable: 'Matthieu Fléchard',
    telephone: '01 XX XX XX XX',
    email: 'livraison@canarddodu.fr'
  }
]

export default function ContactPage() {
  const [formData, setFormData] = useState<ContactForm>({
    nom: '',
    email: '',
    telephone: '',
    sujet: '',
    message: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Ici, vous pouvez ajouter la logique d'envoi du formulaire
    console.log('Formulaire soumis:', formData)
    alert('Votre message a été envoyé avec succès !')
    setFormData({
      nom: '',
      email: '',
      telephone: '',
      sujet: '',
      message: ''
    })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Contactez-nous</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Informations de contact */}
        <div>
          <div className="bg-white shadow rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Siège Social</h2>
            <div className="space-y-4">
              <p className="text-gray-600">
                123 Avenue des Champs-Élysées<br />
                75008 Paris<br />
                France
              </p>
              <p className="text-gray-600">
                Tél : 01 23 45 67 89<br />
                Email : contact@canarddodu.fr
              </p>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Direction</h2>
            <div className="space-y-6">
              {equipeDirection.map((membre) => (
                <div key={membre.nom} className="border-b border-gray-200 last:border-0 pb-4 last:pb-0">
                  <h3 className="font-medium text-gray-900">{membre.nom}</h3>
                  <p className="text-sm text-gray-500">{membre.titre}</p>
                  <p className="text-sm text-gray-600 mt-1">{membre.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Services</h2>
            <div className="space-y-6">
              {servicesContacts.map((service) => (
                <div key={service.service} className="border-b border-gray-200 last:border-0 pb-4 last:pb-0">
                  <h3 className="font-medium text-gray-900">{service.service}</h3>
                  <p className="text-sm text-gray-500">Responsable : {service.responsable}</p>
                  <p className="text-sm text-gray-600">
                    Tél : {service.telephone}<br />
                    Email : {service.email}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Formulaire de contact */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Formulaire de contact</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="nom" className="block text-sm font-medium text-gray-700">
                Nom
              </label>
              <Input
                id="nom"
                type="text"
                value={formData.nom}
                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div>
              <label htmlFor="telephone" className="block text-sm font-medium text-gray-700">
                Téléphone
              </label>
              <Input
                id="telephone"
                type="tel"
                value={formData.telephone}
                onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="sujet" className="block text-sm font-medium text-gray-700">
                Sujet
              </label>
              <Input
                id="sujet"
                type="text"
                value={formData.sujet}
                onChange={(e) => setFormData({ ...formData, sujet: e.target.value })}
                required
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                Message
              </label>
              <textarea
                id="message"
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
              />
            </div>

            <div>
              <Button type="submit">
                Envoyer le message
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
} 