"use client";

import { Euro } from "lucide-react";
import { useAdmin } from "@/components/AdminProvider";
import { useContentEditor } from "@/utils/useContentEditor";

interface PriceContent {
  title: string;
  subtitle: string;
}
interface PriceTierItem {
  id: number;
  title: string;
  period: string;
  price: string;
  description: string;
}

interface PriceProps {
  dataContent: PriceContent;
  dataPriceTiers: PriceTierItem[];
  page?: string;
}

export default function Price({ dataContent, dataPriceTiers, page = 'calendrier' }: PriceProps) {
  const isAdmin = useAdmin();
  const { handleUpdate } = useContentEditor(page, 'Price');

  async function updateTier(id: number, field: string, value: string) {
    try {
      await fetch('/api/price/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, field, value }),
      });
    } catch (err) {
      console.error('Failed to update price tier', err);
    }
  }

  if (!dataContent || !dataPriceTiers) {
    return <section className="bg-[#f5f3ef] py-16">Chargement...</section>;
  }
  return (
    <section className="bg-[#f5f3ef] py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-[#2c4b3a] mb-3">
            {isAdmin ? (
              <input
                type="text"
                defaultValue={dataContent.title}
                onBlur={(e) => handleUpdate(e, 'title')}
                onKeyDown={(e) => handleUpdate(e, 'title')}
                className="w-full text-4xl sm:text-5xl font-serif font-bold bg-white/20 p-2 rounded"
              />
            ) : (
              dataContent.title
            )}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {isAdmin ? (
              <input
                type="text"
                defaultValue={dataContent.subtitle}
                onBlur={(e) => handleUpdate(e, 'subtitle')}
                onKeyDown={(e) => handleUpdate(e, 'subtitle')}
                className="w-full p-2 rounded bg-white/20"
              />
            ) : (
              dataContent.subtitle
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
          {dataPriceTiers.map((tier) => (
            <div
              key={tier.id}
              className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-100 h-full flex flex-col justify-between transition-shadow duration-300 hover:shadow-xl"
            >
              <div className="text-center">
                <div className="mx-auto mb-4 p-2 inline-block rounded-full bg-green-50 text-green-700">
                  <Euro className="h-6 w-6" strokeWidth={2.5} />
                </div>

                {isAdmin ? (
                  <>
                    <input
                      type="text"
                      defaultValue={tier.title}
                      onBlur={(e) => updateTier(tier.id, 'title', e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          updateTier(tier.id, 'title', (e.target as HTMLInputElement).value);
                          (e.target as HTMLInputElement).blur();
                        }
                      }}
                      className="text-xl font-semibold text-[#2c4b3a] mb-1 w-full p-1 rounded bg-white/20"
                    />
                    <input
                      type="text"
                      defaultValue={tier.period}
                      onBlur={(e) => updateTier(tier.id, 'period', e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          updateTier(tier.id, 'period', (e.target as HTMLInputElement).value);
                          (e.target as HTMLInputElement).blur();
                        }
                      }}
                      className="text-sm text-gray-500 mb-4 w-full p-1 rounded bg-white/20"
                    />

                    <input
                      type="text"
                      defaultValue={tier.price}
                      onBlur={(e) => updateTier(tier.id, 'price', e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          updateTier(tier.id, 'price', (e.target as HTMLInputElement).value);
                          (e.target as HTMLInputElement).blur();
                        }
                      }}
                      className="text-4xl font-bold text-[#467A5E] mb-4 w-full p-1 rounded bg-white/20"
                    />

                    <textarea
                      defaultValue={tier.description}
                      onBlur={(e) => updateTier(tier.id, 'description', e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          updateTier(tier.id, 'description', (e.target as HTMLTextAreaElement).value);
                          (e.target as HTMLTextAreaElement).blur();
                        }
                      }}
                      className="text-sm text-gray-600 w-full p-1 rounded bg-white/20"
                      rows={3}
                    />
                  </>
                ) : (
                  <>
                    <h3 className="text-xl font-semibold text-[#2c4b3a] mb-1">{tier.title}</h3>
                    <p className="text-sm text-gray-500 mb-4">{tier.period}</p>

                    <p className="text-4xl font-bold text-[#467A5E] mb-4">{tier.price}</p>

                    <p className="text-sm text-gray-600">{tier.description}</p>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}