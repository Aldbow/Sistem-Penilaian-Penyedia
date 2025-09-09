import { NextRequest, NextResponse } from 'next/server';
import { googleSheetsService } from '@/lib/google-sheets';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const penilaian = await googleSheetsService.getPenilaianByPenyedia(id);
    return NextResponse.json(penilaian);
  } catch (error) {
    console.error('Error fetching penilaian:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data penilaian' },
      { status: 500 }
    );
  }
}