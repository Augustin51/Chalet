import React from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function ContactForm() {
  return (
    <section className="bg-white py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">

          <div className="space-y-8">
            <h2 className="text-4xl sm:text-5xl font-serif font-bold text-[#2c4b3a]">
              Nos coordonnées
            </h2>

            <div className="space-y-4">
              
              <div className="bg-white p-4 sm:p-5 rounded-lg shadow-sm border border-gray-100 flex items-start">
                <MapPin className="h-6 w-6 text-[#467A5E] mr-4 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-lg font-semibold text-[#2c4b3a] mb-0.5">Adresse</h3>
                  <div className="text-gray-700 text-base">
                    <address className="not-italic">
                      123 Rue des Sapins<br />
                      39220 Les Rousses<br />
                      Jura, France
                    </address>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 sm:p-5 rounded-lg shadow-sm border border-gray-100 flex items-start">
                <Phone className="h-6 w-6 text-[#467A5E] mr-4 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-lg font-semibold text-[#2c4b3a] mb-0.5">Téléphone</h3>
                  <div className="text-gray-700 text-base">
                    <p>+33 (0)3 84 00 00 00</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 sm:p-5 rounded-lg shadow-sm border border-gray-100 flex items-start">
                <Mail className="h-6 w-6 text-[#467A5E] mr-4 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-lg font-semibold text-[#2c4b3a] mb-0.5">Email</h3>
                  <div className="text-gray-700 text-base">
                    <p>contact@refugehautjura.fr</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 sm:p-5 rounded-lg shadow-sm border border-gray-100 flex items-start">
                <Clock className="h-6 w-6 text-[#467A5E] mr-4 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-lg font-semibold text-[#2c4b3a] mb-0.5">Disponibilité</h3>
                  <div className="text-gray-700 text-base">
                    <p>Lun - Dim : 9h - 19h</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-lg">
            <h2 className="text-4xl sm:text-5xl font-serif font-bold text-[#2c4b3a] mb-6">
              Envoyez-nous un message
            </h2>
            
            <form className="space-y-4">
              
              <div>
                <label htmlFor="name" className="text-sm font-medium text-gray-700 block mb-1">Nom complet *</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  placeholder="Jean Dupont"
                  required 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-[#467A5E] focus:border-[#467A5E]" 
                />
              </div>
              
              <div>
                <label htmlFor="email" className="text-sm font-medium text-gray-700 block mb-1">Email *</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  placeholder="jean.dupont@exemple.fr"
                  required 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-[#467A5E] focus:border-[#467A5E]" 
                />
              </div>

              <div>
                <label htmlFor="phone" className="text-sm font-medium text-gray-700 block mb-1">Téléphone</label>
                <input 
                  type="tel" 
                  id="phone" 
                  name="phone" 
                  placeholder="+33 6 00 00 00 00"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-[#467A5E] focus:border-[#467A5E]" 
                />
              </div>

              <div>
                <label htmlFor="message" className="text-sm font-medium text-gray-700 block mb-1">Message *</label>
                <textarea 
                  id="message" 
                  name="message" 
                  rows={5} 
                  placeholder="Bonjour, je souhaiterais réserver le chalet pour..."
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-[#467A5E] focus:border-[#467A5E] resize-none"
                ></textarea>
              </div>

              <button 
                type="submit" 
                className="w-full px-6 py-3 bg-[#467A5E] text-white font-semibold rounded-lg hover:bg-[#346048] transition-colors"
              >
                Envoyer le message
              </button>
              
              <p className="text-xs text-gray-500 text-center pt-2">
                Vos données sont protégées et ne seront jamais partagées.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}