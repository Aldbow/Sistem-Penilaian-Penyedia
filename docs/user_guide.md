# Panduan Penggunaan Resmi Website Sistem Penilaian Penyedia UKPBJ Kemnaker

## 1. Pendahuluan

### 1.1 Deskripsi Sistem
Sistem Penilaian Penyedia UKPBJ Kemnaker adalah aplikasi web modern yang dirancang khusus untuk memfasilitasi Pejabat Pembuat Komitmen (PPK) dalam melakukan evaluasi terhadap penyedia barang/jasa sesuai dengan standar LKPP (Lembaga Kebijakan Pengadaan Barang/Jasa Pemerintah). Sistem ini terintegrasi secara real-time dengan Google Spreadsheet untuk memudahkan proses penilaian dan pelaporan.

### 1.2 Tujuan Website
- Memfasilitasi PPK dalam memberikan penilaian kepada penyedia barang/jasa
- Memberikan data terpusat untuk analisis performa penyedia
- Menjamin akuntabilitas dan transparansi dalam proses pengadaan
- Mengintegrasikan data kontrak dengan proses penilaian

### 1.3 Audiens Panduan
- Pejabat Pembuat Komitmen (PPK) yang terdaftar dalam sistem
- Staf administrasi Kementerian Ketenagakerjaan
- Pengguna sistem yang membutuhkan informasi tentang penilaian penyedia

---

## 2. Struktur Website & Navigasi

### 2.1 Tampilan Halaman Utama
Saat pertama mengakses sistem, Anda akan melihat tampilan utama yang terdiri dari:
- **Hero Section**: Gambaran umum sistem dan tombol akses cepat
- **Statistik Dashboard**: Menampilkan jumlah total penyedia, penilaian, PPK aktif, dan rata-rata skor
- **Gambaran Kinerja**: Informasi tentang penyedia terbaik minggu ini dan tren kinerja
- **Fitur Pencarian**: Mencari penyedia barang/jasa
- **Aksi Cepat**: Tautan menuju penilaian, laporan, dan dashboard
- **Form Kontak**: Informasi untuk menghubungi admin sistem

### 2.2 Menu Navigasi Utama
Sistem memiliki menu navigasi utama yang dapat diakses dari bagian atas halaman:

1. **Beranda** (`/`): Kembali ke halaman utama
2. **Penilaian** (`/penilaian`): Akses ke fitur penilaian penyedia
3. **Laporan** (`/laporan`): Akses ke laporan dan statistik penilaian
4. **Dashboard** (`/dashboard`): Tampilan analitik interaktif
5. **Toggle Tema**: Mengganti antara mode terang dan gelap

---

## 3. Panduan Fungsionalitas Inti

### 3.1 Penilaian Penyedia
Fitur penilaian memungkinkan PPK memberikan penilaian terhadap penyedia barang/jasa. Proses penilaian terdiri dari beberapa langkah utama:

#### 3.1.1 Autentikasi PPK
1. Navigasikan ke halaman **Penilaian** menggunakan menu atas
2. Masukkan informasi PPK pada form berikut:
   - **NIP**: Nomor Induk Pegawai Anda
   - **Eselon I**: Pilih Eselon I dari dropdown
   - **Satuan Kerja**: Pilih Satuan Kerja dari dropdown yang tersedia

> **Catatan Penting**: Sistem hanya akan memperlihatkan paket kontrak yang sesuai dengan satuan kerja Anda, kecuali Anda memiliki akses admin.

3. Klik tombol **Masuk** untuk mengotentikasi diri
4. Setelah sukses, Anda akan diarahkan ke form penilaian

#### 3.1.2 Mencari dan Memilih Paket Kontrak
1. Setelah login, Anda akan melihat daftar paket kontrak
2. Gunakan fitur pencarian untuk menemukan paket secara cepat
3. Gunakan filter untuk menampilkan paket yang sudah dinilai atau belum dinilai
4. Klik pada kartu paket untuk memilihnya sebagai objek penilaian
5. Klik **Lanjut** untuk melanjutkan ke informasi paket

#### 3.1.3 Informasi Paket dan Penyedia
1. Lihat detail paket kontrak yang dipilih:
   - Nama paket dan kode paket
   - Nilai kontrak
   - Tahun anggaran
   - Metode pemilihan
   - Status tender
   - Lokasi pekerjaan
2. Lihat detail penyedia:
   - Nama perusahaan
   - Kode dan NPWP penyedia
   - Status penilaian

#### 3.1.4 Pertanyaan Pemutusan Kontrak
1. Sistem akan menanyakan: "Apakah terjadi pemutusan kontrak secara sepihak oleh Pejabat Pembuat Komitmen (PPK) karena kesalahan Penyedia?"
2. Pilih **Ya, terjadi pemutusan kontrak** jika kondisi terjadi:
   - Semua aspek penilaian akan otomatis menjadi skor 0
   - Penilaian akhir akan menjadi "Buruk"
   - Wajib mengisi keterangan pemutusan kontrak
