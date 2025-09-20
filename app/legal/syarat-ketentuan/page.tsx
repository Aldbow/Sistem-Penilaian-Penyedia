"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function SyaratKetentuanPage() {
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
              Syarat & Ketentuan
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
                Selamat datang di Sistem Penilaian Penyedia UKPBJ Kemnaker. Dengan mengakses atau menggunakan layanan kami, 
                Anda setuju untuk terikat oleh syarat dan ketentuan berikut. Jika Anda tidak setuju dengan syarat ini, 
                harap tidak menggunakan layanan kami.
              </p>
            </motion.section>

            <motion.section variants={item}>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">2. Definisi</h2>
              <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300">
                <li><span className="font-semibold">"Kami", "Kita", "Platform"</span> mengacu pada Sistem Penilaian Penyedia UKPBJ Kemnaker</li>
                <li><span className="font-semibold">"Pengguna"</span> mengacu pada Pejabat Pembuat Komitmen (PPK) atau pihak berwenang yang menggunakan sistem ini</li>
                <li><span className="font-semibold">"Penyedia"</span> mengacu pada penyedia barang/jasa yang dinilai melalui sistem ini</li>
                <li><span className="font-semibold">"Data"</span> mengacu pada informasi yang dikumpulkan, diproses, dan disimpan melalui sistem ini</li>
              </ul>
            </motion.section>

            <motion.section variants={item}>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">3. Penggunaan Sistem</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-2">3.1 Hak Akses</h3>
                  <p className="text-slate-600 dark:text-slate-300">
                    Sistem ini hanya dapat diakses oleh Pejabat Pembuat Komitmen (PPK) yang terdaftar dan terverifikasi. 
                    Setiap akses oleh pihak yang tidak berwenang dilarang keras.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-2">3.2 Kewajiban Pengguna</h3>
                  <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300">
                    <li>Menjaga kerahasiaan akun dan kata sandi</li>
                    <li>Menggunakan sistem sesuai dengan prosedur dan standar yang berlaku</li>
                    <li>Memastikan keakuratan data yang dimasukkan ke dalam sistem</li>
                    <li>Tidak melakukan manipulasi data atau tindakan yang dapat merugikan sistem</li>
                  </ul>
                </div>
              </div>
            </motion.section>

            <motion.section variants={item}>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">4. Data dan Privasi</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-2">4.1 Pengumpulan Data</h3>
                  <p className="text-slate-600 dark:text-slate-300">
                    Kami mengumpulkan data yang diperlukan untuk menyediakan layanan penilaian penyedia, 
                    termasuk data pribadi PPK, informasi penyedia, dan hasil penilaian.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-2">4.2 Penggunaan Data</h3>
                  <p className="text-slate-600 dark:text-slate-300">
                    Data digunakan untuk:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300 mt-2">
                    <li>Memfasilitasi proses penilaian penyedia</li>
                    <li>Menghasilkan laporan kinerja penyedia</li>
                    <li>Meningkatkan kualitas layanan sistem</li>
                    <li>Memenuhi kewajiban hukum dan regulasi yang berlaku</li>
                  </ul>
                </div>
              </div>
            </motion.section>

            <motion.section variants={item}>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">5. Hak Kekayaan Intelektual</h2>
              <p className="text-slate-600 dark:text-slate-300">
                Seluruh konten, fitur, dan fungsionalitas sistem ini merupakan hak kekayaan intelektual 
                Kementerian Ketenagakerjaan dan dilindungi oleh undang-undang. Pengguna dilarang menyalin, 
                memodifikasi, atau mendistribusikan bagian mana pun dari sistem tanpa izin tertulis.
              </p>
            </motion.section>

            <motion.section variants={item}>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">6. Pembatasan Tanggung Jawab</h2>
              <p className="text-slate-600 dark:text-slate-300">
                Kami tidak bertanggung jawab atas:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300 mt-2">
                <li>Kerugian langsung atau tidak langsung yang timbul dari penggunaan sistem</li>
                <li>Kesalahan data yang disebabkan oleh input pengguna</li>
                <li>Gangguan layanan yang disebabkan oleh faktor eksternal</li>
                <li>Tindakan yang diambil berdasarkan informasi dari sistem ini</li>
              </ul>
            </motion.section>

            <motion.section variants={item}>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">7. Perubahan Syarat & Ketentuan</h2>
              <p className="text-slate-600 dark:text-slate-300">
                Kami berhak mengubah syarat dan ketentuan ini kapan saja. Perubahan akan diumumkan 
                melalui sistem dan berlaku segera setelah dipublikasikan. Penggunaan berkelanjutan 
                terhadap sistem setelah perubahan dianggap sebagai penerimaan terhadap syarat baru.
              </p>
            </motion.section>

            <motion.section variants={item}>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">8. Penyelesaian Sengketa</h2>
              <p className="text-slate-600 dark:text-slate-300">
                Setiap sengketa yang timbul dari penggunaan sistem ini akan diselesaikan secara musyawarah. 
                Jika tidak dapat diselesaikan secara musyawarah, sengketa akan diselesaikan sesuai dengan 
                hukum yang berlaku di Republik Indonesia.
              </p>
            </motion.section>

            <motion.section variants={item}>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">9. Kontak</h2>
              <p className="text-slate-600 dark:text-slate-300">
                Jika Anda memiliki pertanyaan tentang syarat dan ketentuan ini, silakan hubungi kami melalui:
              </p>
              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <p className="text-slate-700 dark:text-slate-300">
                  <span className="font-semibold">Email:</span> ukpbj@kemnaker.go.id
                </p>
                <p className="text-slate-700 dark:text-slate-300 mt-2">
                  <span className="font-semibold">Telepon:</span> (021) 12345678
                </p>
                <p className="text-slate-700 dark:text-slate-300 mt-2">
                  <span className="font-semibold">Alamat:</span> Jl. Jenderal Gatot Subroto No. 51, Jakarta Selatan 12190
                </p>
              </div>
            </motion.section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}