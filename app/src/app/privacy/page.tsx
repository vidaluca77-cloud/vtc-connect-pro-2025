'use client';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Politique de Confidentialité
          </h1>
          <p className="text-xl text-gray-600">
            VTC Connect Pro
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
          </p>
        </div>
        
        <div className="space-y-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-4">
              <h2 className="text-2xl font-semibold text-gray-800">
                1. Introduction
              </h2>
            </div>
            <div>
              <p className="text-gray-700 leading-relaxed">
                VTC Connect Pro ("nous", "notre", "nos") s'engage à protéger et respecter votre vie privée. 
                Cette politique de confidentialité explique comment nous collectons, utilisons, stockons et 
                protégeons vos informations personnelles lorsque vous utilisez notre plateforme de gestion 
                pour chauffeurs VTC.
              </p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-4">
              <h2 className="text-2xl font-semibold text-gray-800">
                2. Informations que nous collectons
              </h2>
            </div>
            <div>
              <p className="text-gray-700 leading-relaxed mb-4">
                Nous collectons les types d'informations suivants :
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Informations d'identification personnelle (nom, email, téléphone)</li>
                <li>Informations de géolocalisation pour les services VTC</li>
                <li>Données de transaction et de paiement</li>
                <li>Informations sur l'utilisation de la plateforme</li>
                <li>Données techniques (adresse IP, type de navigateur)</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-4">
              <h2 className="text-2xl font-semibold text-gray-800">
                3. Utilisation des informations
              </h2>
            </div>
            <div>
              <p className="text-gray-700 leading-relaxed mb-4">
                Nous utilisons vos informations pour :
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Fournir et améliorer nos services VTC</li>
                <li>Traiter les paiements et gérer les réservations</li>
                <li>Communiquer avec vous concernant votre compte</li>
                <li>Assurer la sécurité de notre plateforme</li>
                <li>Respecter nos obligations légales</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-4">
              <h2 className="text-2xl font-semibold text-gray-800">
                4. Partage des informations
              </h2>
            </div>
            <div>
              <p className="text-gray-700 leading-relaxed">
                Nous ne vendons pas vos informations personnelles. Nous pouvons les partager uniquement 
                dans les cas suivants : avec votre consentement explicite, pour se conformer à la loi, 
                avec nos partenaires de service essentiels, ou en cas de fusion ou acquisition.
              </p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-4">
              <h2 className="text-2xl font-semibold text-gray-800">
                5. Sécurité des données
              </h2>
            </div>
            <div>
              <p className="text-gray-700 leading-relaxed">
                Nous mettons en place des mesures de sécurité techniques et organisationnelles appropriées 
                pour protéger vos informations contre l'accès non autorisé, la perte, la destruction ou 
                l'altération. Cela inclut le chiffrement des données, l'authentification sécurisée et 
                des audits de sécurité réguliers.
              </p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-4">
              <h2 className="text-2xl font-semibold text-gray-800">
                6. Vos droits
              </h2>
            </div>
            <div>
              <p className="text-gray-700 leading-relaxed mb-4">
                Conformément au RGPD, vous disposez des droits suivants :
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Droit d'accès à vos données personnelles</li>
                <li>Droit de rectification des informations inexactes</li>
                <li>Droit à l'effacement de vos données</li>
                <li>Droit à la portabilité des données</li>
                <li>Droit d'opposition au traitement</li>
                <li>Droit à la limitation du traitement</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-4">
              <h2 className="text-2xl font-semibold text-gray-800">
                7. Conservation des données
              </h2>
            </div>
            <div>
              <p className="text-gray-700 leading-relaxed">
                Nous conservons vos informations personnelles uniquement pendant la durée nécessaire 
                aux finalités pour lesquelles elles ont été collectées, ou selon les exigences légales 
                applicables. Les données inactives sont supprimées ou anonymisées après 3 ans d'inactivité.
              </p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-4">
              <h2 className="text-2xl font-semibold text-gray-800">
                8. Contact
              </h2>
            </div>
            <div>
              <p className="text-gray-700 leading-relaxed">
                Pour toute question concernant cette politique de confidentialité ou pour exercer 
                vos droits, contactez-nous à l'adresse : privacy@vtcconnectpro.com ou par courrier 
                à notre siège social.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
