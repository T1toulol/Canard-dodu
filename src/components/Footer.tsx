'use client'

import React from 'react'
import Link from 'next/link'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Coordonnées de l'entreprise */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Canard Dodu</h3>
            <address className="not-italic">
              <p>Siège social :</p>
              <p>123 Avenue des Champs-Élysées</p>
              <p>75008 Paris, France</p>
              <p className="mt-2">Tél : 01 23 45 67 89</p>
              <p>Email : contact@canarddodu.fr</p>
            </address>
          </div>

          {/* Nos agences */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Nos agences</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/agences" className="hover:text-indigo-400">
                  Paris
                </Link>
              </li>
              <li>
                <Link href="/agences" className="hover:text-indigo-400">
                  Lyon
                </Link>
              </li>
              <li>
                <Link href="/agences" className="hover:text-indigo-400">
                  Bordeaux
                </Link>
              </li>
            </ul>
          </div>

          {/* Horaires */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Horaires d'ouverture</h3>
            <ul className="space-y-2">
              <li>Lundi - Vendredi : 9h00 - 19h00</li>
              <li>Samedi : 10h00 - 18h00</li>
              <li>Dimanche : Fermé</li>
            </ul>
          </div>

          {/* Liens utiles */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Informations</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/mentions-legales" className="hover:text-indigo-400">
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link href="/cgv" className="hover:text-indigo-400">
                  CGV
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-indigo-400">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800">
          <p className="text-center text-gray-400">
            © {new Date().getFullYear()} Canard Dodu. Tous droits réservés.
            <br />
            SIRET : 123 456 789 00012 - TVA : FR 12 345 678 900
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer 