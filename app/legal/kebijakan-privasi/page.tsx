"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function KebijakanPrivasiPage() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
          variants={container}
          initial="hidden"
          animate="show"
          className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl overflow-hidden"
        >
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8">
            <motion.h1 
              variants={item}
              className="text-3xl md:text-4xl font-bold text-white"
            >
              Kebijakan Privasi
            </motion.h1>
            <motion.p 
              variants={item}
              className="text-blue-100 mt-2"
            >
              Terakhir diperbarui: {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </motion.p>
          </div>

          <div className="p-8 space-y-8">
            <motion.section variants={item}>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">1. Pendahuluan</h2>
              <p className="text-slate-600 dark:text-slate-300 mb-4">
                Kebijakan Privasi ini menjelaskan bagaimana Sistem Penilaian Penyedia UKPBJ Kemnaker 
                ("kami", "platform") mengumpulkan, menggunakan, membagikan, dan melindungi informasi pribadi 
                pengguna. Dengan menggunakan sistem ini, Anda menyetujui praktik pengumpulan dan penggunaan 
                informasi yang dijelaskan dalam kebijakan ini.
              </p>
            </motion.section>

            <motion.section variants={item}>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">2. Informasi yang Kami Kumpulkan</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-2">2.1 Informasi yang Anda Berikan</h3>
                  <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300">
                    <li><span className="font-semibold">Data Pendaftaran:</span> Nama lengkap, NIP, alamat email, nomor telepon</li>
                    <li><span className="font-semibold">Data Profil:</span> Informasi jabatan, satuan kerja, dan eselon</li>
                    <li><span className="font-semibold">Data Penilaian:</span> Hasil penilaian terhadap penyedia barang/jasa</li>
                    <li><span className="font-semibold">Korespondensi:</span> Informasi yang Anda berikan saat menghubungi kami</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-2">2.2 Informasi yang Kami Kumpulkan Secara Otomatis</h3>
                  <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300">
                    <li><span className="font-semibold">Data Teknis:</span> Alamat IP, jenis browser, sistem operasi, dan informasi perangkat</li>
                    <li><span className="font-semibold">Data Penggunaan:</span> Waktu akses, halaman yang dikunjungi, dan interaksi dengan sistem</li>
                    <li><span className="font-semibold">Data Lokasi:</span> Informasi lokasi umum berdasarkan alamat IP</li>
                  </ul>
                </div>
              </div>
            </motion.section>

            <motion.section variants={item}>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">3. Tujuan Penggunaan Informasi</h2>
              <p className="text-slate-600 dark:text-slate-300 mb-4">
                Kami menggunakan informasi yang dikumpulkan untuk:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300">
                <li>Memverifikasi identitas dan kewenangan pengguna</li>
                <li>Memfasilitasi proses penilaian penyedia barang/jasa</li>
                <li>Menyediakan dan meningkatkan layanan sistem</li>
                <li>Menghasilkan laporan dan analisis kinerja</li>
                <li>Memenuhi kewajiban hukum dan regulasi</li>
                <li>Melindungi keamanan dan integritas sistem</li>
                <li>Berkomunikasi dengan pengguna mengenai layanan</li>
              </ul>
            </motion.section>

            <motion.section variants={item}>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">4. Berbagi Informasi</h2>
              <p className="text-slate-600 dark:text-slate-300 mb-4">
                Kami tidak menjual, memperdagangkan, atau menyewakan informasi pribadi pengguna kepada pihak ketiga. 
                Namun, kami dapat membagikan informasi dalam situasi berikut:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300">
                <li>Dengan otoritas terkait untuk keperluan pelaporan dan audit</li>
                <li>Dengan mitra teknologi yang membantu operasional sistem (dengan kewajiban kerahasiaan)</li>
                <li>Jika diwajibkan oleh hukum atau proses hukum yang sah</li>
                <li>Untuk melindungi hak, properti, atau keamanan platform dan pengguna</li>
              </ul>
            </motion.section>

            <motion.section variants={item}>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">5. Keamanan Data</h2>
              <p className="text-slate-600 dark:text-slate-300 mb-4">
                Kami menerapkan langkah-langkah keamanan teknis dan organisasi yang sesuai untuk melindungi 
                informasi pribadi dari akses tidak sah, pengungkapan, alterasi, atau penghancuran. Langkah-langkah 
                ini meliputi:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300">
                <li>Enkripsi data saat transit dan saat disimpan</li>
                <li>Autentikasi multi-faktor untuk akses administratif</li>
                <li>Audit keamanan berkala</li>
                <li>Pembatasan akses berdasarkan kebutuhan tahu</li>
                <li>Pelatihan keamanan untuk personel yang menangani data</li>
              </ul>
            </motion.section>

            <motion.section variants={item}>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">6. Hak Pengguna</h2>
              <p className="text-slate-600 dark:text-slate-300 mb-4">
                Pengguna memiliki hak-hak berikut terkait informasi pribadi mereka:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300">
                <li><span className="font-semibold">Hak Akses:</span> Meminta informasi tentang data pribadi yang kami miliki</li>
                <li><span className="font-semibold">Hak Koreksi:</span> Memperbaiki data pribadi yang tidak akurat</li>
                <li><span className="font-semibold">Hak Penghapusan:</span> Meminta penghapusan data pribadi dalam kondisi tertentu</li>
                <li><span className="font-semibold">Hak Pembatasan:</span> Membatasi pemrosesan data dalam kondisi tertentu</li>
                <li><span className="font-semibold">Hak Portabilitas:</span> Menerima salinan data pribadi dalam format terstruktur</li>
                <li><span className="font-semibold">Hak Keberatan:</span> Menolak pemrosesan data untuk tujuan tertentu</li>
              </ul>
              <p className="text-slate-600 dark:text-slate-300 mt-4">
                Untuk menggunakan hak-hak ini, silakan hubungi kami melalui kontak yang tersedia di bagian akhir kebijakan ini.
              </p>
            </motion.section>

            <motion.section variants={item}>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">7. Retensi Data</h2>
              <p className="text-slate-600 dark:text-slate-300">
                Kami menyimpan informasi pribadi selama diperlukan untuk memenuhi tujuan pengumpulan, 
                atau selama diwajibkan oleh hukum. Jangka waktu penyimpanan bervariasi tergantung pada 
                jenis data dan tujuan penggunaannya. Setelah periode retensi berakhir, data akan dihapus 
                secara aman sesuai dengan prosedur yang ditetapkan.
              </p>
            </motion.section>

            <motion.section variants={item}>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">8. Perubahan Kebijakan Privasi</h2>
              <p className="text-slate-600 dark:text-slate-300">
                Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu. Perubahan signifikan 
                akan diumumkan melalui sistem dan/atau email kepada pengguna. Kami menyarankan Anda 
                secara berkala meninjau kebijakan ini untuk mengetahui perubahan terbaru.
              </p>
            </motion.section>

            <motion.section variants={item}>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">9. Transfer Data Internasional</h2>
              <p className="text-slate-600 dark:text-slate-300">
                Informasi yang kami kumpulkan dapat diproses dan disimpan di server yang berlokasi di 
                berbagai negara, termasuk di luar Indonesia. Dengan menggunakan sistem ini, Anda 
                menyetujui transfer data tersebut dan mengakui bahwa negara tujuan mungkin tidak 
                memiliki tingkat perlindungan data yang setara dengan hukum privasi di Indonesia.
              </p>
            </motion.section>

            <motion.section variants={item}>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">10. Hubungi Kami</h2>
              <p className="text-slate-600 dark:text-slate-300 mb-4">
                Jika Anda memiliki pertanyaan atau kekhawatiran tentang Kebijakan Privasi ini, 
                atau ingin menggunakan hak privasi Anda, silakan hubungi kami:
              </p>
              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <p className="text-slate-700 dark:text-slate-300">
                  <span className="font-semibold">Email:</span> privacy@kemnaker.go.id
                </p>
                <p className="text-slate-700 dark:text-slate-300 mt-2">
                  <span className="font-semibold">Telepon:</span> (021) 12345678
                </p>
                <p className="text-slate-700 dark:text-slate-300 mt-2">
                  <span className="font-semibold">Alamat:</span> Jl. Jenderal Gatot Subroto No. 51, Jakarta Selatan 12190
                </p>
                <p className="text-slate-700 dark:text-slate-300 mt-2">
                  <span className="font-semibold">Departemen:</span> Unit Pengelola Barang/Jasa Kementerian Ketenagakerjaan
                </p>
              </div>
            </motion.section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}