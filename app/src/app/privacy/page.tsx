'use client';

import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

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
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-gray-800">
                1. Introduction
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                VTC Connect Pro ("nous", "notre", "nos") s'engage à protéger et respecter votre vie privée. 
                Cette politique de confidentialité explique comment nous collectons, utilisons, stockons et 
                protégeons vos informations personnelles lorsque vous utilisez notre plateforme de gestion 
                pour chauffeurs VTC.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-gray-800">
                2. Informations que nous collectons
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    2.1 Informations d'identification personnelle
                  </h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Nom et prénom</li>
                    <li>Adresse e-mail</li>
                    <li>Numéro de téléphone</li>
                    <li>Adresse postale</li>
                    <li>Numéro de permis de conduire</li>
                    <li>Informations sur la licence VTC</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    2.2 Données d'utilisation
                  </h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Historique des courses</li>
                    <li>Données de géolocalisation</li>
                    <li>Informations sur les véhicules</li>
                    <li>Données de performance et statistiques</li>
                    <li>Logs de connexion et d'utilisation</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-gray-800">
                3. Comment nous utilisons vos informations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Fournir et maintenir notre service de plateforme VTC</li>
                <li>Gérer votre compte et vos préférences</li>
                <li>Traiter les paiements et transactions</li>
                <li>Améliorer notre service et développer de nouvelles fonctionnalités</li>
                <li>Vous envoyer des notifications importantes sur le service</li>
                <li>Assurer la sécurité et prévenir la fraude</li>
                <li>Respecter nos obligations légales et réglementaires</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-gray-800">
                4. Partage de vos informations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  Nous ne vendons, ne louons ni ne partageons vos informations personnelles avec des tiers, 
                  sauf dans les cas suivants :
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Avec votre consentement explicite</li>
                  <li>Pour respecter les obligations légales</li>
                  <li>Avec nos prestataires de services de confiance (sous contrat strict)</li>
                  <li>En cas de fusion, acquisition ou vente d'actifs</li>
                  <li>Pour protéger nos droits, notre propriété ou notre sécurité</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-gray-800">
                5. Sécurité des données
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                Nous mettons en place des mesures de sécurité techniques et organisationnelles appropriées 
                pour protéger vos informations personnelles contre l'accès non autorisé, la modification, 
                la divulgation ou la destruction. Cela inclut le chiffrement des données, l'authentification 
                sécurisée et des contrôles d'accès stricts.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-gray-800">
                6. Vos droits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  Conformément au RGPD, vous disposez des droits suivants :
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Droit d'accès à vos données personnelles</li>
                  <li>Droit de rectification des données inexactes</li>
                  <li>Droit à l'effacement ("droit à l'oubli")</li>
                  <li>Droit à la limitation du traitement</li>
                  <li>Droit à la portabilité des données</li>
                  <li>Droit d'opposition au traitement</li>
                  <li>Droit de retirer votre consentement</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-4">
                  Pour exercer ces droits, contactez-nous à l'adresse : privacy@vtcconnectpro.com
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-gray-800">
                7. Conservation des données
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                Nous conservons vos informations personnelles aussi longtemps que nécessaire pour 
                fournir nos services, respecter nos obligations légales, résoudre les litiges et 
                faire respecter nos accords. Les données inactives sont supprimées après une période 
                de 3 ans d'inactivité, sauf obligation légale contraire.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-gray-800">
                8. Cookies et technologies similaires
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                Notre plateforme utilise des cookies et technologies similaires pour améliorer votre 
                expérience, analyser l'utilisation du service et personnaliser le contenu. Vous pouvez 
                gérer vos préférences de cookies dans les paramètres de votre navigateur.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-gray-800">
                9. Modifications de cette politique
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                Nous pouvons mettre à jour cette politique de confidentialité de temps à autre. 
                Nous vous notifierons de tout changement important en publiant la nouvelle politique 
                sur cette page et en vous informant par e-mail si nécessaire.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-gray-800">
                10. Contact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-gray-700 leading-relaxed">
                  Pour toute question concernant cette politique de confidentialité ou le traitement 
                  de vos données personnelles, vous pouvez nous contacter :
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700"><strong>Email :</strong> privacy@vtcconnectpro.com</p>
                  <p className="text-gray-700"><strong>Adresse :</strong> VTC Connect Pro, 123 Avenue des Champs-Élysées, 75008 Paris, France</p>
                  <p className="text-gray-700"><strong>Téléphone :</strong> +33 1 23 45 67 89</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
