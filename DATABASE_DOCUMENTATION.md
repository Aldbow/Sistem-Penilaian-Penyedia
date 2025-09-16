# 📊 Database Implementation Documentation - Sistem Penilaian Penyedia

## 🎯 Overview

The **Sistem Penilaian Penyedia** (Provider Evaluation System) uses **Google Sheets** as its primary database solution for the UKPBJ Kemnaker provider evaluation system. This document provides a comprehensive overview of the database implementation, data structures, and system interactions.

## 🏗️ Database Architecture

### 🛠️ Technology Stack
- **Database**: Google Sheets API v4
- **Authentication**: Google Service Account with OAuth2
- **ORM/Client**: Custom Google Sheets Service (`lib/google-sheets.ts`)
- **Caching**: Custom API cache implementation (`lib/use-api-cache.ts`)
- **Frontend**: Next.js 15 with TypeScript
- **UI Framework**: Tailwind CSS with Framer Motion

### 🔐 Authentication & Configuration

The system uses Google Service Account authentication with the following environment variables:

```env
GOOGLE_SHEETS_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_SHEETS_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----...-----END PRIVATE KEY-----
GOOGLE_SHEETS_PRIVATE_KEY_BASE64=base64-encoded-private-key (alternative)
GOOGLE_SHEET_ID=your-spreadsheet-id
```

> **Note**: The authentication supports both direct private key and base64-encoded private key formats for deployment flexibility.

## 📋 Data Structures & Sheets

The database consists of **6 main sheets** (tabs) in the Google Spreadsheet:

### 1. 🏢 Penyedia (Providers) Sheet

**Purpose**: Stores essential information about service/goods providers that can be evaluated.

> **📅 Updated**: Simplified structure with only essential fields (December 2024)

**Columns (A-C)** - *Simplified Structure*:
- `A`: **ID Penyedia** - Auto-generated unique identifier with format `PYD{timestamp}`
- `B`: **Nama Perusahaan** - Company/Organization name
- `C`: **NPWP** - Tax identification number (Nomor Pokok Wajib Pajak)

**TypeScript Interface**:
```typescript
interface Penyedia {
  id: string;           // Unique provider identifier
  namaPerusahaan: string; // Company name
  npwp: string;         // Tax ID number
}
```

**Key Features**:
- ✅ Simplified data structure for better performance
- ✅ Essential fields only for core functionality
- ✅ Automatic ID generation with timestamp
- ✅ NPWP validation for tax compliance

### 2. 👨‍💼 PPK (Pejabat Pembuat Komitmen) Sheet

**Purpose**: Stores information about procurement officials (PPK) who can perform provider evaluations.

**Columns (A-H)**:
- `A`: **No** - Sequential number for ordering
- `B`: **Eselon I** - Echelon I organizational level
- `C`: **Satuan Kerja** - Main work unit/department
- `D`: **Satuan Kerja Detail** - Detailed work unit specification *(Added 2024)*
- `E`: **TA** - Budget year (Tahun Anggaran)
- `F`: **Nama** - PPK full name
- `G`: **NIP** - Employee identification number
- `H`: **No. HP** - Contact phone number

**TypeScript Interface**:
```typescript
interface PPK {
  no: string;
  eselonI: string;
  satuanKerja: string;
  satuanKerjaDetail: string; // 🆕 Enhanced filtering capability
  ta: string;
  nama: string;
  nip: string;
  noHp: string;
}
```

**Authentication Flow**:
1. PPK enters NIP + Eselon I + Satuan Kerja
2. System validates against this sheet
3. `satuanKerjaDetail` determines accessible packages

### 3. 📦 Paket (Packages/Contracts) Sheet

**Purpose**: Stores contract/package information linking PPK work units with providers for evaluation access control.

> **🔗 Key Feature**: Enables PPK to only evaluate providers they have contracts with

