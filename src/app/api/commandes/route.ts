import { NextResponse } from 'next/server'
import { store } from '@/data/store'
import type { Commande, CommandePayload, LigneCommande } from '@/types/commande'

export async function GET() {
  return NextResponse.json(store.getCommandes())
}

export async function POST(request: Request) {
  const data = await request.json() as CommandePayload
  
  // Validation des données
  if (!data.client || !data.agence || !data.lignesCommande || data.lignesCommande.length === 0) {
    return new NextResponse(
      JSON.stringify({ error: 'Données de commande invalides' }), 
      { status: 400 }
    )
  }

  // Création de la commande avec les champs requis
  const nouvelleCommande = store.addCommande({
    clientId: data.client.id,
    agenceId: data.agence.id,
    lignes: data.lignesCommande,
    total: data.lignesCommande.reduce((sum: number, ligne: LigneCommande) => sum + ligne.sousTotal, 0),
    date: new Date().toISOString(),
    statut: 'en_cours',
    remiseGlobale: 0,
    conditionsLivraison: data.instructions ? { instructions: data.instructions } : undefined
  })

  return NextResponse.json(nouvelleCommande)
}

export async function PUT(request: Request) {
  const data = await request.json()
  const index = store.getCommandes().findIndex(commande => commande.id === data.id)
  if (index === -1) {
    return NextResponse.json({ error: 'Commande non trouvée' }, { status: 404 })
  }
  const updatedCommande = store.updateCommande(data.id, data)
  if (!updatedCommande) {
    return NextResponse.json({ error: 'Erreur lors de la mise à jour' }, { status: 500 })
  }
  return NextResponse.json(updatedCommande)
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!id) {
    return NextResponse.json({ error: 'ID manquant' }, { status: 400 })
  }
  const deletedCommande = store.deleteCommande(id)
  if (!deletedCommande) {
    return NextResponse.json({ error: 'Commande non trouvée' }, { status: 404 })
  }
  return NextResponse.json({ success: true })
} 