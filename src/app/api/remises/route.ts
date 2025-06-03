import { NextResponse } from 'next/server'
import type { Remise } from '@/types'

// Données temporaires pour l'exemple
const remises: Remise[] = [
  {
    id: '1',
    nom: 'Remise volume canard entier',
    description: 'Remise sur le volume pour le canard entier',
    type: 'volume',
    valeur: 10,
    dateDebut: '2024-01-01',
    dateFin: '2024-12-31',
    conditions: {
      quantiteMinimum: 5,
      produitsApplicables: ['1']
    }
  },
  {
    id: '2',
    nom: 'Remise fidélité client premium',
    description: 'Remise fidélité pour les clients premium',
    type: 'fidélité',
    valeur: 5,
    dateDebut: '2024-01-01',
    dateFin: '2024-12-31',
    conditions: {
      clientsApplicables: ['1']
    }
  },
  {
    id: '3',
    nom: 'Promotion magret de canard',
    description: 'Promotion spéciale sur les magrets',
    type: 'promotionnelle',
    valeur: 15,
    dateDebut: '2024-01-01',
    dateFin: '2024-06-30',
    conditions: {
      produitsApplicables: ['2']
    }
  }
]

export async function GET() {
  return NextResponse.json(remises)
}

export async function POST(request: Request) {
  const data = await request.json()
  
  // Validation des données
  if (!data.type || !data.valeur || !data.dateDebut || !data.dateFin || !data.nom || !data.description) {
    return NextResponse.json(
      { error: 'Données de remise invalides' },
      { status: 400 }
    )
  }

  // Création de la remise
  const nouvelleRemise: Remise = {
    id: (remises.length + 1).toString(),
    ...data
  }

  remises.push(nouvelleRemise)
  return NextResponse.json(nouvelleRemise)
} 