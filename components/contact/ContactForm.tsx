"use client";

import React from 'react';
import IconSelectorModal from "@/components/admin/IconSelectorModal";
import { iconMap } from "@/lib/iconMap";
import { useAdmin } from "@/components/common/AdminProvider";
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
    arrivalDate?: FormFieldData;
    departureDate?: FormFieldData;
    guests?: FormFieldData;
    message: FormFieldData;
  };
}

export default function ContactForm({ dataContent, dataInfo, formFields }: ContactFormProps) {
  const isAdmin = useAdmin();
  const { handleUpdate } = useContentEditor("contact", "ContactForm");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitMessage, setSubmitMessage] = React.useState<{type: 'success' | 'error', text: string} | null>(null);
  const [guestsPlaceholder, setGuestsPlaceholder] = React.useState(formFields.guests?.placeholder || 'Sélectionnez...');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      arrivalDate: formData.get('arrivalDate') as string,
      departureDate: formData.get('departureDate') as string,
      guests: formData.get('guests') as string,
      message: formData.get('message') as string,
    };

    try {
      const response = await fetch('/api/contact/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      
      if (result.success) {
        setSubmitMessage({ type: 'success', text: result.message });
        (e.target as HTMLFormElement).reset();
      } else {
        setSubmitMessage({ type: 'error', text: result.error });
      }
    } catch (error) {
      setSubmitMessage({ type: 'error', text: 'Une erreur est survenue lors de l\'envoi' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFieldUpdate = async (
    e: React.FocusEvent<HTMLInputElement> | React.KeyboardEvent<HTMLInputElement>,
    fieldId: number,
    fieldType: "label" | "placeholder"
  ) => {
    if (e.type === "keydown") {
      if ((e as React.KeyboardEvent).key !== "Enter") {
        return;
      }
      e.preventDefault();
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
    if (e.type === "keydown") {
      if ((e as React.KeyboardEvent).key !== "Enter") {
        return;
      }
      e.preventDefault();
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

  const [infoList, setInfoList] = React.useState<ContactInfoItem[]>([...dataInfo].sort((a, b) => a.id - b.id));
  const [iconModalOpen, setIconModalOpen] = React.useState<{ isOpen: boolean; infoId: number | null; currentIcon: string }>({
    isOpen: false,
    infoId: null,
    currentIcon: '',
  });
  const [showReloadBar, setShowReloadBar] = React.useState(false);

  const handleIconSelect = async (iconName: string) => {
    if (!iconModalOpen.infoId) return;
    setInfoList(prev => prev.map(item => item.id === iconModalOpen.infoId ? { ...item, iconName } : item));
    setShowReloadBar(true);
    // Mise à jour côté serveur
    try {
      await fetch('/api/infoitem/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: iconModalOpen.infoId,
          field: 'iconName',
          value: iconName,
        }),
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'icône contact info:', error);
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
              {[...infoList].sort((a, b) => a.id - b.id).map((item) => {
                const Icon = iconMap[item.iconName];
                return (
                  <div key={item.id} className="bg-white p-4 sm:p-5 rounded-lg shadow-sm border border-gray-100 flex items-start">
                    <div
                      className={isAdmin ? `h-8 w-8 flex items-center justify-center rounded-full border-2 ${iconModalOpen.infoId === item.id ? 'border-emerald-600 bg-emerald-50' : 'border-[#467A5E]/40'} cursor-pointer hover:bg-emerald-50 transition-colors mr-4 flex-shrink-0 mt-0.5` : 'h-8 w-8 flex items-center justify-center rounded-full border-2 border-[#467A5E]/40 mr-4 flex-shrink-0 mt-0.5'}
                      onClick={() => {
                        if (isAdmin) {
                          setIconModalOpen({
                            isOpen: true,
                            infoId: item.id,
                            currentIcon: item.iconName,
                          });
                        }
                      }}
                      title={isAdmin ? 'Cliquer pour changer l\'icône' : ''}
                    >
                      <Icon className="h-6 w-6 text-[#467A5E]" />
                    </div>
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
      {showReloadBar && (
        <div
          className="fixed top-0 left-0 w-full bg-yellow-400 text-yellow-900 font-semibold text-center py-0.5 z-[10000] shadow-md cursor-pointer hover:bg-yellow-300 transition-colors text-sm"
          onClick={() => window.location.reload()}
          title="Cliquer pour recharger la page"
        >
          Des modifications sur les icônes nécessitent de <span className="underline">recharger la page</span> pour être totalement prises en compte.<br/>
          <span className="text-xs font-normal">Cliquez ici pour recharger</span>
        </div>
      )}
          <IconSelectorModal
            isOpen={iconModalOpen.isOpen}
            onClose={() => setIconModalOpen({ isOpen: false, infoId: null, currentIcon: '' })}
            onSelect={handleIconSelect}
            currentIcon={
              iconModalOpen.infoId
                ? infoList.find(i => i.id === iconModalOpen.infoId)?.iconName || iconModalOpen.currentIcon
                : iconModalOpen.currentIcon
            }
            title="Choisir une icône"
          />

          <div className="bg-white p-6 sm:p-8 rounded-lg">
            <form className="space-y-4" onSubmit={handleSubmit}>
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
                  required
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="arrivalDate" className="text-sm font-medium text-gray-700 block mb-1">
                    {isAdmin && formFields.arrivalDate ? (
                      <input
                        type="text"
                        defaultValue={formFields.arrivalDate.label}
                        onBlur={(e) => formFields.arrivalDate && handleFieldUpdate(e, formFields.arrivalDate.id, "label")}
                        onKeyDown={(e) => formFields.arrivalDate && handleFieldUpdate(e, formFields.arrivalDate.id, "label")}
                        className="w-full text-sm font-medium text-gray-700 bg-transparent border border-transparent px-1 focus:outline-none focus:border-gray-700/30 focus:bg-gray-50 rounded transition-colors"
                      />
                    ) : (
                      formFields.arrivalDate?.label || "Date d'arrivée *"
                    )}
                  </label>
                  <input 
                    type="date" 
                    id="arrivalDate" 
                    name="arrivalDate" 
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-[#467A5E] focus:border-[#467A5E]" 
                  />
                </div>

                <div>
                  <label htmlFor="departureDate" className="text-sm font-medium text-gray-700 block mb-1">
                    {isAdmin && formFields.departureDate ? (
                      <input
                        type="text"
                        defaultValue={formFields.departureDate.label}
                        onBlur={(e) => formFields.departureDate && handleFieldUpdate(e, formFields.departureDate.id, "label")}
                        onKeyDown={(e) => formFields.departureDate && handleFieldUpdate(e, formFields.departureDate.id, "label")}
                        className="w-full text-sm font-medium text-gray-700 bg-transparent border border-transparent px-1 focus:outline-none focus:border-gray-700/30 focus:bg-gray-50 rounded transition-colors"
                      />
                    ) : (
                      formFields.departureDate?.label || "Date de départ *"
                    )}
                  </label>
                  <input 
                    type="date" 
                    id="departureDate" 
                    name="departureDate" 
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-[#467A5E] focus:border-[#467A5E]" 
                  />
                </div>
              </div>

              <div>
                <label htmlFor="guests" className="text-sm font-medium text-gray-700 block mb-1">
                  {isAdmin && formFields.guests ? (
                    <input
                      type="text"
                      defaultValue={formFields.guests.label}
                      onBlur={(e) => formFields.guests && handleFieldUpdate(e, formFields.guests.id, "label")}
                      onKeyDown={(e) => formFields.guests && handleFieldUpdate(e, formFields.guests.id, "label")}
                      className="w-full text-sm font-medium text-gray-700 bg-transparent border border-transparent px-1 focus:outline-none focus:border-gray-700/30 focus:bg-gray-50 rounded transition-colors"
                    />
                  ) : (
                    formFields.guests?.label || "Nombre de personnes *"
                  )}
                </label>
                <select 
                  id="guests" 
                  name="guests" 
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-[#467A5E] focus:border-[#467A5E]"
                >
                  <option value="">{guestsPlaceholder}</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                    <option key={num} value={num}>
                      {num} personne{num > 1 ? 's' : ''}
                    </option>
                  ))}
                </select>
                {isAdmin && formFields.guests && (
                  <input
                    type="text"
                    value={guestsPlaceholder}
                    onChange={(e) => setGuestsPlaceholder(e.target.value)}
                    onBlur={(e) => formFields.guests && handleFieldUpdate(e, formFields.guests.id, "placeholder")}
                    onKeyDown={(e) => formFields.guests && handleFieldUpdate(e, formFields.guests.id, "placeholder")}
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

              {submitMessage && (
                <div className={`p-4 rounded-lg ${submitMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                  {submitMessage.text}
                </div>
              )}

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full px-6 py-3 bg-[#467A5E] text-white font-semibold rounded-lg hover:bg-[#346048] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
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
                ) : isSubmitting ? (
                  'Envoi en cours...'
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