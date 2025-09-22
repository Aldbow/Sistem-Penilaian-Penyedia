"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, BookOpen, User, FileText, BarChart3, Search, Users, Shield, CheckCircle, ChevronRight, Lightbulb } from "lucide-react";
import { GradientText } from "@/components/ui/gradient-text";

const documentationSections = [
  {
    id: "intro",
    title: "Pengenalan Sistem",
    icon: <BookOpen className="h-6 w-6" />,
    content: (
      <div className="space-y-6">
        <p className="text-slate-600 dark:text-slate-300">
          Sistem Penilaian Penyedia UKPBJ Kemnaker adalah platform digital yang dirancang untuk membantu 
          Pejabat Pembuat Komitmen (PPK) dalam memberikan penilaian terhadap kinerja penyedia barang/jasa 
          sesuai dengan standar UKPBJ Kementerian Ketenagakerjaan.
        </p>
        
        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl border border-blue-200 dark:border-blue-700">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center">
            <Lightbulb className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
            Tujuan Sistem
          </h3>
          <ul className="mt-3 space-y-2 text-slate-600 dark:text-slate-300">
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
              <span>Meningkatkan transparansi dan akuntabilitas dalam proses pengadaan</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
              <span>Memastikan penilaian penyedia dilakukan secara objektif dan konsisten</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
              <span>Mendukung pengambilan keputusan yang berbasis data</span>
            </li>
          </ul>
        </div>
      </div>
    )
  },
  {
    id: "auth",
    title: "Autentikasi & Akses",
    icon: <Shield className="h-6 w-6" />,
    content: (
      <div className="space-y-6">
        <p className="text-slate-600 dark:text-slate-300">
          Untuk mengakses sistem penilaian, PPK harus melakukan autentikasi terlebih dahulu. 
        </p>
        
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Langkah-langkah Autentikasi</h3>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-0.5">
                1
              </div>
              <div className="ml-4">
                <h4 className="font-medium text-slate-800 dark:text-white">Akses Halaman Penilaian</h4>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                  Kunjungi halaman penilaian melalui menu navigasi utama.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-0.5">
                2
              </div>
              <div className="ml-4">
                <h4 className="font-medium text-slate-800 dark:text-white">Isi Form Autentikasi</h4>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                  Masukkan informasi berikut:
                </p>
                <ul className="mt-2 space-y-1 text-slate-600 dark:text-slate-400">
                  <li className="flex items-center">
                    <ChevronRight className="h-4 w-4 text-blue-500 mr-2" />
                    <strong>NIP:</strong> Nomor Induk Pegawai Anda
                  </li>
                  <li className="flex items-center">
                    <ChevronRight className="h-4 w-4 text-blue-500 mr-2" />
                    <strong>Eselon I:</strong> Unit organisasi tingkat eselon I
                  </li>
                  <li className="flex items-center">
                    <ChevronRight className="h-4 w-4 text-blue-500 mr-2" />
                    <strong>Satuan Kerja:</strong> Unit kerja spesifik Anda
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: "penilaian",
    title: "Proses Penilaian",
    icon: <FileText className="h-6 w-6" />,
    content: (
      <div className="space-y-6">
        <p className="text-slate-600 dark:text-slate-300">
          Proses penilaian dilakukan berdasarkan standar LKPP dengan empat kriteria utama. 
        </p>
        
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Kriteria Penilaian LKPP</h3>
          
          <div className="space-y-6">
            <div className="border-l-4 border-blue-500 pl-4 py-1">
              <h4 className="font-medium text-slate-800 dark:text-white">1. Kualitas dan Kuantitas Pekerjaan (Bobot 30%)</h4>
              <div className="mt-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border border-slate-200 dark:border-slate-700 p-3 rounded-lg">
                    <div className="font-medium text-yellow-700 dark:text-yellow-300">Cukup (1)</div>
                  </div>
                  <div className="border border-slate-200 dark:border-slate-700 p-3 rounded-lg">
                    <div className="font-medium text-blue-700 dark:text-blue-300">Baik (2)</div>
                  </div>
                  <div className="border border-slate-200 dark:border-slate-700 p-3 rounded-lg">
                    <div className="font-medium text-green-700 dark:text-green-300">Sangat Baik (3)</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-l-4 border-green-500 pl-4 py-1">
              <h4 className="font-medium text-slate-800 dark:text-white">2. Biaya (Bobot 20%)</h4>
              <div className="mt-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border border-slate-200 dark:border-slate-700 p-3 rounded-lg">
                    <div className="font-medium text-yellow-700 dark:text-yellow-300">Cukup (1)</div>
                  </div>
                  <div className="border border-slate-200 dark:border-slate-700 p-3 rounded-lg">
                    <div className="font-medium text-blue-700 dark:text-blue-300">Baik (2)</div>
                  </div>
                  <div className="border border-slate-200 dark:border-slate-700 p-3 rounded-lg">
                    <div className="font-medium text-green-700 dark:text-green-300">Sangat Baik (3)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
];

export default function DocumentationPage() {
  const [activeSection, setActiveSection] = useState("intro");

  const activeContent = documentationSections.find(section => section.id === activeSection) || documentationSections[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
            Petunjuk Penggunaan
          </GradientText>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Panduan komprehensif untuk menggunakan Sistem Penilaian Penyedia UKPBJ Kemnaker
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Navigation Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:w-1/4"
          >
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 sticky top-24">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center">
                <BookOpen className="h-5 w-5 mr-2" />
                Daftar Isi
              </h2>
              <nav className="space-y-2">
                {documentationSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left px-4 py-3 rounded-xl flex items-center transition-all duration-300 ${
                      activeSection === section.id
                        ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50"
                    }`}
                  >
                    <span className="mr-3">{section.icon}</span>
                    <span>{section.title}</span>
                  </button>
                ))}
              </nav>
            </div>
          </motion.div>

          {/* Content Area */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:w-3/4"
          >
            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
                <h2 className="text-2xl font-bold text-white flex items-center">
                  {activeContent.icon}
                  <span className="ml-3">{activeContent.title}</span>
                </h2>
              </div>
              
              <div className="p-6 sm:p-8">
                {activeContent.content}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}