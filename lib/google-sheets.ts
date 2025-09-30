import { google } from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

// Interface untuk data penyedia
export interface Penyedia {
  id: string;
  namaPerusahaan: string;
  npwp: string;
}

// Interface untuk data PPK
export interface PPK {
  no: string;
  eselonI: string;
  satuanKerja: string;
  satuanKerjaDetail: string;
  ta: string;
  nama: string;
  nip: string;
  noHp: string;
}

// Interface untuk data paket
export interface Paket {
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
  
  // Enriched fields from TenderPengumuman join
  tenderInfo?: TenderPengumuman | null;
  namaPaket?: string;
  statusTender?: string;
  metodePemilihan?: string;
  jenisKontrak?: string;
  lokasiPekerjaan?: string;
  tanggalPengumuman?: string;
  urlLpse?: string | null;
}

// Interface untuk data penilaian
export interface Penilaian {
  id: string;
  idPenyedia: string;
  namaPPK: string;
  satuanKerja: string;
  metodePemilihan: string;
  namaPaket: string;
  jenisPengadaan: string;
  nilaiKontrak: string;
  namaPenyedia: string;
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
  status: string;
  // Additional field for package code
  kodePaket?: string;
}

// Interface untuk data SATKER
export interface SATKER {
  eselonI: string;
  no: string;
  satuanKerja: string;
  satuanKerjaDetail: string;
  kodeSatuanKerja: string;
  jenisSatuanKerja: string;
}

// Interface untuk data TenderPengumuman
export interface TenderPengumuman {
  tahunAnggaran: string;
  listTahunAnggaran: string;
  kdKlpd: string;
  namaKlpd: string;
  jenisKlpd: string;
  kdSatker: string;
  kdSatkerStr: string;
  namaSatker: string;
  kdLpse: string;
  namaLpse: string;
  kdTender: string;
  kdPktDce: string;
  kdRup: string;
  namaPaket: string;
  pagu: string;
  hps: string;
  sumberDana: string;
  kualifikasiPaket: string;
  jenisPengadaan: string;
  mtdPemilihan: string;
  mtdEvaluasi: string;
  mtdKualifikasi: string;
  kontrakPembayaran: string;
  statusTender: string;
  tanggalStatus: string;
  versiTender: string;
  ketDitutup: string;
  ketDiulang: string;
  tglBuatPaket: string;
  tglKolektifKolegial: string;
  tglPengumumanTender: string;
  nipPpk: string;
  namaPpk: string;
  nipPokja: string;
  namaPokja: string;
  lokasiPekerjaan: string;
  urlLpse: string;
  eventDate: string;
}

class GoogleSheetsService {
  private auth: any;
  private sheets: any;

  constructor() {
    this.initializeAuth();
  }

