import { NextResponse } from 'next/server'
import type { Remise } from '@/types'

// Données temporaires pour l'exemple
const remises: Remise[] = [
  {
    id: '1',
    type: 'volume',
    taux: 10,
    dateValidite: '2024-12-31',
    produitId: '1'
  },
  {
    id: '2',
    type: 'fidelite',
    taux: 5,
    dateValidite: '2024-12-31',
    clientId: '1'
  },
  {
    id: '3',
    type: 'promotion',
    taux: 15,
    dateValidite: '2024-06-30',
    produitId: '2'
  }
]

export async function GET() {
  return NextResponse.json(remises)
}

export async function POST(request: Request) {
  const data = await request.json()
  
  // Validation des données
  if (!data.type || !data.taux || !data.dateValidite) {
    return new NextResponse(null, { status: 400 })
  }

  // Création de la remise
  const nouvelleRemise: Remise = {
    id: (remises.length + 1).toString(),
    ...data
  }

  remises.push(nouvelleRemise)
  return NextResponse.json(nouvelleRemise)
} 