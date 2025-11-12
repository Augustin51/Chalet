import React from 'react';
import Link from 'next/link';

interface InfoContent {
  title: string;
  platform_text: string;
  cta_contact_text: string;
  cta_contact_link: string;
  cta_platform_text: string;
  cta_platform_link: string;
}
interface InfoItem {
  id: number;
  text: string;
}

interface ImportantInfoProps {
  dataContent: InfoContent;
  dataInfoItems: InfoItem[];
}

export default function ImportantInfo({ dataContent, dataInfoItems }: ImportantInfoProps) {
  if (!dataContent || !dataInfoItems) {
    return <div className="container mx-auto my-9">Chargement...</div>;
  }
  return (
    <div className="container mx-auto my-9 max-w-4xl px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-6 sm:p-10 rounded-2xl shadow-xl border border-gray-100">
        <div className="flex items-start mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 mt-1 text-[#467A5E] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-2xl font-semibold text-[#2c4b3a]">
            {dataContent.title}
          </h3>
        </div>

        <ul className="list-disc ml-6 space-y-2 text-gray-700 text-base mb-8">
          {dataInfoItems.map((item) => (
            <li key={item.id} className="marker:text-[#467A5E]">
              {item.text}
            </li>
          ))}
        </ul>
        
        <div className="border-t border-gray-200 pt-6 flex flex-col items-center">
          
          <p className="text-sm text-gray-500 mb-4 text-center">
            {dataContent.platform_text}
          </p>
          
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
            <Link 
              href={dataContent.cta_contact_link}
              className="px-6 py-2 border border-[#467A5E] bg-[#467A5E] text-white rounded-full hover:bg-[#346048] transition-colors text-sm font-medium text-center"
            >
              {dataContent.cta_contact_text}
            </Link>
            
            <Link 
              href={dataContent.cta_platform_link}
              className="px-6 py-2 border border-gray-300 text-gray-700 bg-white rounded-full hover:bg-gray-50 transition-colors text-sm font-medium text-center"
            >
              {dataContent.cta_platform_text}
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}