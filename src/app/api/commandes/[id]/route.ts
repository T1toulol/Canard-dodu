import { NextRequest, NextResponse } from 'next/server'
import { store } from '@/data/store'

type RouteContext = {
  params: {
    id: string
  }
}

export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  const commande = store.getCommande(context.params.id)
  
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
  context: RouteContext
) {
  const data = await request.json()
  const updatedCommande = store.updateCommande(context.params.id, data)

  if (!updatedCommande) {
    return new NextResponse(
      JSON.stringify({ error: 'Commande non trouvée' }), 
      { status: 404 }
    )
  }

  return NextResponse.json(updatedCommande)
}

export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  const deletedCommande = store.deleteCommande(context.params.id)

  if (!deletedCommande) {
    return new NextResponse(
      JSON.stringify({ error: 'Commande non trouvée' }), 
      { status: 404 }
    )
  }

  return NextResponse.json(deletedCommande)
} 