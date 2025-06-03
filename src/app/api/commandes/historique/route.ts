import { NextResponse } from 'next/server'
import type { Commande } from '@/types/commande'

// Données temporaires pour l'exemple
const historique: { [clientId: string]: Commande[] } = {
  '1': [
    {
      id: 'CMD001',
      clientId: '1',
      agenceId: 'AGC1',
      date: '2024-03-10T10:00:00Z',
      lignes: [
        {
          produitId: 'P1',
          quantite: 5,
          prixUnitaire: 25.99,
          remise: 5,
          sousTotal: 123.45
        }
      ],
      remiseGlobale: 0,
      total: 123.45,
      statut: 'livrée',
      conditionsLivraison: {
        dateEstimee: '2024-03-12T14:00:00Z'
      }
    },
    {
      id: 'CMD002',
      clientId: '1',
      agenceId: 'AGC1',
      date: '2024-03-05T15:30:00Z',
      lignes: [
        {
          produitId: 'P2',
          quantite: 3,
          prixUnitaire: 45.99,
          remise: 5,
          sousTotal: 131.07
        }
      ],
      remiseGlobale: 0,
      total: 131.07,
      statut: 'livrée',
      conditionsLivraison: {
        dateEstimee: '2024-03-07T14:00:00Z'
      }
    }
  ],
  '2': [
    {
      id: 'CMD003',
      clientId: '2',
      agenceId: 'AGC2',
      date: '2024-03-08T09:15:00Z',
      lignes: [
        {
          produitId: 'P1',
          quantite: 2,
          prixUnitaire: 25.99,
          remise: 3,
          sousTotal: 50.42
        }
      ],
      remiseGlobale: 0,
      total: 50.42,
      statut: 'livrée',
      conditionsLivraison: {
        dateEstimee: '2024-03-10T14:00:00Z'
      }
    }
  ],
  '3': [
    {
      id: 'CMD004',
      clientId: '3',
      agenceId: 'AGC1',
      date: '2024-03-09T16:45:00Z',
      lignes: [
        {
          produitId: 'P3',
          quantite: 10,
          prixUnitaire: 15.99,
          remise: 10,
          sousTotal: 143.91
        }
      ],
      remiseGlobale: 0,
      total: 143.91,
      statut: 'livrée',
      conditionsLivraison: {
        dateEstimee: '2024-03-11T14:00:00Z'
      }
    }
  ]
}

export async function GET() {
  return NextResponse.json(historique)
} 