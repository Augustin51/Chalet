import React from 'react';
import { Star } from 'lucide-react';

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
}

export default function Testimonials({ dataContent, dataTestimonials }: TestimonialsProps) {
  if (!dataContent || !dataTestimonials) {
    return <section className="bg-[#fcfaf7] py-16">Chargement...</section>;
  }
  return (
    <section className="bg-[#fcfaf7] py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl">
        
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-[#2c4b3a] mb-3">
            {dataContent.title}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {dataContent.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10">
          {dataTestimonials.map((testimonial) => (
            <div 
              key={testimonial.id}
              className="bg-white p-6 sm:p-8 rounded-2xl shadow-md border border-gray-100 h-full relative"
            >

              <div className="absolute top-4 right-4 bg-[#e9f3ef] text-[#2c4b3a] text-sm font-semibold px-3 py-1 rounded-full shadow-sm">
                {testimonial.source}
              </div>
              
              <div className="flex-grow mt-2">
                
                <div className="text-4xl font-serif text-[#467A5E] mb-3 leading-none">
                  ”
                </div>
                
                <div className="flex items-start space-x-4 mb-4">
                  <img
                    src={testimonial.avatarUrl}
                    alt={`Photo de profil de ${testimonial.name}`}
                    className="h-12 w-12 rounded-full object-cover flex-shrink-0"
                  />
                  
                  <div>
                    <p className="font-bold text-[#2c4b3a] text-lg">{testimonial.name}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex space-x-0.5">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star
                        key={index}
                        className={`h-5 w-5 transition-colors ${
                          index < testimonial.stars ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300 fill-gray-300'
                        }`}
                        strokeWidth={1.5}
                      />
                    ))}
                  </div>
                  
                  <p className="text-sm text-gray-500">{testimonial.date}</p>
                </div>

                <p className="text-gray-700 text-base italic leading-relaxed">
                  {`"${testimonial.review}"`}
                </p>
              </div>

            </div>
          ))}
        </div>
        
      </div>
    </section>
  );
}