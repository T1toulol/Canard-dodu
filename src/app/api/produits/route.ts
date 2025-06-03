import { NextResponse } from 'next/server'
import type { Produit } from '@/types/commande'

// Données temporaires pour l'exemple
let produits: Produit[] = [
  {
    id: '1',
    nom: 'Canard Entier Label Rouge',
    description: 'Canard fermier Label Rouge, élevé en plein air',
    prix: 49.90,
    categorie: 'Volailles',
    stock: {
      'AGC1': 30,
      'AGC2': 20
    },
    image: '/images/produits/canard-prepare.png'
  },
  {
    id: '2',
    nom: 'Magret de Canard',
    description: 'Magret de canard du Sud-Ouest, environ 350g',
    prix: 19.95,
    categorie: 'Volailles',
    stock: {
      'AGC1': 50,
      'AGC2': 50
    },
    image: '/images/produits/magret-canard.png'
  },
  {
    id: '3',
    nom: 'Foie Gras de Canard Entier',
    description: 'Foie gras de canard entier mi-cuit, 250g',
    prix: 39.90,
    categorie: 'Foie Gras',
    stock: {
      'AGC1': 15,
      'AGC2': 15
    },
    image: '/images/produits/foie-gras.png'
  },
  {
    id: '4',
    nom: 'Confit de Canard',
    description: 'Cuisses de canard confites, lot de 2',
    prix: 24.90,
    categorie: 'Conserves',
    stock: {
      'AGC1': 40,
      'AGC2': 35
    },
    image: '/images/produits/confit-canard.png'
  }
]

export async function GET() {
  return NextResponse.json(produits)
}

export async function POST(request: Request) {
  const data = await request.json()
  
  // Validation des données
  if (!data.nom || !data.prix || data.prix <= 0 || !data.categorie || !data.stock) {
    return new NextResponse(
      JSON.stringify({ error: 'Données produit invalides' }), 
      { status: 400 }
    )
  }

  // Création du produit
  const nouveauProduit: Produit = {
    id: (produits.length + 1).toString(),
    stock: data.stock || {},
    image: data.image,
    ...data
  }

  produits.push(nouveauProduit)
  return NextResponse.json(nouveauProduit)
}

export async function PUT(request: Request) {
  const data = await request.json()
  const index = produits.findIndex(produit => produit.id === data.id)
  if (index === -1) {
    return NextResponse.json({ error: 'Produit non trouvé' }, { status: 404 })
  }
  produits[index] = { ...produits[index], ...data }
  return NextResponse.json(produits[index])
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!id) {
    return NextResponse.json({ error: 'ID manquant' }, { status: 400 })
  }
  const index = produits.findIndex(produit => produit.id === id)
  if (index === -1) {
    return NextResponse.json({ error: 'Produit non trouvé' }, { status: 404 })
  }
  produits = produits.filter(produit => produit.id !== id)
  return NextResponse.json({ success: true })
} 