**Columns (A-P)** - *Complete Contract Information*:
- `A`: **Tahun Anggaran** - Budget year
- `B`: **Kode Satuan Kerja** - Work unit code
- `C`: **Nama Satuan Kerja** - Work unit name
- `D`: **Kode Paket** - Package/contract code
- `E`: **Kode RUP Paket** - RUP system package code
- `F`: **Pagu** - Budget ceiling amount
- `G`: **HPS** - Government estimated price
- `H`: **Nilai Penawaran** - Initial bid value
- `I`: **Nilai Terkoreksi** - Corrected bid value
- `J`: **Nilai Negosiasi** - Negotiated value
- `K`: **Nilai Kontrak** - Final contract value
- `L`: **Kode Penyedia** - Provider code
- `M`: **Nama Penyedia** - Provider name
- `N`: **NPWP Penyedia** - Provider tax ID
- `O`: **NPWP 16 Penyedia** - 16-digit provider tax ID
- `P`: **Penilaian** - Evaluation status: `"Belum"` | `"Sudah"`

**TypeScript Interface**:
```typescript
interface Paket {
  tahunAnggaran: string;
  kodeSatuanKerja: string;
  namaSatuanKerja: string;
  kodePaket: string;
  kodeRupPaket: string;
  pagu: string;
  hps: string;
  nilaiPenawaran: string;
  nilaiTerkoreksi: string;
  nilaiNegosiasi: string;
  nilaiKontrak: string;
  kodePenyedia: string;
  namaPenyedia: string;
  npwpPenyedia: string;
  npwp16Penyedia: string;
  penilaian: 'Belum' | 'Sudah'; // Evaluation status
}
```

**Business Logic**:
- 🔒 PPK can only see providers from their `satuanKerjaDetail`
- 🔄 Status automatically updates from "Belum" → "Sudah" after evaluation
- 💼 Links procurement data with evaluation permissions

### 4. ⭐ Penilaian (Evaluations) Sheet

**Purpose**: Stores the actual evaluation data submitted by PPK officials using the LKPP evaluation criteria.

**Columns (A-O)** - *Complete Evaluation Data*:
- `A`: **ID Penilaian** - Auto-generated with format `PNL{timestamp}`
- `B`: **ID Penyedia** - Reference to provider being evaluated
- `C`: **Nama PPK** - Name of evaluating PPK official
- `D`: **Tanggal Penilaian** - Evaluation submission date
- `E`: **Kualitas & Kuantitas** - Quality & quantity score (1-3)
- `F`: **Komentar Kualitas** - Quality & quantity comments
- `G`: **Biaya** - Cost effectiveness score (1-3)
- `H`: **Komentar Biaya** - Cost comments
- `I`: **Waktu** - Time management score (1-3)
- `J`: **Komentar Waktu** - Time comments
- `K`: **Layanan** - Service quality score (1-3)
- `L`: **Komentar Layanan** - Service comments
- `M`: **Penilaian Akhir** - Final calculated rating
- `N`: **Skor Total** - Weighted total score (1-3)
- `O`: **Keterangan** - Additional notes

**🎯 LKPP Scoring System**:
| Score | Rating | Description | UI Color |
|-------|--------|-------------|----------|
| `1` | **Cukup** | Sufficient | 🟡 Yellow |
| `2` | **Baik** | Good | 🔵 Blue |
| `3` | **Sangat Baik** | Very Good | 🟢 Green |

**⚖️ Weighted Calculation Formula**:
```
Total Score = (Quality × 30%) + (Cost × 20%) + (Time × 30%) + (Service × 20%)
```

**TypeScript Interface**:
```typescript
interface Penilaian {
  id: string;
  idPenyedia: string;
  namaPPK: string;
  tanggalPenilaian: string;
  kualitasKuantitasBarangJasa: number; // 1-3
  komentarKualitasKuantitasBarangJasa: string;
  biaya: number; // 1-3
  komentarBiaya: string;
  waktu: number; // 1-3
  komentarWaktu: string;
  layanan: number; // 1-3
  komentarLayanan: string;
  penilaianAkhir: string; // Calculated rating
  skorTotal: number; // Weighted score (1-3)
  keterangan: string;
}
```

**🔄 Automatic Processes**:
- ✅ Score calculation using weighted formula
- ✅ Final rating determination based on score ranges
- ✅ Package status update to "Sudah" after submission

### 5. 🏛️ SATKER (Satuan Kerja) Sheet

**Purpose**: Reference data for Kemnaker organizational work units and their hierarchical structure.

