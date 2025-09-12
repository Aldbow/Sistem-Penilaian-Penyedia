// Test file untuk fungsi google-sheets.ts
// Ini adalah simulasi sederhana untuk memverifikasi logika yang telah diubah

// Mock data untuk testing
const mockSATKER = [
  {
    eselonI: "Eselon I Test",
    no: "1",
    satuanKerja: "Satuan Kerja Test",
    satuanKerjaDetail: "Detail Test",
    kodeSatuanKerja: "KODE-001",
    jenisSatuanKerja: "Jenis Test"
  },
  {
    eselonI: "Eselon I Test",
    no: "2",
    satuanKerja: "Satuan Kerja Test",
    satuanKerjaDetail: "Detail Test",
    kodeSatuanKerja: "KODE-002",
    jenisSatuanKerja: "Jenis Test"
  }
];

const mockPaket = [
  {
    tahunAnggaran: "2023",
    kodeSatuanKerja: "KODE-001",
    namaSatuanKerja: "Satuan Kerja Test",
    kodePaket: "PAKET-001",
    kodeRupPaket: "RUP-001",
    pagu: "1000000000",
    hps: "900000000",
    nilaiPenawaran: "850000000",
    nilaiTerkoreksi: "850000000",
    nilaiNegosiasi: "850000000",
    nilaiKontrak: "850000000",
    kodePenyedia: "PYD-001",
    namaPenyedia: "Penyedia Test",
    npwpPenyedia: "123456789012345",
    npwp16Penyedia: "1234567890123456",
    penilaian: "Belum"
  },
  {
    tahunAnggaran: "2023",
    kodeSatuanKerja: "KODE-003", // Kode yang tidak ada di SATKER
    namaSatuanKerja: "Satuan Kerja Lain",
    kodePaket: "PAKET-002",
    kodeRupPaket: "RUP-002",
    pagu: "2000000000",
    hps: "1800000000",
    nilaiPenawaran: "1700000000",
    nilaiTerkoreksi: "1700000000",
    nilaiNegosiasi: "1700000000",
    nilaiKontrak: "1700000000",
    kodePenyedia: "PYD-002",
    namaPenyedia: "Penyedia Lain",
    npwpPenyedia: "987654321098765",
    npwp16Penyedia: "9876543210987654",
    penilaian: "Belum"
  }
];

// Simulasi fungsi getPaketBySatuanKerja
function getPaketBySatuanKerja(satuanKerjaDetail: string): any[] {
  // Filter SATKER berdasarkan satuanKerjaDetail untuk mendapatkan kode satuan kerja yang valid
  const validKodeSatuanKerja = mockSATKER
    .filter(item => item.satuanKerjaDetail.toLowerCase() === satuanKerjaDetail.toLowerCase())
    .map(item => item.kodeSatuanKerja)
    .filter(kode => kode && kode.trim() !== ''); // Filter out empty codes
  
  // Jika tidak ada kode satuan kerja yang valid, kembalikan array kosong
  if (validKodeSatuanKerja.length === 0) {
    return [];
  }
  
  // Filter paket berdasarkan kode satuan kerja yang valid
  return mockPaket.filter(paket => 
    validKodeSatuanKerja.includes(paket.kodeSatuanKerja)
  );
}

// Test case
console.log("Testing getPaketBySatuanKerja function:");
console.log("Input: 'Detail Test'");
const result = getPaketBySatuanKerja("Detail Test");
console.log("Output:", result);
console.log("Expected: Hanya paket dengan kode KODE-001");
console.log("Test passed:", result.length === 1 && result[0].kodeSatuanKerja === "KODE-001");

console.log("\nTesting with non-existent satuanKerjaDetail:");
const result2 = getPaketBySatuanKerja("Non Existent");
console.log("Output:", result2);
console.log("Expected: Array kosong");
console.log("Test passed:", result2.length === 0);