export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            Conditions d'utilisation
          </h1>
          
          <div className="prose prose-lg max-w-none">
            <div className="mb-8">
              <p className="text-gray-600 text-sm mb-4">
                Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
              </p>
              <p className="text-lg text-gray-700">
                Bienvenue sur VTC Connect Pro. En utilisant notre service, vous acceptez 
                les présentes conditions d'utilisation.
              </p>
            </div>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                1. Acceptation des conditions
              </h2>
              <p className="text-gray-700 mb-4">
                En accédant et en utilisant la plateforme VTC Connect Pro, vous reconnaissez 
                avoir lu, compris et accepté d'être lié par ces conditions d'utilisation 
                et notre politique de confidentialité.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                2. Description du service
              </h2>
              <p className="text-gray-700 mb-4">
                VTC Connect Pro est une plateforme de gestion pour chauffeurs VTC qui propose :
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Gestion des courses et planification</li>
                <li>Suivi des revenus et comptabilité</li>
                <li>Outils d'optimisation des trajets</li>
                <li>Communauté de chauffeurs VTC</li>
                <li>Assistant IA pour l'aide à la gestion</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                3. Conditions d'éligibilité
              </h2>
              <p className="text-gray-700 mb-4">
                Pour utiliser VTC Connect Pro, vous devez :
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Être âgé de 18 ans minimum</li>
                <li>Posséder une licence VTC valide</li>
                <li>Disposer d'un véhicule conforme à la réglementation VTC</li>
                <li>Être en règle avec vos obligations fiscales et sociales</li>
                <li>Fournir des informations exactes lors de l'inscription</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                4. Compte utilisateur et sécurité
              </h2>
              <p className="text-gray-700 mb-4">
                Vous êtes responsable de maintenir la confidentialité de vos identifiants 
                de connexion et de toutes les activités qui se déroulent sous votre compte. 
                Vous devez nous informer immédiatement de toute utilisation non autorisée 
                de votre compte.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                5. Utilisation acceptable
              </h2>
              <p className="text-gray-700 mb-4">
                Vous acceptez de ne pas utiliser VTC Connect Pro pour :
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Des activités illégales ou non autorisées</li>
                <li>Violer les droits de tiers</li>
                <li>Transmettre des virus ou codes malveillants</li>
                <li>Contourner les mesures de sécurité de la plateforme</li>
                <li>Utiliser des robots ou scripts automatisés</li>
                <li>Collecter des données d'autres utilisateurs</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                6. Données et confidentialité
              </h2>
              <p className="text-gray-700 mb-4">
                Nous nous engageons à protéger vos données personnelles conformément au RGPD 
                et à notre politique de confidentialité. Vos données de course et financières 
                sont chiffrées et stockées de manière sécurisée.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                7. Tarification et paiements
              </h2>
              <p className="text-gray-700 mb-4">
                L'utilisation de base de VTC Connect Pro est gratuite. Des fonctionnalités 
                premium peuvent être proposées avec des frais d'abonnement. Tous les prix 
                sont indiqués en euros TTC.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                8. Propriété intellectuelle
              </h2>
              <p className="text-gray-700 mb-4">
                Tous les contenus, marques, logos et éléments de design de VTC Connect Pro 
                sont la propriété exclusive de notre société et sont protégés par le droit 
                de la propriété intellectuelle.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                9. Limitation de responsabilité
              </h2>
              <p className="text-gray-700 mb-4">
                VTC Connect Pro est fourni "en l'état". Nous ne garantissons pas que le service 
                sera ininterrompu ou exempt d'erreurs. Notre responsabilité est limitée dans 
                les conditions prévues par la loi française.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                10. Résiliation
              </h2>
              <p className="text-gray-700 mb-4">
                Vous pouvez fermer votre compte à tout moment. Nous nous réservons le droit 
                de suspendre ou fermer votre compte en cas de violation de ces conditions 
                d'utilisation.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                11. Modifications des conditions
              </h2>
              <p className="text-gray-700 mb-4">
                Nous nous réservons le droit de modifier ces conditions d'utilisation. 
                Les modifications importantes vous seront notifiées par email ou via la plateforme.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                12. Droit applicable et juridiction
              </h2>
              <p className="text-gray-700 mb-4">
                Ces conditions d'utilisation sont régies par le droit français. 
                Tout litige sera soumis aux tribunaux français compétents.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                13. Contact
              </h2>
              <p className="text-gray-700 mb-4">
                Pour toute question concernant ces conditions d'utilisation, 
                vous pouvez nous contacter :
              </p>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-700 mb-2">
                  <strong>Email :</strong> legal@vtcconnectpro.fr
                </p>
                <p className="text-gray-700 mb-2">
                  <strong>Adresse :</strong> VTC Connect Pro, 123 Rue de la Tech, 75001 Paris, France
                </p>
                <p className="text-gray-700">
                  <strong>Téléphone :</strong> +33 1 23 45 67 89
                </p>
              </div>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <button 
                onClick={() => window.history.back()}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                ← Retour
              </button>
              <button 
                onClick={() => window.print()}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                📄 Imprimer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
