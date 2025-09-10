import { NextRequest, NextResponse } from 'next/server'
import { googleSheetsService } from '@/lib/google-sheets'

export async function POST(request: NextRequest) {
  try {
    const { nip, eselonI, satuanKerja } = await request.json()

    if (!nip || !eselonI || !satuanKerja) {
      return NextResponse.json(
        { error: 'Semua field harus diisi (NIP, Eselon I, dan Satuan Kerja)' },
        { status: 400 }
      )
    }

    // Get all PPK data
    const allPPK = await googleSheetsService.getPPK()
    
    // Find PPK with matching fields (exact match for all)
    const matchedPPK = allPPK.find(ppk => 
      ppk.nip.trim() === nip.trim() &&
      ppk.eselonI.trim() === eselonI.trim() &&
      ppk.satuanKerja.trim() === satuanKerja.trim()
    )

    if (matchedPPK) {
      return NextResponse.json({
        success: true,
        ppk: matchedPPK,
        message: 'Validasi PPK berhasil'
      })
    } else {
      return NextResponse.json(
        { 
          success: false,
          error: 'Data yang dimasukkan tidak sesuai dengan data PPK yang terdaftar. Pastikan NIP, Eselon I, dan Satuan Kerja benar.' 
        },
        { status: 401 }
      )
    }

  } catch (error) {
    console.error('Error validating PPK:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat validasi PPK' },
      { status: 500 }
    )
  }
}
