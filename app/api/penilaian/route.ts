import { NextRequest, NextResponse } from 'next/server';
import { googleSheetsService } from '@/lib/google-sheets';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const idPenyedia = searchParams.get('idPenyedia');

    if (idPenyedia) {
      const penilaian = await googleSheetsService.getPenilaianByPenyedia(idPenyedia);
      return NextResponse.json(penilaian);
    } else {
      const penilaian = await googleSheetsService.getPenilaian();
      return NextResponse.json(penilaian);
    }
  } catch (error) {
    console.error('Error fetching penilaian:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data penilaian' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields for new structure
    const requiredFields = [
      'idPenyedia', 'namaPPK', 'satuanKerja', 'metodePemilihan', 
      'namaPaket', 'jenisPengadaan', 'nilaiKontrak', 'namaPenyedia', 
      'tanggalPenilaian', 'kualitasKuantitasBarangJasa', 'biaya', 
      'waktu', 'layanan', 'keterangan', 'status'
    ];
    
    for (const field of requiredFields) {
      if (body[field] === undefined || body[field] === null) {
        return NextResponse.json(
          { error: `Field ${field} is required` },
          { status: 400 }
        );
      }
    }
    
    // Add penilaian with new structure
    await googleSheetsService.addPenilaian(body);
    
    // Update paket status from "Belum" to "Sudah" if kodePaket and kodePenyedia are provided
    if (body.kodePaket && body.kodePenyedia) {
      await googleSheetsService.updatePenilaianStatus(body.kodePaket, body.kodePenyedia, 'Sudah');
    }
    
    return NextResponse.json({ message: 'Penilaian berhasil disimpan' });
  } catch (error) {
    console.error('Error adding penilaian:', error);
    return NextResponse.json(
      { error: 'Gagal menyimpan penilaian' },
      { status: 500 }
    );
  }
}
