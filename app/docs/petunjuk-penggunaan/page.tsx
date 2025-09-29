"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, BookOpen, Shield, FileText, BarChart3, Search, Users, CheckCircle, ChevronRight, Lightbulb, Building2, TrendingUp, Star, Mail, HelpCircle, Smartphone, Globe, Database, Lock, Layers, User, Building, FileBarChart, Filter, Download, RefreshCw, Eye, Calendar, Clock, Handshake, Scale, Coins, Package, Tag, Ruler, History, BookText, Gavel, FileSpreadsheet, Network, Award, Target, ShieldCheck } from "lucide-react";
import { GradientText } from "@/components/ui/gradient-text";

const documentationSections = [
  {
    id: "sejarah",
    title: "Sejarah & Latar Belakang",
    icon: <History className="h-6 w-6" />,
    content: (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-8 rounded-2xl border border-blue-200 dark:border-blue-700">
          <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">Latar Belakang Pengembangan Sistem</h3>
          <p className="text-slate-600 dark:text-slate-300 mb-6">
            Pengembangan Sistem Penilaian Penyedia UKPBJ Kemnaker dilatarbelakangi oleh kebutuhan mendesak untuk meningkatkan transparansi, akuntabilitas, dan efisiensi dalam proses pengadaan barang/jasa di lingkungan Kementerian Ketenagakerjaan.
          </p>
          <div className="relative h-48 w-full rounded-xl overflow-hidden mb-6">
            <Image 
              src="/img/pengadaan-banner.jpg" 
              alt="Proses Pengadaan Barang/Jasa" 
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            <div className="absolute bottom-4 left-4 text-white">
              <h4 className="text-lg font-semibold">Proses Pengadaan Barang/Jasa</h4>
              <p className="text-sm opacity-90">Meningkatkan efisiensi dan transparansi dalam pengadaan</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-800/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
              <h4 className="font-semibold text-slate-800 dark:text-white mb-2 flex items-center">
                <Target className="h-5 w-5 text-blue-500 mr-2" />
                Tantangan
              </h4>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Sebelum adanya sistem ini, proses penilaian penyedia dilakukan secara manual, kurang terintegrasi, dan sulit untuk dilacak secara real-time.
              </p>
            </div>
            <div className="bg-white dark:bg-slate-800/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
              <h4 className="font-semibold text-slate-800 dark:text-white mb-2 flex items-center">
                <Award className="h-5 w-5 text-green-500 mr-2" />
                Tujuan
              </h4>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Menghadirkan sistem digital yang dapat memberikan penilaian objektif terhadap penyedia barang/jasa secara konsisten dan terukur.
              </p>
            </div>
            <div className="bg-white dark:bg-slate-800/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
              <h4 className="font-semibold text-slate-800 dark:text-white mb-2 flex items-center">
                <ShieldCheck className="h-5 w-5 text-purple-500 mr-2" />
                Solusi
              </h4>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Sistem digital terintegrasi yang memungkinkan PPK memberikan penilaian secara real-time dan terstandarisasi.
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">1.1 Evolusi Pengadaan di Indonesia</h3>
          <p className="text-slate-600 dark:text-slate-300 mb-4">
            Pengadaan barang/jasa di Indonesia telah mengalami perubahan yang signifikan seiring dengan kebijakan reformasi birokrasi dan tata kelola pemerintahan yang baik. Pada awalnya, pengadaan dilakukan secara manual dengan sistem yang cenderung tidak transparan dan rentan terhadap praktik korupsi.
          </p>
          <p className="text-slate-600 dark:text-slate-300">
            Dalam perkembangannya, pemerintah membentuk Lembaga Kebijakan Pengadaan Barang/Jasa Pemerintah (LKPP) untuk menyusun kebijakan, strategi, dan regulasi pengadaan yang lebih terstandarisasi. Sistem Penilaian Penyedia UKPBJ Kemnaker merupakan bagian dari implementasi kebijakan tersebut di lingkungan Kementerian Ketenagakerjaan.
          </p>
        </div>
        
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">1.2 Peran Kementerian Ketenagakerjaan</h3>
          <p className="text-slate-600 dark:text-slate-300">
            Kementerian Ketenagakerjaan sebagai salah satu instansi pemerintah yang memiliki kegiatan pengadaan barang/jasa yang cukup signifikan, perlu menerapkan sistem penilaian yang objektif dan transparan terhadap penyedia barang/jasa. Hal ini sejalan dengan komitmen pemerintah dalam mendukung pemerintahan yang bersih dan bebas dari korupsi.
          </p>
        </div>
      </div>
    )
  },
  {
    id: "dasarhukum",
    title: "Dasar Hukum",
    icon: <Gavel className="h-6 w-6" />,
    content: (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 p-6 rounded-2xl border border-amber-200 dark:border-amber-700">
          <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-4 flex items-center">
            <Scale className="h-5 w-5 mr-2 text-amber-600 dark:text-amber-400" />
            Dasar Hukum Pengadaan Barang/Jasa Pemerintah
          </h3>
          <p className="text-slate-600 dark:text-slate-300 mb-4">
            Penyelenggaraan pengadaan barang/jasa pemerintah di Indonesia didasarkan pada berbagai peraturan perundang-undangan yang saling terkait.
          </p>
        </div>
        
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">2.1 Peraturan Presiden (PERPRES)</h3>
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4 py-2 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h4 className="font-medium text-slate-800 dark:text-white">Peraturan Presiden Nomor 12 Tahun 2021</h4>
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                tentang Perubahan atas Peraturan Presiden Nomor 16 Tahun 2018 tentang Pengadaan Barang/Jasa Pemerintah
              </p>
              <p className="text-slate-600 dark:text-slate-400 text-sm mt-2">
                Merupakan aturan utama yang mengatur seluruh proses pengadaan barang/jasa pemerintah termasuk penilaian kinerja penyedia.
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">2.2 Peraturan Lainnya</h3>
          <ul className="space-y-4">
            <li className="border-l-4 border-green-500 pl-4 py-2 bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <h4 className="font-medium text-slate-800 dark:text-white">Peraturan LKPP Nomor 7 Tahun 2021</h4>
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                tentang Pemilihan Penyedia Barang/Jasa dengan Penunjukan Langsung, Seleksi Sederhana, Seleksi Umum, Seleksi Terbatas, Kontak Pengadaan Barang/Jasa, dan Pengadaan Langsung
              </p>
            </li>
            <li className="border-l-4 border-purple-500 pl-4 py-2 bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
              <h4 className="font-medium text-slate-800 dark:text-white">Peraturan LKPP Nomor 8 Tahun 2021</h4>
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                tentang Manajemen Dan Rekayasa, Tata Letak Dan Penataan Ruang, Pemeliharaan Bangunan Gedung Negara
              </p>
            </li>
            <li className="border-l-4 border-indigo-500 pl-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg">
              <h4 className="font-medium text-slate-800 dark:text-white">Peraturan Menteri PAN-RB Nomor 51 Tahun 2021</h4>
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                tentang Pedoman Evaluasi Pengadaan Barang/Jasa Pemerintah
              </p>
            </li>
          </ul>
        </div>
        
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">2.3 Hubungan dengan Sistem Penilaian</h3>
          <p className="text-slate-600 dark:text-slate-300 mb-4">
            Sistem Penilaian Penyedia UKPBJ Kemnaker dirancang sesuai dengan ketentuan yang tertuang dalam berbagai peraturan tersebut, khususnya dalam hal:
          </p>
          <ul className="space-y-2 text-slate-600 dark:text-slate-400 ml-4">
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
              <span>Penilaian kinerja penyedia sebagai bagian dari mekanisme seleksi ulang</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
              <span>Pengumpulan dan penyajian data kinerja secara objektif dan transparan</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
              <span>Pengembangan database penyedia yang terpercaya</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
              <span>Peningkatan kualitas dan efisiensi proses pengadaan barang/jasa</span>
            </li>
          </ul>
        </div>
      </div>
    )
  },
  {
    id: "intro",
    title: "Deskripsi Sistem",
    icon: <BookOpen className="h-6 w-6" />,
    content: (
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-slate-800 dark:text-white">3.1 Deskripsi Sistem</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
            <p className="text-slate-600 dark:text-slate-300">
              Sistem Penilaian Penyedia UKPBJ Kemnaker adalah aplikasi web modern yang dirancang khusus untuk memfasilitasi Pejabat Pembuat Komitmen (PPK) dalam melakukan evaluasi terhadap penyedia barang/jasa sesuai dengan standar LKPP (Lembaga Kebijakan Pengadaan Barang/Jasa Pemerintah). Sistem ini terintegrasi secara real-time dengan Google Spreadsheet untuk memudahkan proses penilaian dan pelaporan.
            </p>
          </div>
          <div className="relative h-48 rounded-xl overflow-hidden">
            <Image 
              src="/img/sistem-penilaian.jpg" 
              alt="Sistem Penilaian Penyedia" 
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            <div className="absolute bottom-4 left-4 text-white">
              <h4 className="font-semibold">Sistem Penilaian Penyedia</h4>
            </div>
          </div>
        </div>
        
        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl border border-blue-200 dark:border-blue-700">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center">
            <Lightbulb className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
            Tujuan Website
          </h3>
          <ul className="mt-3 space-y-2 text-slate-600 dark:text-slate-300">
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
              <span>Memfasilitasi PPK dalam memberikan penilaian kepada penyedia barang/jasa</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
              <span>Memberikan data terpusat untuk analisis performa penyedia</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
              <span>Menjamin akuntabilitas dan transparansi dalam proses pengadaan</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
              <span>Mengintegrasikan data kontrak dengan proses penilaian</span>
            </li>
          </ul>
        </div>

        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-6 rounded-2xl border border-indigo-200 dark:border-indigo-700">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center">
            <Users className="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400" />
            Audiens Panduan
          </h3>
          <ul className="mt-3 space-y-2 text-slate-600 dark:text-slate-300">
            <li className="flex items-start">
              <ChevronRight className="h-5 w-5 text-indigo-500 mt-0.5 mr-2 flex-shrink-0" />
              <span>Pejabat Pembuat Komitmen (PPK) yang terdaftar dalam sistem</span>
            </li>
            <li className="flex items-start">
              <ChevronRight className="h-5 w-5 text-indigo-500 mt-0.5 mr-2 flex-shrink-0" />
              <span>Staf administrasi Kementerian Ketenagakerjaan</span>
            </li>
            <li className="flex items-start">
              <ChevronRight className="h-5 w-5 text-indigo-500 mt-0.5 mr-2 flex-shrink-0" />
              <span>Pengguna sistem yang membutuhkan informasi tentang penilaian penyedia</span>
            </li>
          </ul>
        </div>
      </div>
    )
  },
  {
    id: "navigasi",
    title: "Struktur Website & Navigasi",
    icon: <Layers className="h-6 w-6" />,
    content: (
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-slate-800 dark:text-white">4.1 Tampilan Halaman Utama</h3>
        <div className="relative h-64 rounded-xl overflow-hidden mb-6">
          <Image 
            src="/img/halaman-utama.jpg" 
            alt="Tampilan Halaman Utama Sistem" 
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          <div className="absolute bottom-4 left-4 text-white">
            <h4 className="text-lg font-semibold">Tampilan Halaman Utama</h4>
            <p className="text-sm opacity-90">Antarmuka modern dan intuitif</p>
          </div>
        </div>
        <p className="text-slate-600 dark:text-slate-300">
          Saat pertama mengakses sistem, Anda akan melihat tampilan utama yang terdiri dari:
        </p>
        <ul className="space-y-2 text-slate-600 dark:text-slate-300 ml-4">
          <li className="flex items-start">
            <Building2 className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
            <span><strong>Hero Section:</strong> Gambaran umum sistem dan tombol akses cepat</span>
          </li>
          <li className="flex items-start">
            <BarChart3 className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
            <span><strong>Statistik Dashboard:</strong> Menampilkan jumlah total penyedia, penilaian, PPK aktif, dan rata-rata skor</span>
          </li>
          <li className="flex items-start">
            <TrendingUp className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
            <span><strong>Gambaran Kinerja:</strong> Informasi tentang penyedia terbaik minggu ini dan tren kinerja</span>
          </li>
          <li className="flex items-start">
            <Search className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
            <span><strong>Fitur Pencarian:</strong> Mencari penyedia barang/jasa</span>
          </li>
          <li className="flex items-start">
            <ChevronRight className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
            <span><strong>Aksi Cepat:</strong> Tautan menuju penilaian, laporan, dan dashboard</span>
          </li>
          <li className="flex items-start">
            <Mail className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
            <span><strong>Form Kontak:</strong> Informasi untuk menghubungi admin sistem</span>
          </li>
        </ul>
        
        <h3 className="text-xl font-semibold text-slate-800 dark:text-white mt-8">4.2 Menu Navigasi Utama</h3>
        <p className="text-slate-600 dark:text-slate-300">
          Sistem memiliki menu navigasi utama yang dapat diakses dari bagian atas halaman:
        </p>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 mt-4">
          <ul className="space-y-4">
            <li className="flex items-start">
              <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mr-3 mt-0.5">
                1
              </div>
              <div>
                <h4 className="font-medium text-slate-800 dark:text-white">Beranda</h4>
                <p className="text-slate-600 dark:text-slate-400">(<code className="bg-slate-100 dark:bg-slate-700 px-1 rounded">/</code>): Kembali ke halaman utama</p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mr-3 mt-0.5">
                2
              </div>
              <div>
                <h4 className="font-medium text-slate-800 dark:text-white">Penilaian</h4>
                <p className="text-slate-600 dark:text-slate-400">(<code className="bg-slate-100 dark:bg-slate-700 px-1 rounded">/penilaian</code>): Akses ke fitur penilaian penyedia</p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mr-3 mt-0.5">
                3
              </div>
              <div>
                <h4 className="font-medium text-slate-800 dark:text-white">Laporan</h4>
                <p className="text-slate-600 dark:text-slate-400">(<code className="bg-slate-100 dark:bg-slate-700 px-1 rounded">/laporan</code>): Akses ke laporan dan statistik penilaian</p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mr-3 mt-0.5">
                4
              </div>
              <div>
                <h4 className="font-medium text-slate-800 dark:text-white">Dashboard</h4>
                <p className="text-slate-600 dark:text-slate-400">(<code className="bg-slate-100 dark:bg-slate-700 px-1 rounded">/dashboard</code>): Tampilan analitik interaktif</p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mr-3 mt-0.5">
                5
              </div>
              <div>
                <h4 className="font-medium text-slate-800 dark:text-white">Toggle Tema</h4>
                <p className="text-slate-600 dark:text-slate-400">Mengganti antara mode terang dan gelap</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    )
  },
  {
    id: "penilaian",
    title: "Fungsionalitas Penilaian",
    icon: <FileText className="h-6 w-6" />,
    content: (
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-slate-800 dark:text-white">5.1 Penilaian Penyedia</h3>
        <div className="relative h-48 rounded-xl overflow-hidden mb-6">
          <Image 
            src="/img/penilaian-proses.jpg" 
            alt="Proses Penilaian Penyedia" 
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          <div className="absolute bottom-4 left-4 text-white">
            <h4 className="font-semibold">Proses Penilaian Penyedia</h4>
            <p className="text-sm opacity-90">Evaluasi kinerja secara objektif dan terstruktur</p>
          </div>
        </div>
        <p className="text-slate-600 dark:text-slate-300">
          Fitur penilaian memungkinkan PPK memberikan penilaian terhadap penyedia barang/jasa. Proses penilaian terdiri dari beberapa langkah utama:
        </p>
        
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">5.1.1 Autentikasi PPK</h3>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-0.5">
                1
              </div>
              <div className="ml-4">
                <h4 className="font-medium text-slate-800 dark:text-white">Navigasi ke Halaman Penilaian</h4>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                  Gunakan menu navigasi atas untuk mengakses halaman <strong>Penilaian</strong>.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-0.5">
                2
              </div>
              <div className="ml-4">
                <h4 className="font-medium text-slate-800 dark:text-white">Formulir Autentikasi</h4>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                  Masukkan informasi PPK berikut:
                </p>
                <ul className="mt-2 space-y-1 text-slate-600 dark:text-slate-400 ml-4">
                  <li className="flex items-center">
                    <ChevronRight className="h-4 w-4 text-blue-500 mr-2" />
                    <strong>NIP:</strong> Nomor Induk Pegawai Anda
                  </li>
                  <li className="flex items-center">
                    <ChevronRight className="h-4 w-4 text-blue-500 mr-2" />
                    <strong>Eselon I:</strong> Pilih Eselon I dari dropdown
                  </li>
                  <li className="flex items-center">
                    <ChevronRight className="h-4 w-4 text-blue-500 mr-2" />
                    <strong>Satuan Kerja:</strong> Pilih Satuan Kerja dari dropdown yang tersedia
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-700">
              <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 flex items-center">
                <Lightbulb className="h-5 w-5 mr-2" />
                Catatan Penting: Sistem hanya akan menampilkan paket kontrak yang sesuai dengan satuan kerja Anda, kecuali Anda memiliki akses admin.
              </h4>
            </div>

            <div className="flex items-start">
              <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-0.5">
                3
              </div>
              <div className="ml-4">
                <h4 className="font-medium text-slate-800 dark:text-white">Masuk ke Sistem</h4>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                  Klik tombol <strong>Masuk</strong> untuk mengotentikasi diri. Setelah sukses, Anda akan diarahkan ke form penilaian.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">5.1.2 Mencari dan Memilih Paket Kontrak</h3>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-0.5">
                1
              </div>
              <div className="ml-4">
                <h4 className="font-medium text-slate-800 dark:text-white">Daftar Paket Kontrak</h4>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                  Setelah login, Anda akan melihat daftar paket kontrak.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-0.5">
                2
              </div>
              <div className="ml-4">
                <h4 className="font-medium text-slate-800 dark:text-white">Fitur Pencarian</h4>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                  Gunakan fitur pencarian untuk menemukan paket secara cepat.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-0.5">
                3
              </div>
              <div className="ml-4">
                <h4 className="font-medium text-slate-800 dark:text-white">Filter Paket</h4>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                  Gunakan filter untuk menampilkan paket yang sudah dinilai atau belum dinilai.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-0.5">
                4
              </div>
              <div className="ml-4">
                <h4 className="font-medium text-slate-800 dark:text-white">Pilih Paket</h4>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                  Klik pada kartu paket untuk memilihnya sebagai objek penilaian.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-0.5">
                5
              </div>
              <div className="ml-4">
                <h4 className="font-medium text-slate-800 dark:text-white">Lanjutkan Proses</h4>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                  Klik <strong>Lanjut</strong> untuk melanjutkan ke informasi paket.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">5.1.3 Informasi Paket dan Penyedia</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-slate-800 dark:text-white mb-3">Detail Paket Kontrak:</h4>
              <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                <li className="flex items-center">
                  <FileText className="h-4 w-4 text-blue-500 mr-2" />
                  <span>Nama paket dan kode paket</span>
                </li>
                <li className="flex items-center">
                  <Coins className="h-4 w-4 text-blue-500 mr-2" />
                  <span>Nilai kontrak</span>
                </li>
                <li className="flex items-center">
                  <Calendar className="h-4 w-4 text-blue-500 mr-2" />
                  <span>Tahun anggaran</span>
                </li>
                <li className="flex items-center">
                  <Package className="h-4 w-4 text-blue-500 mr-2" />
                  <span>Metode pemilihan</span>
                </li>
                <li className="flex items-center">
                  <Tag className="h-4 w-4 text-blue-500 mr-2" />
                  <span>Status tender</span>
                </li>
                <li className="flex items-center">
                  <Globe className="h-4 w-4 text-blue-500 mr-2" />
                  <span>Lokasi pekerjaan</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-slate-800 dark:text-white mb-3">Detail Penyedia:</h4>
              <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                <li className="flex items-center">
                  <Building className="h-4 w-4 text-blue-500 mr-2" />
                  <span>Nama perusahaan</span>
                </li>
                <li className="flex items-center">
                  <User className="h-4 w-4 text-blue-500 mr-2" />
                  <span>Kode dan NPWP penyedia</span>
                </li>
                <li className="flex items-center">
                  <FileText className="h-4 w-4 text-blue-500 mr-2" />
                  <span>Status penilaian</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">5.1.4 Pertanyaan Pemutusan Kontrak</h3>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-0.5">
                1
              </div>
              <div className="ml-4">
                <h4 className="font-medium text-slate-800 dark:text-white">Pertanyaan Sistem</h4>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                  Sistem akan menanyakan: <strong>"Apakah terjadi pemutusan kontrak secara sepihak oleh Pejabat Pembuat Komitmen (PPK) karena kesalahan Penyedia?"</strong>
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-0.5">
                2
              </div>
              <div className="ml-4">
                <h4 className="font-medium text-slate-800 dark:text-white">Pemutusan Kontrak Terjadi</h4>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                  Jika memilih <strong>Ya, terjadi pemutusan kontrak</strong> karena kesalahan Penyedia:
                </p>
                <ul className="mt-2 space-y-1 text-slate-600 dark:text-slate-400 ml-4">
                  <li className="flex items-start">
                    <ChevronRight className="h-4 w-4 text-red-500 mr-2 mt-1 flex-shrink-0" />
                    <span>Semua aspek penilaian akan otomatis menjadi skor 0</span>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="h-4 w-4 text-red-500 mr-2 mt-1 flex-shrink-0" />
                    <span>Penilaian akhir akan menjadi "Buruk"</span>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="h-4 w-4 text-red-500 mr-2 mt-1 flex-shrink-0" />
                    <span>Wajib mengisi keterangan pemutusan kontrak</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-0.5">
                3
              </div>
              <div className="ml-4">
                <h4 className="font-medium text-slate-800 dark:text-white">Tidak Ada Pemutusan Kontrak</h4>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                  Jika memilih <strong>Tidak, kontrak berjalan normal</strong>:
                </p>
                <ul className="mt-2 space-y-1 text-slate-600 dark:text-slate-400 ml-4">
                  <li className="flex items-start">
                    <ChevronRight className="h-4 w-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                    <span>Anda dapat melanjutkan ke penilaian normal</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">5.1.5 Proses Penilaian</h3>
          
          <p className="text-slate-600 dark:text-slate-300 mb-4">
            Sistem menggunakan 4 kriteria penilaian sesuai standar LKPP:
          </p>
          
          <div className="space-y-6">
            <div className="border-l-4 border-blue-500 pl-4 py-1">
              <h4 className="font-medium text-slate-800 dark:text-white">1. Kualitas dan Kuantitas Pekerjaan (Bobot: 30%)</h4>
              <div className="mt-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border border-slate-200 dark:border-slate-700 p-3 rounded-lg">
                    <div className="font-medium text-yellow-700 dark:text-yellow-300 flex items-center justify-between">
                      <span>Cukup (1)</span>
                      <Star className="h-4 w-4 text-yellow-500" />
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Lebih dari 50% hasil pekerjaan memerlukan perbaikan/penggantian</p>
                  </div>
                  <div className="border border-slate-200 dark:border-slate-700 p-3 rounded-lg">
                    <div className="font-medium text-blue-700 dark:text-blue-300 flex items-center justify-between">
                      <span>Baik (2)</span>
                      <Star className="h-4 w-4 text-blue-500" />
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Kurang dari atau sama dengan 50% hasil pekerjaan memerlukan perbaikan</p>
                  </div>
                  <div className="border border-slate-200 dark:border-slate-700 p-3 rounded-lg">
                    <div className="font-medium text-green-700 dark:text-green-300 flex items-center justify-between">
                      <span>Sangat Baik (3)</span>
                      <Star className="h-4 w-4 text-green-500" />
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Hasil pekerjaan sesuai kontrak tanpa perlu perbaikan</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-l-4 border-green-500 pl-4 py-1">
              <h4 className="font-medium text-slate-800 dark:text-white">2. Biaya (Bobot: 20%)</h4>
              <div className="mt-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border border-slate-200 dark:border-slate-700 p-3 rounded-lg">
                    <div className="font-medium text-yellow-700 dark:text-yellow-300 flex items-center justify-between">
                      <span>Cukup (1)</span>
                      <Star className="h-4 w-4 text-yellow-500" />
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Pengendalian biaya buruk, banyak perubahan kontrak</p>
                  </div>
                  <div className="border border-slate-200 dark:border-slate-700 p-3 rounded-lg">
                    <div className="font-medium text-blue-700 dark:text-blue-300 flex items-center justify-between">
                      <span>Baik (2)</span>
                      <Star className="h-4 w-4 text-blue-500" />
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Pengendalian biaya cukup baik, beberapa perubahan kontrak</p>
                  </div>
                  <div className="border border-slate-200 dark:border-slate-700 p-3 rounded-lg">
                    <div className="font-medium text-green-700 dark:text-green-300 flex items-center justify-between">
                      <span>Sangat Baik (3)</span>
                      <Star className="h-4 w-4 text-green-500" />
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Pengendalian biaya baik, tidak ada perubahan kontrak</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-l-4 border-purple-500 pl-4 py-1">
              <h4 className="font-medium text-slate-800 dark:text-white">3. Waktu (Bobot: 30%)</h4>
              <div className="mt-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border border-slate-200 dark:border-slate-700 p-3 rounded-lg">
                    <div className="font-medium text-yellow-700 dark:text-yellow-300 flex items-center justify-between">
                      <span>Cukup (1)</span>
                      <Star className="h-4 w-4 text-yellow-500" />
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Penyelesaian terlambat lebih dari 50 hari dari waktu kontrak</p>
                  </div>
                  <div className="border border-slate-200 dark:border-slate-700 p-3 rounded-lg">
                    <div className="font-medium text-blue-700 dark:text-blue-300 flex items-center justify-between">
                      <span>Baik (2)</span>
                      <Star className="h-4 w-4 text-blue-500" />
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Penyelesaian terlambat hingga 50 hari dari waktu kontrak</p>
                  </div>
                  <div className="border border-slate-200 dark:border-slate-700 p-3 rounded-lg">
                    <div className="font-medium text-green-700 dark:text-green-300 flex items-center justify-between">
                      <span>Sangat Baik (3)</span>
                      <Star className="h-4 w-4 text-green-500" />
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Penyelesaian sesuai atau lebih cepat dari waktu kontrak</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-l-4 border-yellow-500 pl-4 py-1">
              <h4 className="font-medium text-slate-800 dark:text-white">4. Layanan (Bobot: 20%)</h4>
              <div className="mt-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border border-slate-200 dark:border-slate-700 p-3 rounded-lg">
                    <div className="font-medium text-yellow-700 dark:text-yellow-300 flex items-center justify-between">
                      <span>Cukup (1)</span>
                      <Star className="h-4 w-4 text-yellow-500" />
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Responsivitas dan kualitas layanan rendah</p>
                  </div>
                  <div className="border border-slate-200 dark:border-slate-700 p-3 rounded-lg">
                    <div className="font-medium text-blue-700 dark:text-blue-300 flex items-center justify-between">
                      <span>Baik (2)</span>
                      <Star className="h-4 w-4 text-blue-500" />
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Responsivitas dan kualitas layanan cukup baik</p>
                  </div>
                  <div className="border border-slate-200 dark:border-slate-700 p-3 rounded-lg">
                    <div className="font-medium text-green-700 dark:text-green-300 flex items-center justify-between">
                      <span>Sangat Baik (3)</span>
                      <Star className="h-4 w-4 text-green-500" />
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Responsivitas dan kualitas layanan sangat baik</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-700">
            <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 flex items-center">
              <Lightbulb className="h-5 w-5 mr-2" />
              Catatan: Skor total dihitung dengan rumus: (Kualitas×30%) + (Biaya×20%) + (Waktu×30%) + (Layanan×20%)
            </h4>
          </div>
        </div>
      </div>
    )
  },
  {
    id: "laporan",
    title: "Laporan & Dashboard",
    icon: <BarChart3 className="h-6 w-6" />,
    content: (
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-slate-800 dark:text-white">6.1 Laporan Penilaian</h3>
        <div className="relative h-48 rounded-xl overflow-hidden mb-6">
          <Image 
            src="/img/laporan-dashboard.jpg" 
            alt="Laporan dan Dashboard Sistem" 
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          <div className="absolute bottom-4 left-4 text-white">
            <h4 className="font-semibold">Laporan & Dashboard Analitik</h4>
            <p className="text-sm opacity-90">Visualisasi data dan analisis kinerja</p>
          </div>
        </div>
        <p className="text-slate-600 dark:text-slate-300">
          Halaman laporan menyediakan informasi komprehensif tentang hasil penilaian:
        </p>
        
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">6.1.1 Statistik Umum</h3>
          <ul className="space-y-2 text-slate-600 dark:text-slate-400">
            <li className="flex items-center">
              <Building2 className="h-5 w-5 text-blue-500 mr-2" />
              <span><strong>Total Penyedia:</strong> Jumlah seluruh penyedia terdaftar</span>
            </li>
            <li className="flex items-center">
              <FileText className="h-5 w-5 text-blue-500 mr-2" />
              <span><strong>Total Penilaian:</strong> Jumlah total penilaian yang telah diberikan</span>
            </li>
            <li className="flex items-center">
              <Users className="h-5 w-5 text-blue-500 mr-2" />
              <span><strong>PPK Aktif:</strong> Jumlah PPK yang telah login dan memberikan penilaian</span>
            </li>
          </ul>
        </div>
        
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">6.1.2 Distribusi Rating</h3>
          <p className="text-slate-600 dark:text-slate-300">
            Menampilkan distribusi penilaian berdasarkan skala 1-5 bintang dan menunjukkan persentase penyedia pada setiap tingkatan rating.
          </p>
        </div>
        
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">6.1.3 Fitur Pencarian dan Filter</h3>
          <div className="space-y-4">
            <div className="flex items-start">
              <Search className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-slate-800 dark:text-white">Pencarian</h4>
                <p className="text-slate-600 dark:text-slate-400">
                  Gunakan kolom pencarian untuk mencari penyedia berdasarkan nama perusahaan atau NPWP
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <Filter className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-slate-800 dark:text-white">Filter Status</h4>
                <p className="text-slate-600 dark:text-slate-400">
                  Filter berdasarkan kategori penilaian (Sangat Baik, Baik, Cukup, Buruk)
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <FileText className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-slate-800 dark:text-white">Filter Penilaian</h4>
                <p className="text-slate-600 dark:text-slate-400">
                  Tampilkan hanya penyedia yang sudah dinilai atau belum dinilai
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <TrendingUp className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-slate-800 dark:text-white">Urutan Penilaian</h4>
                <p className="text-slate-600 dark:text-slate-400">
                  Pilih untuk mengurutkan berdasarkan nama, rating, tanggal penilaian, atau jumlah penilaian
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">6.1.4 Detail Penyedia</h3>
          <p className="text-slate-600 dark:text-slate-300">
            Klik pada kartu penyedia untuk melihat detail penilaian. Informasi lengkap termasuk:
          </p>
          <ul className="mt-3 space-y-2 text-slate-600 dark:text-slate-400 ml-4">
            <li className="flex items-center">
              <Building2 className="h-4 w-4 text-blue-500 mr-2" />
              <span>Profil penyedia lengkap</span>
            </li>
            <li className="flex items-center">
              <FileText className="h-4 w-4 text-blue-500 mr-2" />
              <span>Riwayat penilaian</span>
            </li>
            <li className="flex items-center">
              <Star className="h-4 w-4 text-blue-500 mr-2" />
              <span>Skor per kriteria</span>
            </li>
            <li className="flex items-center">
              <FileText className="h-4 w-4 text-blue-500 mr-2" />
              <span>Komentar PPK</span>
            </li>
          </ul>
        </div>
        
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">6.1.5 Ekspor Data</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-slate-200 dark:border-slate-700 p-4 rounded-lg">
              <div className="flex items-center">
                <Download className="h-5 w-5 text-blue-500 mr-2" />
                <h4 className="font-medium text-slate-800 dark:text-white">Export CSV</h4>
              </div>
              <p className="text-slate-600 dark:text-slate-400 mt-2">
                Unduh laporan dalam format CSV. Data yang diekspor mencakup informasi detail setiap penyedia dan penilaian.
              </p>
            </div>
            <div className="border border-slate-200 dark:border-slate-700 p-4 rounded-lg">
              <div className="flex items-center">
                <Download className="h-5 w-5 text-blue-500 mr-2" />
                <h4 className="font-medium text-slate-800 dark:text-white">Export Excel</h4>
              </div>
              <p className="text-slate-600 dark:text-slate-400 mt-2">
                Unduh laporan dalam format Excel. Data yang diekspor mencakup informasi detail setiap penyedia dan penilaian.
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 p-6 rounded-2xl border border-purple-200 dark:border-purple-700">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">6.2 Dashboard Analitik</h3>
          <p className="text-slate-600 dark:text-slate-300 mb-4">
            Dashboard menyediakan tampilan visualisasi data penilaian melalui Google Looker Studio:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-slate-800 dark:text-white flex items-center">
                <RefreshCw className="h-4 w-4 text-purple-500 mr-2" />
                <span>Kontrol Dashboard</span>
              </h4>
              <ul className="mt-2 space-y-2 text-slate-600 dark:text-slate-400 ml-4">
                <li className="flex items-center">
                  <ChevronRight className="h-4 w-4 text-purple-500 mr-2" />
                  <span><strong>Refresh Dashboard:</strong> Perbarui tampilan data secara real-time</span>
                </li>
                <li className="flex items-center">
                  <ChevronRight className="h-4 w-4 text-purple-500 mr-2" />
                  <span><strong>Buka di Tab Baru:</strong> Membuka dashboard di jendela baru untuk tampilan lebih lebar</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-slate-800 dark:text-white flex items-center">
                <TrendingUp className="h-4 w-4 text-purple-500 mr-2" />
                <span>Fitur Dashboard</span>
              </h4>
              <ul className="mt-2 space-y-2 text-slate-600 dark:text-slate-400 ml-4">
                <li className="flex items-center">
                  <ChevronRight className="h-4 w-4 text-purple-500 mr-2" />
                  <span><strong>Real-time Analytics:</strong> Data terintegrasi secara langsung dengan Google Spreadsheet</span>
                </li>
                <li className="flex items-center">
                  <ChevronRight className="h-4 w-4 text-purple-500 mr-2" />
                  <span><strong>Visualisasi Interaktif:</strong> Grafik dan chart yang bisa diinteraksi</span>
                </li>
                <li className="flex items-center">
                  <ChevronRight className="h-4 w-4 text-purple-500 mr-2" />
                  <span><strong>Multi-User Access:</strong> Akses bisa dibagikan ke berbagai stakeholder</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: "pencarian",
    title: "Fitur Pencarian",
    icon: <Search className="h-6 w-6" />,
    content: (
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-slate-800 dark:text-white">7.1 Fitur Pencarian</h3>
        <div className="relative h-48 rounded-xl overflow-hidden mb-6">
          <Image 
            src="/img/fitur-pencarian.jpg" 
            alt="Fitur Pencarian Sistem" 
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          <div className="absolute bottom-4 left-4 text-white">
            <h4 className="font-semibold">Fitur Pencarian Canggih</h4>
            <p className="text-sm opacity-90">Temukan data yang Anda butuhkan dengan cepat</p>
          </div>
        </div>
        <p className="text-slate-600 dark:text-slate-300">
          Sistem menyediakan fitur pencarian yang komprehensif:
        </p>
        
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">7.1.1 Pencarian Penyedia</h3>
          <ul className="space-y-2 text-slate-600 dark:text-slate-400">
            <li className="flex items-center">
              <Building2 className="h-5 w-5 text-blue-500 mr-2" />
              <span>Pencarian berdasarkan nama perusahaan</span>
            </li>
            <li className="flex items-center">
              <FileText className="h-5 w-5 text-blue-500 mr-2" />
              <span>Pencarian berdasarkan NPWP</span>
            </li>
            <li className="flex items-center">
              <FileText className="h-5 w-5 text-blue-500 mr-2" />
              <span>Pencarian berdasarkan kode paket atau kode RUP</span>
            </li>
          </ul>
        </div>
        
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">7.1.2 Pencarian di Berbagai Halaman</h3>
          <ul className="space-y-2 text-slate-600 dark:text-slate-400">
            <li className="flex items-center">
              <Search className="h-5 w-5 text-blue-500 mr-2" />
              <span>Pencarian tersedia di halaman Laporan</span>
            </li>
            <li className="flex items-center">
              <Search className="h-5 w-5 text-blue-500 mr-2" />
              <span>Pencarian tersedia di halaman Penilaian (untuk mencari paket)</span>
            </li>
            <li className="flex items-center">
              <Filter className="h-5 w-5 text-blue-500 mr-2" />
              <span>Filter yang membantu mempersempit hasil pencarian</span>
            </li>
          </ul>
        </div>
      </div>
    )
  },
  {
    id: "login",
    title: "Proses Login & Logout",
    icon: <Shield className="h-6 w-6" />,
    content: (
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-slate-800 dark:text-white">8.1 Proses Login dan Logout PPK</h3>
        <div className="relative h-48 rounded-xl overflow-hidden mb-6">
          <Image 
            src="/img/login-process.jpg" 
            alt="Proses Login dan Logout" 
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          <div className="absolute bottom-4 left-4 text-white">
            <h4 className="font-semibold">Proses Otentikasi Keamanan</h4>
            <p className="text-sm opacity-90">Login dan logout yang aman untuk PPK</p>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">8.1.1 Login PPK</h3>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-0.5">
                1
              </div>
              <div className="ml-4">
                <h4 className="font-medium text-slate-800 dark:text-white">Akses Halaman Penilaian</h4>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                  Navigasikan ke halaman <strong>Penilaian</strong> menggunakan menu atas.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-0.5">
                2
              </div>
              <div className="ml-4">
                <h4 className="font-medium text-slate-800 dark:text-white">Masukkan Informasi PPK</h4>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                  Masukkan informasi PPK (NIP, Eselon I, Satuan Kerja).
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-0.5">
                3
              </div>
              <div className="ml-4">
                <h4 className="font-medium text-slate-800 dark:text-white">Validasi Informasi</h4>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                  Sistem akan memvalidasi informasi dengan database PPK.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-0.5">
                4
              </div>
              <div className="ml-4">
                <h4 className="font-medium text-slate-800 dark:text-white">Akses Form Penilaian</h4>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                  Jika valid, Anda dapat mengakses form penilaian.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">8.1.2 Logout PPK</h3>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-0.5">
                1
              </div>
              <div className="ml-4">
                <h4 className="font-medium text-slate-800 dark:text-white">Klik Tombol Keluar</h4>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                  Di halaman penilaian, klik tombol <strong>Keluar</strong> di pojok kanan atas.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-0.5">
                2
              </div>
              <div className="ml-4">
                <h4 className="font-medium text-slate-800 dark:text-white">Konfirmasi Logout</h4>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                  Konfirmasi logout untuk mengakhiri sesi.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: "konsep",
    title: "Konsep & Terminologi",
    icon: <HelpCircle className="h-6 w-6" />,
    content: (
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-slate-800 dark:text-white">9.1 Terminologi Utama</h3>
        <div className="relative h-48 rounded-xl overflow-hidden mb-6">
          <Image 
            src="/img/terminologi.jpg" 
            alt="Konsep dan Terminologi" 
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          <div className="absolute bottom-4 left-4 text-white">
            <h4 className="font-semibold">Pengertian dan Istilah Kunci</h4>
            <p className="text-sm opacity-90">Pahami konsep dasar sistem</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Definisi Umum</h3>
            <div className="space-y-4">
              <div>
                <p className="font-medium text-slate-800 dark:text-white">PPK (Pejabat Pembuat Komitmen)</p>
                <p className="text-slate-600 dark:text-slate-400 text-sm">Pejabat yang bertugas melaksanakan pengadaan barang/jasa</p>
              </div>
              <div>
                <p className="font-medium text-slate-800 dark:text-white">LKPP</p>
                <p className="text-slate-600 dark:text-slate-400 text-sm">Lembaga Kebijakan Pengadaan Barang/Jasa Pemerintah</p>
              </div>
              <div>
                <p className="font-medium text-slate-800 dark:text-white">UKPBJ</p>
                <p className="text-slate-600 dark:text-slate-400 text-sm">Unit Pengadaan Barang/Jasa</p>
              </div>
              <div>
                <p className="font-medium text-slate-800 dark:text-white">Penilaian</p>
                <p className="text-slate-600 dark:text-slate-400 text-sm">Proses evaluasi kinerja penyedia berdasarkan kriteria yang ditentukan</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Istilah Teknis</h3>
            <div className="space-y-4">
              <div>
                <p className="font-medium text-slate-800 dark:text-white">Skor Total</p>
                <p className="text-slate-600 dark:text-slate-400 text-sm">Skor akhir yang dihitung dari kombinasi skor kriteria dengan bobot masing-masing</p>
              </div>
              <div>
                <p className="font-medium text-slate-800 dark:text-white">Penilaian Akhir</p>
                <p className="text-slate-600 dark:text-slate-400 text-sm">Kategori hasil penilaian (Buruk, Cukup, Baik, Sangat Baik)</p>
              </div>
              <div>
                <p className="font-medium text-slate-800 dark:text-white">Pemutusan Kontrak</p>
                <p className="text-slate-600 dark:text-slate-400 text-sm">Penghentian kontrak secara sepihak oleh PPK karena kesalahan Penyedia</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">9.2 Skala Penilaian</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-slate-200 dark:border-slate-700 p-4 rounded-lg">
              <div className="font-medium text-yellow-700 dark:text-yellow-300 flex items-center justify-between">
                <span>Cukup (1)</span>
                <Star className="h-4 w-4 text-yellow-500" />
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Memenuhi syarat minimum yang ditentukan</p>
            </div>
            <div className="border border-slate-200 dark:border-slate-700 p-4 rounded-lg">
              <div className="font-medium text-blue-700 dark:text-blue-300 flex items-center justify-between">
                <span>Baik (2)</span>
                <Star className="h-4 w-4 text-blue-500" />
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Melampaui syarat minimum dengan kinerja yang memuaskan</p>
            </div>
            <div className="border border-slate-200 dark:border-slate-700 p-4 rounded-lg">
              <div className="font-medium text-green-700 dark:text-green-300 flex items-center justify-between">
                <span>Sangat Baik (3)</span>
                <Star className="h-4 w-4 text-green-500" />
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Kinerja yang sangat memuaskan dan melebihi ekspektasi</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">9.3 Ikon dan Simbol</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="flex flex-col items-center p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
              <Building2 className="h-8 w-8 text-blue-500 mb-2" />
              <span className="text-xs text-center text-slate-600 dark:text-slate-400">Penyedia</span>
            </div>
            <div className="flex flex-col items-center p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
              <BarChart3 className="h-8 w-8 text-green-500 mb-2" />
              <span className="text-xs text-center text-slate-600 dark:text-slate-400">Statistik</span>
            </div>
            <div className="flex flex-col items-center p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
              <FileText className="h-8 w-8 text-purple-500 mb-2" />
              <span className="text-xs text-center text-slate-600 dark:text-slate-400">Formulir</span>
            </div>
            <div className="flex flex-col items-center p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
              <Users className="h-8 w-8 text-indigo-500 mb-2" />
              <span className="text-xs text-center text-slate-600 dark:text-slate-400">PPK</span>
            </div>
            <div className="flex flex-col items-center p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
              <Star className="h-8 w-8 text-yellow-500 mb-2" />
              <span className="text-xs text-center text-slate-600 dark:text-slate-400">Rating</span>
            </div>
            <div className="flex flex-col items-center p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
              <TrendingUp className="h-8 w-8 text-teal-500 mb-2" />
              <span className="text-xs text-center text-slate-600 dark:text-slate-400">Tren</span>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: "lanjutan",
    title: "Fitur Lanjutan",
    icon: <Layers className="h-6 w-6" />,
    content: (
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-slate-800 dark:text-white">10.1 Penilaian oleh Admin</h3>
        <div className="relative h-48 rounded-xl overflow-hidden mb-6">
          <Image 
            src="/img/admin-akses.jpg" 
            alt="Fitur Akses Admin" 
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          <div className="absolute bottom-4 left-4 text-white">
            <h4 className="font-semibold">Hak Akses Administratif</h4>
            <p className="text-sm opacity-90">Manajemen sistem dan aksesibilitas tingkat lanjut</p>
          </div>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl border border-blue-200 dark:border-blue-700">
          <p className="text-slate-600 dark:text-slate-300">
            User dengan <code className="bg-slate-100 dark:bg-slate-700 px-1 rounded">satuanKerjaDetail = "ADMIN"</code> memiliki akses ke semua paket:
          </p>
          <ul className="mt-3 space-y-2 text-slate-600 dark:text-slate-300 ml-4">
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
              <span>Dapat menilai semua penyedia tanpa batasan unit kerja</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
              <span>Digunakan untuk testing dan manajemen sistem</span>
            </li>
          </ul>
        </div>

        <h3 className="text-xl font-semibold text-slate-800 dark:text-white mt-8">10.2 Fitur Responsif Mobile</h3>
        <div className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 p-6 rounded-2xl border border-green-200 dark:border-teal-700">
          <div className="flex items-start">
            <Smartphone className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <p className="text-slate-600 dark:text-slate-300">
                Sistem dapat diakses melalui smartphone dan tablet:
              </p>
              <ul className="mt-2 space-y-1 text-slate-600 dark:text-slate-400 ml-1">
                <li className="flex items-start">
                  <ChevronRight className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Desain responsif untuk pengalaman pengguna optimal</span>
                </li>
                <li className="flex items-start">
                  <ChevronRight className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Fitur dan fungsi tetap tersedia secara penuh di perangkat mobile</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold text-slate-800 dark:text-white mt-8">10.3 Integrasi Google Sheets</h3>
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 p-6 rounded-2xl border border-purple-200 dark:border-indigo-700">
          <div className="flex items-start">
            <Database className="h-5 w-5 text-purple-500 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <p className="text-slate-600 dark:text-slate-300">
                Sistem terintegrasi langsung dengan Google Sheets:
              </p>
              <ul className="mt-2 space-y-1 text-slate-600 dark:text-slate-400 ml-1">
                <li className="flex items-start">
                  <ChevronRight className="h-4 w-4 text-purple-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Data disimpan secara real-time di Google Sheets</span>
                </li>
                <li className="flex items-start">
                  <ChevronRight className="h-4 w-4 text-purple-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Sinkronisasi otomatis antara sistem dan database</span>
                </li>
                <li className="flex items-start">
                  <ChevronRight className="h-4 w-4 text-purple-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Memungkinkan manajemen data yang mudah melalui antarmuka Google Sheets</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: "bantuan",
    title: "Dukungan & Bantuan",
    icon: <Mail className="h-6 w-6" />,
    content: (
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-slate-800 dark:text-white">11.1 Halaman FAQ</h3>
        <div className="relative h-48 rounded-xl overflow-hidden mb-6">
          <Image 
            src="/img/dukungan-bantuan.jpg" 
            alt="Dukungan dan Bantuan" 
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          <div className="absolute bottom-4 left-4 text-white">
            <h4 className="font-semibold">Pusat Bantuan dan Dukungan</h4>
            <p className="text-sm opacity-90">Temukan jawaban dan bantuan yang Anda butuhkan</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
          <p className="text-slate-600 dark:text-slate-300 mb-4">
            Kunjungi halaman <strong>FAQ</strong> untuk jawaban atas pertanyaan umum:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-slate-200 dark:border-slate-700 p-4 rounded-lg">
              <h4 className="font-medium text-slate-800 dark:text-white mb-2">Kategori Umum</h4>
              <ul className="space-y-1 text-slate-600 dark:text-slate-400">
                <li className="flex items-center">
                  <ChevronRight className="h-4 w-4 text-blue-500 mr-2" />
                  <span>Umum</span>
                </li>
                <li className="flex items-center">
                  <ChevronRight className="h-4 w-4 text-blue-500 mr-2" />
                  <span>Autentikasi</span>
                </li>
                <li className="flex items-center">
                  <ChevronRight className="h-4 w-4 text-blue-500 mr-2" />
                  <span>Penilaian</span>
                </li>
              </ul>
            </div>
            <div className="border border-slate-200 dark:border-slate-700 p-4 rounded-lg">
              <h4 className="font-medium text-slate-800 dark:text-white mb-2">Kategori Spesifik</h4>
              <ul className="space-y-1 text-slate-600 dark:text-slate-400">
                <li className="flex items-center">
                  <ChevronRight className="h-4 w-4 text-blue-500 mr-2" />
                  <span>Data dan Laporan</span>
                </li>
                <li className="flex items-center">
                  <ChevronRight className="h-4 w-4 text-blue-500 mr-2" />
                  <span>Teknis</span>
                </li>
                <li className="flex items-center">
                  <ChevronRight className="h-4 w-4 text-blue-500 mr-2" />
                  <span>Bantuan dan Dukungan</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">11.2 Cara Menghubungi Dukungan</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-slate-200 dark:border-slate-700 p-4 rounded-lg">
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-blue-500 mr-2" />
                <h4 className="font-medium text-slate-800 dark:text-white">Email Support</h4>
              </div>
              <p className="text-slate-600 dark:text-slate-400 mt-2">
                Kirim email ke <span className="font-mono">support@kemnaker.go.id</span>
              </p>
            </div>
            <div className="border border-slate-200 dark:border-slate-700 p-4 rounded-lg">
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-blue-500 mr-2" />
                <h4 className="font-medium text-slate-800 dark:text-white">Form Kontak</h4>
              </div>
              <p className="text-slate-600 dark:text-slate-400 mt-2">
                Gunakan form kontak di halaman beranda
              </p>
            </div>
            <div className="border border-slate-200 dark:border-slate-700 p-4 rounded-lg">
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-blue-500 mr-2" />
                <h4 className="font-medium text-slate-800 dark:text-white">Jam Operasional</h4>
              </div>
              <p className="text-slate-600 dark:text-slate-400 mt-2">
                Respon dalam waktu 1x24 jam kerja
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">11.3 Panduan Teknis</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-slate-800 dark:text-white mb-3">Dokumentasi Teknis</h4>
              <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                <li className="flex items-center">
                  <FileText className="h-4 w-4 text-blue-500 mr-2" />
                  <span>Lihat dokumentasi teknis di file SETUP.md</span>
                </li>
                <li className="flex items-center">
                  <FileText className="h-4 w-4 text-blue-500 mr-2" />
                  <span>Informasi deployment tersedia di DEPLOYMENT.md</span>
                </li>
                <li className="flex items-center">
                  <FileText className="h-4 w-4 text-blue-500 mr-2" />
                  <span>Tutorial setup lengkap di TUTORIAL_SETUP.md</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-slate-800 dark:text-white mb-3">Troubleshooting Umum</h4>
              <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                <li className="flex items-center">
                  <ChevronRight className="h-4 w-4 text-blue-500 mr-2" />
                  <span><strong>Tidak bisa login:</strong> Pastikan NIP, Eselon I, dan Satuan Kerja sudah benar</span>
                </li>
                <li className="flex items-center">
                  <ChevronRight className="h-4 w-4 text-blue-500 mr-2" />
                  <span><strong>Data tidak muncul:</strong> Refresh halaman atau hubungi admin sistem</span>
                </li>
                <li className="flex items-center">
                  <ChevronRight className="h-4 w-4 text-blue-500 mr-2" />
                  <span><strong>Error koneksi:</strong> Pastikan koneksi internet stabil</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: "tips",
    title: "Tips & Trik",
    icon: <Lightbulb className="h-6 w-6" />,
    content: (
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-slate-800 dark:text-white">12.1 Tips Penggunaan Efektif</h3>
        <div className="relative h-48 rounded-xl overflow-hidden mb-6">
          <Image 
            src="/img/tips-trik.jpg" 
            alt="Tips dan Trik Penggunaan Sistem" 
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          <div className="absolute bottom-4 left-4 text-white">
            <h4 className="font-semibold">Tips Efektif Penggunaan Sistem</h4>
            <p className="text-sm opacity-90">Optimalkan pengalaman Anda dengan sistem</p>
          </div>
        </div>
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 p-6 rounded-2xl border border-amber-200 dark:border-amber-700">
          <ul className="space-y-3 text-slate-600 dark:text-slate-400">
            <li className="flex items-start">
              <Lightbulb className="h-5 w-5 text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
              <span>Gunakan fitur pencarian untuk menemukan penyedia secara cepat</span>
            </li>
            <li className="flex items-start">
              <Lightbulb className="h-5 w-5 text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
              <span>Gunakan filter untuk mempersempit hasil dan fokus pada data yang relevan</span>
            </li>
            <li className="flex items-start">
              <Lightbulb className="h-5 w-5 text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
              <span>Manfaatkan dashboard untuk pemantauan performa secara keseluruhan</span>
            </li>
            <li className="flex items-start">
              <Lightbulb className="h-5 w-5 text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
              <span>Gunakan fitur ekspor untuk laporan periodik</span>
            </li>
            <li className="flex items-start">
              <Lightbulb className="h-5 w-5 text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
              <span>Simpan secara berkala saat mengisi formulir penilaian yang panjang</span>
            </li>
          </ul>
        </div>

        <h3 className="text-xl font-semibold text-slate-800 dark:text-white mt-8">12.2 Praktik Terbaik</h3>
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 p-6 rounded-2xl border border-emerald-200 dark:border-teal-700">
          <ul className="space-y-3 text-slate-600 dark:text-slate-400">
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5 mr-2 flex-shrink-0" />
              <span>Berikan penilaian berdasarkan kriteria dan standar LKPP secara objektif</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5 mr-2 flex-shrink-0" />
              <span>Isi komentar penilaian untuk memberikan feedback yang berguna</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5 mr-2 flex-shrink-0" />
              <span>Perbarui penilaian secara berkala untuk mendapatkan gambaran kinerja yang akurat</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5 mr-2 flex-shrink-0" />
              <span>Gunakan sistem secara konsisten untuk memastikan data yang komprehensif</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5 mr-2 flex-shrink-0" />
              <span>Verifikasi kembali data sebelum menyimpan penilaian</span>
            </li>
          </ul>
        </div>

        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-6 rounded-2xl border border-indigo-200 dark:border-purple-700">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">12.3 Tips Tambahan</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-slate-800 dark:text-white mb-3">Untuk PPK</h4>
              <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                <li className="flex items-center">
                  <ChevronRight className="h-4 w-4 text-indigo-500 mr-2" />
                  <span>Gunakan browser dan perangkat yang stabil</span>
                </li>
                <li className="flex items-center">
                  <ChevronRight className="h-4 w-4 text-indigo-500 mr-2" />
                  <span>Periksa koneksi internet sebelum memulai penilaian</span>
                </li>
                <li className="flex items-center">
                  <ChevronRight className="h-4 w-4 text-indigo-500 mr-2" />
                  <span>Gunakan kriteria dengan objektif dan konsisten</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-slate-800 dark:text-white mb-3">Untuk Administrator</h4>
              <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                <li className="flex items-center">
                  <ChevronRight className="h-4 w-4 text-indigo-500 mr-2" />
                  <span>Periksa secara berkala integritas data</span>
                </li>
                <li className="flex items-center">
                  <ChevronRight className="h-4 w-4 text-indigo-500 mr-2" />
                  <span>Pantau aktivitas pengguna secara berkala</span>
                </li>
                <li className="flex items-center">
                  <ChevronRight className="h-4 w-4 text-indigo-500 mr-2" />
                  <span>Verifikasi validitas data yang masuk</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: "kesimpulan",
    title: "Kesimpulan",
    icon: <FileBarChart className="h-6 w-6" />,
    content: (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-8 rounded-2xl border border-blue-200 dark:border-blue-700">
          <div className="relative h-64 rounded-xl overflow-hidden mb-6">
            <Image 
              src="/img/kesimpulan.jpg" 
              alt="Kesimpulan dan Harapan" 
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            <div className="absolute bottom-4 left-4 text-white">
              <h4 className="text-xl font-bold">Sistem Penilaian Penyedia UKPBJ</h4>
              <p className="text-sm opacity-90">Memastikan kualitas dan akuntabilitas dalam pengadaan barang/jasa</p>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">Sistem Penilaian Penyedia UKPBJ Kemnaker</h3>
          <p className="text-lg text-slate-600 dark:text-slate-300 mb-6">
            adalah alat yang penting untuk memastikan kualitas dan akuntabilitas dalam proses pengadaan barang/jasa.
          </p>
          <p className="text-slate-600 dark:text-slate-300 mb-6">
            Dengan antarmuka yang intuitif dan fitur yang komprehensif, sistem ini memudahkan PPK dalam memberikan penilaian yang objektif dan terstruktur terhadap penyedia barang/jasa.
          </p>
          <p className="text-slate-600 dark:text-slate-300">
            Gunakan panduan ini sebagai referensi utama untuk memahami dan memanfaatkan semua fitur yang tersedia dalam sistem. Pastikan untuk selalu memperbaharui informasi dan ikuti perkembangan sistem dari administrator yang ditunjuk.
          </p>
          
          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
            <h4 className="font-semibold text-slate-800 dark:text-white mb-3">Prinsip-prinsip Penggunaan Sistem:</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-slate-800/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                <div className="text-center">
                  <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <h5 className="font-medium text-slate-800 dark:text-white">Objektifitas</h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Berikan penilaian yang objektif berdasarkan data dan fakta</p>
                </div>
              </div>
              <div className="bg-white dark:bg-slate-800/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                <div className="text-center">
                  <Scale className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <h5 className="font-medium text-slate-800 dark:text-white">Konsistensi</h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Gunakan kriteria penilaian secara konsisten</p>
                </div>
              </div>
              <div className="bg-white dark:bg-slate-800/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                <div className="text-center">
                  <Handshake className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                  <h5 className="font-medium text-slate-800 dark:text-white">Transparansi</h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Jaga transparansi dalam proses penilaian</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
            <h4 className="font-semibold text-slate-800 dark:text-white mb-4">Dampak dan Manfaat Sistem:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h5 className="font-medium text-slate-800 dark:text-white mb-3">Untuk PPK:</h5>
                <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                  <li className="flex items-start">
                    <ChevronRight className="h-4 w-4 text-blue-500 mt-1 mr-2 flex-shrink-0" />
                    <span>Memudahkan proses penilaian dengan antarmuka yang intuitif</span>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="h-4 w-4 text-blue-500 mt-1 mr-2 flex-shrink-0" />
                    <span>Menyediakan data historis untuk pengambilan keputusan yang lebih baik</span>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="h-4 w-4 text-blue-500 mt-1 mr-2 flex-shrink-0" />
                    <span>Meningkatkan efisiensi dan efektivitas dalam pengadaan barang/jasa</span>
                  </li>
                </ul>
              </div>
              <div>
                <h5 className="font-medium text-slate-800 dark:text-white mb-3">Untuk Penyedia:</h5>
                <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                  <li className="flex items-start">
                    <ChevronRight className="h-4 w-4 text-blue-500 mt-1 mr-2 flex-shrink-0" />
                    <span>Mendapatkan umpan balik yang objektif dan transparan</span>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="h-4 w-4 text-blue-500 mt-1 mr-2 flex-shrink-0" />
                    <span>Meningkatkan kualitas layanan dan kinerja secara berkelanjutan</span>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="h-4 w-4 text-blue-500 mt-1 mr-2 flex-shrink-0" />
                    <span>Menumbuhkan rasa percaya terhadap proses pengadaan yang adil</span>
                  </li>
                </ul>
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