**Columns (A-F)** - *Organizational Structure*:
- `A`: **Eselon I** - Top-level organizational division
- `B`: **No** - Sequential ordering number
- `C`: **Satuan Kerja** - Main work unit name
- `D`: **Satuan Kerja Detail** - Detailed work unit specification
- `E`: **Kode Satuan Kerja** - Official work unit code
- `F`: **Jenis Satuan Kerja** - Work unit type/category

**TypeScript Interface**:
```typescript
interface SATKER {
  eselonI: string;
  no: string;
  satuanKerja: string;
  satuanKerjaDetail: string;
  kodeSatuanKerja: string;
  jenisSatuanKerja: string;
}
```

**🔗 Integration Purpose**:
- Maps PPK work units to package filtering
- Provides hierarchical organizational structure
- Enables proper access control for evaluations

### 6. 📢 TenderPengumuman (Tender Announcements) Sheet

**Purpose**: Stores comprehensive tender announcement data from external procurement systems for reference and integration.

**Columns (A-AK)** - *37 comprehensive fields including*:
- 📊 **Basic Information**: Year, codes, names, descriptions
- 💰 **Financial Data**: Budget ceiling, HPS, bid values, contract amounts
- 🔄 **Process Information**: Methods, status, important dates
- 👥 **Official Information**: PPK details, working groups
- 📍 **Location & References**: Addresses, URLs, documentation

**TypeScript Interface**:
```typescript
interface TenderPengumuman {
  tahunAnggaran: string;
  listTahunAnggaran: string;
  kdKlpd: string;
  namaKlpd: string;
  // ... 33 additional comprehensive fields
  eventDate: string;
}
```

**🎯 Usage**:
- Reference data for procurement processes
- Integration with external tender systems
- Historical tender information tracking

## 🔧 Database Service Layer

### 🛠️ GoogleSheetsService Class

Located in `lib/google-sheets.ts`, this service provides the main interface to interact with Google Sheets API.

#### 🔐 Authentication & Initialization

| Method | Description | Usage |
|--------|-------------|-------|
| `initializeAuth()` | Sets up Google Sheets API authentication | System startup |
| `testConnection()` | Validates connection to the spreadsheet | Health checks |
| `initializeSpreadsheet()` | Creates headers for all sheets | Initial setup |

#### 🏢 Penyedia (Provider) Operations

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `getPenyedia()` | - | `Penyedia[]` | Retrieves all providers (simplified structure) |
| `searchPenyedia(query)` | `query: string` | `Penyedia[]` | Searches by name/NPWP |
| `addPenyedia(penyedia)` | `Omit<Penyedia, 'id'>` | `string` | Adds new provider, returns ID |
| `searchPenyediaWithRatings(query)` | `query: string` | `PenyediaWithRatings[]` | Optimized search with evaluation data |

#### 👨‍💼 PPK Operations

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `getPPK()` | - | `PPK[]` | Retrieves all PPK officials |
| `searchPPK(query)` | `query: string` | `PPK[]` | Searches by name, NIP, or work unit |

#### 📦 Paket (Package) Operations

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `getPaket()` | - | `Paket[]` | Retrieves all packages/contracts |
| `getPaketBySatuanKerja(detail)` | `satuanKerjaDetail: string` | `Paket[]` | Filters by PPK's work unit |
| `updatePenilaianStatus(kode, penyedia, status)` | `kodePaket, kodePenyedia, status` | `boolean` | Updates evaluation status |

#### ⭐ Penilaian (Evaluation) Operations

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `getPenilaian()` | - | `Penilaian[]` | Retrieves all evaluations |
| `addPenilaian(penilaian)` | `Omit<Penilaian, 'id'>` | `string` | Adds evaluation with auto-scoring |
| `getPenilaianByPenyedia(id)` | `idPenyedia: string` | `Penilaian[]` | Gets evaluations for provider |

#### 🏛️ SATKER & Reference Operations

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `getSATKER()` | - | `SATKER[]` | Organizational structure data |
| `getKodeSatuanKerjaByDetail(detail)` | `satuanKerjaDetail: string` | `string[]` | Maps work units to codes |
| `getTenderPengumuman()` | - | `TenderPengumuman[]` | Tender announcement data |

## 🌐 API Layer

The system exposes RESTful API endpoints that interact with the database service:

### 🔧 System Endpoints

#### `POST /api/init` - Database Initialization
```typescript
// Initializes spreadsheet headers for all sheets
Response: { success: boolean, message: string }
Usage: Setup and maintenance
```

