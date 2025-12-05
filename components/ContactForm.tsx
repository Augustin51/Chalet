"use client";

import React from 'react';
import { iconMap, DefaultIcon } from "@/lib/iconMap";
import { useAdmin } from "@/components/AdminProvider";
import { useContentEditor } from "@/utils/useContentEditor";

interface ContactFormContent {
  title_left: string;
  title_right: string;
  button_text: string;
  footer_text: string;
}

interface ContactInfoItem {
  id: number;
  title: string;
  content: string;
  iconName: string;
}

interface FormFieldData {
  id: number;
  label: string;
  placeholder: string;
}

interface ContactFormProps {
  dataContent: ContactFormContent;
  dataInfo: ContactInfoItem[];
  formFields: {
    name: FormFieldData;
    email: FormFieldData;
    phone: FormFieldData;
    message: FormFieldData;
  };
}

export default function ContactForm({ dataContent, dataInfo, formFields }: ContactFormProps) {
  const isAdmin = useAdmin();
  const { handleUpdate } = useContentEditor("contact", "ContactForm");

  const handleFieldUpdate = async (
    e: React.FocusEvent<HTMLInputElement> | React.KeyboardEvent<HTMLInputElement>,
    fieldId: number,
    fieldType: "label" | "placeholder"
  ) => {
    if (e.type === "keydown" && (e as React.KeyboardEvent).key !== "Enter") {
      return;
    }

    const target = e.target as HTMLInputElement;
    const value = target.value;

    try {
      const response = await fetch("/api/formfield/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: fieldId, field: fieldType, value }),
      });

      const data = await response.json();
      if (!data.success) {
        console.error("Erreur:", data.error);
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
    }
  };

  const handleInfoUpdate = async (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement> | React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
    infoId: number,
    field: string
  ) => {
    if (e.type === "keydown" && (e as React.KeyboardEvent).key !== "Enter") {
      return;
    }

    const target = e.target as HTMLInputElement | HTMLTextAreaElement;
    const value = target.value;

    try {
      const response = await fetch("/api/infoitem/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: infoId, field, value }),
      });

      const data = await response.json();
      if (!data.success) {
        console.error("Erreur:", data.error);
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
    }
  };

  if (!dataContent || !dataInfo) {
    return <section className="bg-white py-16">Chargement...</section>;
  }
  return (
    <section className="bg-white py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-8 lg:mb-12">
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-[#2c4b3a]">
            {isAdmin ? (
              <input
                type="text"
                defaultValue={dataContent.title_left}
                onBlur={(e) => handleUpdate(e, "title_left")}
                onKeyDown={(e) => handleUpdate(e, "title_left")}
                className="w-full text-4xl sm:text-5xl font-serif font-bold text-[#2c4b3a] bg-transparent border border-transparent px-2 py-1 focus:outline-none focus:border-[#2c4b3a]/30 focus:bg-gray-50 rounded transition-colors"
              />
            ) : (
              dataContent.title_left
            )}
          </h2>
          
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-[#2c4b3a] lg:pl-10">
            {isAdmin ? (
              <textarea
                defaultValue={dataContent.title_right}
                onBlur={(e) => handleUpdate(e, "title_right")}
                onKeyDown={(e) => handleUpdate(e, "title_right")}
                onInput={(e: any) => {
                  e.target.style.height = 'auto';
                  e.target.style.height = e.target.scrollHeight + 'px';
                }}
                className="w-full text-4xl sm:text-5xl font-serif font-bold text-[#2c4b3a] bg-transparent border border-transparent px-2 py-1 focus:outline-none focus:border-[#2c4b3a]/30 focus:bg-gray-50 rounded transition-colors pl-0 resize-none overflow-hidden min-h-[3rem]"
              />
            ) : (
              dataContent.title_right
            )}
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          <div className="space-y-4">
              {dataInfo.map((item) => {
                const Icon = iconMap[item.iconName] || DefaultIcon;
                return (
                  <div key={item.id} className="bg-white p-4 sm:p-5 rounded-lg shadow-sm border border-gray-100 flex items-start">
                    <Icon className="h-6 w-6 text-[#467A5E] mr-4 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-[#2c4b3a] mb-0.5">
                        {isAdmin ? (
                          <input
                            type="text"
                            defaultValue={item.title}
                            onBlur={(e) => handleInfoUpdate(e, item.id, "title")}
                            onKeyDown={(e) => handleInfoUpdate(e, item.id, "title")}
                            className="w-full text-lg font-semibold text-[#2c4b3a] bg-transparent border border-transparent px-2 py-1 focus:outline-none focus:border-[#2c4b3a]/30 focus:bg-white/50 rounded transition-colors"
                          />
                        ) : (
                          item.title
                        )}
                      </h3>
                      <div className="text-gray-700 text-base">
                        {isAdmin ? (
                          <input
                            type="text"
                            defaultValue={item.content}
                            onBlur={(e) => handleInfoUpdate(e, item.id, "content")}
                            onKeyDown={(e) => handleInfoUpdate(e, item.id, "content")}
                            className="w-full text-base text-gray-700 bg-transparent border border-transparent px-2 py-1 focus:outline-none focus:border-gray-700/30 focus:bg-white/50 rounded transition-colors"
                          />
                        ) : item.title === 'Adresse' ? (
                          <address className="not-italic">
                            {item.content.split('\n').map((line, index) => (
                              <React.Fragment key={index}>
                                {line}
                                <br />
                              </React.Fragment>
                            ))}
                          </address>
                        ) : (
                          <p>{item.content}</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-lg">
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="text-sm font-medium text-gray-700 block mb-1">
                  {isAdmin ? (
                    <input
                      type="text"
                      defaultValue={formFields.name.label}
                      onBlur={(e) => handleFieldUpdate(e, formFields.name.id, "label")}
                      onKeyDown={(e) => handleFieldUpdate(e, formFields.name.id, "label")}
                      className="w-full text-sm font-medium text-gray-700 bg-transparent border border-transparent px-1 focus:outline-none focus:border-gray-700/30 focus:bg-gray-50 rounded transition-colors"
                    />
                  ) : (
                    formFields.name.label
                  )}
                </label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  placeholder={isAdmin ? undefined : formFields.name.placeholder}
                  required 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-[#467A5E] focus:border-[#467A5E]"
                />
                {isAdmin && (
                  <input
                    type="text"
                    defaultValue={formFields.name.placeholder}
                    onBlur={(e) => handleFieldUpdate(e, formFields.name.id, "placeholder")}
                    onKeyDown={(e) => handleFieldUpdate(e, formFields.name.id, "placeholder")}
                    placeholder="Placeholder"
                    className="w-full mt-1 text-xs text-gray-500 bg-gray-50/50 border border-gray-200 px-2 py-1 focus:outline-none focus:border-[#467A5E]/30 rounded transition-colors"
                  />
                )}
              </div>
              
              <div>
                <label htmlFor="email" className="text-sm font-medium text-gray-700 block mb-1">
                  {isAdmin ? (
                    <input
                      type="text"
                      defaultValue={formFields.email.label}
                      onBlur={(e) => handleFieldUpdate(e, formFields.email.id, "label")}
                      onKeyDown={(e) => handleFieldUpdate(e, formFields.email.id, "label")}
                      className="w-full text-sm font-medium text-gray-700 bg-transparent border border-transparent px-1 focus:outline-none focus:border-gray-700/30 focus:bg-gray-50 rounded transition-colors"
                    />
                  ) : (
                    formFields.email.label
                  )}
                </label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  placeholder={isAdmin ? undefined : formFields.email.placeholder}
                  required 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-[#467A5E] focus:border-[#467A5E]" 
                />
                {isAdmin && (
                  <input
                    type="text"
                    defaultValue={formFields.email.placeholder}
                    onBlur={(e) => handleFieldUpdate(e, formFields.email.id, "placeholder")}
                    onKeyDown={(e) => handleFieldUpdate(e, formFields.email.id, "placeholder")}
                    placeholder="Placeholder"
                    className="w-full mt-1 text-xs text-gray-500 bg-gray-50/50 border border-gray-200 px-2 py-1 focus:outline-none focus:border-[#467A5E]/30 rounded transition-colors"
                  />
                )}
              </div>

              <div>
                <label htmlFor="phone" className="text-sm font-medium text-gray-700 block mb-1">
                  {isAdmin ? (
                    <input
                      type="text"
                      defaultValue={formFields.phone.label}
                      onBlur={(e) => handleFieldUpdate(e, formFields.phone.id, "label")}
                      onKeyDown={(e) => handleFieldUpdate(e, formFields.phone.id, "label")}
                      className="w-full text-sm font-medium text-gray-700 bg-transparent border border-transparent px-1 focus:outline-none focus:border-gray-700/30 focus:bg-gray-50 rounded transition-colors"
                    />
                  ) : (
                    formFields.phone.label
                  )}
                </label>
                <input 
                  type="tel" 
                  id="phone" 
                  name="phone" 
                  placeholder={isAdmin ? undefined : formFields.phone.placeholder}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-[#467A5E] focus:border-[#467A5E]" 
                />
                {isAdmin && (
                  <input
                    type="text"
                    defaultValue={formFields.phone.placeholder}
                    onBlur={(e) => handleFieldUpdate(e, formFields.phone.id, "placeholder")}
                    onKeyDown={(e) => handleFieldUpdate(e, formFields.phone.id, "placeholder")}
                    placeholder="Placeholder"
                    className="w-full mt-1 text-xs text-gray-500 bg-gray-50/50 border border-gray-200 px-2 py-1 focus:outline-none focus:border-[#467A5E]/30 rounded transition-colors"
                  />
                )}
              </div>

              <div>
                <label htmlFor="message" className="text-sm font-medium text-gray-700 block mb-1">
                  {isAdmin ? (
                    <input
                      type="text"
                      defaultValue={formFields.message.label}
                      onBlur={(e) => handleFieldUpdate(e, formFields.message.id, "label")}
                      onKeyDown={(e) => handleFieldUpdate(e, formFields.message.id, "label")}
                      className="w-full text-sm font-medium text-gray-700 bg-transparent border border-transparent px-1 focus:outline-none focus:border-gray-700/30 focus:bg-gray-50 rounded transition-colors"
                    />
                  ) : (
                    formFields.message.label
                  )}
                </label>
                <textarea 
                  id="message" 
                  name="message" 
                  rows={5} 
                  placeholder={isAdmin ? undefined : formFields.message.placeholder}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-[#467A5E] focus:border-[#467A5E] resize-none"
                ></textarea>
                {isAdmin && (
                  <input
                    type="text"
                    defaultValue={formFields.message.placeholder}
                    onBlur={(e) => handleFieldUpdate(e, formFields.message.id, "placeholder")}
                    onKeyDown={(e) => handleFieldUpdate(e, formFields.message.id, "placeholder")}
                    placeholder="Placeholder"
                    className="w-full mt-1 text-xs text-gray-500 bg-gray-50/50 border border-gray-200 px-2 py-1 focus:outline-none focus:border-[#467A5E]/30 rounded transition-colors"
                  />
                )}
              </div>

              <button 
                type="submit" 
                className="w-full px-6 py-3 bg-[#467A5E] text-white font-semibold rounded-lg hover:bg-[#346048] transition-colors"
              >
                {isAdmin ? (
                  <input
                    type="text"
                    defaultValue={dataContent.button_text}
                    onBlur={(e) => handleUpdate(e, "button_text")}
                    onKeyDown={(e) => handleUpdate(e, "button_text")}
                    className="w-full text-center font-semibold text-white bg-transparent border border-transparent px-2 py-1 focus:outline-none focus:border-white/40 rounded transition-colors"
                    onClick={(e) => e.preventDefault()}
                  />
                ) : (
                  dataContent.button_text
                )}
              </button>
              
              <p className="text-xs text-gray-500 text-center pt-2">
                {isAdmin ? (
                  <input
                    type="text"
                    defaultValue={dataContent.footer_text}
                    onBlur={(e) => handleUpdate(e, "footer_text")}
                    onKeyDown={(e) => handleUpdate(e, "footer_text")}
                    className="w-full text-center text-xs text-gray-500 bg-transparent border border-transparent px-2 py-1 focus:outline-none focus:border-gray-500/30 focus:bg-gray-50 rounded transition-colors"
                  />
                ) : (
                  dataContent.footer_text
                )}
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}