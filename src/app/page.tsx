'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'

interface Stats {
  clients: number
  produits: number
  commandes: number
}

export default function Home() {
  const [stats, setStats] = useState<Stats>({ clients: 0, produits: 0, commandes: 0 })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [clientsRes, produitsRes, commandesRes] = await Promise.all([
          fetch('/api/clients'),
          fetch('/api/produits'),
          fetch('/api/commandes')
        ])
        
        const clients = await clientsRes.json()
        const produits = await produitsRes.json()
        const commandes = await commandesRes.json()

        setStats({
          clients: clients.length,
          produits: produits.length,
          commandes: commandes.length
        })
      } catch (error) {
        console.error('Erreur lors du chargement des statistiques:', error)
      }
    }

    fetchStats()
  }, [])

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4 text-gray-900">
          🦆 Canard Dodu 🦆
        </h1>
        <p className="text-xl text-gray-600">
          Votre solution de gestion pour une restauration d'excellence
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-4xl mb-2">👥</div>
          <div className="text-3xl font-bold text-indigo-600 mb-1">{stats.clients}</div>
          <div className="text-gray-600">Clients actifs</div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-4xl mb-2">🍗</div>
          <div className="text-3xl font-bold text-indigo-600 mb-1">{stats.produits}</div>
          <div className="text-gray-600">Produits</div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-4xl mb-2">📦</div>
          <div className="text-3xl font-bold text-indigo-600 mb-1">{stats.commandes}</div>
          <div className="text-gray-600">Commandes</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/clients" 
          className="block p-6 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg shadow-md hover:shadow-lg transition-all hover:-translate-y-1">
          <h2 className="text-xl font-semibold mb-2 text-white flex items-center">
            <span className="text-2xl mr-2">👥</span> Clients
          </h2>
          <p className="text-indigo-100">Gérer vos clients et leurs informations</p>
        </Link>

        <Link href="/produits"
          className="block p-6 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg shadow-md hover:shadow-lg transition-all hover:-translate-y-1">
          <h2 className="text-xl font-semibold mb-2 text-white flex items-center">
            <span className="text-2xl mr-2">🍗</span> Produits
          </h2>
          <p className="text-emerald-100">Gérer votre catalogue de produits</p>
        </Link>

        <Link href="/commandes"
          className="block p-6 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg shadow-md hover:shadow-lg transition-all hover:-translate-y-1">
          <h2 className="text-xl font-semibold mb-2 text-white flex items-center">
            <span className="text-2xl mr-2">📦</span> Commandes
          </h2>
          <p className="text-amber-100">Consulter et gérer les commandes</p>
        </Link>
      </div>

      <div className="mt-12 text-center">
        <Link href="/commandes/nouvelle"
          className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-md text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 transition-all hover:shadow-lg hover:-translate-y-1">
          <span className="text-2xl mr-2">✨</span>
          Créer une nouvelle commande
        </Link>
      </div>
    </div>
  )
}