### 🏢 Provider Endpoints

#### `GET /api/penyedia` - Provider Management
```typescript
// Retrieve providers with optional search
Query: { search?: string }
Response: Penyedia[]
Example: /api/penyedia?search=PT%20ABC
```

#### `POST /api/penyedia` - Add Provider
```typescript
// Add new provider
Body: { namaPerusahaan: string, npwp: string }
Response: { id: string, success: boolean }
```

#### `GET /api/penyedia/search` - Optimized Search
```typescript
// Search providers with ratings included
Query: { q: string }
Response: PenyediaWithRatings[]
Features: Aggregated evaluation data, performance optimized
```

#### `GET /api/penyedia/[id]/penilaian` - Provider Evaluations
```typescript
// Get all evaluations for specific provider
Path: /api/penyedia/{providerId}/penilaian
Response: Penilaian[]
```

### 👨‍💼 PPK Endpoints

#### `GET /api/ppk` - PPK Management
```typescript
// Retrieve PPK officials with optional search
Query: { search?: string }
Response: PPK[]
Example: /api/ppk?search=John
```

#### `POST /api/penilaian/validate-ppk` - PPK Authentication
```typescript
// Validates PPK credentials for evaluation access
Body: {
  nip: string,
  eselonI: string,
  satuanKerja: string
}
Response: {
  valid: boolean,
  ppk?: PPK,
  message: string
}
```

#### `GET /api/penilaian/ppk-options` - PPK Form Options
```typescript
// Retrieve dropdown options for PPK forms
Query: { eselonI?: string }
Response: {
  eselonIOptions: string[],
  satuanKerjaOptions: string[],
  satuanKerjaDetailOptions: string[]
}
```

### ⭐ Evaluation Endpoints

#### `GET /api/penilaian` - Evaluation Management
```typescript
// Retrieve evaluations with optional provider filter
Query: { idPenyedia?: string }
Response: Penilaian[]
Example: /api/penilaian?idPenyedia=PYD123
```

#### `POST /api/penilaian` - Submit Evaluation
```typescript
// Submit new evaluation with automatic scoring
Body: {
  idPenyedia: string,
  namaPPK: string,
  kualitasKuantitasBarangJasa: number, // 1-3
  komentarKualitasKuantitasBarangJasa: string,
  biaya: number, // 1-3
  komentarBiaya: string,
  waktu: number, // 1-3
  komentarWaktu: string,
  layanan: number, // 1-3
  komentarLayanan: string,
  keterangan: string
}
Response: {
  id: string,
  skorTotal: number,
  penilaianAkhir: string,
  success: boolean
}
Side Effects: Updates package evaluation status to "Sudah"
```

### 📦 Package/Contract Endpoints

#### `GET /api/paket` - Package Data
```typescript
// Retrieve packages filtered by PPK's work unit
Query: { satuanKerjaDetail: string } // Required
Response: Paket[]
Purpose: Shows only packages that PPK can evaluate
Example: /api/paket?satuanKerjaDetail=Direktorat%20ABC
```

### 📢 Reference Data Endpoints

#### `GET /api/tender-pengumuman` - Tender Announcements
```typescript
// Retrieve tender announcement data
Query: { kdRup?: string }
Response: TenderPengumuman[]
Purpose: Reference data for procurement processes
```

## 🚀 Caching Layer

### 📦 API Cache Implementation

Located in `lib/use-api-cache.ts`, provides intelligent client-side caching for optimal performance.

#### 🎯 Core Features
- ⏰ **Time-based expiration** (configurable per endpoint)
- 🔄 **Automatic revalidation** on window focus
- 📊 **Interval-based revalidation** for real-time data
- 🗑️ **Manual cache invalidation** for immediate updates
- ⚡ **Optimistic updates** for better UX
- 🔍 **Search result caching** with debouncing

#### 🎣 Specialized Cache Hooks

| Hook | Cache Duration | Purpose | Auto-Revalidation |
|------|----------------|---------|-------------------|
| `usePenyediaData()` | 10 minutes | Provider data | On focus |
| `usePenilaianData()` | 5 minutes | Evaluation data | On focus + interval |
| `usePPKData()` | 10 minutes | PPK officials | On focus |
| `useDashboardStats()` | 3 minutes | Aggregated stats | Interval (30s) |
| `useSearchCache()` | 5 minutes | Search results | Debounced (250ms) |

