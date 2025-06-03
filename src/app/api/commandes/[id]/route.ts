import { NextRequest, NextResponse } from 'next/server'
import { store } from '@/data/store'

type Props = {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function GET(request: NextRequest, props: Props) {
  const commande = store.getCommande(props.params.id)
  
  if (!commande) {
    return new NextResponse(
      JSON.stringify({ error: 'Commande non trouvée' }), 
      { status: 404 }
    )
  }

  return NextResponse.json(commande)
}

export async function PUT(request: NextRequest, props: Props) {
  const data = await request.json()
  const updatedCommande = store.updateCommande(props.params.id, data)

  if (!updatedCommande) {
    return new NextResponse(
      JSON.stringify({ error: 'Commande non trouvée' }), 
      { status: 404 }
    )
  }

  return NextResponse.json(updatedCommande)
}

export async function DELETE(request: NextRequest, props: Props) {
  const deletedCommande = store.deleteCommande(props.params.id)

  if (!deletedCommande) {
    return new NextResponse(
      JSON.stringify({ error: 'Commande non trouvée' }), 
      { status: 404 }
    )
  }

  return NextResponse.json(deletedCommande)
} 