3. Pilih **Tidak, kontrak berjalan normal** jika tidak ada pemutusan kontrak:
   - Anda dapat melanjutkan ke penilaian normal

#### 3.1.5 Proses Penilaian
Sistem menggunakan 4 kriteria penilaian sesuai standar LKPP:

**1. Kualitas dan Kuantitas Pekerjaan (Bobot: 30%)**
- Skala: 1 (Cukup) - 2 (Baik) - 3 (Sangat Baik)
- Kriteria Skor:
  - **1 (Cukup)**: Lebih dari 50% hasil pekerjaan memerlukan perbaikan/penggantian
  - **2 (Baik)**: Kurang dari atau sama dengan 50% hasil pekerjaan memerlukan perbaikan
  - **3 (Sangat Baik)**: Hasil pekerjaan sesuai kontrak tanpa perlu perbaikan

**2. Biaya (Bobot: 20%)**
- Skala: 1 (Cukup) - 2 (Baik) - 3 (Sangat Baik)
- Menilai pengendalian biaya dan perubahan kontrak

**3. Waktu (Bobot: 30%)**
- Skala: 1 (Cukup) - 2 (Baik) - 3 (Sangat Baik)
- Menilai ketepatan waktu penyelesaian pekerjaan
- **1 (Cukup)**: Penyelesaian terlambat lebih dari 50 hari dari waktu kontrak
- **2 (Baik)**: Penyelesaian terlambat hingga 50 hari dari waktu kontrak
- **3 (Sangat Baik)**: Penyelesaian sesuai atau lebih cepat dari waktu kontrak

**4. Layanan (Bobot: 20%)**
- Skala: 1 (Cukup) - 2 (Baik) - 3 (Sangat Baik)
- Menilai responsivitas dan kualitas layanan penyedia

> **Catatan**: Skor total dihitung dengan rumus: (Kualitas×30%) + (Biaya×20%) + (Waktu×30%) + (Layanan×20%)

### 3.2 Laporan Penilaian
Halaman laporan menyediakan informasi komprehensif tentang hasil penilaian:

#### 3.2.1 Statistik Umum
- **Total Penyedia**: Jumlah seluruh penyedia terdaftar
- **Total Penilaian**: Jumlah total penilaian yang telah diberikan
- **PPK Aktif**: Jumlah PPK yang telah login dan memberikan penilaian

#### 3.2.2 Distribusi Rating
- Menampilkan distribusi penilaian berdasarkan skala 1-5 bintang
- Menunjukkan persentase penyedia pada setiap tingkatan rating

#### 3.2.3 Fitur Pencarian dan Filter
1. **Pencarian**: Gunakan kolom pencarian untuk mencari penyedia berdasarkan nama perusahaan atau NPWP
2. **Filter Status**: Filter berdasarkan kategori penilaian (Sangat Baik, Baik, Cukup, Buruk)
3. **Filter Penilaian**: Tampilkan hanya penyedia yang sudah dinilai atau belum dinilai
4. **Urutan Penilaian**: Pilih untuk mengurutkan berdasarkan nama, rating, tanggal penilaian, atau jumlah penilaian

#### 3.2.4 Detail Penyedia
- Klik pada kartu penyedia untuk melihat detail penilaian
- Informasi lengkap termasuk:
  - Profil penyedia lengkap
  - Riwayat penilaian
  - Skor per kriteria
  - Komentar PPK

#### 3.2.5 Ekspor Data
- **Export CSV**: Unduh laporan dalam format CSV
- **Export Excel**: Unduh laporan dalam format Excel
- Data yang diekspor mencakup informasi detail setiap penyedia dan penilaian

### 3.3 Dashboard Analitik
Dashboard menyediakan tampilan visualisasi data penilaian melalui Google Looker Studio:

#### 3.3.1 Kontrol Dashboard
- **Refresh Dashboard**: Perbarui tampilan data secara real-time
- **Buka di Tab Baru**: Membuka dashboard di jendela baru untuk tampilan lebih lebar

#### 3.3.2 Fitur Dashboard
- **Real-time Analytics**: Data terintegrasi secara langsung dengan Google Spreadsheet
- **Visualisasi Interaktif**: Grafik dan chart yang bisa diinteraksi
- **Multi-User Access**: Akses bisa dibagikan ke berbagai stakeholder

### 3.4 Fitur Pencarian
Sistem menyediakan fitur pencarian yang komprehensif:

#### 3.4.1 Pencarian Penyedia
- Pencarian berdasarkan nama perusahaan
- Pencarian berdasarkan NPWP
- Pencarian berdasarkan kode paket atau kode RUP

#### 3.4.2 Pencarian di Berbagai Halaman
- Pencarian tersedia di halaman Laporan
- Pencarian tersedia di halaman Penilaian (untuk mencari paket)
- Filter yang membantu mempersempit hasil pencarian

### 3.5 Proses Login dan Logout PPK
#### 3.5.1 Login PPK
1. Navigasikan ke halaman **Penilaian**
2. Masukkan informasi PPK (NIP, Eselon I, Satuan Kerja)
3. Sistem akan memvalidasi informasi dengan database PPK
4. Jika valid, Anda dapat mengakses form penilaian