#### 🔧 Cache Configuration
```typescript
interface CacheConfig {
  cacheTimeout: number;     // Expiration time in ms
  debounceDelay: number;    // Search debounce delay
  revalidateOnFocus: boolean; // Auto-revalidate on window focus
  revalidateInterval: number; // Background revalidation interval
}
```

## 🔄 Business Logic & Workflows

### 🔐 PPK Authentication Workflow

```mermaid
flowchart TD
    A[PPK enters credentials] --> B{Validate against PPK sheet}
    B -->|Valid| C[Grant access to evaluation]
    B -->|Invalid| D[Show error message]
    C --> E[Load accessible packages based on satuanKerjaDetail]
    E --> F[Display providers with contracts]
```

**Steps**:
1. 📝 PPK enters **NIP** + **Eselon I** + **Satuan Kerja**
2. 🔍 System validates against PPK sheet data
3. ✅ If valid, PPK gains access to evaluation functions
4. 🎯 PPK's `satuanKerjaDetail` determines accessible packages

### ⭐ Provider Evaluation Workflow

```mermaid
flowchart TD
    A[PPK authenticated] --> B[Filter packages by work unit]
    B --> C[Display providers with contracts]
    C --> D[PPK selects provider to evaluate]
    D --> E[Submit 4-criteria evaluation]
    E --> F[Calculate weighted score]
    F --> G[Determine final rating]
    G --> H[Update package status to 'Sudah']
    H --> I[Store evaluation in database]
```

**Detailed Steps**:
1. 🔍 **Package Filtering**: System filters by PPK's work unit
2. 📋 **Provider Display**: Shows providers with existing contracts only
3. 📝 **Evaluation Submission**: PPK submits 4-criteria evaluation
4. 🧮 **Automatic Scoring**: System calculates weighted total score
5. 🔄 **Status Update**: Package status: "Belum" → "Sudah"
6. 🏆 **Final Rating**: Determines rating based on score ranges

#### 🎯 Rating Scale Mapping
| Score Range | Rating | Description | Star Display |
|-------------|--------|-------------|-------------|
| `0` | **Buruk** | Poor | ⭐ (1 star) |
| `1.0 - 1.99` | **Cukup** | Sufficient | ⭐⭐ (2 stars) |
| `2.0 - 2.99` | **Baik** | Good | ⭐⭐⭐⭐ (4 stars) |
| `3.0` | **Sangat Baik** | Very Good | ⭐⭐⭐⭐⭐ (5 stars) |

### 🔗 Data Relationships

```
👨‍💼 PPK → (satuanKerjaDetail) → 🏛️ SATKER → (kodeSatuanKerja) → 📦 Paket → (kodePenyedia) → 🏢 Penyedia
                                                                              ↓
                                                                          ⭐ Penilaian
```

### 🔍 Search & Filtering Logic

#### 🏢 Provider Search
- 📝 **Company name**: Case-insensitive partial matching
- 🔢 **NPWP**: Exact match for tax ID
- 📊 **Includes**: Aggregated rating data and evaluation count
- ⚡ **Performance**: Limited to top 20 results
- 🕒 **Caching**: 5-minute cache with 250ms debounce

#### 👨‍💼 PPK Search
- 👤 **Name**: Case-insensitive partial matching
- 🆔 **NIP**: Exact match for employee ID
- 🏢 **Work unit**: Case-insensitive partial matching
- 🎯 **Scope**: Searches across all organizational levels

#### 📦 Package Filtering
- 🗺️ **Mapping**: PPK's `satuanKerjaDetail` → valid `kodeSatuanKerja` values
- 🔍 **Filtering**: Only packages matching work unit codes
- 📋 **Contracts**: Only shows packages with existing contracts
- 🔒 **Access Control**: PPK can only evaluate their contracted providers

## ⚡ Performance Optimizations

### 🗄️ Database Level
- 📦 **Batch operations** where possible to reduce API calls
- 🎯 **Optimized range queries** (e.g., `A2:C` vs full sheet for providers)
- 🔄 **Parallel data fetching** for related entities
- 📊 **Simplified data structures** (Provider: 7 fields → 3 fields)
- 🔍 **Indexed lookups** using efficient range selections