  private async initializeAuth() {
    try {
      // Validate environment variables
      const hasPrivateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY || process.env.GOOGLE_SHEETS_PRIVATE_KEY_BASE64;
      if (!hasPrivateKey || !process.env.GOOGLE_SHEETS_CLIENT_EMAIL || !process.env.GOOGLE_SHEET_ID) {
        throw new Error('Missing required Google Sheets environment variables');
      }

      // Handle private key - support both direct and base64 encoded
      let privateKey: string;
      
      if (process.env.GOOGLE_SHEETS_PRIVATE_KEY_BASE64) {
        // Decode from base64
        privateKey = Buffer.from(process.env.GOOGLE_SHEETS_PRIVATE_KEY_BASE64, 'base64').toString('utf8');
        console.log('Using base64 encoded private key');
      } else if (process.env.GOOGLE_SHEETS_PRIVATE_KEY) {
        // Use direct private key
        privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY;
        
        // Remove quotes if present
        privateKey = privateKey.replace(/^["']|["']$/g, '');
        
        // Replace escaped newlines with actual newlines
        privateKey = privateKey.replace(/\\n/g, '\n');
        console.log('Using direct private key');
      } else {
        throw new Error('No private key found in environment variables');
      }
      
      // Validate private key format
      if (!privateKey.includes('-----BEGIN PRIVATE KEY-----') || !privateKey.includes('-----END PRIVATE KEY-----')) {
        throw new Error('Invalid private key format. Must include BEGIN and END markers.');
      }

      // Validate private key length (should be substantial)
      if (privateKey.length < 1000) {
        throw new Error(`Private key seems too short (${privateKey.length} chars). Please check if the key is complete.`);
      }

      console.log('Initializing Google Sheets auth...');
      console.log('Client email:', process.env.GOOGLE_SHEETS_CLIENT_EMAIL);
      console.log('Sheet ID:', process.env.GOOGLE_SHEET_ID);
      console.log('Private key length:', privateKey.length, 'characters');
      
      this.auth = new google.auth.GoogleAuth({
        credentials: {
          client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
          private_key: privateKey,
        },
        scopes: SCOPES,
      });

      this.sheets = google.sheets({ version: 'v4', auth: this.auth });
      
      // Test the connection
      await this.testConnection();
      console.log('Google Sheets auth initialized successfully');
      
    } catch (error) {
      console.error('Error initializing Google Sheets auth:', error);
      throw error;
    }
  }

  // Test connection method
  private async testConnection() {
    try {
      const response = await this.sheets.spreadsheets.get({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
      });
      console.log('Connection test successful. Spreadsheet title:', response.data.properties?.title);
    } catch (error) {
      console.error('Connection test failed:', error);
      throw new Error('Failed to connect to Google Sheets. Please check your credentials and sheet ID.');
    }
  }

  // Mendapatkan semua data penyedia
  async getPenyedia(): Promise<Penyedia[]> {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: 'Penyedia!A2:C', // Mulai dari baris 2 (skip header)
      });

      const rows = response.data.values || [];
      return rows.map((row: any[]) => ({
        id: row[0] || '',
        namaPerusahaan: row[1] || '',
        npwp: row[2] || '',
      }));
    } catch (error) {
      console.error('Error getting penyedia data:', error);
      throw error;
    }
  }

  // Mencari penyedia berdasarkan nama
  async searchPenyedia(query: string): Promise<Penyedia[]> {
    const allPenyedia = await this.getPenyedia();
    return allPenyedia.filter(penyedia => 
      penyedia.namaPerusahaan.toLowerCase().includes(query.toLowerCase()) ||
      penyedia.npwp.includes(query)
    );
  }

  // Menambah penyedia baru
  async addPenyedia(penyedia: Omit<Penyedia, 'id'>): Promise<void> {
    try {
      const id = `PYD${Date.now()}`;
      const values = [[
        id,
        penyedia.namaPerusahaan,
        penyedia.npwp
      ]];

      await this.sheets.spreadsheets.values.append({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: 'Penyedia!A:C',
        valueInputOption: 'RAW',
        resource: { values },
      });
    } catch (error) {
      console.error('Error adding penyedia:', error);
      throw error;
    }
  }

  // Mendapatkan semua data PPK
  async getPPK(): Promise<PPK[]> {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: 'PPK!A2:H', // Updated range to include new column
      });

      const rows = response.data.values || [];
      return rows.map((row: any[]) => ({
        no: row[0] || '',
        eselonI: row[1] || '',
        satuanKerja: row[2] || '',
        satuanKerjaDetail: row[3] || '', // New column
        ta: row[4] || '',
        nama: row[5] || '',
        nip: row[6] || '',
        noHp: row[7] || '',
      }));
    } catch (error) {
      console.error('Error getting PPK data:', error);
      throw error;
    }
  }

  // Mencari PPK berdasarkan nama atau NIP
  async searchPPK(query: string): Promise<PPK[]> {
    const allPPK = await this.getPPK();
    return allPPK.filter(ppk => 
      ppk.nama.toLowerCase().includes(query.toLowerCase()) ||
      ppk.nip.includes(query) ||
      ppk.satuanKerja.toLowerCase().includes(query.toLowerCase())
    );
  }

  // Mendapatkan semua penilaian
  async getPenilaian(): Promise<Penilaian[]> {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: 'Penilaian!A2:V', // Updated range to include all new columns
      });

      const rows = response.data.values || [];
      return rows.map((row: any[]) => ({
        id: row[0] || '',
        idPenyedia: row[1] || '',
        namaPPK: row[2] || '',
        satuanKerja: row[3] || '',
        metodePemilihan: row[4] || '',
        namaPaket: row[5] || '',
        jenisPengadaan: row[6] || '',
        nilaiKontrak: row[7] || '',
        namaPenyedia: row[8] || '',
        tanggalPenilaian: row[9] || '',
        kualitasKuantitasBarangJasa: parseFloat(row[10]) || 0,
        komentarKualitasKuantitasBarangJasa: row[11] || '',
        biaya: parseFloat(row[12]) || 0,
        komentarBiaya: row[13] || '',
        waktu: parseFloat(row[14]) || 0,
        komentarWaktu: row[15] || '',
        layanan: parseFloat(row[16]) || 0,
        komentarLayanan: row[17] || '',
        penilaianAkhir: row[18] || '',
        skorTotal: parseFloat(row[19]) || 0,
        keterangan: row[20] || '',
        status: row[21] || '',
      }));
    } catch (error) {
      console.error('Error getting penilaian data:', error);
      throw error;
    }
  }

  // Menambah penilaian baru
  async addPenilaian(penilaian: Omit<Penilaian, 'id' | 'skorTotal' | 'penilaianAkhir'>): Promise<void> {
    try {
      const id = `PNL${Date.now()}`;
      
      // Hitung skor total berdasarkan bobot LKPP:
      // Kualitas dan kuantitas: 30%, Biaya: 20%, Waktu: 30%, Layanan: 20%
      const skorTotal = (
        (penilaian.kualitasKuantitasBarangJasa * 0.3) +
        (penilaian.biaya * 0.2) +
        (penilaian.waktu * 0.3) +
        (penilaian.layanan * 0.2)
      );

      // Tentukan penilaian akhir berdasarkan skor total
      let penilaianAkhir: string;
      if (skorTotal === 0) {
        penilaianAkhir = 'Buruk';
      } else if (skorTotal >= 1 && skorTotal < 2) {
        penilaianAkhir = 'Cukup';
      } else if (skorTotal >= 2 && skorTotal < 3) {
        penilaianAkhir = 'Baik';
      } else if (skorTotal === 3) {
        penilaianAkhir = 'Sangat Baik';
      } else {
        penilaianAkhir = 'Cukup'; // fallback
      }

      const values = [[
        id,
        penilaian.idPenyedia,
        penilaian.namaPPK,
        penilaian.satuanKerja,
        penilaian.metodePemilihan,
        penilaian.namaPaket,
        penilaian.jenisPengadaan,
        penilaian.nilaiKontrak,
        penilaian.namaPenyedia,
        penilaian.tanggalPenilaian,
        penilaian.kualitasKuantitasBarangJasa,
        penilaian.komentarKualitasKuantitasBarangJasa,
        penilaian.biaya,
        penilaian.komentarBiaya,
        penilaian.waktu,
        penilaian.komentarWaktu,
        penilaian.layanan,
        penilaian.komentarLayanan,
        penilaianAkhir,
        skorTotal,
        penilaian.keterangan,
        penilaian.status
      ]];

      await this.sheets.spreadsheets.values.append({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: 'Penilaian!A:V',
        valueInputOption: 'RAW',
        resource: { values },
      });
    } catch (error) {
      console.error('Error adding penilaian:', error);
      throw error;
    }
  }

  // Mendapatkan penilaian berdasarkan ID penyedia dengan informasi paket
  async getPenilaianByPenyedia(idPenyedia: string): Promise<Penilaian[]> {
    const allPenilaian = await this.getPenilaian();
    const filteredPenilaian = allPenilaian.filter(penilaian => penilaian.idPenyedia === idPenyedia);
    
    // Jika tidak ada penilaian, kembalikan array kosong
    if (filteredPenilaian.length === 0) {
      return [];
    }
    
    // Dapatkan semua paket untuk mendapatkan informasi tambahan
    const allPaket = await this.getPaket();
    
    // Gabungkan informasi penilaian dengan informasi paket
    return filteredPenilaian.map(penilaian => {
      // Cari paket yang sesuai berdasarkan nama paket dan penyedia
      const paket = allPaket.find(p => 
        p.namaPaket === penilaian.namaPaket && 
        p.kodePenyedia === penilaian.idPenyedia
      );
      
      // Tambahkan informasi paket ke penilaian jika ditemukan
      return {
        ...penilaian,
        kodePaket: paket?.kodePaket || undefined
      };
    });
  }

  // Mendapatkan semua data paket
  async getPaket(): Promise<Paket[]> {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: 'Paket!A2:P', // A2 to P to include all columns
      });

      const rows = response.data.values || [];
      return rows.map((row: any[]) => ({
        tahunAnggaran: row[0] || '',
        kodeSatuanKerja: row[1] || '',
        namaSatuanKerja: row[2] || '',
        kodePaket: row[3] || '',
        kodeRupPaket: row[4] || '',
        pagu: row[5] || '',
        hps: row[6] || '',
        nilaiPenawaran: row[7] || '',
        nilaiTerkoreksi: row[8] || '',
        nilaiNegosiasi: row[9] || '',
        nilaiKontrak: row[10] || '',
        kodePenyedia: row[11] || '',
        namaPenyedia: row[12] || '',
        npwpPenyedia: row[13] || '',
        npwp16Penyedia: row[14] || '',
        penilaian: row[15] || 'Belum', // Default to "Belum"
      }));
    } catch (error) {
      console.error('Error getting paket data:', error);
      throw error;
    }
  }

  // Mendapatkan semua paket dengan data tender pengumuman (untuk admin)
  async getAllPaketWithTenderInfo(): Promise<any[]> {
    // Dapatkan semua paket dan tender pengumuman secara paralel
    const [allPaket, allTenderPengumuman] = await Promise.all([
      this.getPaket(),
      this.getTenderPengumuman()
    ]);
    
    // Gabungkan semua data paket dengan tender pengumuman berdasarkan RUP code
    const enrichedPaket = allPaket.map(paket => {
      const tenderData = allTenderPengumuman.find(tender => 
        tender.kdRup === paket.kodeRupPaket
      );
      
      return {
        ...paket,
        tenderInfo: tenderData || null,
        // Add derived fields for easier access
        namaPaket: tenderData?.namaPaket || `Paket ${paket.kodePaket}`,
        statusTender: tenderData?.statusTender || 'Unknown',
        metodePemilihan: tenderData?.mtdPemilihan || 'Unknown',
        jenisKontrak: tenderData?.kontrakPembayaran || 'Unknown',
        lokasiPekerjaan: tenderData?.lokasiPekerjaan || 'Unknown',
        tanggalPengumuman: tenderData?.tglPengumumanTender || 'Unknown',
        urlLpse: tenderData?.urlLpse || null,
      };
    });
    
    return enrichedPaket;
  }

  // Mendapatkan paket berdasarkan satuan kerja PPK dengan data tender pengumuman
  async getPaketBySatuanKerja(satuanKerjaDetail: string): Promise<any[]> {
    // Dapatkan kode satuan kerja yang valid berdasarkan satuanKerjaDetail
    const validKodeSatuanKerja = await this.getKodeSatuanKerjaByDetail(satuanKerjaDetail);
    
    // Jika tidak ada kode satuan kerja yang valid, kembalikan array kosong
    if (validKodeSatuanKerja.length === 0) {
      return [];
    }
    
    // Dapatkan semua paket dan tender pengumuman secara paralel
    const [allPaket, allTenderPengumuman] = await Promise.all([
      this.getPaket(),
      this.getTenderPengumuman()
    ]);
    
    // Filter paket berdasarkan kode satuan kerja yang valid
    const filteredPaket = allPaket.filter(paket => 
      validKodeSatuanKerja.includes(paket.kodeSatuanKerja)
    );
    
    // Gabungkan data paket dengan tender pengumuman berdasarkan RUP code
    const enrichedPaket = filteredPaket.map(paket => {
      const tenderData = allTenderPengumuman.find(tender => 
        tender.kdRup === paket.kodeRupPaket
      );
      
      return {
        ...paket,
        tenderInfo: tenderData || null,
        // Add derived fields for easier access
        namaPaket: tenderData?.namaPaket || `Paket ${paket.kodePaket}`,
        statusTender: tenderData?.statusTender || 'Unknown',
        metodePemilihan: tenderData?.mtdPemilihan || 'Unknown',
        jenisKontrak: tenderData?.kontrakPembayaran || 'Unknown',
        lokasiPekerjaan: tenderData?.lokasiPekerjaan || 'Unknown',
        tanggalPengumuman: tenderData?.tglPengumumanTender || 'Unknown',
        urlLpse: tenderData?.urlLpse || null,
      };
    });
    
    return enrichedPaket;
  }

  // Mendapatkan paket berdasarkan NIP PPK dengan data tender pengumuman
  async getPaketByNipPpk(nipPpk: string): Promise<any[]> {
    // Dapatkan semua paket dan tender pengumuman secara paralel
    const [allPaket, allTenderPengumuman] = await Promise.all([
      this.getPaket(),
      this.getTenderPengumuman()
    ]);
    
    // Buat map untuk tender pengumuman berdasarkan kdRup untuk akses cepat
    const tenderMap = new Map<string, TenderPengumuman>();
    allTenderPengumuman.forEach(tender => {
      if (tender.nipPpk === nipPpk) {
        tenderMap.set(tender.kdRup, tender);
      }
    });
    
    // Filter paket dan gabungkan dengan data tender pengumuman
    const enrichedPaket = allPaket
      .filter(paket => tenderMap.has(paket.kodeRupPaket))
      .map(paket => {
        const tenderData = tenderMap.get(paket.kodeRupPaket);
        return {
          ...paket,
          tenderInfo: tenderData || null,
          // Add derived fields for easier access
          namaPaket: tenderData?.namaPaket || `Paket ${paket.kodePaket}`,
          statusTender: tenderData?.statusTender || 'Unknown',
          metodePemilihan: tenderData?.mtdPemilihan || 'Unknown',
          jenisKontrak: tenderData?.kontrakPembayaran || 'Unknown',
          lokasiPekerjaan: tenderData?.lokasiPekerjaan || 'Unknown',
          tanggalPengumuman: tenderData?.tglPengumumanTender || 'Unknown',
          urlLpse: tenderData?.urlLpse || null,
        };
      });
    
    return enrichedPaket;
  }

  // Mendapatkan daftar kode satuan kerja yang valid berdasarkan satuanKerjaDetail
  async getKodeSatuanKerjaByDetail(satuanKerjaDetail: string): Promise<string[]> {
    // Dapatkan semua data SATKER
    const allSATKER = await this.getSATKER();
    
    // Filter SATKER berdasarkan satuanKerjaDetail untuk mendapatkan kode satuan kerja yang valid
    return allSATKER
      .filter(item => item.satuanKerjaDetail.toLowerCase() === satuanKerjaDetail.toLowerCase())
      .map(item => item.kodeSatuanKerja)
      .filter(kode => kode && kode.trim() !== ''); // Filter out empty codes
  }

  // Update status penilaian paket
  async updatePenilaianStatus(kodePaket: string, kodePenyedia: string, status: string): Promise<void> {
    try {
      // Get all paket data to find the row to update
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: 'Paket!A2:P',
      });

      const rows = response.data.values || [];
      const rowIndex = rows.findIndex((row: any[]) => 
        row[3] === kodePaket && row[11] === kodePenyedia
      );

      if (rowIndex !== -1) {
        // Update the status in column P (index 15, but in A1 notation it's column P)
        const actualRowNumber = rowIndex + 2; // +2 because we started from A2 and arrays are 0-indexed
        await this.sheets.spreadsheets.values.update({
          spreadsheetId: process.env.GOOGLE_SHEET_ID,
          range: `Paket!P${actualRowNumber}`,
          valueInputOption: 'RAW',
          resource: { values: [[status]] },
        });
      }
    } catch (error) {
      console.error('Error updating penilaian status:', error);
      throw error;
    }
  }

  // Mendapatkan semua data SATKER
  async getSATKER(): Promise<SATKER[]> {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: 'SATKER!A2:F', // Mulai dari baris 2 (skip header) sampai kolom F
      });

      const rows = response.data.values || [];
      return rows.map((row: any[]) => ({
        eselonI: row[0] || '',
        no: row[1] || '',
        satuanKerja: row[2] || '',
        satuanKerjaDetail: row[3] || '',
        kodeSatuanKerja: row[4] || '',
        jenisSatuanKerja: row[5] || '',
      }));
    } catch (error) {
      console.error('Error getting SATKER data:', error);
      throw error;
    }
  }

  // Optimized search method that combines penyedia with ratings
  async searchPenyediaWithRatings(query: string): Promise<any[]> {
    try {
      // Get both penyedia and penilaian data in parallel
      const [penyediaList, penilaianList] = await Promise.all([
        this.searchPenyedia(query),
        this.getPenilaian()
      ]);

      // Combine data efficiently
      const results = penyediaList.map(penyedia => {
        const penilaianPenyedia = penilaianList.filter(pnl => pnl.idPenyedia === penyedia.id);
        const totalPenilaian = penilaianPenyedia.length;
        const rataRataSkor = totalPenilaian > 0 
          ? penilaianPenyedia.reduce((sum, pnl) => sum + pnl.skorTotal, 0) / totalPenilaian
          : 0;

        return {
          ...penyedia,
          totalPenilaian,
          rataRataSkor,
          penilaian: penilaianPenyedia
        };
      });

      // Sort by rating (highest first) and limit results for performance
      return results
        .sort((a, b) => b.rataRataSkor - a.rataRataSkor)
        .slice(0, 20); // Limit to top 20 results
    } catch (error) {
      console.error('Error searching penyedia with ratings:', error);
      throw error;
    }
  }

  // Inisialisasi spreadsheet dengan header jika belum ada
  async initializeSpreadsheet(): Promise<void> {
    try {
      // Header untuk sheet Penyedia
      const penyediaHeaders = [
        'ID Penyedia', 'Nama Perusahaan', 'NPWP'
      ];

      // Header untuk sheet PPK
      const ppkHeaders = [
        'No', 'Eselon I', 'Satuan Kerja', 'Satuan Kerja Detail', 'TA', 'Nama', 'NIP', 'No. HP'
      ];

      // Header untuk sheet Paket
      const paketHeaders = [
        'Tahun Anggaran', 'Kode Satuan Kerja', 'Nama Satuan Kerja', 'Kode Paket', 'Kode RUP Paket',
        'Pagu', 'HPS', 'Nilai Penawaran', 'Nilai Terkoreksi', 'Nilai Negosiasi', 'Nilai Kontrak',
        'Kode Penyedia', 'Nama Penyedia', 'NPWP Penyedia', 'NPWP 16 Penyedia', 'Penilaian'
      ];

      // Header untuk sheet Penilaian
      const penilaianHeaders = [
        'ID Penilaian', 'ID Penyedia', 'Nama PPK', 'Satuan Kerja', 'Metode Pemilihan', 
        'Nama Paket', 'Jenis Pengadaan', 'Nilai Kontrak', 'Nama Penyedia', 'Tanggal Penilaian',
        'Kualitas dan KuantitasBarang/Jasa', 'Komentar Kualitas dan KuantitasBarang/Jasa',
        'Biaya', 'Komentar Biaya', 'Waktu', 'Komentar Waktu',
        'Layanan', 'Komentar Layanan', 'Penilaian Akhir', 'Skor Total', 'Keterangan', 'Status'
      ];

      // Header untuk sheet SATKER
      const satkerHeaders = [
        'Eselon I', 'No', 'Satuan Kerja', 'Satuan Kerja Detail', 'Kode Satuan Kerja', 'Jenis Satuan Kerja'
      ];

      // Cek apakah header sudah ada, jika belum tambahkan
      await this.sheets.spreadsheets.values.update({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: 'Penyedia!A1:C1',
        valueInputOption: 'RAW',
        resource: { values: [penyediaHeaders] },
      });

      await this.sheets.spreadsheets.values.update({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: 'PPK!A1:H1', // Updated range to include new column
        valueInputOption: 'RAW',
        resource: { values: [ppkHeaders] },
      });

      await this.sheets.spreadsheets.values.update({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: 'Paket!A1:P1',
        valueInputOption: 'RAW',
        resource: { values: [paketHeaders] },
      });

      await this.sheets.spreadsheets.values.update({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: 'Penilaian!A1:V1',
        valueInputOption: 'RAW',
        resource: { values: [penilaianHeaders] },
      });

      await this.sheets.spreadsheets.values.update({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: 'SATKER!A1:F1',
        valueInputOption: 'RAW',
        resource: { values: [satkerHeaders] },
      });

      // Header untuk sheet TenderPengumuman
      const tenderPengumumanHeaders = [
        'tahun_anggaran', 'list_tahun_anggaran', 'kd_klpd', 'nama_klpd', 'jenis_klpd', 'kd_satker', 'kd_satker_str', 'nama_satker',
        'kd_lpse', 'nama_lpse', 'kd_tender', 'kd_pkt_dce', 'kd_rup', 'nama_paket', 'pagu', 'hps', 'sumber_dana',
        'kualifikasi_paket', 'jenis_pengadaan', 'mtd_pemilihan', 'mtd_evaluasi', 'mtd_kualifikasi',
        'kontrak_pembayaran', 'status_tender', 'tanggal_status', 'versi_tender', 'ket_ditutup', 'ket_diulang',
        'tgl_buat_paket', 'tgl_kolektif_kolegial', 'tgl_pengumuman_tender', 'nip_ppk', 'nama_ppk',
        'nip_pokja', 'nama_pokja', 'lokasi_pekerjaan', 'url_lpse', '_event_date'
      ];

      await this.sheets.spreadsheets.values.update({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: 'TenderPengumuman!A1:AK1', // Sesuaikan dengan jumlah kolom
        valueInputOption: 'RAW',
        resource: { values: [tenderPengumumanHeaders] },
      });

    } catch (error) {
      console.error('Error initializing spreadsheet:', error);
      throw error;
    }
  }

  // Mendapatkan semua data TenderPengumuman
  async getTenderPengumuman(): Promise<TenderPengumuman[]> {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: 'TenderPengumuman!A2:AK', // Sesuaikan range dengan jumlah kolom yang ada
      });

      const rows = response.data.values || [];
      return rows.map((row: any[]) => ({
        tahunAnggaran: row[0] || '',
        listTahunAnggaran: row[1] || '',
        kdKlpd: row[2] || '',
        namaKlpd: row[3] || '',
        jenisKlpd: row[4] || '',
        kdSatker: row[5] || '',
        kdSatkerStr: row[6] || '',
        namaSatker: row[7] || '',
        kdLpse: row[8] || '',
        namaLpse: row[9] || '',
        kdTender: row[10] || '',
        kdPktDce: row[11] || '',
        kdRup: row[12] || '',
        namaPaket: row[13] || '',
        pagu: row[14] || '',
        hps: row[15] || '',
        sumberDana: row[16] || '',
        kualifikasiPaket: row[17] || '',
        jenisPengadaan: row[18] || '',
        mtdPemilihan: row[19] || '',
        mtdEvaluasi: row[20] || '',
        mtdKualifikasi: row[21] || '',
        kontrakPembayaran: row[22] || '',
        statusTender: row[23] || '',
        tanggalStatus: row[24] || '',
        versiTender: row[25] || '',
        ketDitutup: row[26] || '',
        ketDiulang: row[27] || '',
        tglBuatPaket: row[28] || '',
        tglKolektifKolegial: row[29] || '',
        tglPengumumanTender: row[30] || '',
        nipPpk: row[31] || '',
        namaPpk: row[32] || '',
        nipPokja: row[33] || '',
        namaPokja: row[34] || '',
        lokasiPekerjaan: row[35] || '',
        urlLpse: row[36] || '',
        eventDate: row[37] || '',
      }));
    } catch (error) {
      console.error('Error getting tender pengumuman data:', error);
      throw error;
    }
  }

  // Export comprehensive report data to Laporan sheet
  async exportToLaporan(data: any[]): Promise<void> {
    try {
      if (!data || data.length === 0) {
        console.log('No data to export');
        return;
      }

      // Prepare headers from the first data object
      const headers = Object.keys(data[0]);
      
      // Prepare values array - first row is headers, then all data rows
      const values = [headers, ...data.map(item => headers.map(header => item[header] || ''))];

      // Clear the Laporan sheet first (if it exists) or create it
      await this.sheets.spreadsheets.values.clear({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: 'Laporan!A:ZZ',  // Clear a large range to ensure we clear the sheet
      });

      // Write the header and data to the Laporan sheet
      await this.sheets.spreadsheets.values.update({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: 'Laporan!A1',  // Start from A1
        valueInputOption: 'RAW',
        resource: { values },
      });

      console.log(`Successfully exported ${data.length} records to Laporan sheet`);
    } catch (error) {
      console.error('Error exporting to Laporan sheet:', error);
      throw error;
    }
  }
  
  // Generate comprehensive report data similar to the prepareExportData function in laporan page
  async generateLaporanData(): Promise<any[]> {
    try {
      // Get all necessary data
      const [penyedia, penilaian, ppk] = await Promise.all([
        this.getPenyedia(),
        this.getPenilaian(),
        this.getPPK()
      ]);

      // Calculate Wilson Score Confidence Interval
      const calculateWilsonScore = (successRate: number, totalSamples: number, confidence: number = 1.96): number => {
        if (totalSamples === 0) return 0;
        
        const p = successRate;
        const n = totalSamples;
        const z = confidence; // 1.96 for 95% confidence interval
        
        const numerator = p + (z * z) / (2 * n) - z * Math.sqrt((p * (1 - p) + (z * z) / (4 * n)) / n);
        const denominator = 1 + (z * z) / n;
        
        return Math.max(0, numerator / denominator);
      };

      // Convert LKPP score (1-3) to Wilson Score
      const calculateProviderWilsonScore = (rataRataSkor: number, totalPenilaian: number): number => {
        if (totalPenilaian === 0) return 0;
        
        // Convert score 1-3 to success rate (0-1)
        // Score 1 = 0% success, Score 2 = 50% success, Score 3 = 100% success
        const successRate = Math.max(0, Math.min(1, (rataRataSkor - 1) / 2));
        
        const wilsonScore = calculateWilsonScore(successRate, totalPenilaian);
        
        // Convert back to 1-3 scale
        return 1 + (wilsonScore * 2);
      };

      // Get rating text based on LKPP scale
      const getRatingText = (rating: number) => {
        if (rating === 3) return 'Sangat Baik';
        if (rating >= 2 && rating < 3) return 'Baik';
        if (rating >= 1 && rating < 2) return 'Cukup';
        if (rating === 0) return 'Buruk';
        return 'Cukup'; // fallback
      };

      // Helper function to get criteria rating
      const getCriteriaRating = (score: number) => {
        if (score >= 2.5) return 'Sangat Baik';
        if (score >= 2.0) return 'Baik';
        if (score >= 1.5) return 'Cukup';
        return 'Perlu Perbaikan';
      };

      // Combine data for each provider
      const combinedData = penyedia.map(p => {
        const penilaianPenyedia = penilaian.filter(pnl => pnl.idPenyedia === p.id);
        const totalPenilaian = penilaianPenyedia.length;
        const rataRataSkor = totalPenilaian > 0 
          ? penilaianPenyedia.reduce((sum, pnl) => sum + pnl.skorTotal, 0) / totalPenilaian
          : 0;
          
        // Sort penilaian by date without mutating the original array
        const sortedPenilaian = [...penilaianPenyedia].sort((a, b) => 
          new Date(b.tanggalPenilaian).getTime() - new Date(a.tanggalPenilaian).getTime()
        );
        
        const penilaianTerbaru = totalPenilaian > 0
          ? sortedPenilaian[0].tanggalPenilaian
          : '-';

        // Calculate criteria averages
        const avgKualitas = penilaianPenyedia.length > 0 
          ? penilaianPenyedia.reduce((sum, p) => sum + (p.kualitasKuantitasBarangJasa || 0), 0) / penilaianPenyedia.length
          : 0;
        const avgBiaya = penilaianPenyedia.length > 0 
          ? penilaianPenyedia.reduce((sum, p) => sum + (p.biaya || 0), 0) / penilaianPenyedia.length
          : 0;
        const avgWaktu = penilaianPenyedia.length > 0 
          ? penilaianPenyedia.reduce((sum, p) => sum + (p.waktu || 0), 0) / penilaianPenyedia.length
          : 0;
        const avgLayanan = penilaianPenyedia.length > 0 
          ? penilaianPenyedia.reduce((sum, p) => sum + (p.layanan || 0), 0) / penilaianPenyedia.length
          : 0;

        // Calculate standard deviation for consistency analysis
        const scores = penilaianPenyedia.map(p => p.skorTotal);
        const mean = rataRataSkor;
        const variance = scores.length > 1 
          ? scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / (scores.length - 1)
          : 0;
        const stdDev = Math.sqrt(variance);

        // Get unique PPKs who evaluated this provider
        const uniquePPKs = Array.from(new Set(penilaianPenyedia.map(p => p.namaPPK))).length;

        // Calculate trend (compare first half vs second half of evaluations)
        let trend = 'Stabil';
        if (penilaianPenyedia.length >= 4) {
          const sortedEvals = [...penilaianPenyedia].sort((a, b) => 
            new Date(a.tanggalPenilaian).getTime() - new Date(b.tanggalPenilaian).getTime()
          );
          const midIndex = Math.floor(sortedEvals.length / 2);
          const firstHalf = sortedEvals.slice(0, midIndex);
          const secondHalf = sortedEvals.slice(midIndex);
          
          const avgFirst = firstHalf.reduce((sum, p) => sum + p.skorTotal, 0) / firstHalf.length;
          const avgSecond = secondHalf.reduce((sum, p) => sum + p.skorTotal, 0) / secondHalf.length;
          
          if (avgSecond > avgFirst + 0.2) trend = 'Meningkat';
          else if (avgSecond < avgFirst - 0.2) trend = 'Menurun';
        }

        // Get evaluation period
        const dates = penilaianPenyedia.map(p => new Date(p.tanggalPenilaian));
        const earliestDate = dates.length > 0 ? new Date(Math.min(...dates.map(d => d.getTime()))) : null;
        const latestDate = dates.length > 0 ? new Date(Math.max(...dates.map(d => d.getTime()))) : null;

        // Calculate Wilson Score
        const wilsonScore = calculateProviderWilsonScore(rataRataSkor, totalPenilaian);

        return {
          // === INFORMASI DASAR PENYEDIA ===
          'ID Penyedia': p.id,
          'Nama Perusahaan': p.namaPerusahaan,
          'NPWP': p.npwp,

          // === STATISTIK PENILAIAN KESELURUHAN ===
          'Total Penilaian': totalPenilaian,
          'Rata-rata Skor Keseluruhan': rataRataSkor.toFixed(2),
          'Rating Kategori': getRatingText(rataRataSkor),
          'Wilson Score': wilsonScore.toFixed(3),
          'Penilaian Terbaru': penilaianTerbaru !== '-' 
            ? new Date(penilaianTerbaru).toLocaleDateString('id-ID')
            : 'Belum ada',

          // === ANALISIS PER ASPEK PENILAIAN ===
          'Rata-rata Kualitas': avgKualitas.toFixed(2),
          'Rating Kualitas': getCriteriaRating(avgKualitas),
          'Rata-rata Biaya': avgBiaya.toFixed(2),
          'Rating Biaya': getCriteriaRating(avgBiaya),
          'Rata-rata Waktu': avgWaktu.toFixed(2),
          'Rating Waktu': getCriteriaRating(avgWaktu),
          'Rata-rata Layanan': avgLayanan.toFixed(2),
          'Rating Layanan': getCriteriaRating(avgLayanan),

          // === METADATA UNTUK ANALISIS ===
          'Jumlah PPK Penilai': uniquePPKs,
          'Konsistensi Penilaian (StdDev)': stdDev.toFixed(3),
          'Trend Penilaian': trend,
          'Periode Evaluasi Awal': earliestDate ? earliestDate.toLocaleDateString('id-ID') : '-',
          'Periode Evaluasi Akhir': latestDate ? latestDate.toLocaleDateString('id-ID') : '-',
          'Rentang Evaluasi (Hari)': earliestDate && latestDate 
            ? Math.ceil((latestDate.getTime() - earliestDate.getTime()) / (1000 * 60 * 60 * 24))
            : 0,

          // === DETAIL RIWAYAT PENILAIAN (untuk analisis mendalam) ===
          'Riwayat Penilaian': penilaianPenyedia.map((evaluation, index) => 
            `[${index + 1}] ${new Date(evaluation.tanggalPenilaian).toLocaleDateString('id-ID')} - ${evaluation.namaPPK} - Skor: ${evaluation.skorTotal} (K:${evaluation.kualitasKuantitasBarangJasa || 0}, B:${evaluation.biaya || 0}, W:${evaluation.waktu || 0}, L:${evaluation.layanan || 0}) - ${evaluation.penilaianAkhir || getRatingText(evaluation.skorTotal)}`
          ).join(' | '),

          // === ANALISIS TAMBAHAN ===
          'Skor Tertinggi': penilaianPenyedia.length > 0 ? Math.max(...scores).toFixed(1) : '-',
          'Skor Terendah': penilaianPenyedia.length > 0 ? Math.min(...scores).toFixed(1) : '-',
          'Persentase Penilaian Sangat Baik': penilaianPenyedia.length > 0 
            ? ((penilaianPenyedia.filter(p => p.skorTotal >= 2.5).length / penilaianPenyedia.length) * 100).toFixed(1) + '%'
            : '0%',
          'Persentase Penilaian Baik': penilaianPenyedia.length > 0 
            ? ((penilaianPenyedia.filter(p => p.skorTotal >= 2 && p.skorTotal < 2.5).length / penilaianPenyedia.length) * 100).toFixed(1) + '%'
            : '0%',
          'Persentase Penilaian Cukup': penilaianPenyedia.length > 0 
            ? ((penilaianPenyedia.filter(p => p.skorTotal >= 1 && p.skorTotal < 2).length / penilaianPenyedia.length) * 100).toFixed(1) + '%'
            : '0%'
        }
      });

      return combinedData;
    } catch (error) {
      console.error('Error generating laporan data:', error);
      throw error;
    }
  }
  
  // Update Laporan sheet with comprehensive report data
  async updateLaporanSheet(): Promise<void> {
    try {
      // Generate the latest report data
      const data = await this.generateLaporanData();
      
      if (!data || data.length === 0) {
        console.log('No data to update in Laporan sheet');
        return;
      }

      // Prepare headers from the first data object
      const headers = Object.keys(data[0]);
      
      // Prepare values array - first row is headers, then all data rows
      const values = [headers, ...data.map(item => headers.map(header => item[header] || ''))];

      // Clear the Laporan sheet first (if it exists) or create it
      await this.sheets.spreadsheets.values.clear({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: 'Laporan!A:ZZ',  // Clear a large range to ensure we clear the sheet
      });

      // Write the header and data to the Laporan sheet
      await this.sheets.spreadsheets.values.update({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: 'Laporan!A1',  // Start from A1
        valueInputOption: 'RAW',
        resource: { values },
      });

      console.log(`Successfully updated Laporan sheet with ${data.length} records`);
    } catch (error) {
      console.error('Error updating Laporan sheet:', error);
      throw error;
    }
  }
}

export const googleSheetsService = new GoogleSheetsService();