#### 3.5.2 Logout PPK
1. Di halaman penilaian, klik tombol **Keluar** di pojok kanan atas
2. Konfirmasi logout untuk mengakhiri sesi

---

## 4. Penjelasan Konsep & Terminologi

### 4.1 Terminologi Utama
- **PPK (Pejabat Pembuat Komitmen)**: Pejabat yang bertugas melaksanakan pengadaan barang/jasa
- **LKPP**: Lembaga Kebijakan Pengadaan Barang/Jasa Pemerintah
- **UKPBJ**: Unit Pengadaan Barang/Jasa
- **Penilaian**: Proses evaluasi kinerja penyedia berdasarkan kriteria yang ditentukan
- **Skor Total**: Skor akhir yang dihitung dari kombinasi skor kriteria dengan bobot masing-masing
- **Penilaian Akhir**: Kategori hasil penilaian (Buruk, Cukup, Baik, Sangat Baik)

### 4.2 Skala Penilaian
- **1 (Cukup)**: Memenuhi syarat minimum yang ditentukan
- **2 (Baik)**: Melampaui syarat minimum dengan kinerja yang memuaskan
- **3 (Sangat Baik)**: Kinerja yang sangat memuaskan dan melebihi ekspektasi

### 4.3 Ikon dan Simbol
- **Building2**: Menunjukkan informasi tentang penyedia
- **BarChart3**: Menunjukkan data statistik dan analisis
- **FileText**: Menunjukkan dokumen atau formulir penilaian
- **Users**: Menunjukkan informasi PPK atau pengguna
- **Star**: Menunjukkan penilaian atau rating
- **TrendingUp**: Menunjukkan tren atau analisis kinerja

---

## 5. Fitur Lanjutan

### 5.1 Penilaian oleh Admin
- User dengan `satuanKerjaDetail = "ADMIN"` memiliki akses ke semua paket
- Dapat menilai semua penyedia tanpa batasan unit kerja
- Digunakan untuk testing dan manajemen sistem

### 5.2 Fitur Responsif Mobile
- Sistem dapat diakses melalui smartphone dan tablet
- Desain responsif untuk pengalaman pengguna optimal
- Fitur dan fungsi tetap tersedia secara penuh di perangkat mobile

### 5.3 Integrasi Google Sheets
- Data disimpan secara real-time di Google Sheets
- Sinkronisasi otomatis antara sistem dan database
- Memungkinkan manajemen data yang mudah melalui antarmuka Google Sheets

---

## 6. Dukungan dan Bantuan

### 6.1 Halaman FAQ
- Kunjungi halaman **FAQ** untuk jawaban atas pertanyaan umum
- Kategori pertanyaan meliputi:
  - Umum
  - Autentikasi
  - Penilaian
  - Data dan Laporan
  - Teknis
  - Bantuan dan Dukungan

### 6.2 Cara Menghubungi Dukungan
- **Email Support**: Kirim email ke support@kemnaker.go.id
- **Form Kontak**: Gunakan form kontak di halaman beranda
- **Jam Operasional**: Respon dalam waktu 1x24 jam kerja

### 6.3 Panduan Teknis
- Lihat dokumentasi teknis di file SETUP.md
- Informasi deployment tersedia di DEPLOYMENT.md
- Tutorial setup lengkap di TUTORIAL_SETUP.md

### 6.4 Troubleshooting Umum
- **Tidak bisa login**: Pastikan NIP, Eselon I, dan Satuan Kerja sudah benar
- **Data tidak muncul**: Refresh halaman atau hubungi admin sistem
- **Error koneksi**: Pastikan koneksi internet stabil
- **Browser tidak kompatibel**: Gunakan browser modern terbaru

---

## 7. Tips dan Trik

### 7.1 Tips Penggunaan Efektif
- Gunakan fitur pencarian untuk menemukan penyedia secara cepat
- Gunakan filter untuk mempersempit hasil dan fokus pada data yang relevan
- Manfaatkan dashboard untuk pemantauan performa secara keseluruhan
- Gunakan fitur ekspor untuk laporan periodik

### 7.2 Praktik Terbaik
- Berikan penilaian berdasarkan kriteria dan standar LKPP secara objektif
- Isi komentar penilaian untuk memberikan feedback yang berguna
- Perbarui penilaian secara berkala untuk mendapatkan gambaran kinerja yang akurat
- Gunakan sistem secara konsisten untuk memastikan data yang komprehensif

---

## 8. Kesimpulan

Sistem Penilaian Penyedia UKPBJ Kemnaker adalah alat yang penting untuk memastikan kualitas dan akuntabilitas dalam proses pengadaan barang/jasa. Dengan antarmuka yang intuitif dan fitur yang komprehensif, sistem ini memudahkan PPK dalam memberikan penilaian yang objektif dan terstruktur terhadap penyedia barang/jasa.

Gunakan panduan ini sebagai referensi utama untuk memahami dan memanfaatkan semua fitur yang tersedia dalam sistem.