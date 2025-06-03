import { NextRequest, NextResponse } from 'next/server'
import { store } from '@/data/store'

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const commande = store.getCommande(params.id)
  
  if (!commande) {
    return new NextResponse(
      JSON.stringify({ error: 'Commande non trouvée' }), 
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
    return new NextResponse(
      JSON.stringify({ error: 'Commande non trouvée' }), 
      { status: 404 }
    )
  }

  return NextResponse.json(updatedCommande)
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const deletedCommande = store.deleteCommande(params.id)

  if (!deletedCommande) {
    return new NextResponse(
      JSON.stringify({ error: 'Commande non trouvée' }), 
      { status: 404 }
    )
  }

  return NextResponse.json(deletedCommande)
} 