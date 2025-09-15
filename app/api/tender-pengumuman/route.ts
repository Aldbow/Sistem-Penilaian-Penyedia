import { NextRequest, NextResponse } from 'next/server';
import { googleSheetsService } from '@/lib/google-sheets';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const kdRup = searchParams.get('kdRup');

    // Get all tender pengumuman data
    let tenderPengumumanList = await googleSheetsService.getTenderPengumuman();

    // Filter by kdRup if provided
    if (kdRup) {
      tenderPengumumanList = tenderPengumumanList.filter(
        (tender) => tender.kdRup === kdRup
      );
    }

    return NextResponse.json(tenderPengumumanList);
  } catch (error) {
    console.error('Error fetching tender pengumuman data:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data tender pengumuman' },
      { status: 500 }
    );
  }
}