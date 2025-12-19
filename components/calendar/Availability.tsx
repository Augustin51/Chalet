"use client";

import React, { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAdmin } from '@/components/admin/AdminProvider';
import { useContentEditor } from '@/utils/useContentEditor';
import AdminCalendar from '@/components/admin/AdminCalendar';
import Loading from '@/components/common/Loading';
import AnimationWrapper from '@/components/common/AnimationWrapper';

interface AvailabilityData {
  title: string;
  subtitle: string;
  placeholder_text: string;
  legend_both_available?: string;
  legend_one_available?: string;
  legend_unavailable?: string;
  color_both_available?: string;
  color_one_available?: string;
  color_unavailable?: string;
}

interface Reservation {
  id: number;
  startDate: string;
  endDate: string;
  chaletLeft: boolean;
  chaletRight: boolean;
}

type DayStatus = 'both-available' | 'one-available' | 'unavailable';

export default function Availability({ dataContent, page = 'calendrier' }: { dataContent: AvailabilityData; page?: string }) {
  const isAdmin = useAdmin();
  const { handleUpdate } = useContentEditor(page, 'Availability');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  // Bloquer le scroll du body quand le panel admin est ouvert
  useEffect(() => {
    if (showAdminPanel) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showAdminPanel]);

  // Charger les réservations du mois
  useEffect(() => {
    loadReservations();
  }, [currentMonth]);

  const loadReservations = async () => {
    const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

    try {
      const response = await fetch(
        `/api/reservation/list?startDate=${firstDay.toISOString()}&endDate=${lastDay.toISOString()}`
      );
      const data = await response.json();
      console.log('Réservations chargées:', data);
      if (data.success) {
        setReservations(data.reservations);
        console.log('Nombre de réservations:', data.reservations.length);
      } else {
        console.error('Erreur API:', data.error);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des réservations:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDayStatus = (date: Date): DayStatus => {
    // Normaliser la date à minuit UTC
    const checkDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const checkTime = checkDate.getTime();
    
    // Trouver toutes les réservations qui couvrent ce jour
    let leftBooked = false;
    let rightBooked = false;
    
    for (const res of reservations) {
      const startDate = new Date(res.startDate);
      const endDate = new Date(res.endDate);
      
      // Normaliser les dates de réservation
      const startTime = new Date(Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate())).getTime();
      const endTime = new Date(Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate())).getTime();
      
      // Vérifier si la date est dans la plage de réservation
      if (checkTime >= startTime && checkTime <= endTime) {
        console.log(`Date ${date.toLocaleDateString()} correspond à la réservation:`, res);
        if (res.chaletLeft) leftBooked = true;
        if (res.chaletRight) rightBooked = true;
      }
    }
    
    const status = leftBooked && rightBooked ? 'unavailable' : (leftBooked || rightBooked ? 'one-available' : 'both-available');
    if (date.getDate() === 18 || date.getDate() === 25) {
      console.log(`Statut pour le ${date.toLocaleDateString()}:`, status, { leftBooked, rightBooked });
    }
    
    if (leftBooked && rightBooked) return 'unavailable';
    if (leftBooked || rightBooked) return 'one-available';
    return 'both-available';
  };

  const getDayBackgroundColor = (status: DayStatus): string => {
    switch (status) {
      case 'both-available':
        return dataContent.color_both_available || '#10b981';
      case 'one-available':
        return dataContent.color_one_available || '#f97316';
      case 'unavailable':
        return dataContent.color_unavailable || '#ef4444';
    }
  };

  const getDayColor = (status: DayStatus): string => {
    return 'hover:opacity-80';
  };

  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];
    
    // Jours vides avant le début du mois
    for (let i = 0; i < (startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1); i++) {
      days.push(null);
    }
    
    // Jours du mois
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const previousMonth = () => {
    const today = new Date();
    const prevMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1);
    // Empêcher d'aller avant le mois actuel
    if (prevMonth.getFullYear() > today.getFullYear() || 
        (prevMonth.getFullYear() === today.getFullYear() && prevMonth.getMonth() >= today.getMonth())) {
      setCurrentMonth(prevMonth);
    }
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  const dayNames = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  if (!dataContent) {
    return <section className="bg-[#fcfaf7] py-16"><Loading /></section>;
  }
  return (
    <section className="bg-[#fcfaf7] py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl">
        <AnimationWrapper variant="pop" delay={0} className="w-full">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-4xl sm:text-5xl font-serif font-bold text-[#2c4b3a] mb-2">
            {isAdmin ? (
              <input
                type="text"
                defaultValue={dataContent.title}
                onBlur={(e) => handleUpdate(e, 'title')}
                onKeyDown={(e) => handleUpdate(e, 'title')}
                className="w-full text-4xl sm:text-5xl font-serif font-bold text-[#2c4b3a] bg-transparent border-transparent focus:border-[#2c4b3a]/30 focus:bg-white/5 p-2 rounded text-center transition-colors"
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
                className="w-full max-w-2xl mx-auto text-lg text-gray-600 bg-transparent border-transparent focus:border-gray-600/30 focus:bg-white/5 p-2 rounded text-center transition-colors"
              />
            ) : (
              dataContent.subtitle
            )}
            </p>
          </div>
        </AnimationWrapper>

        {/* Interface admin de gestion (conditionnelle) en overlay */}
        {isAdmin && showAdminPanel && (
          <div 
            className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center p-4 overflow-y-auto"
            onClick={() => setShowAdminPanel(false)}
          >
            <div 
              className="bg-white rounded-lg shadow-xl max-w-6xl w-full my-8 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowAdminPanel(false)}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Fermer"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <AdminCalendar />
            </div>
          </div>
        )}

        {/* Bouton admin et légende */}
        <div className="w-full">
          <div className="flex flex-col items-center gap-4 mb-4 sm:mb-6">
          {isAdmin && (
            <button
              onClick={() => setShowAdminPanel(!showAdminPanel)}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#467A5E] text-white rounded-lg hover:bg-[#3a6b4f] transition-colors font-medium"
            >
              <Calendar className="w-5 h-5" />
              {showAdminPanel ? 'Masquer' : 'Gérer'} les réservations
            </button>
          )}
          
          {/* Légende */}
          <div className="flex flex-wrap justify-center gap-3 sm:gap-6 text-xs sm:text-sm">
            <div className="flex items-center space-x-1.5">
              {isAdmin ? (
                <label className="cursor-pointer">
                  <input
                    type="color"
                    defaultValue={dataContent.color_both_available || '#10b981'}
                    onChange={(e) => handleUpdate(e, 'color_both_available')}
                    className="w-0 h-0 opacity-0 absolute"
                  />
                  <span className="w-3 h-3 rounded block" style={{ backgroundColor: dataContent.color_both_available || '#10b981' }}></span>
                </label>
              ) : (
                <span className="w-3 h-3 rounded" style={{ backgroundColor: dataContent.color_both_available || '#10b981' }}></span>
              )}
              <span className="text-gray-700">
                {isAdmin ? (
                  <input
                    type="text"
                    defaultValue={dataContent.legend_both_available || '2 chalets'}
                    onBlur={(e) => handleUpdate(e, 'legend_both_available')}
                    onKeyDown={(e) => handleUpdate(e, 'legend_both_available')}
                    size={Math.max((dataContent.legend_both_available || '2 chalets').length, 3)}
                    className="text-xs sm:text-sm text-gray-700 bg-transparent border-b border-transparent focus:border-gray-400 px-1 transition-colors"
                  />
                ) : (
                  dataContent.legend_both_available || '2 chalets'
                )}
              </span>
            </div>
            <div className="flex items-center space-x-1.5">
              {isAdmin ? (
                <label className="cursor-pointer">
                  <input
                    type="color"
                    defaultValue={dataContent.color_one_available || '#f97316'}
                    onChange={(e) => handleUpdate(e, 'color_one_available')}
                    className="w-0 h-0 absolute opacity-0"
                  />
                  <span className="w-3 h-3 rounded block" style={{ backgroundColor: dataContent.color_one_available || '#f97316' }}></span>
                </label>
              ) : (
                <span className="w-3 h-3 rounded" style={{ backgroundColor: dataContent.color_one_available || '#f97316' }}></span>
              )}
              <span className="text-gray-700">
                {isAdmin ? (
                  <input
                    type="text"
                    defaultValue={dataContent.legend_one_available || '1 chalet'}
                    onBlur={(e) => handleUpdate(e, 'legend_one_available')}
                    onKeyDown={(e) => handleUpdate(e, 'legend_one_available')}
                    size={Math.max((dataContent.legend_one_available || '1 chalet').length, 3)}
                    className="text-xs sm:text-sm text-gray-700 bg-transparent border-b border-transparent focus:border-gray-400 px-1 transition-colors"
                  />
                ) : (
                  dataContent.legend_one_available || '1 chalet'
                )}
              </span>
            </div>
            <div className="flex items-center space-x-1.5">
              {isAdmin ? (
                <label className="cursor-pointer">
                  <input
                    type="color"
                    defaultValue={dataContent.color_unavailable || '#ef4444'}
                    onChange={(e) => handleUpdate(e, 'color_unavailable')}
                    className="w-0 h-0 opacity-0 absolute"
                  />
                  <span className="w-3 h-3 rounded block" style={{ backgroundColor: dataContent.color_unavailable || '#ef4444' }}></span>
                </label>
              ) : (
                <span className="w-3 h-3 rounded" style={{ backgroundColor: dataContent.color_unavailable || '#ef4444' }}></span>
              )}
              <span className="text-gray-700">
                {isAdmin ? (
                  <input
                    type="text"
                    defaultValue={dataContent.legend_unavailable || 'Complet'}
                    onBlur={(e) => handleUpdate(e, 'legend_unavailable')}
                    onKeyDown={(e) => handleUpdate(e, 'legend_unavailable')}
                    size={Math.max((dataContent.legend_unavailable || 'Complet').length, 3)}
                    className="text-xs sm:text-sm text-gray-700 bg-transparent border-b border-transparent focus:border-gray-400 px-1 transition-colors"
                  />
                ) : (
                  dataContent.legend_unavailable || 'Complet'
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Calendrier */}
        <div className="bg-white rounded-lg shadow-md p-3 sm:p-6 max-w-2xl mx-auto">
          {/* En-tête du calendrier */}
          <div className="flex items-center justify-between mb-3 sm:mb-6">
            <button
              onClick={previousMonth}
              className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Mois précédent"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
            </button>
            
            <h3 className="text-lg sm:text-xl md:text-2xl font-serif font-bold text-[#2c4b3a]">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h3>
            
            <button
              onClick={nextMonth}
              className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Mois suivant"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
            </button>
          </div>

          {/* Jours de la semaine */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-1 sm:mb-2">
            {dayNames.map(day => (
              <div key={day} className="text-center text-xs sm:text-sm font-semibold text-gray-600 py-1 sm:py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Grille des jours */}
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#467A5E]"></div>
            </div>
          ) : (
            <div className="grid grid-cols-7 gap-1">
              {getDaysInMonth().map((date, index) => {
                if (!date) {
                  return <div key={`empty-${index}`} className="aspect-square w-full" />;
                }

                const status = getDayStatus(date);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const isPast = date < today;
                const isToday = 
                  date.toDateString() === today.toDateString();

                // Générer le texte du tooltip
                const getTooltipText = () => {
                  if (isPast) return 'Date passée';
                  switch (status) {
                    case 'both-available':
                      return `✓ ${dataContent.legend_both_available || '2 chalets disponibles'}`;
                    case 'one-available':
                      return `⚠ ${dataContent.legend_one_available || '1 chalet disponible'}`;
                    case 'unavailable':
                      return `✗ ${dataContent.legend_unavailable || 'Complet'}`;
                  }
                };

                return (
                  <div
                    key={date.toISOString()}
                    className={`
                      aspect-square w-full flex items-center justify-center rounded
                      text-xs sm:text-sm font-medium transition-all relative group
                      ${
                        isPast 
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : `text-white cursor-pointer ${getDayColor(status)}`
                      }
                      ${isToday ? 'ring-1 ring-[#2c4b3a] ring-offset-1' : ''}
                    `}
                    style={!isPast ? { backgroundColor: getDayBackgroundColor(status) } : {}}
                  >
                    {date.getDate()}
                    {/* Tooltip au hover */}
                    <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-1.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-lg">
                      {getTooltipText()}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      </div>
    </section>
  );
}