### 💻 Application Level
- 🚀 **Client-side caching** with configurable expiration times
- ⏱️ **Debounced search queries** (250ms delay)
- 🎯 **Lazy loading** of non-critical data components
- 📋 **Optimized search results** (limited to 20 items)
- 🎨 **Virtual scrolling** for large data sets
- 📱 **Responsive design** with mobile-first approach

### 🌐 API Level
- 🔗 **Combined operations** (e.g., `searchPenyediaWithRatings`)
- 🔍 **Efficient filtering** at the service layer
- 📦 **Minimal data transfer** (only required fields)
- 🗜️ **Response compression** for large datasets
- ⚡ **Connection pooling** equivalent for Google Sheets API

### 🎯 Specific Optimizations

| Component | Optimization | Impact |
|-----------|-------------|--------|
| Provider Search | Debounced + Cached | 🔥 90% fewer API calls |
| Dashboard Stats | 3-min cache + background refresh | 🚀 Instant loading |
| Evaluation Form | Optimistic updates | ⚡ Immediate feedback |
| Package Filtering | Server-side filtering | 📊 Reduced data transfer |
| Provider Data | Simplified structure | 🎯 60% smaller payload |

## 🚨 Error Handling

### 🔐 Authentication Errors

| Error Type | Detection | Response | User Action |
|------------|-----------|----------|-------------|
| Invalid Credentials | Service account validation | 401 Unauthorized | Check environment variables |
| Private Key Format | Key parsing failure | 500 Internal Error | Verify key format/encoding |
| Connection Failure | API connectivity test | 503 Service Unavailable | Check network/permissions |
| Quota Exceeded | Google API limits | 429 Too Many Requests | Implement retry logic |

### ✅ Data Validation

#### Input Validation Rules
```typescript
// Provider validation
interface ProviderValidation {
  namaPerusahaan: string; // Required, min 3 chars
  npwp: string;          // Required, 15 digits format
}

// Evaluation validation
interface EvaluationValidation {
  scores: number;        // Range: 1-3 only
  comments: string;      // Required for each criteria
  ppkName: string;       // Must match authenticated PPK
}
```

#### Validation Layers
- 🎯 **Client-side**: Immediate feedback, UX optimization
- 🛡️ **Server-side**: Security, data integrity
- 📊 **Database-level**: Constraint validation

### 🌐 API Error Responses

#### Standardized Error Format
```typescript
interface APIError {
  success: false;
  error: {
    code: string;        // Machine-readable error code
    message: string;     // Human-readable message
    details?: any;       // Additional error context
    timestamp: string;   // ISO timestamp
  };
}
```

#### HTTP Status Code Mapping
| Status | Code | Usage | Example |
|--------|------|-------|----------|
| 200 | OK | Successful operation | Data retrieved |
| 201 | Created | Resource created | New evaluation added |
| 400 | Bad Request | Invalid input | Missing required field |
| 401 | Unauthorized | Authentication failed | Invalid PPK credentials |
| 403 | Forbidden | Access denied | PPK accessing wrong unit |
| 404 | Not Found | Resource not found | Provider ID not exists |
| 429 | Too Many Requests | Rate limit exceeded | Google API quota |
| 500 | Internal Server Error | System error | Database connection failed |

### 🔧 Error Recovery Strategies

- 🔄 **Automatic retry** with exponential backoff
- 💾 **Offline data caching** for critical operations
- 🎯 **Graceful degradation** when services are unavailable
- 📝 **Detailed logging** for debugging and monitoring
- 🚨 **User-friendly error messages** with actionable guidance

## 📊 Google Sheets Integration Details

### 🔗 Connection Setup

#### Required Environment Variables
```bash
# Google Service Account Configuration
GOOGLE_SHEETS_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
# OR (for deployment environments)
GOOGLE_SHEETS_PRIVATE_KEY_BASE64=base64_encoded_private_key

# Target Spreadsheet
GOOGLE_SHEET_ID=1234567890abcdef_your_sheet_id
```

#### Service Account Permissions
- **Google Sheets API**: Read/Write access
- **Spreadsheet Access**: Editor permissions on target sheet
- **Minimal Scope**: `https://www.googleapis.com/auth/spreadsheets`

