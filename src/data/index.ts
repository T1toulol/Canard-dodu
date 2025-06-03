import type { Client, Produit, Commande, Agence } from '@/types'

// Données temporaires pour l'exemple
const initialClients: Client[] = [
  {
    id: '1',
    nom: 'Restaurant Le Gourmet',
    email: 'contact@legourmet.fr',
    telephone: '01 23 45 67 89',
    adresse: '15 Rue de la Gastronomie, 75001 Paris',
    adresseFacturation: '15 Rue de la Gastronomie, 75001 Paris'
  },
  {
    id: '2',
    nom: 'Bistrot Chez Marcel',
    email: 'marcel@bistrot.fr',
    telephone: '01 98 76 54 32',
    adresse: '42 Avenue des Saveurs, 75002 Paris',
    adresseFacturation: '42 Avenue des Saveurs, 75002 Paris'
  },
  {
    id: '3',
    nom: 'Hôtel Le Magnifique',
    email: 'reservation@magnifique.fr',
    telephone: '01 45 67 89 10',
    adresse: '8 Place de l\'Élégance, 75008 Paris',
    adresseFacturation: '8 Place de l\'Élégance, 75008 Paris'
  }
]

const initialProduits: Produit[] = [
  {
    id: '1',
    nom: 'Canard Entier Label Rouge',
    description: 'Canard fermier Label Rouge, élevé en plein air',
    prix: 49.90,
    stockDisponible: 50,
    categorie: 'Volailles',
    image: '/images/canard-entier.jpg'
  },
  {
    id: '2',
    nom: 'Magret de Canard',
    description: 'Magret de canard du Sud-Ouest, environ 350g',
    prix: 19.95,
    stockDisponible: 100,
    categorie: 'Volailles',
    image: '/images/magret.jpg'
  },
  {
    id: '3',
    nom: 'Foie Gras de Canard Entier',
    description: 'Foie gras de canard entier mi-cuit, 250g',
    prix: 39.90,
    stockDisponible: 30,
    categorie: 'Foie Gras',
    image: '/images/foie-gras.jpg'
  },
  {
    id: '4',
    nom: 'Confit de Canard',
    description: 'Cuisses de canard confites, lot de 2',
    prix: 24.90,
    stockDisponible: 75,
    categorie: 'Conserves',
    image: '/images/confit.jpg'
  }
]

const initialAgences: Agence[] = [
  {
    id: '1',
    nom: 'Canard Dodu Paris',
    adresse: '123 Avenue de la Volaille, 75011 Paris',
    zone: 'Île-de-France',
    telephone: '01 23 45 67 89',
    email: 'paris@canard-dodu.fr'
  },
  {
    id: '2',
    nom: 'Canard Dodu Lyon',
    adresse: '45 Rue de la Gastronomie, 69002 Lyon',
    zone: 'Rhône-Alpes',
    telephone: '04 78 12 34 56',
    email: 'lyon@canard-dodu.fr'
  }
]

// Commandes par défaut
const initialCommandes: Commande[] = [
  {
    id: '1',
    clientId: '1',
    date: new Date().toISOString(),
    dateCréation: new Date().toISOString(),
    statutCommande: 'en_cours',
    produits: [
      { produitId: '1', quantite: 2, montantRemise: 0 },
      { produitId: '2', quantite: 1, montantRemise: 0 }
    ],
    total: 119.75,
    agenceAffectee: '1'
  },
  {
    id: '2',
    clientId: '2',
    date: new Date().toISOString(),
    dateCréation: new Date().toISOString(),
    statutCommande: 'validée',
    produits: [
      { produitId: '3', quantite: 3, montantRemise: 0 },
      { produitId: '4', quantite: 2, montantRemise: 0 }
    ],
    total: 169.50,
    agenceAffectee: '2'
  }
]

// Données mutables
export let clients = [...initialClients]
export let produits = [...initialProduits]
export let agences = [...initialAgences]
export let commandes = [...initialCommandes]

// Fonction pour réinitialiser les données
export function resetData() {
  clients = [...initialClients]
  produits = [...initialProduits]
  agences = [...initialAgences]
  commandes = [...initialCommandes]
} 