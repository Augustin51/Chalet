import React from 'react';

interface PracticalInfoData {
  main_title: string;
  card_access_title: string;
  card_access_content: string;
  card_rules_title: string;
  card_rules_content: string;
  location_title: string;
  location_map_src: string;
}

export default function PracticalInformation({ dataContent }: { dataContent: PracticalInfoData }) {
  if (!dataContent) {
    return <section className="bg-white py-16">Chargement...</section>;
  }

  return (
    <section className="bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl">
        
        <h2 className="text-4xl sm:text-5xl font-serif font-bold text-[#2c4b3a] mb-12">
          {dataContent.main_title}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          
          <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-100 h-full">
            <h3 className="text-xl sm:text-2xl font-semibold text-[#2c4b3a] mb-4">
              {dataContent.card_access_title}
            </h3>
            <div className="text-gray-700 text-base leading-relaxed">
              <p>{dataContent.card_access_content}</p>
            </div>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-100 h-full">
            <h3 className="text-xl sm:text-2xl font-semibold text-[#2c4b3a] mb-4">
              {dataContent.card_rules_title}
            </h3>
            <div className="text-gray-700 text-base leading-relaxed">
              <ul className="list-none space-y-2 pl-0">
                {dataContent.card_rules_content.split('\n').map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
          
        </div>

        <div className="mb-8">
          <h3 className="text-3xl sm:text-4xl font-serif font-bold text-[#2c4b3a] mb-8">
            {dataContent.location_title}
          </h3>

          <div className="rounded-xl overflow-hidden shadow-inner border border-gray-200 h-150">
            <iframe
              src={dataContent.location_map_src}
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