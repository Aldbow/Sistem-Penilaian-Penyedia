'use client'

import { useState, useEffect } from 'react'
import { BarChart3, Building2, Users, Star, TrendingUp, Download, Award, Trophy, Medal, ChevronDown, FileText, FileSpreadsheet, Search, Filter, X } from 'lucide-react'
import { StarRating } from '@/components/ui/star-rating'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { motion } from 'framer-motion'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'
import { Penyedia, Penilaian } from '@/lib/google-sheets'
import { LaporanModal } from '@/components/ui/laporan-modal'

interface PenyediaWithRating extends Penyedia {
  totalPenilaian: number
  rataRataSkor: number
  penilaianTerbaru: string
  penilaianAkhir?: string
  wilsonScore: number
}

interface PenyediaWithDetails extends PenyediaWithRating {
  penilaian: Penilaian[]
}

// Define interface for PPK data
interface PPK {
  id: string;
  nama: string;
  nip: string;
  // Add other properties as needed based on your PPK data structure
}

// Wilson Score Confidence Interval calculation
const calculateWilsonScore = (successRate: number, totalSamples: number, confidence: number = 1.96): number => {
  if (totalSamples === 0) return 0;
  
  const p = successRate;
  const n = totalSamples;
  const z = confidence; // 1.96 for 95% confidence interval
  
  const numerator = p + (z * z) / (2 * n) - z * Math.sqrt((p * (1 - p) + (z * z) / (4 * n)) / n);
  const denominator = 1 + (z * z) / n;
  
  return Math.max(0, numerator / denominator);
};

// Convert LKPP score (1-3) to Wilson Score
const calculateProviderWilsonScore = (rataRataSkor: number, totalPenilaian: number): number => {
  if (totalPenilaian === 0) return 0;
  
  // Convert score 1-3 to success rate (0-1)
  // Score 1 = 0% success, Score 2 = 50% success, Score 3 = 100% success
  const successRate = Math.max(0, Math.min(1, (rataRataSkor - 1) / 2));
  
  const wilsonScore = calculateWilsonScore(successRate, totalPenilaian);
  
  // Convert back to 1-3 scale
  return 1 + (wilsonScore * 2);
};

