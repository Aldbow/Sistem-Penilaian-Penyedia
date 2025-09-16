import { NextRequest, NextResponse } from 'next/server';
import { googleSheetsService } from '@/lib/google-sheets';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const satuanKerjaDetail = searchParams.get('satuanKerjaDetail');

    if (!satuanKerjaDetail) {
      return NextResponse.json(
        { error: 'Parameter satuanKerjaDetail diperlukan' },
        { status: 400 }
      );
    }

    // Check if user is admin - admin can access all packages
    const isAdmin = satuanKerjaDetail.toUpperCase() === 'ADMIN';
    
    let paketList;
    if (isAdmin) {
      // Admin gets all packages with enriched data
      paketList = await googleSheetsService.getAllPaketWithTenderInfo();
    } else {
      // Regular PPK gets filtered packages by their satuan kerja detail
      paketList = await googleSheetsService.getPaketBySatuanKerja(satuanKerjaDetail);
    }

    return NextResponse.json(paketList);
  } catch (error) {
    console.error('Error fetching paket data:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data paket' },
      { status: 500 }
    );
  }
}
