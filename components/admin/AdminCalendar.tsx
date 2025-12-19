'use client';

import { useState, useEffect } from 'react';
import { Calendar, Plus, Edit2, Trash2, X } from 'lucide-react';
import ConfirmModal from './ConfirmModal';
import AlertModal from './AlertModal';

interface Reservation {
  id: number;
  startDate: string;
  endDate: string;
  chaletLeft: boolean;
  chaletRight: boolean;
}

export default function AdminCalendar() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingReservation, setEditingReservation] = useState<Reservation | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    chaletLeft: false,
    chaletRight: false
  });

  // Modales
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; reservationId: number | null }>({ 
    isOpen: false, 
    reservationId: null 
  });
  const [alertModal, setAlertModal] = useState<{ 
    isOpen: boolean; 
    title: string; 
    message: string; 
    variant: 'success' | 'error' | 'info' 
  }>({ 
    isOpen: false, 
    title: '', 
    message: '', 
    variant: 'info' 
  });

  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = async () => {
    try {
      // Charger les 6 prochains mois
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 6);

      const response = await fetch(
        `/api/reservation/list?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
      );
      const data = await response.json();
      if (data.success) {
        setReservations(data.reservations);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des réservations:', error);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingReservation(null);
    setFormData({
      startDate: '',
      endDate: '',
      chaletLeft: false,
      chaletRight: false
    });
    setShowModal(true);
  };

  const openEditModal = (reservation: Reservation) => {
    setEditingReservation(reservation);
    setFormData({
      startDate: reservation.startDate.split('T')[0],
      endDate: reservation.endDate.split('T')[0],
      chaletLeft: reservation.chaletLeft,
      chaletRight: reservation.chaletRight
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.chaletLeft && !formData.chaletRight) {
      setAlertModal({
        isOpen: true,
        title: 'Chalet requis',
        message: 'Vous devez sélectionner au moins un chalet',
        variant: 'error'
      });
      return;
    }

    try {
      const url = editingReservation 
        ? '/api/reservation/update' 
        : '/api/reservation/create';
      
      const body = editingReservation
        ? { id: editingReservation.id, ...formData }
        : formData;

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await response.json();
      
      if (data.success) {
        setAlertModal({
          isOpen: true,
          title: 'Succès',
          message: editingReservation 
            ? 'Réservation modifiée avec succès' 
            : 'Réservation créée avec succès',
          variant: 'success'
        });
        setShowModal(false);
        loadReservations();
      } else {
        // Afficher le message d'erreur détaillé si disponible
        const errorMessage = data.details 
          ? `${data.error}: ${data.details}` 
          : data.error || 'Une erreur est survenue';
          
        setAlertModal({
          isOpen: true,
          title: response.status === 409 ? 'Conflit de réservation' : 'Erreur',
          message: errorMessage,
          variant: 'error'
        });
      }
    } catch (error) {
      console.error('Erreur:', error);
      setAlertModal({
        isOpen: true,
        title: 'Erreur',
        message: 'Une erreur est survenue',
        variant: 'error'
      });
    }
  };

  const handleDelete = (id: number) => {
    setConfirmModal({ isOpen: true, reservationId: id });
  };

  const confirmDelete = async () => {
    const id = confirmModal.reservationId;
    setConfirmModal({ isOpen: false, reservationId: null });

    if (!id) return;

    try {
      const response = await fetch('/api/reservation/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });

      const data = await response.json();
      
      if (data.success) {
        setAlertModal({
          isOpen: true,
          title: 'Supprimée',
          message: 'Réservation supprimée avec succès',
          variant: 'success'
        });
        loadReservations();
      } else {
        setAlertModal({
          isOpen: true,
          title: 'Erreur',
          message: data.error || 'Une erreur est survenue',
          variant: 'error'
        });
      }
    } catch (error) {
      console.error('Erreur:', error);
      setAlertModal({
        isOpen: true,
        title: 'Erreur',
        message: 'Une erreur est survenue lors de la suppression',
        variant: 'error'
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getChaletStatus = (reservation: Reservation) => {
    if (reservation.chaletLeft && reservation.chaletRight) return '2 chalets';
    if (reservation.chaletLeft) return 'Chalet gauche';
    if (reservation.chaletRight) return 'Chalet droit';
    return 'Aucun';
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Calendar className="w-6 h-6 text-[#467A5E]" />
          <h2 className="text-2xl font-serif font-bold text-[#2c4b3a]">
            Gestion des Réservations
          </h2>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2 bg-[#467A5E] text-white rounded-lg hover:bg-[#3a6b4f] transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nouvelle réservation
        </button>
      </div>

      {/* Liste des réservations */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#467A5E]"></div>
        </div>
      ) : reservations.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>Aucune réservation pour les 6 prochains mois</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reservations.map((reservation) => (
            <div
              key={reservation.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-semibold text-gray-800">
                    {formatDate(reservation.startDate)} → {formatDate(reservation.endDate)}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    reservation.chaletLeft && reservation.chaletRight
                      ? 'bg-red-100 text-red-700'
                      : 'bg-orange-100 text-orange-700'
                  }`}>
                    {getChaletStatus(reservation)}
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(reservation.endDate).getTime() - new Date(reservation.startDate).getTime() > 0 
                    ? Math.ceil((new Date(reservation.endDate).getTime() - new Date(reservation.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1 
                    : 1} jour(s)
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEditModal(reservation)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Modifier"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(reservation.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Supprimer"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de création/édition */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 z-[10000] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-serif font-bold text-gray-900">
                {editingReservation ? 'Modifier la réservation' : 'Nouvelle réservation'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Formulaire */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date de début
                </label>
                <input
                  type="date"
                  required
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#467A5E] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date de fin
                </label>
                <input
                  type="date"
                  required
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#467A5E] focus:border-transparent"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chalets réservés
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.chaletLeft}
                    onChange={(e) => setFormData({ ...formData, chaletLeft: e.target.checked })}
                    className="w-4 h-4 text-[#467A5E] border-gray-300 rounded focus:ring-[#467A5E]"
                  />
                  <span className="text-gray-700">Chalet gauche</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.chaletRight}
                    onChange={(e) => setFormData({ ...formData, chaletRight: e.target.checked })}
                    className="w-4 h-4 text-[#467A5E] border-gray-300 rounded focus:ring-[#467A5E]"
                  />
                  <span className="text-gray-700">Chalet droit</span>
                </label>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#467A5E] text-white rounded-lg hover:bg-[#3a6b4f] transition-colors"
                >
                  {editingReservation ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modales */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title="Supprimer la réservation ?"
        message="Êtes-vous sûr de vouloir supprimer cette réservation ? Cette action est irréversible."
        confirmText="Supprimer"
        cancelText="Annuler"
        onConfirm={confirmDelete}
        onCancel={() => setConfirmModal({ isOpen: false, reservationId: null })}
        variant="danger"
      />

      <AlertModal
        isOpen={alertModal.isOpen}
        title={alertModal.title}
        message={alertModal.message}
        variant={alertModal.variant}
        onClose={() => setAlertModal({ isOpen: false, title: '', message: '', variant: 'info' })}
      />
    </div>
  );
}