export default function LaporanPage() {
  const [penyediaData, setPenyediaData] = useState<PenyediaWithRating[]>([])
  const [penilaianData, setPenilaianData] = useState<Penilaian[]>([])
  const [ppkData, setPpkData] = useState<PPK[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [sortOption, setSortOption] = useState('a-z')
  const [starFilter, setStarFilter] = useState('all')
  const [starSort, setStarSort] = useState('none')
  const [mostRatedFilter, setMostRatedFilter] = useState(false) // New state for most rated filter
  const [dateSort, setDateSort] = useState('none') // New state for date sorting
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [screenSize, setScreenSize] = useState<'sm' | 'md' | 'lg'>('lg')
  const [selectedPenyedia, setSelectedPenyedia] = useState<PenyediaWithDetails | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Fetch data
  useEffect(() => {
    fetchData()
  }, [])

  // Track screen size for responsive pagination
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setScreenSize('sm')
      } else if (window.innerWidth < 768) {
        setScreenSize('md')
      } else {
        setScreenSize('lg')
      }
    }

    handleResize() // Set initial size
    window.addEventListener('resize', handleResize)
    
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const [penyediaResponse, penilaianResponse, ppkResponse] = await Promise.all([
        fetch('/api/penyedia'),
        fetch('/api/penilaian'),
        fetch('/api/ppk')
      ])

      if (penyediaResponse.ok && penilaianResponse.ok && ppkResponse.ok) {
        const penyedia: Penyedia[] = await penyediaResponse.json()
        const penilaian: Penilaian[] = await penilaianResponse.json()
        const ppk: any[] = await ppkResponse.json()

        // Combine data
        const combinedData: PenyediaWithRating[] = penyedia.map(p => {
          const penilaianPenyedia = penilaian.filter(pnl => pnl.idPenyedia === p.id)
          const totalPenilaian = penilaianPenyedia.length
          const rataRataSkor = totalPenilaian > 0 
            ? penilaianPenyedia.reduce((sum, pnl) => sum + pnl.skorTotal, 0) / totalPenilaian
            : 0
            
          // Sort penilaian by date without mutating the original array
          const sortedPenilaian = [...penilaianPenyedia].sort((a, b) => 
            new Date(b.tanggalPenilaian).getTime() - new Date(a.tanggalPenilaian).getTime()
          )
          
          const penilaianTerbaru = totalPenilaian > 0
            ? sortedPenilaian[0].tanggalPenilaian
            : '-'
          const penilaianAkhir = totalPenilaian > 0
            ? sortedPenilaian[0].penilaianAkhir
            : undefined

          // Calculate Wilson Score
          const wilsonScore = calculateProviderWilsonScore(rataRataSkor, totalPenilaian)

          return {
            ...p,
            totalPenilaian,
            rataRataSkor,
            penilaianTerbaru,
            penilaianAkhir,
            wilsonScore
          }
        })

        setPenyediaData(combinedData)
        setPenilaianData(penilaian)
        setPpkData(ppk)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Filter data based on search, status, and star rating
  // (Moved after mapScoreToStars function definition)

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Handle items per page change
  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage)
    setCurrentPage(1)
  }

  // Calculate statistics
  const totalPenyedia = penyediaData.length
  const totalPenilaian = penilaianData.length
  const totalPPK = ppkData.length // Get PPK count from PPK sheet
  
  // Map 1-3 evaluation score to 5-star display
  const mapScoreToStars = (score: number) => {
    if (score === 0) return 0
    if (score >= 1 && score < 2) return 2 // Cukup = 2 stars
    if (score >= 2 && score < 3) return 4 // Baik = 4 stars
    if (score === 3) return 5 // Sangat Baik = 5 stars
    return 1 // fallback
  }

  // Filter data based on search, status, and star rating
  const filteredData = penyediaData.filter(penyedia => {
    const matchesSearch = penyedia.namaPerusahaan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      penyedia.npwp.includes(searchQuery)
    
    if (!matchesSearch) return false
    
    // Apply status filter based on LKPP scale (1-3)
    if (filterStatus !== 'all') {
      if (filterStatus === 'excellent') {
        if (penyedia.rataRataSkor !== 3) return false
      } else if (filterStatus === 'good') {
        if (!(penyedia.rataRataSkor >= 2 && penyedia.rataRataSkor < 3)) return false
      } else if (filterStatus === 'average') {
        if (!(penyedia.rataRataSkor >= 1 && penyedia.rataRataSkor < 2)) return false
      } else if (filterStatus === 'poor') {
        if (penyedia.rataRataSkor !== 0) return false
      }
    }
    
    // Apply star filter (rated/unrated)
    if (starFilter === 'rated') {
      return penyedia.totalPenilaian > 0
    } else if (starFilter === 'unrated') {
      return penyedia.totalPenilaian === 0
    }
    
    return true
  }).sort((a, b) => {
    // Apply most rated filter first (if enabled, sort by totalPenilaian descending)
    if (mostRatedFilter) {
      return b.totalPenilaian - a.totalPenilaian;
    }
    
    // Apply date sorting (newest/oldest evaluation)
    if (dateSort === 'newest') {
      // Sort by latest evaluation date (newest first)
      if (a.penilaianTerbaru === '-' && b.penilaianTerbaru === '-') return 0;
      if (a.penilaianTerbaru === '-') return 1; // Move unrated to end
      if (b.penilaianTerbaru === '-') return -1; // Move unrated to end
      return new Date(b.penilaianTerbaru).getTime() - new Date(a.penilaianTerbaru).getTime();
    } else if (dateSort === 'oldest') {
      // Sort by latest evaluation date (oldest first)
      if (a.penilaianTerbaru === '-' && b.penilaianTerbaru === '-') return 0;
      if (a.penilaianTerbaru === '-') return 1; // Move unrated to end
      if (b.penilaianTerbaru === '-') return -1; // Move unrated to end
      return new Date(a.penilaianTerbaru).getTime() - new Date(b.penilaianTerbaru).getTime();
    }
    
    // Apply Wilson Score sorting
    if (starSort === 'high-low') {
      // Sort by Wilson Score (highest first)
      return b.wilsonScore - a.wilsonScore;
    } else if (starSort === 'low-high') {
      // Sort by Wilson Score (lowest first)
      return a.wilsonScore - b.wilsonScore;
    }
    
    // Apply alphabetical sorting based on sort option
    if (sortOption === 'a-z') {
      return a.namaPerusahaan.localeCompare(b.namaPerusahaan)
    } else if (sortOption === 'z-a') {
      return b.namaPerusahaan.localeCompare(a.namaPerusahaan)
    }
    
    return 0
  })

  // Pagination calculations
  const totalItems = filteredData.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedData = filteredData.slice(startIndex, endIndex)

  // Calculate star distribution (1-5 stars)
  const calculateStarDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    const totalWithRatings = penyediaData.filter(p => p.totalPenilaian > 0).length
    
    penyediaData.forEach(penyedia => {
      if (penyedia.totalPenilaian > 0) {
        const stars = mapScoreToStars(penyedia.rataRataSkor)
        if (stars >= 1 && stars <= 5) {
          distribution[stars as keyof typeof distribution]++
        }
      }
    })
    
    return { distribution, totalWithRatings }
  }
  
  const { distribution: starDistribution, totalWithRatings } = calculateStarDistribution()

  // Get rating color based on LKPP scale (1-3)
  const getRatingColor = (rating: number) => {
    if (rating >= 2.5) return 'text-green-600 bg-green-100'
    if (rating >= 2.0) return 'text-blue-600 bg-blue-100'
    if (rating >= 1.0) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getRatingText = (rating: number) => {
    if (rating === 3) return 'Sangat Baik'
    if (rating >= 2 && rating < 3) return 'Baik'
    if (rating >= 1 && rating < 2) return 'Cukup'
    if (rating === 0) return 'Buruk'
    return 'Cukup' // fallback
  }

  // Get final evaluation text from penilaian data
  const getFinalEvaluationText = (penilaianAkhir: string) => {
    return penilaianAkhir || 'Belum Dinilai'
  }


  // Prepare comprehensive export data
  const prepareExportData = () => {
    return filteredData.map(penyedia => {
      // Get all evaluations for this provider
      const providerEvaluations = penilaianData.filter(p => p.idPenyedia === penyedia.id)
      
      // Calculate criteria averages
      const avgKualitas = providerEvaluations.length > 0 
        ? providerEvaluations.reduce((sum, p) => sum + (p.kualitasKuantitasBarangJasa || 0), 0) / providerEvaluations.length
        : 0
      const avgBiaya = providerEvaluations.length > 0 
        ? providerEvaluations.reduce((sum, p) => sum + (p.biaya || 0), 0) / providerEvaluations.length
        : 0
      const avgWaktu = providerEvaluations.length > 0 
        ? providerEvaluations.reduce((sum, p) => sum + (p.waktu || 0), 0) / providerEvaluations.length
        : 0
      const avgLayanan = providerEvaluations.length > 0 
        ? providerEvaluations.reduce((sum, p) => sum + (p.layanan || 0), 0) / providerEvaluations.length
        : 0

      // Calculate standard deviation for consistency analysis
      const scores = providerEvaluations.map(p => p.skorTotal)
      const mean = penyedia.rataRataSkor
      const variance = scores.length > 1 
        ? scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / (scores.length - 1)
        : 0
      const stdDev = Math.sqrt(variance)

      // Get unique PPKs who evaluated this provider
      const uniquePPKs = Array.from(new Set(providerEvaluations.map(p => p.namaPPK))).length

      // Calculate trend (compare first half vs second half of evaluations)
      let trend = 'Stabil'
      if (providerEvaluations.length >= 4) {
        const sortedEvals = [...providerEvaluations].sort((a, b) => 
          new Date(a.tanggalPenilaian).getTime() - new Date(b.tanggalPenilaian).getTime()
        )
        const midIndex = Math.floor(sortedEvals.length / 2)
        const firstHalf = sortedEvals.slice(0, midIndex)
        const secondHalf = sortedEvals.slice(midIndex)
        
        const avgFirst = firstHalf.reduce((sum, p) => sum + p.skorTotal, 0) / firstHalf.length
        const avgSecond = secondHalf.reduce((sum, p) => sum + p.skorTotal, 0) / secondHalf.length
        
        if (avgSecond > avgFirst + 0.2) trend = 'Meningkat'
        else if (avgSecond < avgFirst - 0.2) trend = 'Menurun'
      }

      // Get evaluation period
      const dates = providerEvaluations.map(p => new Date(p.tanggalPenilaian))
      const earliestDate = dates.length > 0 ? new Date(Math.min(...dates.map(d => d.getTime()))) : null
      const latestDate = dates.length > 0 ? new Date(Math.max(...dates.map(d => d.getTime()))) : null

      // Helper function to get rating text for criteria
      const getCriteriaRating = (score: number) => {
        if (score >= 2.5) return 'Sangat Baik'
        if (score >= 2.0) return 'Baik'
        if (score >= 1.5) return 'Cukup'
        return 'Perlu Perbaikan'
      }

      return {
        // === INFORMASI DASAR PENYEDIA ===
        'ID Penyedia': penyedia.id,
        'Nama Perusahaan': penyedia.namaPerusahaan,
        'NPWP': penyedia.npwp,

        // === STATISTIK PENILAIAN KESELURUHAN ===
        'Total Penilaian': penyedia.totalPenilaian,
        'Rata-rata Skor Keseluruhan': penyedia.rataRataSkor.toFixed(2),
        'Rating Kategori': getRatingText(penyedia.rataRataSkor),
        'Wilson Score': penyedia.wilsonScore.toFixed(3),
        'Penilaian Terbaru': penyedia.penilaianTerbaru !== '-' 
          ? new Date(penyedia.penilaianTerbaru).toLocaleDateString('id-ID')
          : 'Belum ada',

        // === ANALISIS PER ASPEK PENILAIAN ===
        'Rata-rata Kualitas': avgKualitas.toFixed(2),
        'Rating Kualitas': getCriteriaRating(avgKualitas),
        'Rata-rata Biaya': avgBiaya.toFixed(2),
        'Rating Biaya': getCriteriaRating(avgBiaya),
        'Rata-rata Waktu': avgWaktu.toFixed(2),
        'Rating Waktu': getCriteriaRating(avgWaktu),
        'Rata-rata Layanan': avgLayanan.toFixed(2),
        'Rating Layanan': getCriteriaRating(avgLayanan),

        // === METADATA UNTUK ANALISIS ===
        'Jumlah PPK Penilai': uniquePPKs,
        'Konsistensi Penilaian (StdDev)': stdDev.toFixed(3),
        'Trend Penilaian': trend,
        'Periode Evaluasi Awal': earliestDate ? earliestDate.toLocaleDateString('id-ID') : '-',
        'Periode Evaluasi Akhir': latestDate ? latestDate.toLocaleDateString('id-ID') : '-',
        'Rentang Evaluasi (Hari)': earliestDate && latestDate 
          ? Math.ceil((latestDate.getTime() - earliestDate.getTime()) / (1000 * 60 * 60 * 24))
          : 0,

        // === DETAIL RIWAYAT PENILAIAN (untuk analisis mendalam) ===
        'Riwayat Penilaian': providerEvaluations.map((evaluation, index) => 
          `[${index + 1}] ${new Date(evaluation.tanggalPenilaian).toLocaleDateString('id-ID')} - ${evaluation.namaPPK} - Skor: ${evaluation.skorTotal} (K:${evaluation.kualitasKuantitasBarangJasa || 0}, B:${evaluation.biaya || 0}, W:${evaluation.waktu || 0}, L:${evaluation.layanan || 0}) - ${evaluation.penilaianAkhir || getRatingText(evaluation.skorTotal)}`
        ).join(' | '),

        // === ANALISIS TAMBAHAN ===
        'Skor Tertinggi': providerEvaluations.length > 0 ? Math.max(...scores).toFixed(1) : '-',
        'Skor Terendah': providerEvaluations.length > 0 ? Math.min(...scores).toFixed(1) : '-',
        'Persentase Penilaian Sangat Baik': providerEvaluations.length > 0 
          ? ((providerEvaluations.filter(p => p.skorTotal >= 2.5).length / providerEvaluations.length) * 100).toFixed(1) + '%'
          : '0%',
        'Persentase Penilaian Baik': providerEvaluations.length > 0 
          ? ((providerEvaluations.filter(p => p.skorTotal >= 2 && p.skorTotal < 2.5).length / providerEvaluations.length) * 100).toFixed(1) + '%'
          : '0%',
        'Persentase Penilaian Cukup': providerEvaluations.length > 0 
          ? ((providerEvaluations.filter(p => p.skorTotal >= 1 && p.skorTotal < 2).length / providerEvaluations.length) * 100).toFixed(1) + '%'
          : '0%'
      }
    })
  }

  // Export data to CSV
  const exportToCSV = () => {
    const csvData = prepareExportData()
    const headers = Object.keys(csvData[0] || {})
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => 
        headers.map(header => 
          `"${String(row[header as keyof typeof row]).replace(/"/g, '""')}"`
        ).join(',')
      )
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `laporan-penyedia-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Export data to Excel
  const exportToExcel = () => {
    const excelData = prepareExportData()
    const headers = Object.keys(excelData[0] || {})
    
    // Create HTML table for Excel
    const htmlTable = `
      <table>
        <thead>
          <tr>${headers.map(header => `<th>${header}</th>`).join('')}</tr>
        </thead>
        <tbody>
          ${excelData.map(row => 
            `<tr>${headers.map(header => 
              `<td>${String(row[header as keyof typeof row])}</td>`
            ).join('')}</tr>`
          ).join('')}
        </tbody>
      </table>
    `

    const blob = new Blob([htmlTable], { 
      type: 'application/vnd.ms-excel;charset=utf-8;' 
    })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `laporan-penyedia-${new Date().toISOString().split('T')[0]}.xls`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data laporan...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 lg:space-y-8 p-2 sm:p-4 lg:p-6">
      <style jsx>{`
        .text-responsive {
          font-size: clamp(0.875rem, 2vw, 1.125rem);
        }
      `}</style>
      {/* Header */}
      <motion.div 
        className="text-center space-y-3 lg:space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-3">
          <motion.div 
            className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl flex items-center justify-center shadow-xl"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <BarChart3 className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
          </motion.div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-emerald-700 to-emerald-600 bg-clip-text text-transparent">
            Laporan Penilaian
          </h1>
        </div>
        <p className="text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto px-2">
          Hasil penilaian penyedia barang/jasa oleh PPK Kementerian Ketenagakerjaan.
        </p>
      </motion.div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="border-l-4 border-l-blue-500 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1 group rounded-2xl">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Penyedia</p>
                  <p className="text-3xl font-bold text-blue-600">{totalPenyedia}</p>
                </div>
                <motion.div 
                  className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-xl"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Building2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="border-l-4 border-l-emerald-500 hover:shadow-2xl hover:shadow-emerald-500/20 transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1 group rounded-2xl">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Penilaian</p>
                  <p className="text-3xl font-bold text-green-600">{totalPenilaian}</p>
                </div>
                <motion.div 
                  className="p-3 bg-green-100 dark:bg-green-900/50 rounded-xl"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <BarChart3 className="h-6 w-6 text-green-600 dark:text-green-400" />
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="border-l-4 border-l-purple-500 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1 group rounded-2xl">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">PPK Aktif</p>
                  <p className="text-3xl font-bold text-purple-600">{totalPPK}</p>
                </div>
                <motion.div 
                  className="p-3 bg-purple-100 dark:bg-purple-900/50 rounded-xl"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Star Rating Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="border-l-4 border-l-amber-500 hover:shadow-2xl hover:shadow-amber-500/20 transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1 rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-amber-600" />
              <span>Distribusi Rating Penyedia</span>
            </CardTitle>
            <CardDescription>
              Distribusi rating berdasarkan {totalWithRatings} penyedia yang sudah dinilai
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[5, 4, 3, 2, 1].map((starCount) => {
                const count = starDistribution[starCount as keyof typeof starDistribution]
                const percentage = totalWithRatings > 0 ? (count / totalWithRatings) * 100 : 0
                
                return (
                  <motion.div 
                    key={starCount} 
                    className="flex items-center space-x-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * starCount }}
                  >
                    <div className="flex items-center space-x-1 w-16">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{starCount}</span>
                      <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                    </div>
                    <div className="flex-1">
                      <Progress value={percentage} className="h-2.5" />
                    </div>
                    <div className="flex items-center space-x-2 w-24 justify-end">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{count}</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">({percentage.toFixed(1)}%)</span>
                    </div>
                  </motion.div>
                )
              })}
            </div>
            
            {totalWithRatings === 0 && (
              <div className="text-center py-8">
                <Star className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Belum ada penyedia yang dinilai</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Search and Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="h-5 w-5" />
              <span>Filter & Pencarian</span>
            </CardTitle>
            <CardDescription>Cari dan filter data penyedia</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 bg-white dark:bg-slate-800 p-4 lg:p-6 rounded-xl shadow-sm border">
              <div className="flex flex-col gap-4">
                <div className="relative w-full group">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-emerald-500 h-5 w-5 transition-colors duration-300" />
                  <input
                    type="text"
                    placeholder="Cari penyedia..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none dark:bg-slate-700 dark:text-white w-full text-base transition-all duration-300 hover:border-emerald-500 hover:shadow-sm hover:shadow-emerald-500/20 dark:hover:border-emerald-500 focus:hover:shadow-emerald-500/30"
                  />
                </div>
                
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col sm:flex-row justify-between gap-3">
                    <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-2">
                      {/* Status Filter Dropdown */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" className="flex items-center justify-between space-x-2 text-base px-4 py-3 rounded-xl w-full sm:w-auto">
                            <div className="flex items-center space-x-2">
                              <Filter className="h-5 w-5" />
                              <span>Status</span>
                            </div>
                            <ChevronDown className="h-4 w-4 sm:ml-2" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-56">
                          <DropdownMenuItem onSelect={() => {
                            setFilterStatus('all');
                            setCurrentPage(1);
                          }}>
                            <div className="flex items-center">
                              <div className={`w-3 h-3 rounded-full mr-2 ${filterStatus === 'all' ? 'bg-emerald-500' : 'bg-gray-300'}`}></div>
                              <span>Semua Status</span>
                            </div>
                          </DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => {
                            setFilterStatus('excellent');
                            setCurrentPage(1);
                          }}>
                            <div className="flex items-center">
                              <div className={`w-3 h-3 rounded-full mr-2 ${filterStatus === 'excellent' ? 'bg-emerald-500' : 'bg-gray-300'}`}></div>
                              <span>Sangat Baik</span>
                            </div>
                          </DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => {
                            setFilterStatus('good');
                            setCurrentPage(1);
                          }}>
                            <div className="flex items-center">
                              <div className={`w-3 h-3 rounded-full mr-2 ${filterStatus === 'good' ? 'bg-emerald-500' : 'bg-gray-300'}`}></div>
                              <span>Baik</span>
                            </div>
                          </DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => {
                            setFilterStatus('average');
                            setCurrentPage(1);
                          }}>
                            <div className="flex items-center">
                              <div className={`w-3 h-3 rounded-full mr-2 ${filterStatus === 'average' ? 'bg-emerald-500' : 'bg-gray-300'}`}></div>
                              <span>Cukup</span>
                            </div>
                          </DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => {
                            setFilterStatus('poor');
                            setCurrentPage(1);
                          }}>
                            <div className="flex items-center">
                              <div className={`w-3 h-3 rounded-full mr-2 ${filterStatus === 'poor' ? 'bg-emerald-500' : 'bg-gray-300'}`}></div>
                              <span>Buruk</span>
                            </div>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>

                      {/* Star Filter Dropdown */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" className="flex items-center justify-between space-x-2 text-base px-4 py-3 rounded-xl w-full sm:w-auto">
                            <div className="flex items-center space-x-2">
                              <Star className="h-5 w-5" />
                              <span>Penilaian</span>
                            </div>
                            <ChevronDown className="h-4 w-4 sm:ml-2" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-56">
                          <DropdownMenuItem onSelect={() => {
                            setStarFilter('all');
                            setCurrentPage(1);
                          }}>
                            <div className="flex items-center">
                              <div className={`w-3 h-3 rounded-full mr-2 ${starFilter === 'all' ? 'bg-emerald-500' : 'bg-gray-300'}`}></div>
                              <span>Semua Penyedia</span>
                            </div>
                          </DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => {
                            setStarFilter('rated');
                            setCurrentPage(1);
                          }}>
                            <div className="flex items-center">
                              <div className={`w-3 h-3 rounded-full mr-2 ${starFilter === 'rated' ? 'bg-emerald-500' : 'bg-gray-300'}`}></div>
                              <span>Sudah Dinilai</span>
                            </div>
                          </DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => {
                            setStarFilter('unrated');
                            setCurrentPage(1);
                          }}>
                            <div className="flex items-center">
                              <div className={`w-3 h-3 rounded-full mr-2 ${starFilter === 'unrated' ? 'bg-emerald-500' : 'bg-gray-300'}`}></div>
                              <span>Belum Dinilai</span>
                            </div>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>

                      {/* Sort Options Dropdown */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" className="flex items-center justify-between space-x-2 text-base px-4 py-3 rounded-xl w-full sm:w-auto">
                            <div className="flex items-center space-x-2">
                              <TrendingUp className="h-5 w-5" />
                              <span>Urutkan</span>
                            </div>
                            <ChevronDown className="h-4 w-4 sm:ml-2" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-56">
                          <DropdownMenuLabel>Urutkan Berdasarkan Nama</DropdownMenuLabel>
                          <DropdownMenuItem onSelect={() => {
                            setSortOption('a-z');
                            setCurrentPage(1);
                          }}>
                            <div className="flex items-center">
                              <div className={`w-3 h-3 rounded-full mr-2 ${sortOption === 'a-z' ? 'bg-emerald-500' : 'bg-gray-300'}`}></div>
                              <span>A-Z</span>
                            </div>
                          </DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => {
                            setSortOption('z-a');
                            setCurrentPage(1);
                          }}>
                            <div className="flex items-center">
                              <div className={`w-3 h-3 rounded-full mr-2 ${sortOption === 'z-a' ? 'bg-emerald-500' : 'bg-gray-300'}`}></div>
                              <span>Z-A</span>
                            </div>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuLabel>Urutkan Berdasarkan Rating</DropdownMenuLabel>
                          <DropdownMenuItem onSelect={() => {
                            setStarSort('none');
                            setCurrentPage(1);
                          }}>
                            <div className="flex items-center">
                              <div className={`w-3 h-3 rounded-full mr-2 ${starSort === 'none' ? 'bg-emerald-500' : 'bg-gray-300'}`}></div>
                              <span>Tanpa Sortir Bintang</span>
                            </div>
                          </DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => {
                            setStarSort('high-low');
                            setCurrentPage(1);
                          }}>
                            <div className="flex items-center">
                              <div className={`w-3 h-3 rounded-full mr-2 ${starSort === 'high-low' ? 'bg-emerald-500' : 'bg-gray-300'}`}></div>
                              <span>Bintang Tinggi-Rendah</span>
                            </div>
                          </DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => {
                            setStarSort('low-high');
                            setCurrentPage(1);
                          }}>
                            <div className="flex items-center">
                              <div className={`w-3 h-3 rounded-full mr-2 ${starSort === 'low-high' ? 'bg-emerald-500' : 'bg-gray-300'}`}></div>
                              <span>Bintang Rendah-Tinggi</span>
                            </div>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuLabel>Urutkan Berdasarkan Tanggal Penilaian</DropdownMenuLabel>
                          <DropdownMenuItem onSelect={() => {
                            setDateSort('none');
                            setCurrentPage(1);
                          }}>
                            <div className="flex items-center">
                              <div className={`w-3 h-3 rounded-full mr-2 ${dateSort === 'none' ? 'bg-emerald-500' : 'bg-gray-300'}`}></div>
                              <span>Tanpa Sortir Tanggal</span>
                            </div>
                          </DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => {
                            setDateSort('newest');
                            setCurrentPage(1);
                          }}>
                            <div className="flex items-center">
                              <div className={`w-3 h-3 rounded-full mr-2 ${dateSort === 'newest' ? 'bg-emerald-500' : 'bg-gray-300'}`}></div>
                              <span>Terbaru</span>
                            </div>
                          </DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => {
                            setDateSort('oldest');
                            setCurrentPage(1);
                          }}>
                            <div className="flex items-center">
                              <div className={`w-3 h-3 rounded-full mr-2 ${dateSort === 'oldest' ? 'bg-emerald-500' : 'bg-gray-300'}`}></div>
                              <span>Terlama</span>
                            </div>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuLabel>Urutkan Berdasarkan Aktivitas</DropdownMenuLabel>
                          <DropdownMenuItem onSelect={() => {
                            setMostRatedFilter(!mostRatedFilter);
                            setCurrentPage(1);
                          }}>
                            <div className="flex items-center">
                              <div className={`w-3 h-3 rounded-full mr-2 ${mostRatedFilter ? 'bg-emerald-500' : 'bg-gray-300'}`}></div>
                              <span>Paling Banyak Dinilai</span>
                            </div>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>

                      {/* Active Filters Display - only show when filters are actually active */}
                      {(filterStatus !== 'all' || starFilter !== 'all' || sortOption !== 'a-z' || starSort !== 'none' || mostRatedFilter || dateSort !== 'none') && (
                        <Button 
                          variant="ghost" 
                          className="flex items-center space-x-2 text-base px-4 py-3 rounded-xl text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 w-full sm:w-auto"
                          onClick={() => {
                            setFilterStatus('all');
                            setStarFilter('all');
                            setSortOption('a-z');
                            setStarSort('none');
                            setMostRatedFilter(false);
                            setDateSort('none');
                            setCurrentPage(1);
                          }}
                        >
                          <X className="h-5 w-5" />
                          <span>Reset Filter</span>
                        </Button>
                      )}
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="flex items-center justify-between space-x-2 text-base px-4 py-3 rounded-xl w-full sm:w-auto">
                          <div className="flex items-center space-x-2">
                            <Download className="h-5 w-5" />
                            <span className="hidden sm:inline">Export Data</span>
                            <span className="sm:hidden">Export</span>
                          </div>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={exportToCSV}>
                          <FileText className="h-5 w-5 mr-2" />
                          Export CSV
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={exportToExcel}>
                          <FileSpreadsheet className="h-5 w-5 mr-2" />
                          Export Excel
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Penyedia Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building2 className="h-5 w-5" />
              <span>Daftar Penyedia dan Penilaian</span>
            </CardTitle>
            <CardDescription>
              Menampilkan {startIndex + 1}-{Math.min(endIndex, totalItems)} dari {totalItems} penyedia ({totalPenyedia} total terdaftar)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {paginatedData.length > 0 ? (
              <div className="space-y-4">
                {paginatedData.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-2xl hover:shadow-slate-500/20 transition-all duration-500 hover:scale-[1.01] hover:-translate-y-1 bg-gradient-to-r from-white to-gray-50 dark:from-slate-800 dark:to-slate-700 group rounded-2xl border">
                      <CardContent className="p-5">
                        <div 
                          className="flex flex-col space-y-4 lg:space-y-0 lg:flex-row lg:items-center lg:justify-between cursor-pointer"
                          onClick={async () => {
                            // Fetch detailed penilaian data for this provider
                            try {
                              const response = await fetch(`/api/penyedia/${item.id}/penilaian`)
                              if (response.ok) {
                                const penilaian = await response.json()
                                const penyediaWithDetails: PenyediaWithDetails = {
                                  ...item,
                                  penilaian
                                }
                                setSelectedPenyedia(penyediaWithDetails)
                                setIsModalOpen(true)
                              }
                            } catch (error) {
                              console.error('Error fetching penilaian data:', error)
                              // Still show the modal with available data
                              const penyediaWithDetails: PenyediaWithDetails = {
                                ...item,
                                penilaian: []
                              }
                              setSelectedPenyedia(penyediaWithDetails)
                              setIsModalOpen(true)
                            }
                          }}
                        >
                          <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mb-4">
                              <motion.div 
                                className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center group-hover:shadow-xl group-hover:scale-110 transition-all duration-300"
                                whileHover={{ scale: 1.1 }}
                                transition={{ type: "spring", stiffness: 400 }}
                              >
                                <Building2 className="h-6 w-6 text-white" />
                              </motion.div>
                              <div>
                                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{item.namaPerusahaan}</h3>
                                <p className="text-sm text-slate-600 dark:text-slate-300">ID: {item.id}</p>
                              </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                              <div>
                                <p className="text-slate-500 dark:text-slate-400">NPWP</p>
                                <p className="font-medium text-slate-800 dark:text-slate-200 break-all">{item.npwp}</p>
                              </div>
                              <div>
                                <p className="text-slate-500 dark:text-slate-400">Total Penilaian</p>
                                <p className="font-medium text-slate-800 dark:text-slate-200">{item.totalPenilaian}</p>
                              </div>
                              <div>
                                <p className="text-slate-500 dark:text-slate-400">Penilaian Terbaru</p>
                                <p className="font-medium text-slate-800 dark:text-slate-200">{item.penilaianTerbaru !== '-' ? new Date(item.penilaianTerbaru).toLocaleDateString('id-ID') : 'Belum ada'}</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="lg:ml-8 border-t lg:border-t-0 pt-4 lg:pt-0">
                            <div className="text-center">
                              <StarRating rating={mapScoreToStars(item.rataRataSkor)} size="lg" showValue={false} className="justify-center" />
                              <div className={`text-sm font-medium mt-2 px-3 py-1 rounded-full inline-block ${getRatingColor(item.rataRataSkor)}`}>
                                {getRatingText(item.rataRataSkor)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Building2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  {searchQuery ? 'Tidak ada penyedia yang ditemukan' : 'Belum ada data penyedia'}
                </h3>
                <p className="text-muted-foreground">
                  {searchQuery ? 'Coba ubah kata kunci pencarian' : 'Data penyedia akan muncul di sini setelah ditambahkan'}
                </p>
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="text-sm text-slate-600 dark:text-slate-300">
                  Halaman {currentPage} dari {totalPages} ({totalItems} total items)
                </div>
                
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                  {/* Items per page selector - responsive */}
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <label htmlFor="itemsPerPage" className="text-sm font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap hidden xs:block">Items per halaman:</label>
                    <label htmlFor="itemsPerPage" className="text-sm font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap xs:hidden">Item:</label>
                    <select
                      id="itemsPerPage"
                      value={itemsPerPage}
                      onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                      className="px-2 py-1 sm:px-3 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none dark:bg-slate-700 dark:text-white text-sm w-full sm:w-auto transition-all duration-300 hover:border-emerald-500 hover:shadow-sm hover:shadow-emerald-500/20"
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                  </div>

                  {/* Pagination buttons - responsive */}
                  <div className="flex items-center gap-1 sm:gap-2">
                    {/* Previous Button */}
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <span className="hidden xs:inline">Sebelumnya</span>
                      <span className="xs:hidden">Prev</span>
                    </button>

                    {/* Page Numbers - responsive with ellipsis for small screens */}
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(screenSize === 'sm' ? 3 : screenSize === 'md' ? 4 : 5, totalPages) }, (_, i) => {
                        let pageNum;
                        const maxVisiblePages = screenSize === 'sm' ? 3 : screenSize === 'md' ? 4 : 5;
                        if (totalPages <= maxVisiblePages) {
                          pageNum = i + 1;
                        } else if (currentPage <= (screenSize === 'sm' ? 2 : screenSize === 'md' ? 2 : 3)) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - (screenSize === 'sm' ? 1 : screenSize === 'md' ? 1 : 2)) {
                          pageNum = totalPages - (screenSize === 'sm' ? 2 : screenSize === 'md' ? 2 : 4) + i;
                        } else {
                          pageNum = currentPage - (screenSize === 'sm' ? 1 : screenSize === 'md' ? 1 : 2) + i;
                        }
                        
                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors ${
                              currentPage === pageNum
                                ? 'bg-emerald-600 text-white'
                                : 'text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-slate-700'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>

                    {/* Next Button */}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <span className="hidden xs:inline">Selanjutnya</span>
                      <span className="xs:hidden">Next</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Top Performers */}
      {penyediaData.filter(p => p.totalPenilaian > 0).length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <Card className="rounded-2xl shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="h-5 w-5 text-yellow-600" />
                <span>Penyedia Terbaik</span>
              </CardTitle>
              <CardDescription>
                Top 3 penyedia dengan rating tertinggi. Klik kartu untuk melihat detail.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {(() => {
                  // Get top performers using Wilson Score
                  const topPerformers = [...penyediaData]
                    .filter(p => p.totalPenilaian > 0) // Only include providers with evaluations
                    .sort((a, b) => b.wilsonScore - a.wilsonScore)
                    .slice(0, 3);
                  
                  // Function to handle card click and show modal
                  const handleCardClick = (penyedia: PenyediaWithRating) => {
                    const penyediaWithDetails: PenyediaWithDetails = {
                      ...penyedia,
                      penilaian: penilaianData.filter(p => p.idPenyedia === penyedia.id)
                    };
                    setSelectedPenyedia(penyediaWithDetails);
                    setIsModalOpen(true);
                  };
                  
                  return topPerformers.map((penyedia, index) => (
                    <motion.div
                      key={penyedia.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Card 
                        className={`relative overflow-hidden rounded-2xl h-full transition-all duration-300 hover:shadow-xl cursor-pointer hover:scale-105 ${
                        index === 0 
                          ? 'border-2 border-yellow-400 bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20' 
                          : index === 1 
                            ? 'border-2 border-gray-300 bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-800/30 dark:to-slate-800/30' 
                            : 'border-2 border-orange-300 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20'
                      }`}
                        onClick={() => handleCardClick(penyedia)}
                      >
                        <CardContent className="p-8 pt-12">
                          {/* Ranking Badge */}
                          <div className="flex justify-center -mt-10 mb-2">
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-xl ring-4 ring-white dark:ring-slate-800 z-10 ${
                              index === 0 
                                ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' 
                                : index === 1 
                                  ? 'bg-gradient-to-r from-gray-400 to-gray-500' 
                                  : 'bg-gradient-to-r from-orange-400 to-orange-500'
                            }`}>
                              <div className="flex items-center justify-center">
                                {index === 0 ? <Trophy className="h-8 w-8" /> :
                                 index === 1 ? <Medal className="h-8 w-8" /> :
                                 <Award className="h-8 w-8" />}
                              </div>
                            </div>
                          </div>
                          
                          {/* Provider Info */}
                          <div className="flex flex-col items-center text-center mb-8">
                            <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-2 truncate w-full px-2 text-responsive">
                              {penyedia.namaPerusahaan}
                            </h3>
                            <Badge 
                              variant="secondary" 
                              className="text-xs py-1 px-3 rounded-full"
                            >
                              ID: {penyedia.id}
                            </Badge>
                          </div>
                          
                          {/* Rating Details */}
                          <div className="space-y-4">
                            <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-700">
                              <span className="text-sm text-muted-foreground">Total Penilaian</span>
                              <span className="font-bold text-gray-900 dark:text-gray-100">{penyedia.totalPenilaian}</span>
                            </div>
                            
                            <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-700">
                              <span className="text-xs sm:text-sm text-muted-foreground">Rating</span>
                              <div className="flex items-center">
                                <StarRating 
                                  rating={mapScoreToStars(penyedia.rataRataSkor)} 
                                  size="sm" 
                                  showValue={false} 
                                  className=""
                                />
                              </div>
                            </div>
                            
                            {/* Rata-rata per Kriteria */}
                            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                              <div className="text-xs text-muted-foreground mb-2 font-medium">Rata-rata per Kriteria:</div>
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                {(() => {
                                  // Calculate average per criteria for this provider
                                  const providerEvaluations = penilaianData.filter(p => p.idPenyedia === penyedia.id);
                                  
                                  if (providerEvaluations.length === 0) {
                                    return (
                                      <div className="col-span-2 text-center text-muted-foreground py-2">
                                        Belum ada data kriteria
                                      </div>
                                    );
                                  }
                                  
                                  const avgKualitas = providerEvaluations.reduce((sum, p) => sum + p.kualitasKuantitasBarangJasa, 0) / providerEvaluations.length;
                                  const avgBiaya = providerEvaluations.reduce((sum, p) => sum + p.biaya, 0) / providerEvaluations.length;
                                  const avgWaktu = providerEvaluations.reduce((sum, p) => sum + p.waktu, 0) / providerEvaluations.length;
                                  const avgLayanan = providerEvaluations.reduce((sum, p) => sum + p.layanan, 0) / providerEvaluations.length;
                                  
                                  const getCriteriaColor = (score: number) => {
                                    if (score >= 2.5) return 'text-green-700 bg-green-100 hover:text-green-700 hover:bg-green-100 dark:text-green-400 dark:bg-green-900/30 dark:hover:text-green-400 dark:hover:bg-green-900/30';
                                    if (score >= 2.0) return 'text-blue-700 bg-blue-100 hover:text-blue-700 hover:bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30 dark:hover:text-blue-400 dark:hover:bg-blue-900/30';
                                    if (score >= 1.5) return 'text-yellow-700 bg-yellow-100 hover:text-yellow-700 hover:bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30 dark:hover:text-yellow-400 dark:hover:bg-yellow-900/30';
                                    return 'text-red-700 bg-red-100 hover:text-red-700 hover:bg-red-100 dark:text-red-400 dark:bg-red-900/30 dark:hover:text-red-400 dark:hover:bg-red-900/30';
                                  };
                                  
                                  return (
                                    <>
                                      <div className="flex justify-between items-center">
                                        <span className="text-slate-600 dark:text-slate-400">Kualitas:</span>
                                        <Badge className={`text-xs px-2 py-0.5 border-0 ${getCriteriaColor(avgKualitas)}`}>
                                          {avgKualitas.toFixed(1)}
                                        </Badge>
                                      </div>
                                      <div className="flex justify-between items-center">
                                        <span className="text-slate-600 dark:text-slate-400">Biaya:</span>
                                        <Badge className={`text-xs px-2 py-0.5 border-0 ${getCriteriaColor(avgBiaya)}`}>
                                          {avgBiaya.toFixed(1)}
                                        </Badge>
                                      </div>
                                      <div className="flex justify-between items-center">
                                        <span className="text-slate-600 dark:text-slate-400">Waktu:</span>
                                        <Badge className={`text-xs px-2 py-0.5 border-0 ${getCriteriaColor(avgWaktu)}`}>
                                          {avgWaktu.toFixed(1)}
                                        </Badge>
                                      </div>
                                      <div className="flex justify-between items-center">
                                        <span className="text-slate-600 dark:text-slate-400">Layanan:</span>
                                        <Badge className={`text-xs px-2 py-0.5 border-0 ${getCriteriaColor(avgLayanan)}`}>
                                          {avgLayanan.toFixed(1)}
                                        </Badge>
                                      </div>
                                    </>
                                  );
                                })()}
                              </div>
                            </div>
                            
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ));
                })()}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
      <LaporanModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        penyedia={selectedPenyedia}
      />
    </div>
  )
}
