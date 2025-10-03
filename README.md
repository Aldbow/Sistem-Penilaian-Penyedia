# 🏛️ Sistem Penilaian Penyedia LKPP

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/username/sistem-penilaian-penyedia)
[![Live Demo](https://img.shields.io/badge/Live-Demo-blue)](https://sistem-penilaian-penyedia.vercel.app/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> **Sistem penilaian penyedia barang/jasa yang terintegrasi dengan Google Spreadsheet untuk memudahkan PPK dalam memberikan penilaian terhadap penyedia sesuai standar LKPP.**

## 📋 Daftar Isi

- [🎯 Tentang Sistem](#-tentang-sistem)
- [✨ Fitur Utama](#-fitur-utama)
- [🏗️ Arsitektur Sistem](#️-arsitektur-sistem)
- [📊 Diagram Alur Data](#-diagram-alur-data)
- [🗄️ Struktur Database](#️-struktur-database)
- [🛠️ Tech Stack](#️-tech-stack)
- [🚀 Quick Start](#-quick-start)
- [📖 Panduan Lengkap](#-panduan-lengkap)
- [🔧 API Documentation](#-api-documentation)
- [🎨 UI Components](#-ui-components)
- [🔐 Sistem Autentikasi](#-sistem-autentikasi)
- [📈 Dashboard & Laporan](#-dashboard--laporan)
- [🐛 Troubleshooting](#-troubleshooting)
- [🤝 Contributing](#-contributing)

## 🎯 Tentang Sistem

Sistem Penilaian Penyedia LKPP adalah aplikasi web modern yang dirancang khusus untuk memfasilitasi Pejabat Pembuat Komitmen (PPK) dalam melakukan evaluasi terhadap penyedia barang/jasa. Sistem ini mengintegrasikan data kontrak dengan proses penilaian untuk memastikan PPK hanya dapat menilai penyedia yang memiliki kontrak dengan unit kerja mereka.

### 🎯 Tujuan Utama
- Meningkatkan akuntabilitas dalam penilaian penyedia
- Mempermudah proses evaluasi dengan interface yang user-friendly
- Menyediakan data terpusat untuk analisis performa penyedia
- Mendukung transparansi dalam pengadaan barang/jasa

## ✨ Fitur Utama

### 🔐 **Sistem Autentikasi Berbasis Role**
- **PPK Authentication**: PPK hanya dapat menilai penyedia yang memiliki kontrak dengan unit kerjanya
- **Admin Access**: User ADMIN dapat menilai semua paket tanpa batasan unit kerja
- **Role-based Filtering**: Otomatis memfilter data berdasarkan `satuanKerjaDetail`

### 📊 **Dashboard Interaktif**
- Real-time statistics dan metrics
- Grafik performa penyedia
- Trending analysis
- Quick actions untuk akses cepat

### 📝 **Sistem Penilaian Komprehensif**
- 4 kriteria penilaian sesuai standar LKPP:
  - **Kualitas & Kuantitas Barang/Jasa** (Bobot: 30%)
  - **Biaya** (Bobot: 20%)
  - **Waktu** (Bobot: 30%)
  - **Layanan** (Bobot: 20%)
- Skala penilaian 1-3 dengan color coding
- Automatic scoring calculation
- Status tracking (Belum/Sudah)

### 🎨 **Modern UI/UX**
- Responsive design untuk semua device
- Card-based provider display
- Smooth animations dengan Framer Motion
- Dark/Light theme support
- Optimized performance

### 📈 **Reporting & Analytics**
- Comprehensive evaluation reports
- Provider performance trends
- Unit kerja statistics
- Export capabilities

## 🏗️ Arsitektur Sistem

```mermaid
graph TB
    subgraph "Frontend Layer"
        A[Next.js 14 App Router]
        B[React Components]
        C[Tailwind CSS + Shadcn/ui]
        D[Framer Motion]
    end
    
    subgraph "API Layer"
        E[Next.js API Routes]
        F[Authentication Middleware]
        G[Data Validation]
    end
    
    subgraph "Service Layer"
        H[Google Sheets Service]
        I[Data Processing]
        J[Business Logic]
    end
    
    subgraph "Data Layer"
        K[Google Sheets Database]
        L[6 Main Sheets]
        M[Real-time Sync]
    end
    
    A --> E
    B --> E
    E --> H
    H --> K
    F --> G
    G --> I
    I --> J
    J --> H
```

### 🔧 Komponen Utama

#### **Frontend (Client-Side)**
- **Next.js 14**: App Router dengan Server Components
- **TypeScript**: Type safety dan better developer experience
- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn/ui**: Modern component library
- **Framer Motion**: Smooth animations dan transitions

#### **Backend (Server-Side)**
- **Next.js API Routes**: RESTful API endpoints
- **Google Sheets API**: Database integration
- **Server-side validation**: Data integrity dan security
- **Caching**: Optimized performance

#### **Database (Google Sheets)**
- **Serverless**: No database maintenance required
- **Real-time**: Instant data synchronization
- **Accessible**: Easy data management via Google Sheets interface
- **Cost-effective**: Free tier available

## 📊 Diagram Alur Data

### 🔄 **Alur Autentikasi PPK**

```mermaid
sequenceDiagram
    participant U as User (PPK)
    participant F as Frontend
    participant A as API
    participant G as Google Sheets
    
    U->>F: Input PPK credentials
    F->>A: POST /api/penilaian/validate-ppk
    A->>G: Query PPK sheet
    G-->>A: Return PPK data
    A-->>F: Authentication result
    
    alt PPK Valid
        F->>A: GET /api/paket
        A->>G: Query filtered packages
        Note over A,G: Filter by satuanKerjaDetail
        G-->>A: Return contracted packages
        A-->>F: Package list
        F->>U: Display provider cards
    else PPK Invalid
        F->>U: Show error message
    end
```

### 📝 **Alur Proses Penilaian**

```mermaid
sequenceDiagram
    participant P as PPK
    participant F as Frontend
    participant A as API
    participant G as Google Sheets
    
    P->>F: Select provider to evaluate
    F->>P: Show evaluation form
    P->>F: Submit evaluation scores
    F->>A: POST /api/penilaian
    
    A->>A: Calculate weighted score
    Note over A: Kualitas(30%) + Biaya(20%) + Waktu(30%) + Layanan(20%)
    
    A->>G: Insert evaluation data
    A->>G: Update package status (Belum → Sudah)
    G-->>A: Confirmation
    A-->>F: Success response
    F->>P: Show success notification
```

### 🔍 **Alur Admin Access**

```mermaid
flowchart TD
    A[PPK Login] --> B{Check satuanKerjaDetail}
    B -->|ADMIN| C[Admin Mode]
    B -->|Regular PPK| D[PPK Mode]
    
    C --> E[Get All Packages]
    D --> F[Get Filtered Packages]
    
    E --> G[Display All Providers]
    F --> H[Display Unit Providers Only]
    
    G --> I[Can Evaluate Any Provider]
    H --> J[Can Evaluate Contracted Providers Only]
```

### 📈 **Alur Dashboard Data**

```mermaid
graph LR
    A[Dashboard Request] --> B[Aggregate Data]
    B --> C[Calculate Statistics]
    C --> D[Generate Charts]
    
    subgraph "Data Sources"
        E[Penyedia Sheet]
        F[Penilaian Sheet]
        G[PPK Sheet]
        H[Paket Sheet]
    end
    
    B --> E
    B --> F
    B --> G
    B --> H
    
    D --> I[Real-time Dashboard]
```

### 📊 **Flowchart User**

```mermaid
graph TD
    A([Start]) --> B[PPK Login<br/>Masukkan NIP, Eselon I, Satuan Kerja]
    B --> C{Validasi Data}
    C -->|Gagal| D[Akses Ditolak<br/>Kembali ke Login]
    C -->|Berhasil| E[Tampilkan Daftar Paket<br/>Terfilter Berdasarkan Unit Kerja]
    D --> Z([Selesai])
    
    E --> F[Pilih Paket untuk Dinilai]
    F --> G{Paket Sudah Dinilai?}
    G -->|Ya| H[Tidak Dapat Dinilai Lagi<br/>Hanya Bisa Lihat Detail]
    G -->|Tidak| I[Kontrak Diputus?]
    H --> M[Selesai - Status Tetap Sudah Dinilai]
    I -->|Ya| J[Nilai Otomatis 0<br/>Semua Kriteria]
    I -->|Tidak| K[Isi Form Penilaian<br/>4 Kriteria LKPP]
    J --> L[Simpan Penilaian<br/>Status: Buruk]
    K --> L
    L --> M
    M --> N([Selesai])
    
    %% Styling
    classDef startEnd fill:#e1f5fe,stroke:#01579b,stroke-width:2px
    classDef process fill:#f3e5f5,stroke:#4a148c,stroke-width:2px
    classDef decision fill:#fff3e0,stroke:#e65100,stroke-width:2px
    classDef success fill:#e8f5e8,stroke:#2e7d32,stroke-width:2px
    classDef failed fill:#ffebee,stroke:#c62828,stroke-width:2px
    
    class A,N startEnd
    class B,E,F,K,L process
    class C,G,I decision
    class D,H failed
    class J,M success
```

## 🗄️ Struktur Database

Sistem menggunakan **Google Sheets** sebagai database dengan 6 sheet utama:

### 📊 **Sheet 1: Penyedia**
| Kolom | Field | Tipe | Deskripsi |
|-------|-------|------|-----------|
| A | `id` | String | ID unik penyedia (PYD{timestamp}) |
| B | `namaPerusahaan` | String | Nama lengkap perusahaan |
| C | `npwp` | String | Nomor NPWP perusahaan |

### 👥 **Sheet 2: PPK**
| Kolom | Field | Tipe | Deskripsi |
|-------|-------|------|-----------|
| A | `no` | String | Nomor urut PPK |
| B | `eselonI` | String | Eselon I unit kerja |
| C | `satuanKerja` | String | Nama satuan kerja |
| D | `satuanKerjaDetail` | String | **Detail unit kerja (key untuk filtering)** |
| E | `ta` | String | Tahun anggaran |
| F | `nama` | String | Nama lengkap PPK |
| G | `nip` | String | NIP PPK |
| H | `noHp` | String | Nomor HP PPK |

### 📦 **Sheet 3: Paket**
| Kolom | Field | Tipe | Deskripsi |
|-------|-------|------|-----------|
| A | `tahunAnggaran` | String | Tahun anggaran paket |
| B | `kodeSatuanKerja` | String | Kode satuan kerja |
| C | `namaSatuanKerja` | String | Nama satuan kerja |
| D | `kodePaket` | String | Kode unik paket |
| E | `kodeRupPaket` | String | Kode RUP paket |
| F | `pagu` | String | Nilai pagu paket |
| G | `hps` | String | Harga Perkiraan Sendiri |
| H | `nilaiPenawaran` | String | Nilai penawaran |
| I | `nilaiTerkoreksi` | String | Nilai terkoreksi |
| J | `nilaiNegosiasi` | String | Nilai negosiasi |
| K | `nilaiKontrak` | String | Nilai kontrak final |
| L | `kodePenyedia` | String | Kode penyedia |
| M | `namaPenyedia` | String | Nama penyedia |
| N | `npwpPenyedia` | String | NPWP penyedia |
| O | `npwp16Penyedia` | String | NPWP 16 digit |
| P | `penilaian` | String | Status penilaian (Belum/Sudah) |

### 📝 **Sheet 4: Penilaian**
| Kolom | Field | Tipe | Deskripsi |
|-------|-------|------|-----------|
| A | `id` | String | ID unik penilaian (PNL{timestamp}) |
| B | `idPenyedia` | String | Reference ke ID penyedia |
| C | `namaPPK` | String | Nama PPK penilai |
| D | `satuanKerja` | String | Unit kerja PPK |
| E | `metodePemilihan` | String | Metode pemilihan tender |
| F | `namaPaket` | String | Nama paket pekerjaan |
| G | `jenisPengadaan` | String | Jenis pengadaan |
| H | `nilaiKontrak` | String | Nilai kontrak |
| I | `namaPenyedia` | String | Nama penyedia |
| J | `tanggalPenilaian` | String | Tanggal penilaian |
| K | `kualitasKuantitasBarangJasa` | Number | Skor kualitas (1-3) |
| L | `komentarKualitasKuantitasBarangJasa` | String | Komentar kualitas |
| M | `biaya` | Number | Skor biaya (1-3) |
| N | `komentarBiaya` | String | Komentar biaya |
| O | `waktu` | Number | Skor waktu (1-3) |
| P | `komentarWaktu` | String | Komentar waktu |
| Q | `layanan` | Number | Skor layanan (1-3) |
| R | `komentarLayanan` | String | Komentar layanan |
| S | `penilaianAkhir` | String | Kategori akhir (Buruk/Cukup/Baik/Sangat Baik) |
| T | `skorTotal` | Number | Skor total terbobot |
| U | `keterangan` | String | Keterangan tambahan |
| V | `status` | String | Status penilaian |

### 🏢 **Sheet 5: SATKER**
| Kolom | Field | Tipe | Deskripsi |
|-------|-------|------|-----------|
| A | `eselonI` | String | Eselon I |
| B | `no` | String | Nomor urut |
| C | `satuanKerja` | String | Nama satuan kerja |
| D | `satuanKerjaDetail` | String | Detail satuan kerja |
| E | `kodeSatuanKerja` | String | Kode satuan kerja |
| F | `jenisSatuanKerja` | String | Jenis satuan kerja |

### 📋 **Sheet 6: TenderPengumuman**
| Kolom | Field | Tipe | Deskripsi |
|-------|-------|------|-----------|
| A-AK | Various tender fields | String | Data lengkap tender pengumuman |

### 🔗 **Relasi Antar Sheet**

```mermaid
erDiagram
    PPK ||--o{ Penilaian : creates
    Penyedia ||--o{ Penilaian : receives
    Paket ||--o{ Penilaian : evaluated_in
    SATKER ||--o{ PPK : belongs_to
    TenderPengumuman ||--o{ Paket : enriches
    
    PPK {
        string satuanKerjaDetail PK
        string nama
        string nip
    }
    
    Penyedia {
        string id PK
        string namaPerusahaan
        string npwp
    }
    
    Paket {
        string kodePaket PK
        string kodePenyedia FK
        string namaSatuanKerja
        string penilaian
    }
    
    Penilaian {
        string id PK
        string idPenyedia FK
        string namaPPK FK
        number skorTotal
    }
```

## 🛠️ Tech Stack

### **Frontend Technologies**
| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 15.5.2 | React framework dengan App Router |
| **React** | 18.2.0 | UI library |
| **TypeScript** | 5.5.4 | Type safety |
| **Tailwind CSS** | 3.4.7 | Utility-first CSS |
| **Shadcn/ui** | Latest | Component library |
| **Framer Motion** | 10.18.0 | Animations |
| **Lucide React** | 0.424.0 | Icon library |

### **Backend Technologies**
| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js API Routes** | 15.5.2 | Server-side API |
| **Google APIs** | 159.0.0 | Google Sheets integration |
| **Zod** | 3.23.8 | Schema validation |
| **React Hook Form** | 7.52.1 | Form management |

### **Development Tools**
| Tool | Version | Purpose |
|------|---------|---------|
| **ESLint** | 8.57.0 | Code linting |
| **PostCSS** | 8.4.40 | CSS processing |
| **Autoprefixer** | 10.4.19 | CSS vendor prefixes |

### **Deployment & Monitoring**
| Service | Purpose |
|---------|---------|
| **Vercel** | Hosting dan deployment |
| **Google Sheets** | Database |
| **Vercel Speed Insights** | Performance monitoring |

## 🚀 Quick Start

### 📋 Prerequisites
- Node.js 18+ 
- npm atau yarn
- Google account
- Google Cloud Project dengan Sheets API enabled

### ⚡ Installation

1. **Clone repository**
```bash
git clone https://github.com/username/sistem-penilaian-penyedia.git
cd sistem-penilaian-penyedia
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment variables**
```bash
cp .env.example .env.local
```

4. **Configure Google Sheets**
- Buat Google Spreadsheet baru
- Setup Service Account di Google Cloud Console
- Share spreadsheet dengan service account email
- Update `.env.local` dengan credentials

5. **Initialize database**
```bash
npm run dev
curl -X POST http://localhost:3000/api/init
```

6. **Start development server**
```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) untuk melihat aplikasi.

### 🔧 Environment Variables

```env
# Google Sheets Configuration
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEETS_CLIENT_EMAIL="your-service-account@project.iam.gserviceaccount.com"
GOOGLE_SHEET_ID="your-spreadsheet-id"

# Optional: Base64 encoded private key (alternative)
GOOGLE_SHEETS_PRIVATE_KEY_BASE64="base64-encoded-private-key"
```

## 📖 Panduan Lengkap

Untuk panduan setup dan deployment yang lebih detail, lihat:
- 📄 [SETUP.md](./SETUP.md) - Panduan setup lengkap
- 🚀 [DEPLOYMENT.md](./DEPLOYMENT.md) - Panduan deployment ke Vercel
- 📚 [TUTORIAL_SETUP.md](./TUTORIAL_SETUP.md) - Tutorial step-by-step

## 🔧 API Documentation

### 🔐 **Authentication Endpoints**

#### `POST /api/penilaian/validate-ppk`
Validasi kredensial PPK untuk autentikasi.

**Request Body:**
```json
{
  "nama": "string",
  "nip": "string",
  "eselonI": "string",
  "satuanKerja": "string"
}
```

**Response:**
```json
{
  "success": true,
  "ppk": {
    "nama": "string",
    "nip": "string",
    "satuanKerjaDetail": "string",
    // ... other PPK fields
  }
}
```

#### `GET /api/penilaian/ppk-options`
Mendapatkan opsi dropdown untuk form PPK.

**Response:**
```json
{
  "eselonI": [
    { "value": "string", "label": "string" }
  ],
  "satuanKerja": [
    { "value": "string", "label": "string" }
  ]
}
```

### 📦 **Package Endpoints**

#### `GET /api/paket`
Mendapatkan daftar paket berdasarkan PPK yang terautentikasi.

**Headers:**
```
ppk-nama: string
ppk-satuan-kerja-detail: string
```

**Response:**
```json
[
  {
    "kodePaket": "string",
    "namaPaket": "string",
    "namaPenyedia": "string",
    "nilaiKontrak": "string",
    "penilaian": "Belum|Sudah",
    "tenderInfo": {
      "namaPaket": "string",
      "statusTender": "string",
      "metodePemilihan": "string"
    }
  }
]
```

### 📝 **Evaluation Endpoints**

#### `POST /api/penilaian`
Menyimpan penilaian baru.

**Request Body:**
```json
{
  "idPenyedia": "string",
  "namaPPK": "string",
  "satuanKerja": "string",
  "metodePemilihan": "string",
  "namaPaket": "string",
  "jenisPengadaan": "string",
  "nilaiKontrak": "string",
  "namaPenyedia": "string",
  "tanggalPenilaian": "string",
  "kualitasKuantitasBarangJasa": 1-3,
  "komentarKualitasKuantitasBarangJasa": "string",
  "biaya": 1-3,
  "komentarBiaya": "string",
  "waktu": 1-3,
  "komentarWaktu": "string",
  "layanan": 1-3,
  "komentarLayanan": "string",
  "keterangan": "string",
  "status": "string",
  "kodePaket": "string",
  "kodePenyedia": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Penilaian berhasil disimpan",
  "data": {
    "skorTotal": 2.4,
    "penilaianAkhir": "Baik"
  }
}
```

### 👥 **Provider Endpoints**

#### `GET /api/penyedia`
Mendapatkan daftar semua penyedia.

#### `GET /api/penyedia/search?q={query}`
Mencari penyedia berdasarkan nama atau NPWP.

#### `POST /api/penyedia`
Menambah penyedia baru.

### 📊 **Dashboard Endpoints**

#### `GET /api/dashboard/stats`
Mendapatkan statistik dashboard.

**Response:**
```json
{
  "totalPenyedia": 150,
  "totalPenilaian": 89,
  "totalPPK": 25,
  "rataRataSkor": "2.3",
  "skorTertinggi": "3.0",
  "peningkatan": "+12%"
}
```

### 🏢 **Administrative Endpoints**

#### `GET /api/ppk`
Mendapatkan daftar semua PPK.

#### `POST /api/init`
Inisialisasi struktur spreadsheet dengan header yang benar.

#### `GET /api/tender-pengumuman`
Mendapatkan data tender pengumuman.

## 🎨 UI Components

### 🎯 **Core Components**

#### **PPK Selector**
```tsx
import { SearchableSelect } from "@/components/ui/searchable-select";

<SearchableSelect
  options={ppkOptions}
  value={selectedPPK}
  onChange={setSelectedPPK}
  placeholder="Pilih PPK..."
/>
```

#### **Provider Cards**
```tsx
import { ProviderCard } from "@/components/ui/provider-card";

<ProviderCard
  provider={providerData}
  onEvaluate={handleEvaluate}
  isEvaluated={provider.penilaian === "Sudah"}
/>
```

#### **Rating Scale**
```tsx
import { RatingScale } from "@/components/ui/rating-scale";

<RatingScale
  value={rating}
  onChange={setRating}
  criteria="kualitas"
  colors={{
    1: "yellow", // Cukup
    2: "blue",   // Baik  
    3: "green"   // Sangat Baik
  }}
/>
```

### 🎨 **Design System**

#### **Color Palette**
```css
/* Rating Colors */
--rating-cukup: #eab308;     /* Yellow-600 */
--rating-baik: #2563eb;      /* Blue-600 */
--rating-sangat-baik: #16a34a; /* Green-600 */

/* Status Colors */
--status-belum: #ef4444;     /* Red-500 */
--status-sudah: #22c55e;     /* Green-500 */

/* Theme Colors */
--primary: #3b82f6;          /* Blue-500 */
--secondary: #6b7280;        /* Gray-500 */
--accent: #8b5cf6;           /* Violet-500 */
```

#### **Typography Scale**
```css
/* Headings */
.text-4xl { font-size: 2.25rem; line-height: 2.5rem; }
.text-3xl { font-size: 1.875rem; line-height: 2.25rem; }
.text-2xl { font-size: 1.5rem; line-height: 2rem; }
.text-xl { font-size: 1.25rem; line-height: 1.75rem; }

/* Body Text */
.text-lg { font-size: 1.125rem; line-height: 1.75rem; }
.text-base { font-size: 1rem; line-height: 1.5rem; }
.text-sm { font-size: 0.875rem; line-height: 1.25rem; }
```

## 🔐 Sistem Autentikasi

### 🔑 **PPK Authentication Flow**

1. **Input Validation**: User memasukkan kredensial PPK
2. **Database Query**: Sistem mencari PPK di Google Sheets
3. **Role Detection**: Mengecek `satuanKerjaDetail` untuk menentukan role
4. **Session Management**: Menyimpan data PPK di session storage
5. **Access Control**: Memfilter data berdasarkan role

### 👤 **User Roles**

#### **Regular PPK**
- Hanya dapat melihat paket dari unit kerjanya
- Dibatasi oleh `satuanKerjaDetail` matching
- Akses terbatas pada provider yang memiliki kontrak

#### **Admin User**
- `satuanKerjaDetail = "ADMIN"`
- Dapat mengakses semua paket dari semua unit
- Bypass semua filtering untuk testing purposes
- Full access ke seluruh sistem

### 🛡️ **Security Measures**

```typescript
// Role-based filtering
const isAdmin = satuanKerjaDetail.toUpperCase() === 'ADMIN';
const packages = isAdmin 
  ? await getAllPaketWithTenderInfo()
  : await getPaketBySatuanKerja(satuanKerjaDetail);

// Input validation
const validatedData = evaluationSchema.parse(requestBody);

// Session management
sessionStorage.setItem('ppk', JSON.stringify(ppkData));
```

## 📈 Dashboard & Laporan

### 📊 **Dashboard Features**

#### **Real-time Statistics**
- Total penyedia terdaftar
- Total penilaian yang telah dilakukan
- Jumlah PPK aktif
- Rata-rata skor penilaian
- Skor tertinggi
- Persentase peningkatan

#### **Interactive Charts**
```typescript
// Performance trends
const chartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
  datasets: [{
    label: 'Rata-rata Skor',
    data: [2.1, 2.3, 2.5, 2.4, 2.6],
    borderColor: '#3b82f6',
    backgroundColor: 'rgba(59, 130, 246, 0.1)'
  }]
};
```

#### **Quick Actions**
- Mulai Penilaian Baru
- Lihat Laporan Lengkap
- Export Data
- Manage Users

### 📋 **Reporting System**

#### **Evaluation Reports**
- Laporan per penyedia
- Laporan per unit kerja
- Laporan per periode
- Trend analysis

#### **Export Options**
- PDF reports
- Excel spreadsheets
- CSV data export
- Print-friendly views

## 🐛 Troubleshooting

### ❌ **Common Issues**

#### **Google Sheets Connection**
```bash
Error: "Unable to parse private key"
```
**Solution:**
- Pastikan private key dalam format yang benar
- Gunakan `\n` untuk line breaks
- Wrap dengan double quotes

#### **Authentication Errors**
```bash
Error: "The caller does not have permission"
```
**Solution:**
- Share spreadsheet dengan service account email
- Pastikan Google Sheets API sudah enabled
- Cek permission level (Editor required)

#### **Data Not Loading**
```bash
Error: "Spreadsheet not found"
```
**Solution:**
- Verifikasi Google Sheet ID di URL
- Pastikan spreadsheet accessible
- Cek environment variables

### 🔧 **Debug Mode**

Enable debug logging:
```env
NODE_ENV=development
DEBUG=true
```

Check logs:
```bash
# Development
npm run dev

# Production
vercel logs
```

### 📞 **Support**

Jika mengalami masalah:
1. Cek [Issues](https://github.com/username/sistem-penilaian-penyedia/issues) yang sudah ada
2. Buat issue baru dengan detail error
3. Sertakan log file dan environment info
4. Tag dengan label yang sesuai

## 🤝 Contributing

### 🛠️ **Development Setup**

1. Fork repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Make changes dan test
4. Commit: `git commit -m 'Add amazing feature'`
5. Push: `git push origin feature/amazing-feature`
6. Create Pull Request

### 📝 **Coding Standards**

- Use TypeScript untuk type safety
- Follow ESLint configuration
- Write meaningful commit messages
- Add tests untuk new features
- Update documentation

### 🎯 **Areas for Contribution**

- [ ] Unit testing implementation
- [ ] Performance optimizations
- [ ] Additional export formats
- [ ] Mobile app version
- [ ] Advanced analytics
- [ ] Multi-language support

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **LKPP** untuk standar penilaian penyedia
- **Google Sheets API** untuk database solution
- **Vercel** untuk hosting platform
- **Shadcn/ui** untuk component library
- **Next.js team** untuk amazing framework

---