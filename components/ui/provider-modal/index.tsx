"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Building2, MapPin, Phone, FileText, Award, Calendar, User, Star } from "lucide-react";
import { StarRating } from "@/components/ui/star-rating";
import { Penyedia, Penilaian } from "@/lib/google-sheets";

/**
 * ProviderModal Component
 * 
 * Features:
 * - Glassmorphism effect with backdrop blur
 * - Smooth fade-in and scale-up animations
 * - Responsive design (full screen on mobile)
 * - Accessibility features:
 *   - Focus trapping
 *   - Escape key to close
 *   - Proper focus management
 * - Trigger: Click on search result cards
 */

interface PenyediaWithRatings extends Penyedia {
  totalPenilaian: number;
  rataRataSkor: number;
  penilaian: Penilaian[];
}

interface ProviderModalProps {
  isOpen: boolean;
  onClose: () => void;
  penyedia: PenyediaWithRatings | null;
}

// Map LKPP score (1-3) to 5-star rating
const mapScoreToStars = (score: number) => {
  if (score === 0) return 0;
  if (score >= 1 && score < 2) return 2; // Cukup = 2 stars
  if (score >= 2 && score < 3) return 4; // Baik = 4 stars
  if (score === 3) return 5; // Sangat Baik = 5 stars
  return 1; // fallback
};

// Get final evaluation text
const getFinalEvaluationText = (score: number) => {
  if (score === 3) return "Sangat Baik";
  if (score >= 2 && score < 3) return "Baik";
  if (score >= 1 && score < 2) return "Cukup";
  if (score === 0) return "Buruk";
  return "Cukup"; // fallback
};

// Get rating color based on LKPP scale (1-3)
const getRatingColor = (rating: number) => {
  if (rating >= 2.5) return "text-green-600 bg-green-100";
  if (rating >= 2.0) return "text-blue-600 bg-blue-100";
  if (rating >= 1.0) return "text-yellow-600 bg-yellow-100";
  return "text-red-600 bg-red-100";
};

export function ProviderModal({ isOpen, onClose, penyedia }: ProviderModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const initialFocusRef = useRef<HTMLDivElement>(null);

  // Focus trapping and Esc key handling
  useEffect(() => {
    if (!isOpen) return;

    // Focus the modal content when it opens
    const timer = setTimeout(() => {
      if (initialFocusRef.current) {
        initialFocusRef.current.focus();
      }
    }, 100);

    // Handle keyboard events
    const handleKeyDown = (e: KeyboardEvent) => {
      // Close modal with Escape key
      if (e.key === "Escape") {
        onClose();
      }
      
      // Focus trapping
      if (e.key === "Tab" && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
        
        if (e.shiftKey && document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    // Prevent body scrolling when modal is open
    document.body.style.overflow = "hidden";

    return () => {
      clearTimeout(timer);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!penyedia) return null;

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop with glassmorphism effect */}
          <motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Modal Content */}
          <motion.div
            ref={modalRef}
            className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ 
              type: "spring", 
              damping: 25, 
              stiffness: 300,
              duration: 0.3
            }}
          >
            <div 
              ref={initialFocusRef}
              tabIndex={-1}
              className="p-4 sm:p-6 focus:outline-none"
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100">
                  Detail Penyedia
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Tutup detail penyedia"
                >
                  <X className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                </button>
              </div>

              {/* Provider Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">
                    Informasi Penyedia
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg mr-3">
                        <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Nama Perusahaan
                        </p>
                        <p className="font-medium text-slate-800 dark:text-slate-100">
                          {penyedia.namaPerusahaan}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg mr-3">
                        <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          NPWP
                        </p>
                        <p className="font-medium text-slate-800 dark:text-slate-100">
                          {penyedia.npwp}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">
                    ID Penyedia
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg mr-3">
                        <Award className="h-5 w-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          ID Penyedia
                        </p>
                        <p className="font-medium text-slate-800 dark:text-slate-100">
                          {penyedia.id}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ratings Summary */}
              <div className="bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6 mb-8 backdrop-blur-sm">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">
                  Ringkasan Penilaian
                </h3>
                <div className="flex flex-col sm:flex-row items-center justify-between">
                  <div className="flex items-center mb-4 sm:mb-0">
                    <StarRating
                      rating={mapScoreToStars(
                        penyedia.rataRataSkor
                      )}
                      size="lg"
                      showValue={false}
                      className="mr-4"
                    />
                    <div>
                      <div className="text-3xl font-bold text-slate-800 dark:text-slate-100">
                        {penyedia.rataRataSkor.toFixed(1)}
                      </div>
                      <div
                        className={`text-sm px-3 py-1 rounded-full font-medium inline-block ${getRatingColor(
                          penyedia.rataRataSkor
                        )}`}
                      >
                        {getFinalEvaluationText(
                          penyedia.rataRataSkor
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-center sm:text-right">
                    <div className="text-3xl font-bold text-slate-800 dark:text-slate-100">
                      {penyedia.totalPenilaian}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-300">
                      Total Penilaian
                    </div>
                  </div>
                </div>
              </div>

              {/* Rating History */}
              <div>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">
                  Riwayat Penilaian
                </h3>
                {penyedia.penilaian.length > 0 ? (
                  <div className="space-y-4">
                    {penyedia.penilaian.map((penilaian, index) => (
                      <motion.div
                        key={penilaian.id}
                        className="border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-5 backdrop-blur-sm bg-white/30 dark:bg-slate-700/30"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                          <div className="flex items-center mb-2 sm:mb-0">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg mr-2">
                              <User className="h-4 w-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                            </div>
                            <span className="font-medium text-slate-800 dark:text-slate-100">
                              {penilaian.namaPPK}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <div className="p-1 bg-slate-100 dark:bg-slate-700 rounded mr-1">
                              <Calendar className="h-4 w-4 text-slate-500" aria-hidden="true" />
                            </div>
                            <span className="text-sm text-slate-600 dark:text-slate-300">
                              {new Date(
                                penilaian.tanggalPenilaian
                              ).toLocaleDateString("id-ID")}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                          <div className="mb-4 sm:mb-0">
                            <StarRating
                              rating={mapScoreToStars(penilaian.skorTotal)}
                              size="md"
                              showValue={false}
                              className="mb-2"
                            />
                            <div
                              className={`text-xs px-3 py-1 rounded-full font-medium inline-block ${getRatingColor(
                                penilaian.skorTotal
                              )}`}
                            >
                              {penilaian.penilaianAkhir ||
                                getFinalEvaluationText(penilaian.skorTotal)}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                              {penilaian.skorTotal.toFixed(1)}/3
                            </div>
                            <div className="text-sm text-slate-600 dark:text-slate-300">
                              Skor Total
                            </div>
                          </div>
                        </div>

                        {penilaian.keterangan && (
                          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                            <p className="text-sm text-slate-600 dark:text-slate-300">
                              {penilaian.keterangan}
                            </p>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-slate-600 dark:text-slate-300 text-lg">
                      Belum ada penilaian untuk penyedia ini
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Render modal in portal if available, otherwise render inline
  if (typeof document !== 'undefined') {
    const modalRoot = document.getElementById('modal-root');
    if (modalRoot) {
      return createPortal(modalContent, modalRoot);
    }
  }

  // Fallback to inline rendering
  return modalContent;
}