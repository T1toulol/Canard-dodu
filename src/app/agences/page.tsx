'use client'

import React from 'react'

interface Agence {
  id: string
  nom: string
  adresse: string
  telephone: string
  email: string
  responsable: string
  services: {
    nom: string
    responsable?: string
  }[]
  horaires: {
    [key: string]: string
  }
  zoneLivraison: string[]
}

const agences: Agence[] = [
  {
    id: 'siege',
    nom: 'Siège Social Paris',
    adresse: '123 Avenue des Champs-Élysées, 75008 Paris',
    telephone: '01 23 45 67 89',
    email: 'contact@canarddodu.fr',
    responsable: 'François Delgas',
    services: [
      { nom: 'Direction Générale', responsable: 'François Delgas' },
      { nom: 'Direction Commerciale', responsable: 'Françoise Delgas-Pélissier' },
      { nom: 'Service Prise de Commande', responsable: 'Alain Birmont' },
      { nom: 'Service Comptabilité Client', responsable: 'Hélène Mirabelle' }
    ],
    horaires: {
      'Lundi - Vendredi': '9h00 - 18h00',
      'Samedi - Dimanche': 'Fermé'
    },
    zoneLivraison: ['Paris', 'Île-de-France']
  },
  {
    id: 'cuisine-centrale',
    nom: 'Cuisine Centrale',
    adresse: 'Saint-Quentin-en-Yvelines',
    telephone: '01 XX XX XX XX',
    email: 'cuisine.centrale@canarddodu.fr',
    responsable: 'Matthieu Fléchard',
    services: [
      { nom: 'Service Livraison', responsable: 'Matthieu Fléchard' },
      { nom: 'Cuisine' },
      { nom: 'Gestion des Stocks' }
    ],
    horaires: {
      'Lundi - Vendredi': '7h00 - 19h00',
      'Samedi': '8h00 - 16h00',
      'Dimanche': 'Fermé'
    },
    zoneLivraison: ['Île-de-France']
  },
  {
    id: 'strasbourg',
    nom: 'Agence de Strasbourg',
    adresse: 'Strasbourg',
    telephone: '03 XX XX XX XX',
    email: 'strasbourg@canarddodu.fr',
    responsable: 'Hans Scheving',
    services: [
      { nom: 'Direction', responsable: 'Hans Scheving' },
      { nom: 'Production', responsable: 'Joseph Meyer' },
      { nom: 'Service Prise de Commande et Livraison', responsable: 'Otto Waldroff' }
    ],
    horaires: {
      'Lundi - Vendredi': '8h00 - 18h00',
      'Samedi': '9h00 - 16h00',
      'Dimanche': 'Fermé'
    },
    zoneLivraison: ['Alsace']
  },
  {
    id: 'lyon',
    nom: 'Agence de Lyon',
    adresse: 'Lyon',
    telephone: '04 XX XX XX XX',
    email: 'lyon@canarddodu.fr',
    responsable: '',
    services: [
      { nom: 'Cuisine' },
      { nom: 'Service Prise de Commande et Livraison' }
    ],
    horaires: {
      'Lundi - Vendredi': '8h00 - 18h00',
      'Samedi': '9h00 - 16h00',
      'Dimanche': 'Fermé'
    },
    zoneLivraison: ['Rhône-Alpes']
  },
  {
    id: 'bordeaux',
    nom: 'Agence de Bordeaux',
    adresse: 'Bordeaux',
    telephone: '05 XX XX XX XX',
    email: 'bordeaux@canarddodu.fr',
    responsable: '',
    services: [
      { nom: 'Cuisine' },
      { nom: 'Service Prise de Commande et Livraison' }
    ],
    horaires: {
      'Lundi - Vendredi': '8h00 - 18h00',
      'Samedi': '9h00 - 16h00',
      'Dimanche': 'Fermé'
    },
    zoneLivraison: ['Aquitaine']
  }
]

export default function AgencesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Nos Agences</h1>
      
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {agences.map((agence) => (
          <div key={agence.id} className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">{agence.nom}</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Adresse</h3>
                <p className="mt-1 text-sm text-gray-900">{agence.adresse}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Contact</h3>
                <p className="mt-1 text-sm text-gray-900">{agence.telephone}</p>
                <p className="mt-1 text-sm text-gray-900">{agence.email}</p>
              </div>

              {agence.responsable && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Responsable</h3>
                  <p className="mt-1 text-sm text-gray-900">{agence.responsable}</p>
                </div>
              )}

              <div>
                <h3 className="text-sm font-medium text-gray-500">Services</h3>
                <ul className="mt-1 text-sm text-gray-900">
                  {agence.services.map((service, index) => (
                    <li key={index} className="flex justify-between">
                      <span>{service.nom}</span>
                      {service.responsable && (
                        <span className="text-gray-500 text-xs">{service.responsable}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Horaires</h3>
                <ul className="mt-1 text-sm text-gray-900">
                  {Object.entries(agence.horaires).map(([jour, horaire]) => (
                    <li key={jour} className="flex justify-between">
                      <span>{jour}</span>
                      <span>{horaire}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Zone de livraison</h3>
                <p className="mt-1 text-sm text-gray-900">{agence.zoneLivraison.join(', ')}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 