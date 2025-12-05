"use client";

import { useEffect } from "react";
import { useAdmin } from "@/components/AdminProvider";
import { useContentEditor } from "@/utils/useContentEditor";
import { Star } from "lucide-react";
import React from "react";

interface TestimonialContent {
  title: string;
  subtitle: string;
}

interface TestimonialItem {
  id: number;
  name: string;
  avatarUrl: string;
  date: string;
  stars: number;
  source: string;
  review: string;
}

interface TestimonialsProps {
  dataContent: TestimonialContent;
  dataTestimonials: TestimonialItem[];
  availableSources: string[];
}

export default function Testimonials({ dataContent, dataTestimonials, availableSources }: TestimonialsProps) {
  const isAdmin = useAdmin();
  const { handleUpdate } = useContentEditor("avis", "Testimonials");

  useEffect(() => {
    if (isAdmin) {
      const textareas = document.querySelectorAll('textarea');
      textareas.forEach((textarea) => {
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
      });
    }
  }, [isAdmin, dataTestimonials]);

  const handleTestimonialUpdate = async (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> | React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement> | React.ChangeEvent<HTMLSelectElement>,
    testimonialId: number,
    field: string
  ) => {
    if (e.type === "keydown" && (e as React.KeyboardEvent).key !== "Enter") {
      return;
    }

    const target = e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
    const value = target.value;

    try {
      const response = await fetch("/api/testimonial/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: testimonialId, field, value }),
      });

      const data = await response.json();
      if (!data.success) {
        console.error("Erreur:", data.error);
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
    }
  };

  if (!dataContent || !dataTestimonials) {
    return <section className="bg-[#fcfaf7] py-16">Chargement...</section>;
  }

  return (
    <section className="bg-[#fcfaf7] py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl">
        
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-[#2c4b3a] mb-3">
            {isAdmin ? (
              <input
                type="text"
                defaultValue={dataContent.title}
                onBlur={(e) => handleUpdate(e, "title")}
                onKeyDown={(e) => handleUpdate(e, "title")}
                className="w-full text-center text-4xl sm:text-5xl font-serif font-bold text-[#2c4b3a] bg-transparent border border-transparent px-2 py-1 mb-3 focus:outline-none focus:border-[#2c4b3a]/30 focus:bg-white/10 rounded transition-colors"
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
                onBlur={(e) => handleUpdate(e, "subtitle")}
                onKeyDown={(e) => handleUpdate(e, "subtitle")}
                className="w-full max-w-2xl mx-auto text-center text-lg text-gray-600 bg-transparent border border-transparent px-2 py-1 focus:outline-none focus:border-gray-600/30 focus:bg-white/10 rounded transition-colors"
              />
            ) : (
              dataContent.subtitle
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10">
          {dataTestimonials.map((testimonial) => (
            <div 
              key={testimonial.id}
              className="bg-white p-6 sm:p-8 rounded-2xl shadow-md border border-gray-100 h-full relative"
            >
              <div className="absolute top-4 right-4 bg-[#e9f3ef] text-[#2c4b3a] text-sm font-semibold px-3 py-1 rounded-full shadow-sm">
                {isAdmin ? (
                  <select
                    defaultValue={testimonial.source}
                    onChange={(e) => handleTestimonialUpdate(e, testimonial.id, "source")}
                    className="bg-transparent text-[#2c4b3a] text-sm font-semibold border border-transparent px-1 rounded text-center min-w-[80px] focus:outline-none focus:border-[#2c4b3a]/30 cursor-pointer transition-colors"
                  >
                    {availableSources.map((source) => (
                      <option key={source} value={source}>
                        {source}
                      </option>
                    ))}
                  </select>
                ) : (
                  testimonial.source
                )}
              </div>
              
              <div className="flex items-center gap-3 mb-4 mt-2">
                <img 
                  src={testimonial.avatarUrl} 
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <p className="font-semibold text-[#2c4b3a]">
                    {isAdmin ? (
                      <input
                        type="text"
                        defaultValue={testimonial.name}
                        onBlur={(e) => handleTestimonialUpdate(e, testimonial.id, "name")}
                        onKeyDown={(e) => handleTestimonialUpdate(e, testimonial.id, "name")}
                        className="w-full font-semibold text-[#2c4b3a] bg-transparent border border-transparent px-2 py-1 focus:outline-none focus:border-[#2c4b3a]/30 focus:bg-white/10 rounded transition-colors"
                      />
                    ) : (
                      testimonial.name
                    )}
                  </p>
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star 
                        key={index}
                        className={`h-4 w-4 ${index < testimonial.stars ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                        strokeWidth={1}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-500">
                    {isAdmin ? (
                      <input
                        type="text"
                        defaultValue={testimonial.date}
                        onBlur={(e) => handleTestimonialUpdate(e, testimonial.id, "date")}
                        onKeyDown={(e) => handleTestimonialUpdate(e, testimonial.id, "date")}
                        className="w-full text-sm text-gray-500 bg-transparent border border-transparent px-2 py-0.5 focus:outline-none focus:border-gray-500/30 focus:bg-white/10 rounded transition-colors"
                      />
                    ) : (
                      testimonial.date
                    )}
                  </p>
                </div>
              </div>
              
              <div className="flex-grow mt-2">
                <div className="text-4xl font-serif text-[#467A5E] mb-3 leading-none">
                  "
                </div>
                <p className="text-gray-700 leading-relaxed italic">
                  {isAdmin ? (
                    <textarea
                      defaultValue={testimonial.review}
                      onBlur={(e) => handleTestimonialUpdate(e, testimonial.id, "review")}
                      onKeyDown={(e) => handleTestimonialUpdate(e, testimonial.id, "review")}
                      onInput={(e: any) => {
                        e.target.style.height = 'auto';
                        e.target.style.height = e.target.scrollHeight + 'px';
                      }}
                      className="w-full text-gray-700 leading-relaxed italic bg-transparent border border-transparent px-2 py-1 focus:outline-none focus:border-gray-700/30 focus:bg-white/10 rounded transition-colors resize-none overflow-hidden min-h-[3rem]"
                    />
                  ) : (
                    testimonial.review
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>
        
      </div>
    </section>
  );
}