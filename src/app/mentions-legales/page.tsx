export default function MentionsLegalesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Mentions légales</h1>

      <div className="prose prose-indigo max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Informations légales</h2>
          <p className="text-gray-600 mb-4">
            Le site Canard Dodu est édité par la société Canard Dodu SAS, entreprise spécialisée dans la fabrication 
            et la commercialisation de produits alimentaires haut de gamme (foie gras, charcuteries, plats cuisinés gastronomiques).
          </p>
          <div className="bg-gray-50 rounded-lg p-6 mb-4">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Siège social</h3>
            <p className="text-gray-600">
              123 Avenue des Champs-Élysées<br />
              75008 Paris<br />
              France
            </p>
            <p className="text-gray-600 mt-2">
              Téléphone : 01 23 45 67 89<br />
              Email : contact@canarddodu.fr
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Direction de l'entreprise</h2>
          <ul className="space-y-4">
            <li>
              <strong>PDG :</strong> Pierre Pélissier
            </li>
            <li>
              <strong>Directeur Général :</strong> François Delgas
            </li>
            <li>
              <strong>Directrice Commerciale :</strong> Françoise Delgas-Pélissier
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Implantations</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Siège et Services Centraux</h3>
              <p className="text-gray-600">123 Avenue des Champs-Élysées, 75008 Paris</p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Cuisine Centrale</h3>
              <p className="text-gray-600">Saint-Quentin-en-Yvelines</p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Agences Régionales</h3>
              <ul className="list-disc list-inside text-gray-600 ml-4">
                <li>Agence de Lyon</li>
                <li>Agence de Strasbourg</li>
                <li>Agence de Bordeaux</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Protection des données personnelles</h2>
          <p className="text-gray-600 mb-4">
            Conformément à la loi Informatique et Libertés et au RGPD, vous disposez d'un droit d'accès, 
            de rectification, d'effacement et de portabilité des données vous concernant.
          </p>
          <p className="text-gray-600">
            Pour exercer ces droits ou pour toute question sur le traitement de vos données, 
            vous pouvez contacter notre service client à l'adresse : contact@canarddodu.fr
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Clientèle</h2>
          <p className="text-gray-600">
            Le Canard Dodu commercialise ses produits exclusivement auprès des professionnels :
          </p>
          <ul className="list-disc list-inside text-gray-600 ml-4 mt-2">
            <li>Restaurateurs</li>
            <li>Boutiques de luxe</li>
            <li>Organisateurs de manifestations</li>
            <li>Grande distribution</li>
          </ul>
          <p className="text-gray-600 mt-4">
            Nous ne commercialisons pas directement auprès des particuliers.
          </p>
        </section>
      </div>
    </div>
  )
} 