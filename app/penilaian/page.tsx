"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Building2,
  Star,
  Send,
  CheckCircle,
  Award,
  TrendingUp,
  FileText,
  Lock,
  User,
  Shield,
  LogOut,
  ArrowRight,
  ArrowLeft,
  X,
  Check
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Penyedia, PPK, Paket } from "@/lib/google-sheets";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { useToast } from "@/components/ui/use-toast";

interface PPKOptions {
  eselonI: { value: string; label: string }[];
  satuanKerja: { value: string; label: string }[];
}

export default function PenilaianPage() {
  // Toast hook for notifications
  const { toast } = useToast();

  // PPK Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authenticatedPPK, setAuthenticatedPPK] = useState<PPK | null>(null);
  const [authForm, setAuthForm] = useState({
    nip: "",
    eselonI: "",
    satuanKerja: "",
  });
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState("");
  const [ppkOptions, setPpkOptions] = useState<PPKOptions>({
    eselonI: [],
    satuanKerja: [],
  });
  const [isLoadingOptions, setIsLoadingOptions] = useState(false);

  // Evaluation State
  const [paketList, setPaketList] = useState<Paket[]>([]);
  const [selectedPaket, setSelectedPaket] = useState<Paket | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // 1: select provider, 2: info, 3: termination, 4: rating
  const [activeTab, setActiveTab] = useState<'unevaluated' | 'evaluated'>('unevaluated'); // New state for tabs
  const [searchTerm, setSearchTerm] = useState(""); // Search term for providers

  // Contract termination state
  const [contractTerminated, setContractTerminated] = useState<boolean | null>(null);
  const [terminationComment, setTerminationComment] = useState("");

  // Form data untuk penilaian
  const [formData, setFormData] = useState({
    kualitasKuantitasBarangJasa: 1,
    komentarKualitasKuantitasBarangJasa: "",
    biaya: 1,
    komentarBiaya: "",
    waktu: 1,
    komentarWaktu: "",
    layanan: 1,
    komentarLayanan: "",
    keterangan: "",
  });

  // Kriteria penilaian sesuai LKPP
  const kriteriaPenilaian = [
    {
      key: "kualitasKuantitasBarangJasa",
      label: "Kualitas dan Kuantitas Pekerjaan",
      description:
        "Penilaian terhadap kualitas dan kuantitas barang/jasa yang diserahkan",
      bobot: "30%",
      kriteria: {
        1: "Cukup (Skor 1): Lebih dari 50% hasil pekerjaan memerlukan perbaikan/penggantian agar sesuai dengan ketentuan kontrak.",
        2: "Baik (Skor 2): Kurang dari atau sama dengan 50% hasil pekerjaan memerlukan perbaikan/penggantian agar sesuai dengan ketentuan kontrak.",
        3: "Sangat Baik (Skor 3): Hasil pekerjaan sesuai dengan ketentuan kontrak tanpa memerlukan perbaikan/penggantian, atau 100% hasil pekerjaan sesuai dengan ketentuan dalam kontrak.",
      },
    },
    {
      key: "biaya",
      label: "Biaya",
      description:
        "Penilaian terhadap pengendalian biaya dan perubahan kontrak",
      bobot: "20%",
      kriteria: {
        1: "Cukup (Skor 1): Tidak melakukan pengendalian biaya dengan baik dan/atau mengajukan perubahan kontrak yang tidak didasari alasan yang dapat dipertanggungjawabkan, sehingga penambahan biaya tidak dapat diantisipasi. Kriteria ini juga mencakup tidak menginformasikan sejak awal kondisi yang berpotensi menambah biaya dan mengajukan perubahan kontrak yang akan berdampak pada penambahan total biaya tanpa alasan memadai sehingga ditolak PPK.",
        2: "Baik (Skor 2): Melakukan pengendalian biaya dan/atau mengajukan perubahan kontrak yang didasari alasan yang dapat dipertanggungjawabkan, sehingga penambahan biaya dapat diantisipasi. Kriteria ini juga mencakup melakukan salah satu kondisi pada kriteria Cukup.",
        3: "Sangat Baik (Skor 3): Telah melakukan pengendalian biaya dengan baik dengan menginformasikan sejak awal kondisi yang berpotensi menambah biaya dan perubahan kontrak yang diajukan sudah didasari alasan yang dapat dipertanggungjawabkan, sehingga penambahan biaya dapat diantisipasi.",
      },
    },
    {
      key: "waktu",
      label: "Waktu",
      description: "Penilaian terhadap ketepatan waktu penyelesaian pekerjaan",
      bobot: "30%",
      kriteria: {
        1: "Cukup (Skor 1): Penyelesaian pekerjaan terlambat melebihi 50 (lima puluh) hari kalender dari waktu yang ditetapkan dalam kontrak karena kesalahan Penyedia.",
        2: "Baik (Skor 2): Penyelesaian pekerjaan terlambat sampai dengan 50 (lima puluh) hari kalender dari waktu yang ditetapkan dalam kontrak karena kesalahan Penyedia.",
        3: "Sangat Baik (Skor 3): Penyelesaian pekerjaan sesuai dengan waktu yang ditetapkan dalam kontrak atau lebih cepat sesuai dengan kebutuhan PPK.",
      },
    },
    {
      key: "layanan",
      label: "Layanan",
      description:
        "Penilaian terhadap responsivitas dan kualitas layanan penyedia",
      bobot: "20%",
      kriteria: {
        1: "Cukup (Skor 1): Penyedia lambat memberi tanggapan positif atas permintaan PPK dan/atau sulit diajak berdiskusi dalam penyelesaian pelaksanaan pekerjaan.",
        2: "Baik (Skor 2): Merespon permintaan dengan penyelesaian sesuai yang diminta atau Penyedia mudah dihubungi dan berdiskusi dalam penyelesaian pelaksanaan pekerjaan.",
        3: "Sangat Baik (Skor 3): Merespon permintaan dengan penyelesaian sesuai yang diminta dan Penyedia mudah dihubungi serta berdiskusi dalam penyelesaian pelaksanaan pekerjaan.",
      },
    },
  ];

  // Skala penilaian sesuai LKPP (1-3)
  const skalaPenilaian = [
    { value: 1, label: "Cukup", color: "text-yellow-600 bg-yellow-100", textColor: "text-yellow-800 dark:text-yellow-200" },
    { value: 2, label: "Baik", color: "text-blue-600 bg-blue-100", textColor: "text-blue-800 dark:text-blue-200" },
    { value: 3, label: "Sangat Baik", color: "text-green-600 bg-green-100", textColor: "text-green-800 dark:text-green-200" },
  ];

  // Load PPK options on component mount
  useEffect(() => {
    const loadPPKOptions = async () => {
      setIsLoadingOptions(true);
      try {
        const response = await fetch("/api/penilaian/ppk-options");
        if (response.ok) {
          const data = await response.json();
          setPpkOptions(data);
        }
      } catch (error) {
        console.error("Error loading PPK options:", error);
      } finally {
        setIsLoadingOptions(false);
      }
    };

    loadPPKOptions();
  }, []);

  // Load filtered satuan kerja options when eselonI changes
  useEffect(() => {
    const loadFilteredSatuanKerja = async () => {
      if (authForm.eselonI) {
        setIsLoadingOptions(true);
        try {
          const response = await fetch(`/api/penilaian/ppk-options?eselonI=${encodeURIComponent(authForm.eselonI)}`);
          if (response.ok) {
            const data = await response.json();
            setPpkOptions(prev => ({
              ...prev,
              satuanKerja: data.satuanKerja
            }));
            
            // Reset satuan kerja selection if it's not in the filtered list
            if (authForm.satuanKerja && !data.satuanKerja.some((option: { value: string }) => option.value === authForm.satuanKerja)) {
              setAuthForm(prev => ({
                ...prev,
                satuanKerja: ""
              }));
            }
          }
        } catch (error) {
          console.error("Error loading filtered satuan kerja options:", error);
        } finally {
          setIsLoadingOptions(false);
        }
      }
    };

    loadFilteredSatuanKerja();
  }, [authForm.eselonI]);

  // PPK Authentication function
  const authenticatePPK = async () => {
    if (
      !authForm.nip.trim() ||
      !authForm.eselonI.trim() ||
      !authForm.satuanKerja.trim()
    ) {
      setAuthError(
        "Semua field harus diisi (NIP, Eselon I, dan Satuan Kerja)"
      );
      return;
    }

    setIsAuthenticating(true);
    setAuthError("");

    try {
      const response = await fetch("/api/penilaian/validate-ppk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nip: authForm.nip.trim(),
          eselonI: authForm.eselonI.trim(),
          satuanKerja: authForm.satuanKerja.trim(),
        }),
      });

      const data = await response.json();

      if (data.success) {
        setIsAuthenticated(true);
        setAuthenticatedPPK(data.ppk);
        setAuthError("");
        setCurrentStep(1); // Reset to first step
      } else {
        setAuthError(data.error || "Validasi gagal");
      }
    } catch (error) {
      console.error("Error authenticating PPK:", error);
      setAuthError("Terjadi kesalahan saat validasi. Silakan coba lagi.");
    } finally {
      setIsAuthenticating(false);
    }
  };

  // Handle auth form input change
  const handleAuthInputChange = (field: string, value: string) => {
    setAuthForm((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user starts typing
    if (authError) {
      setAuthError("");
    }
  };

  // Load paket data after PPK authentication
  useEffect(() => {
    if (isAuthenticated && authenticatedPPK?.satuanKerjaDetail) {
      const loadPaketData = async () => {
        setIsLoading(true);
        try {
          const response = await fetch(`/api/paket?satuanKerjaDetail=${encodeURIComponent(authenticatedPPK.satuanKerjaDetail)}`);
          if (response.ok) {
            const data = await response.json();
            setPaketList(data);
          }
        } catch (error) {
          console.error("Error loading paket data:", error);
        } finally {
          setIsLoading(false);
        }
      };
      loadPaketData();
    }
  }, [isAuthenticated, authenticatedPPK]);

  // Separate paket into evaluated and unevaluated
  const evaluatedPaket = paketList.filter(paket => paket.penilaian === 'Sudah');
  const unevaluatedPaket = paketList.filter(paket => paket.penilaian !== 'Sudah');
  
  // Filter paket based on search term
  const filteredUnevaluatedPaket = unevaluatedPaket.filter(paket => 
    paket.namaPenyedia.toLowerCase().includes(searchTerm.toLowerCase()) ||
    paket.npwpPenyedia.toLowerCase().includes(searchTerm.toLowerCase()) ||
    paket.kodePaket.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredEvaluatedPaket = evaluatedPaket.filter(paket => 
    paket.namaPenyedia.toLowerCase().includes(searchTerm.toLowerCase()) ||
    paket.npwpPenyedia.toLowerCase().includes(searchTerm.toLowerCase()) ||
    paket.kodePaket.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Logout function
  const logout = () => {
    setIsAuthenticated(false);
    setAuthenticatedPPK(null);
    setAuthForm({ nip: "", eselonI: "", satuanKerja: "" });
    setSelectedPaket(null);
    setPaketList([]);
    setContractTerminated(null);
    setTerminationComment("");
    setFormData({
      kualitasKuantitasBarangJasa: 1,
      komentarKualitasKuantitasBarangJasa: "",
      biaya: 1,
      komentarBiaya: "",
      waktu: 1,
      komentarWaktu: "",
      layanan: 1,
      komentarLayanan: "",
      keterangan: "",
    });
    setCurrentStep(1);
  };


  // Handle form input change
  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Effect to auto-set scores to 0 when contract is terminated
  useEffect(() => {
    if (contractTerminated === true) {
      setFormData({
        kualitasKuantitasBarangJasa: 0,
        komentarKualitasKuantitasBarangJasa: "",
        biaya: 0,
        komentarBiaya: "",
        waktu: 0,
        komentarWaktu: "",
        layanan: 0,
        komentarLayanan: "",
        keterangan: terminationComment,
      });
    } else if (contractTerminated === false) {
      // Reset to default values when contract is not terminated
      setFormData({
        kualitasKuantitasBarangJasa: 1,
        komentarKualitasKuantitasBarangJasa: "",
        biaya: 1,
        komentarBiaya: "",
        waktu: 1,
        komentarWaktu: "",
        layanan: 1,
        komentarLayanan: "",
        keterangan: "",
      });
    }
  }, [contractTerminated, terminationComment]);

  // Calculate weighted score based on LKPP formula
  const calculateWeightedScore = () => {
    const weightedScore =
      formData.kualitasKuantitasBarangJasa * 0.3 +
      formData.biaya * 0.2 +
      formData.waktu * 0.3 +
      formData.layanan * 0.2;
    return weightedScore.toFixed(2);
  };

  // Get final evaluation based on weighted score
  const getFinalEvaluation = () => {
    const score = parseFloat(calculateWeightedScore());
    if (score === 0) return "Buruk";
    if (score >= 1 && score < 2) return "Cukup";
    if (score >= 2 && score < 3) return "Baik";
    if (score === 3) return "Sangat Baik";
    return "Cukup"; // fallback
  };

  // Get rating color based on score
  const getRatingColor = (score: number) => {
    if (score >= 2.5) return "text-green-600";
    if (score >= 2.0) return "text-blue-600";
    if (score >= 1.0) return "text-yellow-600";
    return "text-red-600";
  };

  // Check if form can be submitted
  const canSubmit = selectedPaket && authenticatedPPK;

  // Submit penilaian
  const submitPenilaian = async () => {
    if (!canSubmit) {
      toast({
        title: "⚠️ Form Tidak Lengkap",
        description: "Mohon lengkapi semua field yang wajib diisi sebelum menyimpan penilaian.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const penilaianData = {
        idPenyedia: selectedPaket!.kodePenyedia,
        nipPPK: authenticatedPPK!.nip,
        namaPPK: authenticatedPPK!.nama,
        tanggalPenilaian: new Date().toISOString().split("T")[0],
        kualitasKuantitasBarangJasa: formData.kualitasKuantitasBarangJasa,
        komentarKualitasKuantitasBarangJasa:
          formData.komentarKualitasKuantitasBarangJasa,
        biaya: formData.biaya,
        komentarBiaya: formData.komentarBiaya,
        waktu: formData.waktu,
        komentarWaktu: formData.komentarWaktu,
        layanan: formData.layanan,
        komentarLayanan: formData.komentarLayanan,
        keterangan: formData.keterangan,
        kodePaket: selectedPaket!.kodePaket,
        kodePenyedia: selectedPaket!.kodePenyedia,
      };

      const response = await fetch("/api/penilaian", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(penilaianData),
      });

      if (response.ok) {
        // Show success toast with modern styling
        toast({
          title: "✅ Penilaian Berhasil Disimpan!",
          description: `Penilaian untuk ${selectedPaket!.namaPenyedia} telah berhasil disimpan dengan skor ${calculateWeightedScore()} (${getFinalEvaluation()}).`,
          className: "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-700 dark:text-green-200",
        });

        // Reset form with animation delay
        setTimeout(() => {
          setSelectedPaket(null);
          setContractTerminated(null);
          setTerminationComment("");
          setFormData({
            kualitasKuantitasBarangJasa: 1,
            komentarKualitasKuantitasBarangJasa: "",
            biaya: 1,
            komentarBiaya: "",
            waktu: 1,
            komentarWaktu: "",
            layanan: 1,
            komentarLayanan: "",
            keterangan: "",
          });
          setCurrentStep(1);
          // Reload paket data to refresh status
          if (authenticatedPPK?.satuanKerjaDetail) {
            const loadPaketData = async () => {
              setIsLoading(true);
              try {
                const response = await fetch(`/api/paket?satuanKerjaDetail=${encodeURIComponent(authenticatedPPK.satuanKerjaDetail)}`);
                if (response.ok) {
                  const data = await response.json();
                  setPaketList(data);
                }
              } catch (error) {
                console.error("Error reloading paket data:", error);
              } finally {
                setIsLoading(false);
              }
            };
            loadPaketData();
          }
        }, 1500);
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Gagal menyimpan penilaian");
      }
    } catch (error) {
      console.error("Error submitting penilaian:", error);
      toast({
        title: "❌ Gagal Menyimpan Penilaian",
        description: error instanceof Error ? error.message : "Terjadi kesalahan saat menyimpan penilaian. Silakan coba lagi.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Navigation functions
  const goToNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // If not authenticated, show PPK authentication form
  if (!isAuthenticated) {
    return (
      <div className="space-y-8 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
        {/* Header */}
        <motion.div 
          className="text-center space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col items-center justify-center space-y-4">
            <motion.div 
              className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-xl"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <Shield className="h-8 w-8 text-white" />
            </motion.div>
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-700 to-blue-600 bg-clip-text text-transparent">
                Validasi PPK
              </h1>
              <p className="mt-3 text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                Masukkan NIP dan informasi lainnya untuk mengakses sistem penilaian penyedia
              </p>
            </div>
          </div>
        </motion.div>

        {/* PPK Authentication Form */}
        <motion.div
          className="max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="border-2 border-dashed border-blue-300/50 bg-gradient-to-br from-white/80 to-blue-50/30 dark:from-slate-800/80 dark:to-slate-900/30 shadow-xl rounded-3xl backdrop-blur-sm">
            <CardHeader className="text-center pb-6">
              <CardTitle className="flex items-center justify-center space-x-3 text-xl lg:text-2xl">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                  <Lock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <span>Autentikasi PPK</span>
              </CardTitle>
              <CardDescription className="text-base">
                Silakan masukkan NIP dan informasi lainnya sesuai dengan data PPK yang terdaftar
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="nip"
                    className="text-sm font-medium text-slate-700 dark:text-slate-300"
                  >
                    NIP *
                  </Label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 group-focus-within:text-blue-500 transition-colors" />
                    <Input
                      id="nip"
                      type="text"
                      placeholder="Masukkan NIP Anda"
                      value={authForm.nip}
                      onChange={(e) =>
                        handleAuthInputChange("nip", e.target.value)
                      }
                      className="pl-10 py-5 text-base rounded-xl border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                      disabled={isAuthenticating}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Eselon I *
                  </Label>
                  <SearchableSelect
                    options={ppkOptions.eselonI}
                    value={authForm.eselonI}
                    onValueChange={(value) =>
                      handleAuthInputChange("eselonI", value)
                    }
                    placeholder="Pilih Eselon I..."
                    searchPlaceholder="Cari Eselon I..."
                    disabled={isAuthenticating || isLoadingOptions}
                    className="rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Satuan Kerja *
                  </Label>
                  <SearchableSelect
                    options={ppkOptions.satuanKerja}
                    value={authForm.satuanKerja}
                    onValueChange={(value) =>
                      handleAuthInputChange("satuanKerja", value)
                    }
                    placeholder="Pilih Satuan Kerja..."
                    searchPlaceholder="Cari Satuan Kerja..."
                    disabled={isAuthenticating || isLoadingOptions}
                    className="rounded-xl"
                  />
                </div>
              </div>

              {isLoadingOptions && (
                <div className="flex items-center justify-center py-4">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                  <span className="ml-3 text-base text-muted-foreground">
                    Memuat data...
                  </span>
                </div>
              )}

              {authError && (
                <motion.div 
                  className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-base text-red-600 dark:text-red-400">
                    {authError}
                  </p>
                </motion.div>
              )}

              <Button
                onClick={authenticatePPK}
                disabled={
                  isAuthenticating ||
                  !authForm.nip.trim() ||
                  !authForm.eselonI.trim() ||
                  !authForm.satuanKerja.trim() ||
                  isLoadingOptions
                }
                className="w-full py-6 text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {isAuthenticating ? (
                  <div className="flex items-center justify-center space-x-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Memvalidasi...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-3">
                    <Shield className="h-5 w-5" />
                    <span>Validasi PPK</span>
                    <ArrowRight className="h-5 w-5" />
                  </div>
                )}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // If authenticated, show the evaluation form
  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Header with PPK Info */}
      <motion.div 
        className="text-center space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <motion.div 
            className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-xl"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <FileText className="h-8 w-8 text-white" />
          </motion.div>
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-700 to-blue-600 bg-clip-text text-transparent">
              Penilaian Penyedia
            </h1>
            <p className="mt-3 text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Berikan penilaian terhadap penyedia barang/jasa berdasarkan kriteria LKPP
            </p>
          </div>
        </div>
      </motion.div>

      {/* PPK Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="mb-8 border-0 shadow-xl bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-slate-800 dark:text-slate-100">
                    PPK Terautentikasi
                  </CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-400">
                    Informasi Pejabat Pembuat Komitmen
                  </CardDescription>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 hover:text-red-600 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/20 dark:hover:text-red-400"
              >
                <X className="h-4 w-4 mr-2" />
                Keluar
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Primary Info - Nama */}
              <div className="bg-white/70 dark:bg-slate-800/70 p-6 rounded-xl border border-slate-200/50 dark:border-slate-600/50">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                    {authenticatedPPK?.nama}
                  </h3>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 ml-5">
                  Nama Lengkap PPK
                </p>
              </div>

              {/* Secondary Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* NIP */}
                <div className="bg-white/50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200/30 dark:border-slate-600/30">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                      NIP
                    </p>
                  </div>
                  <p className="font-semibold text-slate-800 dark:text-slate-100 text-sm">
                    {authenticatedPPK?.nip}
                  </p>
                </div>

                {/* Satuan Kerja */}
                <div className="bg-white/50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200/30 dark:border-slate-600/30">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                      Satuan Kerja
                    </p>
                  </div>
                  <p className="font-semibold text-slate-800 dark:text-slate-100 text-sm truncate">
                    {authenticatedPPK?.satuanKerja}
                  </p>
                </div>

                {/* TA */}
                <div className="bg-white/50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200/30 dark:border-slate-600/30">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                      Tahun
                    </p>
                  </div>
                  <p className="font-semibold text-slate-800 dark:text-slate-100 text-sm">
                    {authenticatedPPK?.ta}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stepper */}
      <motion.div
        className="flex justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="flex items-center space-x-4">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                  currentStep === step
                    ? "bg-blue-600 text-white shadow-lg"
                    : currentStep > step
                    ? "bg-green-500 text-white"
                    : "bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400"
                }`}
              >
                {step}
              </div>
              {step < 4 && (
                <div
                  className={`w-16 h-1 mx-2 ${
                    currentStep > step
                      ? "bg-green-500"
                      : "bg-slate-200 dark:bg-slate-700"
                  }`}
                ></div>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        {/* Step 1: Search Penyedia */}
        {currentStep === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-2 border-dashed border-blue-300/50 bg-gradient-to-br from-white/80 to-blue-50/30 dark:from-slate-800/80 dark:to-slate-900/30 shadow-xl rounded-3xl overflow-hidden backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3 text-xl lg:text-2xl">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 font-bold text-base">
                    1
                  </div>
                  <span>Pilih Penyedia</span>
                </CardTitle>
                <CardDescription className="text-base">
                  Pilih penyedia yang berkontrak dengan satuan kerja Anda
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {isLoading && (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-muted-foreground text-lg">
                      Memuat data penyedia...
                    </span>
                  </div>
                )}

                {!isLoading && paketList.length === 0 && (
                  <div className="text-center py-8">
                    <Building2 className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-600 dark:text-slate-400">
                      Tidak ada penyedia yang berkontrak dengan satuan kerja Anda
                    </p>
                  </div>
                )}

                <AnimatePresence>
                  {paketList.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      {/* Search Input */}
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <Input
                          type="text"
                          placeholder="Cari penyedia berdasarkan nama, NPWP, atau kode paket..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 py-5 text-base rounded-xl border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      
                      {/* Tabs for Evaluated vs Unevaluated */}
                      <div className="flex border-b border-slate-200 dark:border-slate-700">
                        <button
                          onClick={() => setActiveTab('unevaluated')}
                          className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors ${
                            activeTab === 'unevaluated'
                              ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400'
                              : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
                          }`}
                        >
                          Belum Dinilai ({filteredUnevaluatedPaket.length})
                        </button>
                        <button
                          onClick={() => setActiveTab('evaluated')}
                          className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors ${
                            activeTab === 'evaluated'
                              ? 'text-green-600 border-b-2 border-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400'
                              : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
                          }`}
                        >
                          Sudah Dinilai ({filteredEvaluatedPaket.length})
                        </button>
                      </div>

                      {/* Content based on active tab */}
                      <div className="max-h-96 overflow-y-auto pr-2">
                        {activeTab === 'unevaluated' && (
                          <>
                            {filteredUnevaluatedPaket.length > 0 ? (
                              filteredUnevaluatedPaket.map((paket) => (
                                <motion.div
                                  key={`${paket.kodePaket}-${paket.kodePenyedia}`}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.2 }}
                                  whileHover={{ 
                                    scale: 1.02,
                                    y: -2,
                                    transition: { duration: 0.2 }
                                  }}
                                  onClick={() => {
                                    setSelectedPaket(paket);
                                    // Remove automatic navigation to step 2
                                  }}
                                  className={`p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 mb-4 ${
                                    selectedPaket?.kodePaket === paket.kodePaket && selectedPaket?.kodePenyedia === paket.kodePenyedia
                                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-500 ring-opacity-50 shadow-lg"
                                      : "border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-500 shadow-sm"
                                  }`}
                                >
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1 min-w-0 space-y-3">
                                      <div>
                                        <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 truncate">
                                          {paket.namaPenyedia}
                                        </h3>
                                        <p className="text-sm text-slate-600 dark:text-slate-300">
                                          NPWP: {paket.npwpPenyedia}
                                        </p>
                                      </div>
                                      
                                      <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                          Paket: {paket.kodePaket}
                                        </p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                          Nilai Kontrak: {new Intl.NumberFormat('id-ID', { 
                                            style: 'currency', 
                                            currency: 'IDR' 
                                          }).format(Number(paket.nilaiKontrak) || 0)}
                                        </p>
                                      </div>

                                      <div className="flex items-center space-x-2">
                                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                                          Belum Dinilai
                                        </span>
                                      </div>
                                    </div>
                                    
                                    {selectedPaket?.kodePaket === paket.kodePaket && selectedPaket?.kodePenyedia === paket.kodePenyedia && (
                                      <CheckCircle className="h-6 w-6 text-blue-500 flex-shrink-0 ml-3" />
                                    )}
                                  </div>
                                </motion.div>
                              ))
                            ) : (
                              <div className="text-center py-8">
                                <Building2 className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                                <p className="text-slate-600 dark:text-slate-400">
                                  Tidak ada penyedia yang belum dinilai
                                </p>
                              </div>
                            )}
                          </>
                        )}

                        {activeTab === 'evaluated' && (
                          <>
                            {filteredEvaluatedPaket.length > 0 ? (
                              filteredEvaluatedPaket.map((paket) => (
                                <motion.div
                                  key={`${paket.kodePaket}-${paket.kodePenyedia}`}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="p-5 rounded-2xl border-2 border-slate-200 dark:border-slate-700 shadow-sm mb-4 bg-slate-50 dark:bg-slate-800/50 opacity-75"
                                >
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1 min-w-0 space-y-3">
                                      <div>
                                        <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 truncate">
                                          {paket.namaPenyedia}
                                        </h3>
                                        <p className="text-sm text-slate-600 dark:text-slate-300">
                                          NPWP: {paket.npwpPenyedia}
                                        </p>
                                      </div>
                                      
                                      <div className="bg-slate-100 dark:bg-slate-700/50 p-3 rounded-lg">
                                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                          Paket: {paket.kodePaket}
                                        </p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                          Nilai Kontrak: {new Intl.NumberFormat('id-ID', { 
                                            style: 'currency', 
                                            currency: 'IDR' 
                                          }).format(Number(paket.nilaiKontrak) || 0)}
                                        </p>
                                      </div>

                                      <div className="flex items-center space-x-2">
                                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                                          Sudah Dinilai
                                        </span>
                                      </div>
                                    </div>
                                    
                                    <Lock className="h-6 w-6 text-slate-400 flex-shrink-0 ml-3" />
                                  </div>
                                </motion.div>
                              ))
                            ) : (
                              <div className="text-center py-8">
                                <Building2 className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                                <p className="text-slate-600 dark:text-slate-400">
                                  Tidak ada penyedia yang sudah dinilai
                                </p>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                      
                      {/* Navigation button - only show when a paket is selected from unevaluated tab */}
                      {activeTab === 'unevaluated' && selectedPaket && (
                        <div className="flex justify-end">
                          <Button
                            onClick={() => setCurrentStep(2)}
                            className="px-8 py-3 text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                          >
                            Lanjut
                            <ArrowRight className="ml-2 h-5 w-5" />
                          </Button>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Step 2: Informasi Penyedia */}
        {currentStep === 2 && selectedPaket && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700 rounded-3xl shadow-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-3 text-xl lg:text-2xl">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 font-bold text-base">
                      2
                    </div>
                    <span>Informasi Penyedia & Paket Terpilih</span>
                  </CardTitle>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedPaket(null);
                      setCurrentStep(1);
                    }}
                    className="rounded-xl"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Ganti Penyedia
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <div className="bg-white/70 dark:bg-slate-800/70 p-5 rounded-2xl shadow-sm">
                      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">
                        Data Penyedia
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                            Nama Penyedia
                          </p>
                          <p className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                            {selectedPaket.namaPenyedia}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                            Kode Penyedia
                          </p>
                          <p className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                            {selectedPaket.kodePenyedia}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                            NPWP
                          </p>
                          <p className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                            {selectedPaket.npwpPenyedia}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="bg-white/70 dark:bg-slate-800/70 p-5 rounded-2xl shadow-sm">
                      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">
                        Informasi Paket
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                            Kode Paket
                          </p>
                          <p className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                            {selectedPaket.kodePaket}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                            Nilai Kontrak
                          </p>
                          <p className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                            {new Intl.NumberFormat('id-ID', { 
                              style: 'currency', 
                              currency: 'IDR' 
                            }).format(Number(selectedPaket.nilaiKontrak) || 0)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                            Status Penilaian
                          </p>
                          <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                            selectedPaket.penilaian === 'Sudah' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                          }`}>
                            {selectedPaket.penilaian === 'Sudah' ? 'Sudah Dinilai' : 'Belum Dinilai'}
                          </span>
                          
                          {/* Warning for already evaluated paket */}
                          {selectedPaket.penilaian === 'Sudah' && (
                            <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
                              <div className="flex items-start space-x-2">
                                <Lock className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                                  Paket ini sudah dinilai dan tidak dapat dinilai kembali. Anda hanya dapat melihat informasi paket ini.
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between mt-8">
                  <Button
                    onClick={goToPrevStep}
                    variant="outline"
                    className="px-6 py-3 text-base font-semibold rounded-xl"
                  >
                    <ArrowLeft className="mr-2 h-5 w-5" />
                    Kembali
                  </Button>
                  <Button
                    onClick={() => {
                      // Check if the selected paket is already evaluated
                      const isEvaluated = evaluatedPaket.some(
                        p => p.kodePaket === selectedPaket?.kodePaket && 
                             p.kodePenyedia === selectedPaket?.kodePenyedia
                      );
                      
                      if (!isEvaluated) {
                        goToNextStep();
                      }
                    }}
                    disabled={!selectedPaket || evaluatedPaket.some(
                      p => p.kodePaket === selectedPaket?.kodePaket && 
                           p.kodePenyedia === selectedPaket?.kodePenyedia
                    )}
                    className="px-8 py-3 text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                  >
                    {evaluatedPaket.some(
                      p => p.kodePaket === selectedPaket?.kodePaket && 
                           p.kodePenyedia === selectedPaket?.kodePenyedia
                    ) ? (
                      <div className="flex items-center">
                        <Lock className="mr-2 h-5 w-5" />
                        Sudah Dinilai
                      </div>
                    ) : (
                      <>
                        Lanjut ke Pertanyaan
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Step 3: Contract Termination Question */}
        {currentStep === 3 && selectedPaket && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-2 border-dashed border-orange-300/50 bg-gradient-to-br from-white/80 to-orange-50/30 dark:from-slate-800/80 dark:to-slate-900/30 shadow-xl rounded-3xl overflow-hidden backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3 text-xl lg:text-2xl">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-orange-100 text-orange-600 font-bold text-base">
                    3
                  </div>
                  <span>Pertanyaan Pemutusan Kontrak</span>
                </CardTitle>
                <CardDescription className="text-base">
                  Jawab pertanyaan berikut sebelum melanjutkan ke penilaian
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-2xl border border-orange-200 dark:border-orange-700">
                  <h3 className="text-lg font-semibold text-orange-800 dark:text-orange-200 mb-4">
                    Pertanyaan Wajib
                  </h3>
                  <p className="text-base text-slate-700 dark:text-slate-300 mb-6">
                    Apakah terjadi pemutusan kontrak secara sepihak oleh Pejabat Pembuat Komitmen (PPK) karena kesalahan Penyedia?
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <motion.button
                      type="button"
                      onClick={() => setContractTerminated(true)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex-1 px-6 py-4 rounded-xl border-2 font-semibold text-base transition-all duration-300 ${
                        contractTerminated === true
                          ? "bg-red-500 border-red-500 text-white shadow-lg"
                          : "bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:border-red-300 dark:hover:border-red-500 shadow-sm"
                      }`}
                    >
                      Ya, terjadi pemutusan kontrak
                    </motion.button>
                    
                    <motion.button
                      type="button"
                      onClick={() => setContractTerminated(false)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex-1 px-6 py-4 rounded-xl border-2 font-semibold text-base transition-all duration-300 ${
                        contractTerminated === false
                          ? "bg-green-500 border-green-500 text-white shadow-lg"
                          : "bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:border-green-300 dark:hover:border-green-500 shadow-sm"
                      }`}
                    >
                      Tidak, kontrak berjalan normal
                    </motion.button>
                  </div>
                </div>

                {/* Show comment field if contract was terminated */}
                <AnimatePresence>
                  {contractTerminated === true && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-3"
                    >
                      <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-2xl border border-red-200 dark:border-red-700">
                        <div className="flex items-start space-x-3 mb-4">
                          <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-white text-sm font-bold">!</span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">
                              Pemutusan Kontrak Terdeteksi
                            </h4>
                            <p className="text-red-700 dark:text-red-300 text-sm">
                              Karena terjadi pemutusan kontrak sepihak, semua aspek penilaian akan otomatis mendapat skor 0 dan penilaian akhir akan menjadi "Buruk". Silakan berikan keterangan mengenai pemutusan kontrak tersebut.
                            </p>
                          </div>
                        </div>
                        
                        <Label className="text-sm font-medium text-red-800 dark:text-red-200 mb-2 block">
                          Keterangan Pemutusan Kontrak (Wajib diisi) *
                        </Label>
                        <Textarea
                          value={terminationComment}
                          onChange={(e) => setTerminationComment(e.target.value)}
                          placeholder="Jelaskan alasan dan detail pemutusan kontrak secara sepihak..."
                          className="min-h-[120px] text-base rounded-xl border-red-300 focus:border-red-500 focus:ring-red-500"
                          required
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Show confirmation if no termination */}
                <AnimatePresence>
                  {contractTerminated === false && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-2xl border border-green-200 dark:border-green-700">
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold text-green-800 dark:text-green-200 mb-1">
                              Kontrak Berjalan Normal
                            </h4>
                            <p className="text-green-700 dark:text-green-300 text-sm">
                              Anda dapat melanjutkan ke tahap penilaian untuk memberikan skor berdasarkan kinerja penyedia.
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex justify-between mt-8">
                  <Button
                    onClick={goToPrevStep}
                    variant="outline"
                    className="px-6 py-3 text-base font-semibold rounded-xl"
                  >
                    <ArrowLeft className="mr-2 h-5 w-5" />
                    Kembali
                  </Button>
                  <Button
                    onClick={goToNextStep}
                    disabled={contractTerminated === null || (contractTerminated === true && !terminationComment.trim())}
                    className="px-8 py-3 text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                  >
                    Lanjut ke Penilaian
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Step 4: Rating Form */}
        {currentStep === 4 && selectedPaket && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-2 border-dashed border-purple-300/50 bg-gradient-to-br from-white/80 to-purple-50/30 dark:from-slate-800/80 dark:to-slate-900/30 shadow-xl rounded-3xl overflow-hidden backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3 text-xl lg:text-2xl">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-100 text-purple-600 font-bold text-base">
                    4
                  </div>
                  <span>Berikan Penilaian</span>
                </CardTitle>
                <CardDescription className="text-base">
                  Berikan skor 1-3 untuk setiap kriteria penilaian sesuai standar LKPP
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Show warning if contract was terminated */}
                {contractTerminated === true && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="bg-red-50 dark:bg-red-900/20 p-6 rounded-2xl border border-red-200 dark:border-red-700"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-sm font-bold">!</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">
                          Penilaian Otomatis: Kontrak Diputus
                        </h4>
                        <p className="text-red-700 dark:text-red-300 text-sm mb-3">
                          Karena terjadi pemutusan kontrak sepihak, semua aspek penilaian akan otomatis mendapat skor 0 dan penilaian akhir akan menjadi "Buruk". Silakan berikan keterangan mengenai pemutusan kontrak tersebut.
                        </p>
                        <p className="text-red-600 dark:text-red-400 text-xs">
                          Keterangan: {terminationComment}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {kriteriaPenilaian.map((criteria, index) => (
                  <motion.div
                    key={criteria.key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="space-y-5 p-6 border border-slate-200/50 dark:border-slate-600/50 bg-white/50 dark:bg-slate-800/50 shadow-sm"
                  >
                    <div>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                        <Label className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                          {criteria.label}
                        </Label>
                        <Badge variant="secondary" className="text-sm py-1 px-3 rounded-full">
                          Bobot: {criteria.bobot}
                        </Badge>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300">
                        {criteria.description}
                      </p>
                    </div>

                    {/* Rating buttons with modern design using borders and transparent gradients */}
                    <div className="grid grid-cols-3 gap-4">
                      {skalaPenilaian.map((skala) => (
                        <motion.button
                          key={skala.value}
                          type="button"
                          onClick={() =>
                            !contractTerminated && handleInputChange(criteria.key, skala.value)
                          }
                          whileHover={!contractTerminated ? { scale: 1.05 } : {}}
                          whileTap={!contractTerminated ? { scale: 0.95 } : {}}
                          disabled={contractTerminated === true}
                          className={`px-4 py-6 rounded-2xl font-bold text-lg transition-all duration-300 flex flex-col items-center justify-center gap-2 relative overflow-hidden ${
                            contractTerminated === true
                              ? "bg-gray-100/50 dark:bg-gray-800/50 text-gray-400 border-2 border-gray-300 dark:border-gray-600 cursor-not-allowed"
                              : formData[criteria.key as keyof typeof formData] === skala.value
                              ? skala.value === 1 
                                ? "bg-yellow-50/70 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 border-2 border-yellow-500 shadow-yellow-500/20"
                                : skala.value === 2
                                ? "bg-blue-50/70 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-2 border-blue-500 shadow-blue-500/20"
                                : "bg-green-50/70 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-2 border-green-500 shadow-green-500/20"
                              : skala.value === 1
                              ? "bg-yellow-50/30 dark:bg-yellow-900/10 text-yellow-600 dark:text-yellow-400 border-2 border-yellow-300 hover:border-yellow-500"
                              : skala.value === 2
                              ? "bg-blue-50/30 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400 border-2 border-blue-300 hover:border-blue-500"
                              : "bg-green-50/30 dark:bg-green-900/10 text-green-600 dark:text-green-400 border-2 border-green-300 hover:border-green-500"
                          }`}
                        >
                          <div className="text-2xl font-extrabold">
                            {contractTerminated === true ? 0 : skala.value}
                          </div>
                          <div className="text-sm font-medium">
                            {skala.label}
                          </div>
                          {formData[criteria.key as keyof typeof formData] === skala.value && !contractTerminated && (
                            <motion.div
                              className="absolute top-2 right-2"
                              initial={{ scale: 0, rotate: -45 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{ 
                                type: "spring", 
                                stiffness: 300, 
                                damping: 20,
                                duration: 0.3
                              }}
                            >
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                skala.value === 1 
                                  ? "bg-yellow-500"
                                  : skala.value === 2
                                  ? "bg-blue-500"
                                  : "bg-green-500"
                              }`}>
                                <Check className="h-4 w-4 text-white" strokeWidth={3} />
                              </div>
                            </motion.div>
                          )}
                        </motion.button>
                      ))}
                    </div>

                    {/* Comment field for this criteria */}
                    <div className="space-y-2">
                      <Label className="font-medium text-slate-700 dark:text-slate-300">
                        Komentar {criteria.label} (Opsional)
                      </Label>
                      <Textarea
                        value={(() => {
                          const commentKey = `komentar${
                            criteria.key.charAt(0).toUpperCase() +
                            criteria.key.slice(1)
                          }`;
                          return (
                            (formData[
                              commentKey as keyof typeof formData
                            ] as string) || ""
                          );
                        })()}
                        onChange={(e) => {
                          if (contractTerminated !== true) {
                            const commentKey = `komentar${
                              criteria.key.charAt(0).toUpperCase() +
                              criteria.key.slice(1)
                            }`;
                            handleInputChange(commentKey, e.target.value);
                          }
                        }}
                        placeholder={contractTerminated === true ? "Tidak dapat diisi karena kontrak diputus" : `Berikan komentar tambahan untuk aspek ${criteria.label.toLowerCase()}...`}
                        className="min-h-[100px] text-base rounded-xl border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                        disabled={contractTerminated === true}
                      />
                    </div>

                    {/* Criteria description */}
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl">
                      <p className="font-medium text-slate-700 dark:text-slate-300 mb-3">
                        Kriteria Penilaian:
                      </p>
                      <div className="space-y-2">
                        {Object.entries(criteria.kriteria).map(([score, desc]) => (
                          <div key={score} className="flex items-start space-x-3">
                            <span
                              className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                parseInt(score) === 1
                                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200"
                                  : parseInt(score) === 2
                                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200"
                                  : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200"
                              }`}
                            >
                              {score}
                            </span>
                            <span className="text-slate-600 dark:text-slate-300">
                              {desc}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* Keterangan */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                  className="space-y-3"
                >
                  <Label className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                    Keterangan Tambahan (Opsional)
                  </Label>
                  <Textarea
                    value={formData.keterangan}
                    onChange={(e) => {
                      if (contractTerminated !== true) {
                        handleInputChange("keterangan", e.target.value);
                      }
                    }}
                    placeholder={contractTerminated === true ? "Keterangan otomatis diisi dari pemutusan kontrak" : "Berikan keterangan tambahan mengenai penilaian ini..."}
                    className="min-h-[120px] text-base rounded-xl border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                    disabled={contractTerminated === true}
                  />
                </motion.div>

                {/* Weighted Score Display */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 }}
                  className="mt-2 p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl border border-blue-200 dark:border-blue-700 shadow-sm"
                >
                  <div className="text-center space-y-5">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                      Hasil Penilaian
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="bg-white/70 dark:bg-slate-800/70 p-5 rounded-xl">
                        <p className="text-slate-600 dark:text-slate-400 mb-2">
                          Skor Total (Berbobot)
                        </p>
                        <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                          {calculateWeightedScore()}
                        </div>
                      </div>

                      <div className="bg-white/70 dark:bg-slate-800/70 p-5 rounded-xl">
                        <p className="text-slate-600 dark:text-slate-400 mb-2">
                          Penilaian Akhir
                        </p>
                        <div
                          className={`text-3xl font-bold ${getRatingColor(parseFloat(calculateWeightedScore()))}`}
                        >
                          {getFinalEvaluation()}
                        </div>
                      </div>
                    </div>

                    <div className="max-w-md mx-auto w-full">
                      <Progress
                        value={(parseFloat(calculateWeightedScore()) / 3) * 100}
                        className="h-3 rounded-full"
                      />
                    </div>

                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      Formula: (Kualitas×30%) + (Biaya×20%) + (Waktu×30%) +
                      (Layanan×20%)
                    </div>
                  </div>
                </motion.div>

                {/* Navigation Buttons */}
                <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4">
                  <Button
                    onClick={goToPrevStep}
                    variant="outline"
                    className="px-6 py-3 text-base font-semibold rounded-xl"
                  >
                    <ArrowLeft className="mr-2 h-5 w-5" />
                    Kembali
                  </Button>
                  
                  <motion.div
                    whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                    whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Button
                      onClick={submitPenilaian}
                      disabled={isSubmitting}
                      className="px-8 py-4 text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-70 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white border-0 min-w-[200px]"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center space-x-3">
                          <motion.div
                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          />
                          <span>Menyimpan Penilaian...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-3">
                          <motion.div
                            initial={{ scale: 1 }}
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Send className="h-5 w-5" />
                          </motion.div>
                          <span>Simpan Penilaian</span>
                          <motion.div
                            className="w-2 h-2 bg-white rounded-full"
                            animate={{ 
                              scale: [1, 1.2, 1],
                              opacity: [0.7, 1, 0.7]
                            }}
                            transition={{ 
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                          />
                        </div>
                      )}
                    </Button>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}