import { NextRequest } from 'next/server';
import { googleSheetsService } from '@/lib/google-sheets';

export async function POST(request: NextRequest) {
  try {
    // Get the data from the request body
    const data = await request.json();

    // Validate the data
    if (!data || !Array.isArray(data)) {
      return new Response(
        JSON.stringify({ error: 'Invalid data format. Expected an array of records.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Export the data to the Laporan sheet
    await googleSheetsService.exportToLaporan(data);

    return new Response(
      JSON.stringify({ message: `Successfully exported ${data.length} records to Laporan sheet` }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in export laporan API:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to export data to Laporan sheet', details: (error as Error).message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}