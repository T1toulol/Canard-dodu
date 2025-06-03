import { NextRequest, NextResponse } from 'next/server'
import { store } from '@/data/store'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const commande = store.getCommande(params.id)
  
  if (!commande) {
    return NextResponse.json(
      { error: 'Commande non trouvée' },
      { status: 404 }
    )
  }

  return NextResponse.json(commande)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const data = await request.json()
  const updatedCommande = store.updateCommande(params.id, data)

  if (!updatedCommande) {
    return NextResponse.json(
      { error: 'Commande non trouvée' },
      { status: 404 }
    )
  }

  return NextResponse.json(updatedCommande)
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const deletedCommande = store.deleteCommande(params.id)

  if (!deletedCommande) {
    return NextResponse.json(
      { error: 'Commande non trouvée' },
      { status: 404 }
    )
  }

  return NextResponse.json(deletedCommande)
} 