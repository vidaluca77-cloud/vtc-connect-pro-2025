'use client';

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
                VTC Connect Pro est une plateforme de mise en relation entre les clients 
                et les chauffeurs de véhicules de transport avec chauffeur (VTC). 
                Notre service facilite la réservation et la gestion des courses.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                3. Utilisation du service
              </h2>
              <p className="text-gray-700 mb-4">
                Vous vous engagez à utiliser notre service de manière légale et 
                respectueuse. Toute utilisation abusive ou frauduleuse est interdite 
                et peut entraîner la suspension de votre compte.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                4. Responsabilités
              </h2>
              <p className="text-gray-700 mb-4">
                VTC Connect Pro agit comme intermédiaire entre les clients et les chauffeurs. 
                Nous nous efforçons de fournir un service de qualité mais ne pouvons 
                garantir la disponibilité permanente de la plateforme.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                5. Modifications des conditions
              </h2>
              <p className="text-gray-700 mb-4">
                Nous nous réservons le droit de modifier ces conditions d'utilisation 
                à tout moment. Les modifications entrent en vigueur dès leur publication 
                sur cette page.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                6. Contact
              </h2>
              <p className="text-gray-700 mb-4">
                Pour toute question concernant ces conditions d'utilisation, 
                vous pouvez nous contacter à l'adresse : contact@vtc-connect-pro.com
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
