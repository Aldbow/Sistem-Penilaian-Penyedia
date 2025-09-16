# Database Implementation Documentation - Sistem Penilaian Penyedia

## Overview

The Sistem Penilaian Penyedia (Provider Evaluation System) uses **Google Sheets** as its primary database solution. This document provides a comprehensive overview of the database implementation, data structures, and how the system interacts with the database.

## Database Architecture

### Technology Stack
- **Database**: Google Sheets API v4
- **Authentication**: Google Service Account with OAuth2
- **ORM/Client**: Custom Google Sheets Service (`lib/google-sheets.ts`)
- **Caching**: Custom API cache implementation (`lib/use-api-cache.ts`)

### Authentication & Configuration

The system uses Google Service Account authentication with the following environment variables:

```env
GOOGLE_SHEETS_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_SHEETS_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----...-----END PRIVATE KEY-----
GOOGLE_SHEETS_PRIVATE_KEY_BASE64=base64-encoded-private-key (alternative)
GOOGLE_SHEET_ID=your-spreadsheet-id
```

The authentication supports both direct private key and base64-encoded private key formats for deployment flexibility.

## Data Structures & Sheets

The database consists of 6 main sheets (tabs) in the Google Spreadsheet:

### 1. Penyedia (Providers) Sheet

**Purpose**: Stores information about service/goods providers that can be evaluated.

**Columns (A-G)**:
- `A`: ID Penyedia (Provider ID) - Auto-generated with format `PYD{timestamp}`
- `B`: Nama Perusahaan (Company Name)
- `C`: NPWP (Tax ID Number)
- `D`: Alamat (Address)
- `E`: Kontak (Contact Information)
- `F`: Jenis Usaha (Business Type)
- `G`: Tanggal Registrasi (Registration Date)

**Interface**:
```typescript
interface Penyedia {
  id: string;
  namaPerusahaan: string;
  npwp: string;
  alamat: string;
  kontak: string;
  jenisUsaha: string;
  tanggalRegistrasi: string;
}
```

### 2. PPK (Pejabat Pembuat Komitmen) Sheet

**Purpose**: Stores information about procurement officials who can perform evaluations.

**Columns (A-H)**:
- `A`: No (Sequential Number)
- `B`: Eselon I (Echelon I Level)
- `C`: Satuan Kerja (Work Unit)
- `D`: Satuan Kerja Detail (Detailed Work Unit) - **NEW COLUMN**
- `E`: TA (Budget Year)
- `F`: Nama (Name)
- `G`: NIP (Employee ID)
- `H`: No. HP (Phone Number)

**Interface**:
```typescript
interface PPK {
  no: string;
  eselonI: string;
  satuanKerja: string;
  satuanKerjaDetail: string; // Added in recent update
  ta: string;
  nama: string;
  nip: string;
  noHp: string;
}
```

### 3. Paket (Packages/Contracts) Sheet

**Purpose**: Stores contract/package information linking PPK units with providers.

**Columns (A-P)**:
- `A`: Tahun Anggaran (Budget Year)
- `B`: Kode Satuan Kerja (Work Unit Code)
- `C`: Nama Satuan Kerja (Work Unit Name)
- `D`: Kode Paket (Package Code)
- `E`: Kode RUP Paket (RUP Package Code)
- `F`: Pagu (Budget Ceiling)
- `G`: HPS (Government Estimated Price)
- `H`: Nilai Penawaran (Bid Value)
- `I`: Nilai Terkoreksi (Corrected Value)
- `J`: Nilai Negosiasi (Negotiated Value)
- `K`: Nilai Kontrak (Contract Value)
- `L`: Kode Penyedia (Provider Code)
- `M`: Nama Penyedia (Provider Name)
- `N`: NPWP Penyedia (Provider Tax ID)
- `O`: NPWP 16 Penyedia (Provider 16-digit Tax ID)
- `P`: Penilaian (Evaluation Status: "Belum"/"Sudah")

