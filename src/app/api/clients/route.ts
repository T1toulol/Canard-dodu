import { NextResponse } from 'next/server'
import type { Client } from '@/types/commande'

// Données temporaires pour l'exemple
let clients: Client[] = [
  {
    id: '1',
    nom: 'Restaurant Le Gourmet',
    email: 'contact@legourmet.fr',
    telephone: '01 23 45 67 89',
    adresse: '15 Rue de la Gastronomie, 75001 Paris',
    zoneGeographique: 'Paris Centre',
    conditionsCommerciales: {
      remiseFixe: 5,
      remiseVolume: 2
    }
  },
  {
    id: '2',
    nom: 'Bistrot Chez Marcel',
    email: 'marcel@bistrot.fr',
    telephone: '01 98 76 54 32',
    adresse: '42 Avenue des Saveurs, 75002 Paris',
    zoneGeographique: 'Paris Centre',
    conditionsCommerciales: {
      remiseFixe: 3
    }
  },
  {
    id: '3',
    nom: 'Hôtel Le Magnifique',
    email: 'reservation@magnifique.fr',
    telephone: '01 45 67 89 10',
    adresse: '8 Place de l\'Élégance, 75008 Paris',
    zoneGeographique: 'Paris Ouest',
    conditionsCommerciales: {
      remiseFixe: 10,
      remiseVolume: 5
    }
  }
]

export async function GET() {
  return NextResponse.json(clients)
}

export async function POST(request: Request) {
  const data = await request.json()
  
  // Validation des données
  if (!data.nom || !data.email || !data.telephone || !data.adresse || !data.zoneGeographique) {
    return new NextResponse(
      JSON.stringify({ error: 'Données client invalides' }), 
      { status: 400 }
    )
  }

  // Création du client
  const nouveauClient: Client = {
    id: (clients.length + 1).toString(),
    ...data,
    conditionsCommerciales: data.conditionsCommerciales || {}
  }

  clients.push(nouveauClient)
  return NextResponse.json(nouveauClient)
}

export async function PUT(request: Request) {
  const data = await request.json()
  const index = clients.findIndex(client => client.id === data.id)
  if (index === -1) {
    return NextResponse.json({ error: 'Client non trouvé' }, { status: 404 })
  }
  clients[index] = { ...clients[index], ...data }
  return NextResponse.json(clients[index])
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!id) {
    return NextResponse.json({ error: 'ID manquant' }, { status: 400 })
  }
  const index = clients.findIndex(client => client.id === id)
  if (index === -1) {
    return NextResponse.json({ error: 'Client non trouvé' }, { status: 404 })
  }
  clients = clients.filter(client => client.id !== id)
  return NextResponse.json({ success: true })
} 