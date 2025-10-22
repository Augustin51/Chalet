import React from 'react';

const InfoCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-100 h-full">
    <h3 className="text-xl sm:text-2xl font-semibold text-[#2c4b3a] mb-4">
      {title}
    </h3>
    <div className="text-gray-700 text-base leading-relaxed">
      {children}
    </div>
  </div>
);


export default function PracticalInformation() {
  return (
    <section className="bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl">
        
        <h2 className="text-4xl sm:text-5xl font-serif font-bold text-[#2c4b3a] mb-12">
          Informations pratiques
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          
          <InfoCard title="Accès">
            <p>
              Le chalet est facilement accessible en voiture. Garage privé disponible. En hiver, chaînes recommandées selon conditions météo.
            </p>
          </InfoCard>

          <InfoCard title="Règlement">
            <ul className="list-none space-y-2 pl-0">
              <li>• Arrivée : 16h00 - Départ : 10h00</li>
              <li>• Animaux non acceptés</li>
              <li>• Caution demandée</li>
            </ul>
          </InfoCard>

        </div>

        <div className="mb-8">
          <h3 className="text-3xl sm:text-4xl font-serif font-bold text-[#2c4b3a] mb-8">
            Localisation
          </h3>

          <div className="rounded-xl overflow-hidden shadow-inner border border-gray-200 h-150">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d657.5318767539773!2d6.028285152331494!3d46.638269989415505!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x478cffa6580849ef%3A0x4040f39774d4a836!2sG%C3%AEte%20des%20Rocqueries!5e0!3m2!1sfr!2sfr!4v1761141124864!5m2!1sfr!2sfr"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
        
      </div>
    </section>
  );
}