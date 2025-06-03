export interface Client {
  id: string
  nom: string
  email: string
  telephone: string
  adresse: string
  zoneGeographique: string
  conditionsCommerciales: {
    remiseFixe?: number
    remiseVolume?: number
  }
}

export interface Produit {
  id: string
  nom: string
  description: string
  prix: number
  categorie: string
  stock: {
    [agenceId: string]: number
  }
  image?: string
}

export interface Agence {
  id: string
  nom: string
  adresse: string
  zoneGeographique: string
  stockDisponible: {
    [produitId: string]: number
  }
}

export interface LigneCommande {
  produitId: string
  quantite: number
  prixUnitaire: number
  remise: number
  sousTotal: number
}

export interface Commande {
  id: string
  clientId: string
  agenceId: string
  date: string
  lignes: LigneCommande[]
  remiseGlobale: number
  total: number
  statut: 'brouillon' | 'en_cours' | 'validée' | 'expédiée' | 'livrée' | 'annulée'
  conditionsLivraison?: {
    instructions?: string
  }
}

// État du processus de commande
export interface CommandeEnCours {
  etape: 1 | 2 | 3 | 4 | 5 | 6
  client?: Client
  produitsFiltres?: Produit[]
  lignesCommande: LigneCommande[]
  agence?: Agence
  instructions?: string
  erreurs: string[]
}

export interface CommandePayload {
  client: Client
  agence: Agence
  lignesCommande: LigneCommande[]
  instructions?: string
} 