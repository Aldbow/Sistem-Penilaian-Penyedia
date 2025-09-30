"use client";

import Link from "next/link";
import { useState, useEffect, useMemo, memo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  FileText,
  BarChart3,
  Users,
  Star,
  Search,
  MapPin,
  Phone,
  Calendar,
  Award,
  User,
  TrendingUp,
  Target,
  Shield,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useDashboardStats } from "@/lib/use-api-cache";
import { useSearchCache } from "@/lib/use-search-cache";
import { StatCard } from "@/components/optimized/stat-card";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Penyedia, Penilaian } from "@/lib/google-sheets";
import { StarRating } from "@/components/ui/star-rating";
import { HeroSection } from "@/components/ui/hero-section";
import { SearchSection } from "@/components/ui/search-section";
import { QuickActions } from "@/components/ui/quick-actions";
import { FeaturesSection } from "@/components/ui/features-section";
import AnimatedLayout from "@/components/ui/animated-layout";
import { ProviderModal } from "@/components/ui/provider-modal";

interface DashboardStats {
  totalPenyedia: number;
  totalPenilaian: number;
  totalPPK: number;
  rataRataSkor: string;
  skorTertinggi: string;
  peningkatan: string;
}

interface PenyediaWithRatings extends Penyedia {
  totalPenilaian: number;
  rataRataSkor: number;
  penilaian: Penilaian[];
}

