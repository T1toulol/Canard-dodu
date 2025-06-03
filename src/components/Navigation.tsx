'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/', label: 'Accueil' },
  { href: '/clients', label: 'Clients' },
  { href: '/produits', label: 'Produits' },
  { href: '/commandes', label: 'Commandes' },
  { href: '/agences', label: 'Agences' },
  { href: '/remises', label: 'Remises' }
]

export default function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-indigo-600">Canard Dodu</span>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {links.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    pathname === href
                      ? 'border-indigo-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
          
          {/* Bouton de login */}
          <div className="flex items-center">
            <button
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg
                className="h-5 w-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              Connexion Client
            </button>
          </div>
        </div>
      </div>

      {/* Navigation mobile */}
      <div className="sm:hidden">
        <div className="pt-2 pb-3 space-y-1">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                pathname === href
                  ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                  : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
              }`}
            >
              {label}
            </Link>
          ))}
          
          {/* Bouton de login en version mobile */}
          <div className="px-3 py-2">
            <button
              className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg
                className="h-5 w-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              Connexion Client
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
} 