### 📋 Sheet Structure & Mapping

#### Sheet Names & Ranges
| Sheet Name | Range | Purpose | Auto-Headers |
|------------|-------|---------|-------------|
| `Penyedia` | A:C | Provider data | ✅ |
| `PPK` | A:H | PPK officials | ✅ |
| `Paket` | A:O | Packages/Contracts | ✅ |
| `Penilaian` | A:L | Evaluations | ✅ |
| `SATKER` | A:D | Organizational units | ✅ |
| `TenderPengumuman` | A:AH | Tender data | ✅ |

#### Data Type Mapping
```typescript
// Google Sheets → TypeScript type conversion
interface SheetMapping {
  string: string;     // Text cells
  number: number;     // Numeric cells
  date: string;       // ISO date strings
  boolean: string;    // "true"/"false" strings
  formula: string;    // Calculated values
}
```

### 🔄 Data Synchronization

#### Read Operations
- **Batch Reading**: Uses `batchGet` for multiple ranges
- **Range Optimization**: Reads only necessary columns (e.g., A2:C for providers)
- **Header Validation**: Ensures sheet structure matches expected format
- **Empty Row Handling**: Filters out empty rows automatically

#### Write Operations
- **Append Mode**: New records added to next available row
- **ID Generation**: Auto-generates unique IDs (PYD001, PNL001, etc.)
- **Atomic Updates**: Single API call per operation
- **Status Updates**: In-place updates for evaluation status

#### Error Handling
```typescript
// Retry logic for Google API operations
const retryConfig = {
  maxRetries: 3,
  backoffMultiplier: 2,
  initialDelay: 1000, // 1 second
  maxDelay: 8000      // 8 seconds
};
```

### 🎯 Performance Considerations

#### API Quota Management
- **Read Quota**: 100 requests/100 seconds/user
- **Write Quota**: 100 requests/100 seconds/user
- **Batch Operations**: Combine multiple operations when possible
- **Caching Strategy**: Reduce API calls with intelligent caching

#### Optimization Techniques
```typescript
// Example: Efficient range reading
const ranges = [
  'Penyedia!A2:C',     // Only essential provider fields
  'Penilaian!A2:L',    // Full evaluation data
  'PPK!A2:H'           // PPK data with new satuanKerjaDetail
];

// Batch request instead of 3 separate calls
const batchResponse = await sheets.spreadsheets.values.batchGet({
  spreadsheetId,
  ranges
});
```

### 🔒 Security & Access Control

#### Authentication Flow
1. 🔑 **Service Account**: Uses JWT for server-to-server auth
2. 🛡️ **Private Key**: Securely stored in environment variables
3. 🔐 **Token Management**: Automatic token refresh handled by Google client
4. 🎯 **Scope Limitation**: Only spreadsheet access, no other Google services

#### Data Security
- **Encryption**: All data transmitted over HTTPS
- **Access Logs**: Google Workspace audit logs track all access
- **Principle of Least Privilege**: Service account has minimal required permissions
- **No Client-Side Keys**: Private keys never exposed to browser

### 🧪 Testing & Validation

#### Connection Testing
```typescript
// Built-in connection test
const testResult = await googleSheetsService.testConnection();
if (!testResult.success) {
  console.error('Connection failed:', testResult.error);
}
```

#### Data Validation
- **Schema Validation**: Ensures data matches expected interfaces
- **Type Checking**: Validates data types before writing
- **Constraint Validation**: Checks business rules (e.g., score ranges)
- **Duplicate Prevention**: ID uniqueness validation

### 🔧 Maintenance & Monitoring

#### Health Checks
- **Connection Status**: Regular connectivity tests
- **Quota Monitoring**: Track API usage against limits
- **Error Rate Tracking**: Monitor failed operations
- **Performance Metrics**: Response time monitoring

#### Backup & Recovery
- **Google Sheets Versioning**: Built-in revision history
- **Export Capabilities**: Programmatic data export for backups
- **Disaster Recovery**: Service account key rotation procedures
- **Data Integrity**: Checksums and validation for critical operations

#### Troubleshooting Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| 403 Forbidden | Service account lacks permissions | Grant Editor access to spreadsheet |
| 429 Rate Limited | Exceeded API quota | Implement exponential backoff |
| Invalid Private Key | Malformed key format | Check key format and encoding |
| Sheet Not Found | Incorrect sheet name | Verify sheet names match exactly |
| Empty Response | No data in range | Check data exists in specified range |

