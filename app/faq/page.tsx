"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, ChevronDown, Search } from "lucide-react";
import { GradientText } from "@/components/ui/gradient-text";

const faqData = [
  {
    category: "Umum",
    questions: [
      {
        question: "Apa itu Sistem Penilaian Penyedia UKPBJ Kemnaker?",
        answer:
          "Sistem Penilaian Penyedia UKPBJ Kemnaker adalah platform digital yang digunakan oleh Pejabat Pembuat Komitmen (PPK) untuk memberikan penilaian terhadap kinerja penyedia barang/jasa sesuai dengan standar UKPBJ (Unit Pengelola Barang/Jasa) Kementerian Ketenagakerjaan.",
      },
      {
        question: "Siapa saja yang dapat menggunakan sistem ini?",
        answer:
          "Sistem ini dapat digunakan oleh Pejabat Pembuat Komitmen (PPK) yang terdaftar dan terverifikasi dalam sistem untuk penilaian kinerja dari penyedia yang telah berkontrak. Pengguna PPK harus memiliki akun dengan kredensial yang valid untuk dapat mengakses fitur penilaian. selain itu, semua para staff Kemnaker dapat mengakses halaman yang disediakan untuk informasi laporan penilaian.",
      },
      {
        question: "Apakah sistem ini terintegrasi dengan sistem lain?",
        answer:
          "Ya, sistem ini terintegrasi dengan Google Spreadsheet untuk penyimpanan dan sinkronisasi data secara real-time. Integrasi ini memastikan data selalu akurat dan dapat diakses untuk pelaporan dan analisis.",
      },
    ],
  },
  {
    category: "Autentikasi",
    questions: [
      {
        question: "Bagaimana cara login ke sistem penilaian kinerja penyedia?",
        answer:
          "Untuk login ke sistem, Anda perlu mengakses halaman penilaian dan memasukkan NIP, Eselon I, dan Satuan Kerja Anda. Sistem akan memverifikasi data tersebut dengan database PPK terdaftar.",
      },
      {
        question: "Apa yang harus saya lakukan jika lupa NIP?",
        answer:
          "Jika Anda lupa NIP, silakan hubungi administrator sistem. Mereka dapat membantu memverifikasi identitas Anda dan memberikan informasi NIP yang benar.",
      },
      {
        question: "Mengapa saya tidak bisa login meski data sudah benar?",
        answer:
          "Pastikan Anda adalah PPK yang terdaftar dalam sistem. Jika data sudah benar namun masih tidak bisa login, kemungkinan ada masalah dengan verifikasi data. Silakan hubungi administrator sistem untuk bantuan lebih lanjut.",
      },
    ],
  },
  {
    category: "Penilaian",
    questions: [
      {
        question: "Bagaimana cara memberikan penilaian terhadap penyedia?",
        answer:
          "Setelah login, Anda akan melihat daftar paket kontrak yang tersedia untuk dinilai. Pilih paket yang ingin dinilai, lalu ikuti langkah-langkah penilaian yang tersedia. Sistem akan memandu Anda melalui proses penilaian secara berurutan.",
      },
      {
        question: "Apa kriteria penilaian yang digunakan?",
        answer:
          "Sistem menggunakan kriteria penilaian sesuai standar LKPP (Lembaga Kebijakan Pengadaan Barang/Jasa), yaitu: Kualitas dan Kuantitas Pekerjaan (30%), Biaya (20%), Waktu (30%), dan Layanan (20%). Setiap kriteria memiliki panduan penilaian yang jelas.",
      },
      {
        question: "Apakah saya bisa mengubah penilaian yang sudah disimpan?",
        answer:
          "Penilaian yang sudah disimpan tidak dapat diubah untuk menjaga integritas data.",
      },
      {
        question: "Bagaimana jika terjadi pemutusan kontrak?",
        answer:
          "Jika terjadi pemutusan kontrak sepihak karena kesalahan penyedia, sistem menyediakan pertanyaan khusus untuk menangani kasus ini. Penyedia akan otomatis mendapat penilaian sesuai dengan prosedur yang berlaku.",
      },
    ],
  },
  {
    category: "Data dan Laporan",
    questions: [
      {
        question: "Berapa lama data penilaian akan tersedia?",
        answer:
          "Data penilaian tersedia secara real-time setelah disimpan. Anda dapat mengakses laporan dan statistik kapan saja melalui halaman Dashboard dan Laporan di sistem.",
      },
      {
        question: "Bagaimana cara mengunduh laporan penilaian?",
        answer:
          "Anda dapat mengunduh laporan penilaian dalam berbagai format (PDF, Excel) melalui halaman Laporan. Pilih periode dan parameter yang diinginkan, lalu klik tombol unduh.",
      },
    ],
  },
  {
    category: "Teknis",
    questions: [
      {
        question: "Browser apa saja yang kompatibel dengan sistem ini?",
        answer:
          "Sistem ini kompatibel dengan browser modern seperti Google Chrome, Mozilla Firefox, Microsoft Edge, dan Safari versi terbaru. Kami menyarankan menggunakan browser terbaru untuk pengalaman terbaik.",
      },
      {
        question: "Apakah sistem ini bisa diakses melalui perangkat mobile?",
        answer:
          "Ya, sistem ini dirancang dengan pendekatan mobile-first dan dapat diakses melalui smartphone dan tablet. Namun, untuk proses penilaian yang kompleks, kami menyarankan menggunakan perangkat desktop.",
      },
      {
        question: "Apa yang harus saya lakukan jika menemui error pada sistem?",
        answer:
          "Jika menemui error, pertama refresh halaman dan pastikan koneksi internet Anda stabil. Jika error masih terjadi, catat detail error dan langkah-langkah yang dilakukan, lalu hubungi administrator sistem untuk bantuan.",
      },
    ],
  },
  {
    category: "Bantuan dan Dukungan",
    questions: [
      {
        question: "Bagaimana cara menghubungi support jika ada pertanyaan?",
        answer:
          "Anda dapat menghubungi tim support melalui email atau melalui form kontak yang tersedia di halaman beranda. Admin akan merespon dalam waktu 1x24 jam kerja.",
      },
      {
        question: "Apakah tersedia panduan penggunaan sistem?",
        answer:
          "Ya, panduan penggunaan sistem tersedia dalam format digital dan dapat diakses melalui menu Dokumentasi. Panduan ini mencakup tutorial langkah demi langkah untuk semua fitur utama sistem.",
      },
      {
        question: "Bagaimana cara memberikan masukan untuk perbaikan sistem?",
        answer:
          "Kami sangat menghargai masukan dari pengguna. Anda dapat memberikan masukan melalui form kontak di halaman beranda, atau mengirim email langsung. Setiap masukan akan dipertimbangkan untuk pengembangan sistem.",
      },
    ],
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<{
    category: number;
    question: number;
  } | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleQuestion = (categoryIndex: number, questionIndex: number) => {
    if (
      openIndex?.category === categoryIndex &&
      openIndex?.question === questionIndex
    ) {
      setOpenIndex(null);
    } else {
      setOpenIndex({ category: categoryIndex, question: questionIndex });
    }
  };

  const filteredFaqData = faqData
    .map((category) => {
      const filteredQuestions = category.questions.filter(
        (q) =>
          q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          q.answer.toLowerCase().includes(searchTerm.toLowerCase())
      );
      return {
        ...category,
        questions: filteredQuestions,
      };
    })
    .filter((category) => category.questions.length > 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Link
            href="/"
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-300"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Kembali ke Beranda
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center mb-12"
        >
          <GradientText as="h1" className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Pertanyaan Umum
          </GradientText>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Temukan jawaban untuk pertanyaan yang sering diajukan tentang sistem
            penilaian penyedia UKPBJ Kemnaker
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-12 max-w-2xl mx-auto"
        >
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Cari pertanyaan..."
              className="block w-full pl-10 pr-3 py-4 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-2xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </motion.div>

        <div className="space-y-8">
          {filteredFaqData.length > 0 ? (
            filteredFaqData.map((category, categoryIndex) => (
              <motion.div
                key={categoryIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * categoryIndex }}
                className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl overflow-hidden"
              >
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
                  <h2 className="text-2xl font-bold text-white">
                    {category.category}
                  </h2>
                </div>

                <div className="p-6 space-y-4">
                  {category.questions.map((faq, questionIndex) => (
                    <div
                      key={questionIndex}
                      className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden transition-all duration-300"
                    >
                      <button
                        className="w-full flex justify-between items-center p-5 text-left bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-300"
                        onClick={() =>
                          toggleQuestion(categoryIndex, questionIndex)
                        }
                      >
                        <h3 className="font-semibold text-slate-800 dark:text-white text-lg pr-4">
                          {faq.question}
                        </h3>
                        <ChevronDown
                          className={`h-5 w-5 text-slate-500 dark:text-slate-400 flex-shrink-0 transition-transform duration-300 ${
                            openIndex?.category === categoryIndex &&
                            openIndex?.question === questionIndex
                              ? "rotate-180"
                              : ""
                          }`}
                        />
                      </button>

                      <motion.div
                        initial={false}
                        animate={{
                          height:
                            openIndex?.category === categoryIndex &&
                            openIndex?.question === questionIndex
                              ? "auto"
                              : 0,
                          opacity:
                            openIndex?.category === categoryIndex &&
                            openIndex?.question === questionIndex
                              ? 1
                              : 0,
                        }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="p-5 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
                          <p className="text-slate-600 dark:text-slate-300">
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <p className="text-slate-600 dark:text-slate-300 text-lg">
                Tidak ditemukan pertanyaan yang sesuai dengan kata kunci "
                {searchTerm}"
              </p>
              <button
                onClick={() => setSearchTerm("")}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Lihat semua pertanyaan
              </button>
            </motion.div>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-16 text-center p-8 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-slate-800 dark:to-slate-700 rounded-3xl border border-blue-200 dark:border-slate-600"
        >
          <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">
            Masih memiliki pertanyaan?
          </h3>
          <p className="text-slate-600 dark:text-slate-300 mb-6 max-w-2xl mx-auto">
            Jika Anda tidak menemukan jawaban yang Anda cari, jangan ragu untuk
            menghubungi tim support kami.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="mailto:support@kemnaker.go.id"
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors duration-300 shadow-lg hover:shadow-xl"
            >
              Email Support
            </a>
            <Link
              href="/contact"
              className="px-6 py-3 bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-medium rounded-xl border border-blue-200 dark:border-slate-600 hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors duration-300 shadow-lg hover:shadow-xl"
            >
              Form Kontak
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
