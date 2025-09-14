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
      const sortedPenilaian = [...penilaian].sort((a, b) => 
        new Date(a.tanggalPenilaian).getTime() - new Date(b.tanggalPenilaian).getTime()
      );
      
      // Split data into two halves for comparison
      const midIndex = Math.floor(sortedPenilaian.length / 2);
      const firstHalf = sortedPenilaian.slice(0, midIndex);
      const secondHalf = sortedPenilaian.slice(midIndex);
      
      // Calculate average for each half
      const avgFirstHalf = firstHalf.length > 0 
        ? firstHalf.reduce((sum, p) => sum + p.skorTotal, 0) / firstHalf.length 
        : 0;
        
      const avgSecondHalf = secondHalf.length > 0 
        ? secondHalf.reduce((sum, p) => sum + p.skorTotal, 0) / secondHalf.length 
        : 0;
      
      // Calculate percentage improvement
      if (avgFirstHalf > 0) {
        const improvement = ((avgSecondHalf - avgFirstHalf) / avgFirstHalf) * 100;
        peningkatan = `${improvement >= 0 ? '+' : ''}${improvement.toFixed(1)}%`;
      }
    }

    // Calculate top penyedia for the current week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const penyediaWithRatings = penyedia
      .map((p: any) => {
        // Filter penilaian within the last week
        const recentPenilaian = penilaian.filter(
          (pnl: any) => {
            const penilaianDate = new Date(pnl.tanggalPenilaian);
            return (
              pnl.idPenyedia === p.id && 
              penilaianDate >= oneWeekAgo
            );
          }
        );
        
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

        {/* Performance Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-800 dark:to-blue-900/20 border-0 shadow-xl rounded-2xl overflow-hidden">
            <CardContent className="p-5 lg:p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl lg:text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center">
                  <TrendingUp className="h-6 w-6 text-blue-600 mr-2" />
                  Gambaran Kinerja
                </h2>
                <Link 
                  href="/laporan" 
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium"
                >
                  Lihat Detail
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Best Provider of the Week */}
                <div className="bg-white/70 dark:bg-slate-800/70 p-4 rounded-xl">
                  <div className="flex items-center mb-2">
                    <Award className="h-5 w-5 text-yellow-600 mr-2" />
                    <h3 className="font-semibold text-slate-700 dark:text-slate-300">Terbaik Minggu Ini</h3>
                  </div>
                  {topPenyedia.length > 0 ? (
                    <>
                      <p className="text-lg font-bold text-yellow-600 truncate">
                        {topPenyedia[0]?.namaPerusahaan || "-"}
                      </p>
                      <div className="flex items-center mt-1">
                        <Star className="h-4 w-4 text-amber-500 fill-amber-500 mr-1" />
                        <span className="text-sm font-medium">
                          {topPenyedia[0]?.rataRataSkor?.toFixed(1) || "-"} ({topPenyedia[0]?.totalPenilaian || 0}x)
                        </span>
                      </div>
                    </>
                  ) : (
                    <p className="text-lg font-bold text-slate-500">-</p>
                  )}
                </div>
                
                {/* Today's Evaluations */}
                <div className="bg-white/70 dark:bg-slate-800/70 p-4 rounded-xl">
                  <div className="flex items-center mb-2">
                    <FileText className="h-5 w-5 text-emerald-600 mr-2" />
                    <h3 className="font-semibold text-slate-700 dark:text-slate-300">Penilaian Hari Ini</h3>
                  </div>
                  <p className="text-2xl font-bold text-emerald-600">
                    {dashboardData?.penilaian?.filter((p: any) => {
                      const today = new Date().toISOString().split('T')[0];
                      return p.tanggalPenilaian === today;
                    }).length || 0}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Evaluasi dilakukan hari ini</p>
                </div>
                
                {/* Performance Trend */}
                <div className="bg-white/70 dark:bg-slate-800/70 p-4 rounded-xl">
                  <div className="flex items-center mb-2">
                    <TrendingUp className="h-5 w-5 text-purple-600 mr-2" />
                    <h3 className="font-semibold text-slate-700 dark:text-slate-300">Tren Kinerja</h3>
                  </div>
                  <p className="text-2xl font-bold text-purple-600">
                    {stats.peningkatan || "+0%"}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {parseFloat(stats.peningkatan || "0") >= 0 
                      ? "Meningkat dari periode sebelumnya" 
                      : "Menurun dari periode sebelumnya"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

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