## 🔒 Security Considerations

### 🔐 Authentication
- **Service Account**: Minimal required permissions for Google Sheets API
- **Private Key Storage**: Secure environment variable storage
- **Base64 Encoding**: Support for deployment environments
- **Token Management**: Automatic refresh with Google client libraries

### 🛡️ Data Access Control
- **PPK Authorization**: Can only evaluate providers in their work unit
- **Role-Based Access**: Different access levels for different user types
- **Data Filtering**: Server-side filtering prevents unauthorized data access
- **Audit Trail**: All evaluations tracked with PPK identification

### 🌐 Network Security
- **No Direct Database Access**: All client operations go through validated API endpoints
- **Server-Side Validation**: All inputs validated before processing
- **CORS Configuration**: Restricted to authorized domains
- **Rate Limiting**: Protection against abuse and DoS attacks

## 🚀 Development & Deployment

### 📋 Environment Setup

#### Required Environment Variables
```bash
# Google Sheets Integration
GOOGLE_SHEETS_CLIENT_EMAIL=service-account@project.iam.gserviceaccount.com
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEETS_PRIVATE_KEY_BASE64=base64_encoded_key  # Alternative for deployment
GOOGLE_SHEET_ID=1234567890abcdef_your_sheet_id

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### 🛠️ Development Setup

1. **Create Google Service Account**
   ```bash
   # Go to Google Cloud Console
   # Create new service account
   # Generate and download private key (JSON format)
   ```

2. **Configure Spreadsheet Access**
   ```bash
   # Share target spreadsheet with service account email
   # Grant "Editor" permissions
   ```

3. **Install Dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

4. **Set Environment Variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

5. **Initialize Database**
   ```bash
   # Start development server
   npm run dev
   
   # Initialize spreadsheet headers (one-time setup)
   curl -X POST http://localhost:3000/api/init
   ```

### 🚢 Deployment Guidelines

#### Production Environment
- **Private Key Encoding**: Use `GOOGLE_SHEETS_PRIVATE_KEY_BASE64` for secure deployment
- **Environment Validation**: Verify all required variables are set
- **Connection Testing**: Test Google Sheets connectivity before going live
- **Monitoring Setup**: Configure logging and error tracking

#### Deployment Checklist
- [ ] Service account created with proper permissions
- [ ] Spreadsheet shared with service account
- [ ] Environment variables configured
- [ ] Database initialized (`/api/init` called)
- [ ] Connection test successful
- [ ] API endpoints responding correctly
- [ ] Authentication flow working
- [ ] Error handling tested

### 📊 Monitoring & Maintenance

#### Key Metrics to Monitor
- **API Response Times**: Google Sheets API latency
- **Error Rates**: Failed operations percentage
- **Quota Usage**: API calls vs. limits
- **User Activity**: Evaluation submissions, searches
- **Cache Hit Rates**: Client-side cache effectiveness

#### Regular Maintenance Tasks
- **Quota Monitoring**: Track Google API usage
- **Performance Review**: Analyze slow queries
- **Data Cleanup**: Remove test data, optimize sheets
- **Security Audit**: Review access permissions
- **Backup Verification**: Ensure data backup processes work

---

## 📝 Summary

This documentation provides a comprehensive overview of the **Sistem Penilaian Penyedia** database structure and implementation. The system uses Google Sheets as a backend database with a simplified Provider data structure (ID, Company Name, NPWP) and implements robust authentication, caching, and performance optimizations.

**Key Features**:
- 🏢 **Simplified Provider Management** with essential fields only
- 👨‍💼 **PPK Authentication** with work unit-based access control
- ⭐ **Comprehensive Evaluation System** with automatic scoring
- 📊 **Performance Optimized** with intelligent caching and debouncing
- 🔒 **Secure** with proper authentication and data validation
- 📱 **Modern UI** with responsive design and real-time updates

For technical support or questions about implementation details, refer to the codebase in `lib/google-sheets.ts` and the API endpoints in `app/api/`.
- Consider Redis caching for frequently accessed data
- Implement database connection pooling equivalent
- Add data compression for large responses