export default function HomePage() {
  const {
    data: dashboardData,
    loading: isLoading,
    error,
  } = useDashboardStats();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPenyedia, setSelectedPenyedia] =
    useState<PenyediaWithRatings | null>(null);

  // Optimized search with caching
  const searchPenyedia = useCallback(async (query: string) => {
    const response = await fetch(
      `/api/penyedia/search?q=${encodeURIComponent(query)}`
    );
    if (!response.ok) throw new Error("Search failed");
    return response.json();
  }, []);

  const {
    results: searchResults,
    isLoading: isSearching,
    search,
  } = useSearchCache(searchPenyedia, {
    cacheTimeout: 5 * 60 * 1000, // 5 minutes
    debounceDelay: 250, // Faster response
  });

  // Handle search query changes
  useEffect(() => {
    search(searchQuery);
  }, [searchQuery, search]);

  const { stats, topPenyedia } = useMemo(() => {
    if (!dashboardData) {
      return {
        stats: {
          totalPenyedia: 0,
          totalPenilaian: 0,
          totalPPK: 0,
          rataRataSkor: "-",
          skorTertinggi: "-",
          peningkatan: "+0%",
        },
        topPenyedia: [],
      };
    }

    const { penyedia, penilaian, ppk } = dashboardData;

    // Calculate stats
    const totalPenyedia = penyedia.length;
    const totalPenilaian = penilaian.length;
    const totalPPK = ppk.length; // Get PPK count from PPK sheet

    // Calculate current average score
    const rataRataSkor =
      penilaian.length > 0
        ? (
            penilaian.reduce((sum: number, p: any) => sum + p.skorTotal, 0) /
            penilaian.length
          ).toFixed(1)
        : "-";

    // Calculate highest score
    const skorTertinggi =
      penilaian.length > 0
        ? Math.max(...penilaian.map((p: any) => p.skorTotal)).toFixed(1)
        : "-";

    // Calculate improvement percentage
    let peningkatan = "+0%";
    if (penilaian.length > 1) {
      // Sort penilaian by date
      const sortedPenilaian = [...penilaian].sort(
        (a, b) =>
          new Date(a.tanggalPenilaian).getTime() -
          new Date(b.tanggalPenilaian).getTime()
      );

      // Split data into two halves for comparison
      const midIndex = Math.floor(sortedPenilaian.length / 2);
      const firstHalf = sortedPenilaian.slice(0, midIndex);
      const secondHalf = sortedPenilaian.slice(midIndex);

      // Calculate average for each half
      const avgFirstHalf =
        firstHalf.length > 0
          ? firstHalf.reduce((sum, p) => sum + p.skorTotal, 0) /
            firstHalf.length
          : 0;

      const avgSecondHalf =
        secondHalf.length > 0
          ? secondHalf.reduce((sum, p) => sum + p.skorTotal, 0) /
            secondHalf.length
          : 0;

      // Calculate percentage improvement
      if (avgFirstHalf > 0) {
        const improvement =
          ((avgSecondHalf - avgFirstHalf) / avgFirstHalf) * 100;
        peningkatan = `${improvement >= 0 ? "+" : ""}${improvement.toFixed(
          1
        )}%`;
      }
    }

    // Calculate top penyedia for the current week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const penyediaWithRatings = penyedia
      .map((p: any) => {
        // Filter penilaian within the last week
        const recentPenilaian = penilaian.filter((pnl: any) => {
          const penilaianDate = new Date(pnl.tanggalPenilaian);
          return pnl.idPenyedia === p.id && penilaianDate >= oneWeekAgo;
        });

        const totalPenilaianCount = recentPenilaian.length;
        const rataRata =
          totalPenilaianCount > 0
            ? recentPenilaian.reduce(
                (sum: number, pnl: any) => sum + pnl.skorTotal,
                0
              ) / totalPenilaianCount
            : 0;

        return {
          ...p,
          totalPenilaian: totalPenilaianCount,
          rataRataSkor: rataRata,
        };
      })
      .filter((p: any) => p.totalPenilaian > 0)
      .sort((a: any, b: any) => {
        // Sort by rating first, then by number of evaluations
        if (b.rataRataSkor !== a.rataRataSkor) {
          return b.rataRataSkor - a.rataRataSkor;
        }
        return b.totalPenilaian - a.totalPenilaian;
      })
      .slice(0, 3);

    return {
      stats: {
        totalPenyedia,
        totalPenilaian,
        totalPPK,
        rataRataSkor,
        skorTertinggi,
        peningkatan,
      },
      topPenyedia: penyediaWithRatings,
    };
  }, [dashboardData]);

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

  return (
    <AnimatedLayout>
      <div className="space-y-8 p-4 sm:p-6 lg:p-8">
        <SpeedInsights />

        {/* Hero Section */}
        <HeroSection />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <StatCard
            title="Total Penyedia"
            value={stats.totalPenyedia}
            icon={Building2}
            color="blue"
            isLoading={isLoading}
          />
          <StatCard
            title="Total Penilaian"
            value={stats.totalPenilaian}
            icon={FileText}
            color="emerald"
            isLoading={isLoading}
          />
          <StatCard
            title="PPK Aktif"
            value={stats.totalPPK}
            icon={Users}
            color="indigo"
            isLoading={isLoading}
          />
          <StatCard
            title="Rata-rata Skor"
            value={`${stats.rataRataSkor}${
              stats.rataRataSkor !== "-" ? "/3" : ""
            }`}
            icon={Target}
            color="amber"
            isLoading={isLoading}
          />
        </div>

        

        {/* Enhanced Search Section */}
        <SearchSection
          searchResults={searchResults}
          isSearching={isSearching}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setSelectedPenyedia={setSelectedPenyedia}
        />

        {/* Quick Actions */}
        <QuickActions />

        {/* Features */}
        <FeaturesSection />

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5, ease: "easeOut" }}
          className="mt-8 lg:mt-12"
        >
          <Card className="bg-gradient-to-br from-slate-50/80 to-white/50 dark:from-slate-800/80 dark:to-slate-700/50 border-0 shadow-2xl rounded-3xl overflow-hidden backdrop-blur-sm">
            <CardContent className="p-6 sm:p-8 lg:p-12">
              <div className="text-center mb-10 lg:mb-12 px-4 sm:px-6">
                <motion.h2
                  className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-700 to-blue-600 dark:from-blue-400 dark:to-blue-300 bg-clip-text text-transparent mb-4 lg:mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  Hubungi Kami
                </motion.h2>
                <motion.p
                  className="text-slate-600 dark:text-slate-300 text-base sm:text-lg lg:text-xl max-w-3xl mx-auto"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Punya pertanyaan atau masukan? Kami siap membantu Anda
                </motion.p>
              </div>

              <div className="max-w-3xl mx-auto">
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                      >
                        Nama Lengkap
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg
                            className="h-5 w-5 text-slate-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                        </div>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          className="block w-full pl-10 pr-3 py-4 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-2xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-base"
                          placeholder="Nama Anda"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                      >
                        Email
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg
                            className="h-5 w-5 text-slate-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          className="block w-full pl-10 pr-3 py-4 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-2xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-base"
                          placeholder="email@google.com"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                    >
                      Subjek
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg
                          className="h-5 w-5 text-slate-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                          />
                        </svg>
                      </div>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        className="block w-full pl-10 pr-3 py-4 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-2xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-base"
                        placeholder="Subjek pesan"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                    >
                      Pesan
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      className="block w-full px-4 py-4 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-2xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-base resize-none"
                      placeholder="Tulis pesan Anda di sini..."
                    ></textarea>
                  </div>

                  <div className="flex justify-center">
                    <motion.button
                      type="submit"
                      className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-base"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="flex items-center">
                        <svg
                          className="h-5 w-5 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                        Kirim Pesan
                      </div>
                    </motion.button>
                  </div>
                </form>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Provider Detail Modal */}
        <ProviderModal
          isOpen={!!selectedPenyedia}
          onClose={() => setSelectedPenyedia(null)}
          penyedia={selectedPenyedia}
        />
      </div>
    </AnimatedLayout>
  );
}
