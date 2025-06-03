export interface Client {
  id: string
  nom: string
  email: string
  telephone: string
  adresse: string
  adresseFacturation: string
}

export interface Produit {
  id: string
  nom: string
  description: string
  prix: number
  stockDisponible: number
  categorie: string
  image: string
}

export interface Remise {
  id: string
  nom: string
  description: string
  type: 'volume' | 'fidélité' | 'promotionnelle'
  valeur: number
  dateDebut: string
  dateFin: string
  conditions?: {
    montantMinimum?: number
    quantiteMinimum?: number
    produitsApplicables?: string[]
    clientsApplicables?: string[]
  }
}

export interface LigneCommande {
  produitId: string
  quantite: number
  prixUnitaire: number
  remise: number
  sousTotal: number
  produit?: Produit
}

export interface Agence {
  id: string
  nom: string
  adresse: string
  zone: string
  telephone: string
  email: string
}

export interface Commande {
  id: string
  clientId: string
  agenceId: string
  date: string
  statut: 'en_cours' | 'validée' | 'expédiée' | 'livrée' | 'annulée'
  lignes: LigneCommande[]
  total: number
  remiseGlobale: number
  conditionsLivraison?: {
    instructions?: string
  }
} 