import { NextResponse } from 'next/server'
import type { Agence } from '@/types/commande'

// Données temporaires pour l'exemple
let agences: Agence[] = [
  {
    id: 'AGC1',
    nom: 'Agence Paris Centre',
    adresse: '15 Rue de la Distribution, 75001 Paris',
    zoneGeographique: 'Paris Centre',
    stockDisponible: {
      '1': 30,
      '2': 50,
      '3': 15,
      '4': 40
    }
  },
  {
    id: 'AGC2',
    nom: 'Agence Paris Ouest',
    adresse: '42 Avenue de la Logistique, 92100 Boulogne-Billancourt',
    zoneGeographique: 'Paris Ouest',
    stockDisponible: {
      '1': 20,
      '2': 50,
      '3': 15,
      '4': 35
    }
  }
]

export async function GET() {
  return NextResponse.json(agences)
}

export async function POST(request: Request) {
  const data = await request.json()
  
  // Validation des données
  if (!data.nom || !data.adresse || !data.zoneGeographique) {
    return new NextResponse(
      JSON.stringify({ error: 'Données agence invalides' }), 
      { status: 400 }
    )
  }

  // Création de l'agence
  const nouvelleAgence: Agence = {
    id: `AGC${agences.length + 1}`,
    stockDisponible: data.stockDisponible || {},
    ...data
  }

  agences.push(nouvelleAgence)
  return NextResponse.json(nouvelleAgence)
}

export async function PUT(request: Request) {
  const data = await request.json()
  const index = agences.findIndex(agence => agence.id === data.id)
  if (index === -1) {
    return NextResponse.json({ error: 'Agence non trouvée' }, { status: 404 })
  }
  agences[index] = { ...agences[index], ...data }
  return NextResponse.json(agences[index])
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!id) {
    return NextResponse.json({ error: 'ID manquant' }, { status: 400 })
  }
  const index = agences.findIndex(agence => agence.id === id)
  if (index === -1) {
    return NextResponse.json({ error: 'Agence non trouvée' }, { status: 404 })
  }
  agences = agences.filter(agence => agence.id !== id)
  return NextResponse.json({ success: true })
} 