**Interface**:
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
  penilaian: string; // "Belum" or "Sudah"
}
```

### 4. Penilaian (Evaluations) Sheet

**Purpose**: Stores the actual evaluation data submitted by PPK officials.

**Columns (A-O)**:
- `A`: ID Penilaian (Evaluation ID) - Auto-generated with format `PNL{timestamp}`
- `B`: ID Penyedia (Provider ID)
- `C`: Nama PPK (PPK Name)
- `D`: Tanggal Penilaian (Evaluation Date)
- `E`: Kualitas dan Kuantitas Barang/Jasa (Quality & Quantity Score: 1-3)
- `F`: Komentar Kualitas dan Kuantitas (Quality & Quantity Comments)
- `G`: Biaya (Cost Score: 1-3)
- `H`: Komentar Biaya (Cost Comments)
- `I`: Waktu (Time Score: 1-3)
- `J`: Komentar Waktu (Time Comments)
- `K`: Layanan (Service Score: 1-3)
- `L`: Komentar Layanan (Service Comments)
- `M`: Penilaian Akhir (Final Rating: Calculated)
- `N`: Skor Total (Total Score: Calculated)
- `O`: Keterangan (Additional Notes)

**Scoring System**:
- Score 1: "Cukup" (Sufficient) - Yellow color scheme
- Score 2: "Baik" (Good) - Blue color scheme  
- Score 3: "Sangat Baik" (Very Good) - Green color scheme

**Weighted Calculation**:
- Quality & Quantity: 30%
- Cost: 20%
- Time: 30%
- Service: 20%

**Interface**:
```typescript
interface Penilaian {
  id: string;
  idPenyedia: string;
  namaPPK: string;
  tanggalPenilaian: string;
  kualitasKuantitasBarangJasa: number;
  komentarKualitasKuantitasBarangJasa: string;
  biaya: number;
  komentarBiaya: string;
  waktu: number;
  komentarWaktu: string;
  layanan: number;
  komentarLayanan: string;
  penilaianAkhir: string;
  skorTotal: number;
  keterangan: string;
}
```

### 5. SATKER (Satuan Kerja) Sheet

**Purpose**: Reference data for organizational work units and their hierarchical structure.

**Columns (A-F)**:
- `A`: Eselon I (Echelon I Level)
- `B`: No (Sequential Number)
- `C`: Satuan Kerja (Work Unit)
- `D`: Satuan Kerja Detail (Detailed Work Unit)
- `E`: Kode Satuan Kerja (Work Unit Code)
- `F`: Jenis Satuan Kerja (Work Unit Type)

**Interface**:
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

### 6. TenderPengumuman (Tender Announcements) Sheet

**Purpose**: Stores tender announcement data from external procurement systems.

**Columns (A-AK)** - 37 columns total including:
- Basic tender information (year, codes, names)
- Financial data (budget, HPS, bid values)
- Process information (methods, status, dates)
- Official information (PPK, working group)
- Location and URL references

**Interface**:
```typescript
interface TenderPengumuman {
  tahunAnggaran: string;
  listTahunAnggaran: string;
  kdKlpd: string;
  namaKlpd: string;
  // ... 33 more fields
  eventDate: string;
}
```

## Database Service Layer

### GoogleSheetsService Class

Located in `lib/google-sheets.ts`, this service provides the main interface to interact with Google Sheets.

#### Core Methods

**Authentication & Initialization**:
- `initializeAuth()`: Sets up Google Sheets API authentication
- `testConnection()`: Validates connection to the spreadsheet
- `initializeSpreadsheet()`: Creates headers for all sheets

**Penyedia Operations**:
- `getPenyedia()`: Retrieves all providers
- `searchPenyedia(query)`: Searches providers by name or NPWP
- `addPenyedia(penyedia)`: Adds a new provider
- `searchPenyediaWithRatings(query)`: Optimized search with evaluation data

**PPK Operations**:
- `getPPK()`: Retrieves all PPK officials
- `searchPPK(query)`: Searches PPK by name, NIP, or work unit

**Paket Operations**:
- `getPaket()`: Retrieves all packages/contracts
- `getPaketBySatuanKerja(satuanKerjaDetail)`: Filters packages by PPK's work unit
- `updatePenilaianStatus(kodePaket, kodePenyedia, status)`: Updates evaluation status

**Penilaian Operations**:
- `getPenilaian()`: Retrieves all evaluations
- `addPenilaian(penilaian)`: Adds new evaluation with automatic scoring
- `getPenilaianByPenyedia(idPenyedia)`: Gets evaluations for specific provider

**SATKER Operations**:
- `getSATKER()`: Retrieves organizational structure data
- `getKodeSatuanKerjaByDetail(satuanKerjaDetail)`: Maps detailed work units to codes

**TenderPengumuman Operations**:
- `getTenderPengumuman()`: Retrieves tender announcement data

## API Layer

The system exposes RESTful API endpoints that interact with the database service:

### `/api/init` - Database Initialization
- **POST**: Initializes spreadsheet headers
- **Usage**: Setup and maintenance

### `/api/penyedia` - Provider Management
- **GET**: Retrieve providers (with optional search)
- **POST**: Add new provider
- **Query Parameters**: `search` for filtering

### `/api/penyedia/search` - Optimized Provider Search
- **GET**: Search providers with ratings included
- **Query Parameters**: `q` for search query
- **Returns**: Providers with aggregated evaluation data

### `/api/penyedia/[id]/penilaian` - Provider Evaluations
- **GET**: Get all evaluations for specific provider
- **Path Parameter**: Provider ID

### `/api/ppk` - PPK Management
- **GET**: Retrieve PPK officials (with optional search)
- **Query Parameters**: `search` for filtering

### `/api/penilaian` - Evaluation Management
- **GET**: Retrieve evaluations (with optional provider filter)
- **POST**: Submit new evaluation
- **Query Parameters**: `idPenyedia` for filtering
- **Side Effects**: Updates package evaluation status

### `/api/penilaian/validate-ppk` - PPK Authentication
- **POST**: Validates PPK credentials
- **Body**: `{ nip, eselonI, satuanKerja }`
- **Returns**: PPK data if valid

### `/api/penilaian/ppk-options` - PPK Form Options
- **GET**: Retrieve dropdown options for PPK forms
- **Query Parameters**: `eselonI` for filtering work units
- **Returns**: Hierarchical options for form fields

### `/api/paket` - Package/Contract Data
- **GET**: Retrieve packages filtered by work unit
- **Query Parameters**: `satuanKerjaDetail` (required)
- **Usage**: Shows packages that PPK can evaluate

### `/api/tender-pengumuman` - Tender Announcements
- **GET**: Retrieve tender announcement data
- **Query Parameters**: `kdRup` for filtering

## Caching Layer

### API Cache Implementation

Located in `lib/use-api-cache.ts`, provides client-side caching for API responses.

**Features**:
- Time-based expiration (default 5 minutes)
- Automatic revalidation on window focus
- Interval-based revalidation
- Manual cache invalidation
- Optimistic updates

**Specialized Hooks**:
- `usePenyediaData()`: Cached provider data (10 min expiry)
- `usePenilaianData()`: Cached evaluation data (5 min expiry)
- `usePPKData()`: Cached PPK data (10 min expiry)
- `useDashboardStats()`: Aggregated dashboard data (3 min expiry)

## Business Logic & Workflows

### PPK Authentication Workflow

1. PPK enters NIP, Eselon I, and Satuan Kerja
2. System validates against PPK sheet data
3. If valid, PPK gains access to evaluation functions
4. PPK's `satuanKerjaDetail` determines accessible packages

### Provider Evaluation Workflow

1. **Package Filtering**: System filters packages by PPK's work unit
2. **Provider Display**: Shows providers with existing contracts
3. **Evaluation Submission**: PPK submits 4-criteria evaluation
4. **Automatic Scoring**: System calculates weighted total score
5. **Status Update**: Package status changes from "Belum" to "Sudah"
6. **Final Rating**: Determines rating based on score ranges:
   - 0: "Buruk" (Poor)
   - 1-1.99: "Cukup" (Sufficient)
   - 2-2.99: "Baik" (Good)
   - 3: "Sangat Baik" (Very Good)

### Data Relationships

```
PPK → (satuanKerjaDetail) → SATKER → (kodeSatuanKerja) → Paket → (kodePenyedia) → Penyedia
                                                            ↓
                                                        Penilaian
