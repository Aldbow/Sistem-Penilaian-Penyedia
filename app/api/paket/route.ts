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

    // Get paket data filtered by satuan kerja detail
    const paketList = await googleSheetsService.getPaketBySatuanKerja(satuanKerjaDetail);

    return NextResponse.json(paketList);
  } catch (error) {
    console.error('Error fetching paket data:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data paket' },
      { status: 500 }
    );
  }
}
