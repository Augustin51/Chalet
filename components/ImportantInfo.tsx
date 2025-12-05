"use client";

import React from 'react';
import Link from 'next/link';
import { useAdmin } from '@/components/AdminProvider';
import { useContentEditor } from '@/utils/useContentEditor';

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
  page?: string;
}

export default function ImportantInfo({ dataContent, dataInfoItems, page = 'calendrier' }: ImportantInfoProps) {
  const isAdmin = useAdmin();
  const { handleUpdate } = useContentEditor(page, 'ImportantInfo');

  async function updateInfoItem(id: number, text: string) {
    try {
      await fetch('/api/infoitem/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, text }),
      });
    } catch (err) {
      console.error('Failed to update info item', err);
    }
  }

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
          {isAdmin ? (
            <input
              type="text"
              defaultValue={dataContent.title}
              onBlur={(e) => handleUpdate(e, 'title')}
              onKeyDown={(e) => handleUpdate(e, 'title')}
              onInput={(e: any) => e.target.size = e.target.value.length + 1}
              className="text-2xl font-semibold text-[#2c4b3a] bg-transparent border-transparent focus:border-[#2c4b3a]/30 focus:bg-white/5 p-2 rounded transition-colors"
              size={dataContent.title.length + 1}
            />
          ) : (
            <h3 className="text-2xl font-semibold text-[#2c4b3a]">{dataContent.title}</h3>
          )}
        </div>

        <ul className="list-disc ml-6 space-y-2 text-gray-700 text-base mb-8">
          {dataInfoItems.map((item) => (
            <li key={item.id} className="marker:text-[#467A5E]">
              {isAdmin ? (
                <input
                  type="text"
                  defaultValue={item.text}
                  onBlur={(e) => updateInfoItem(item.id, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      updateInfoItem(item.id, (e.target as HTMLInputElement).value);
                      (e.target as HTMLInputElement).blur();
                    }
                  }}
                  onInput={(e: any) => e.target.size = e.target.value.length + 1}
                  className="text-gray-700 text-base bg-transparent border-transparent focus:border-[#467A5E]/30 focus:bg-white/5 p-1 rounded transition-colors"
                  size={item.text.length + 1}
                />
              ) : (
                item.text
              )}
            </li>
          ))}
        </ul>
        
        <div className="border-t border-gray-200 pt-6 flex flex-col items-center">
          
          <p className="text-sm text-gray-500 mb-4 text-center">
            {isAdmin ? (
              <input
                type="text"
                defaultValue={dataContent.platform_text}
                onBlur={(e) => handleUpdate(e, 'platform_text')}
                onKeyDown={(e) => handleUpdate(e, 'platform_text')}
                onInput={(e: any) => e.target.size = e.target.value.length + 1}
                className="text-sm text-gray-500 text-center bg-transparent border-transparent focus:border-gray-500/30 focus:bg-white/5 p-1 rounded transition-colors"
                size={dataContent.platform_text.length + 1}
              />
            ) : (
              dataContent.platform_text
            )}
          </p>
          
          {isAdmin ? (
            <div className="flex flex-col gap-2 w-full max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  defaultValue={dataContent.cta_contact_text}
                  onBlur={(e) => handleUpdate(e, 'cta_contact_text')}
                  onKeyDown={(e) => handleUpdate(e, 'cta_contact_text')}
                  className="px-6 py-2 border border-[#467A5E] bg-[#467A5E] text-white rounded-full text-sm font-medium text-center flex-1 focus:border-white/50 focus:bg-[#346048] transition-colors"
                  placeholder="Contact link"
                />
                <input
                  type="text"
                  defaultValue={dataContent.cta_platform_text}
                  onBlur={(e) => handleUpdate(e, 'cta_platform_text')}
                  onKeyDown={(e) => handleUpdate(e, 'cta_platform_text')}
                  className="px-6 py-2 border border-gray-300 text-gray-700 bg-white rounded-full text-sm font-medium text-center flex-1 focus:border-gray-500/50 focus:bg-gray-50 transition-colors"
                  placeholder="Platform link"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  defaultValue={dataContent.cta_contact_link}
                  onBlur={(e) => handleUpdate(e, 'cta_contact_link')}
                  onKeyDown={(e) => handleUpdate(e, 'cta_contact_link')}
                  className="text-xs text-gray-600 bg-transparent border-transparent focus:border-gray-600/30 focus:bg-white/5 p-1 rounded text-center flex-1 transition-colors"
                  placeholder="Contact CTA text"
                />
                <input
                  type="text"
                  defaultValue={dataContent.cta_platform_link}
                  onBlur={(e) => handleUpdate(e, 'cta_platform_link')}
                  onKeyDown={(e) => handleUpdate(e, 'cta_platform_link')}
                  className="text-xs text-gray-600 bg-transparent border-transparent focus:border-gray-600/30 focus:bg-white/5 p-1 rounded text-center flex-1 transition-colors"
                  placeholder="Platform CTA text"
                />
              </div>              
            </div>
          ) : (
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
          )}
        </div>

      </div>
    </div>
  );
}