```

### Search & Filtering Logic

**Provider Search**:
- Searches by company name (case-insensitive)
- Searches by NPWP (exact match)
- Includes aggregated rating data
- Limited to top 20 results for performance

**PPK Search**:
- Searches by name (case-insensitive)
- Searches by NIP (exact match)
- Searches by work unit (case-insensitive)

**Package Filtering**:
- Maps PPK's `satuanKerjaDetail` to valid `kodeSatuanKerja` values
- Filters packages by matching work unit codes
- Only shows packages with contracts

## Performance Optimizations

### Database Level
- Batch operations where possible
- Optimized range queries (e.g., `A2:G` instead of full sheet)
- Parallel data fetching for related entities

### Application Level
- Client-side caching with configurable expiration
- Debounced search queries
- Lazy loading of non-critical data
- Optimized search results (limited to 20 items)

### API Level
- Combined operations (e.g., `searchPenyediaWithRatings`)
- Efficient filtering at the service layer
- Minimal data transfer (only required fields)

## Error Handling

### Authentication Errors
- Invalid credentials detection
- Private key format validation
- Connection testing on initialization

### Data Validation
- Required field validation
- Data type checking
- Range validation for scores (1-3)

### API Error Responses
- Standardized error format
- Appropriate HTTP status codes
- Detailed error messages for debugging

## Security Considerations

### Authentication
- Service account with minimal required permissions
- Private key stored as environment variable
- Support for base64 encoding for secure deployment

### Data Access
- PPK can only evaluate providers in their work unit
- No direct database access from client
- All operations go through validated API endpoints

### Input Validation
- Server-side validation for all inputs
- SQL injection prevention (not applicable to Sheets API)
- XSS prevention through proper data handling

## Deployment & Configuration

### Environment Setup
```bash
# Required environment variables
GOOGLE_SHEETS_CLIENT_EMAIL=service-account@project.iam.gserviceaccount.com
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
# OR
GOOGLE_SHEETS_PRIVATE_KEY_BASE64=base64-encoded-key
GOOGLE_SHEET_ID=1234567890abcdef
```

### Google Sheets Setup
1. Create Google Spreadsheet with 6 sheets: Penyedia, PPK, Paket, Penilaian, SATKER, TenderPengumuman
2. Share spreadsheet with service account email
3. Grant edit permissions to service account
4. Run `/api/init` endpoint to initialize headers

### Monitoring & Maintenance
- API quota monitoring (Google Sheets API limits)
- Error logging for failed operations
- Regular data backup recommendations
- Performance monitoring for large datasets

## Future Considerations

### Scalability
- Consider migration to traditional database for large datasets
- Implement data archiving for old evaluations
- Add database indexing equivalent (sheet organization)

### Features
- Real-time collaboration features
- Advanced reporting and analytics
- Data export capabilities
- Audit trail implementation

### Performance
- Consider Redis caching for frequently accessed data
- Implement database connection pooling equivalent
- Add data compression for large responses
