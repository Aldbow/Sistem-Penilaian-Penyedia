import { NextResponse } from 'next/server'
import { googleSheetsService } from '@/lib/google-sheets'

export async function GET(request: Request) {
  try {
    // Get all PPK data
    const allPPK = await googleSheetsService.getPPK()
    
    // Get SATKER data for filtering
    const allSATKER = await googleSheetsService.getSATKER()
    
    // Extract unique values
    const eselonISet = new Set<string>()
    const satuanKerjaSet = new Set<string>()
    
    allPPK.forEach(ppk => {
      if (ppk.eselonI && ppk.eselonI.trim()) {
        eselonISet.add(ppk.eselonI.trim())
      }
      if (ppk.satuanKerja && ppk.satuanKerja.trim()) {
        satuanKerjaSet.add(ppk.satuanKerja.trim())
      }
    })

    // Convert to sorted arrays
    const eselonIOptions = Array.from(eselonISet)
      .sort()
      .map(value => ({ value, label: value }))
    
    // Get query parameters
    const { searchParams } = new URL(request.url)
    const eselonIParam = searchParams.get('eselonI')
    
    let satuanKerjaOptions = Array.from(satuanKerjaSet)
      .sort()
      .map(value => ({ value, label: value }))

    // If eselonI is provided, filter satuan kerja based on SATKER data
    if (eselonIParam) {
      const filteredSATKER = allSATKER.filter(item => 
        item.eselonI.trim().toLowerCase() === eselonIParam.trim().toLowerCase()
      )
      
      const filteredSatuanKerjaSet = new Set<string>()
      filteredSATKER.forEach(item => {
        if (item.satuanKerja && item.satuanKerja.trim()) {
          filteredSatuanKerjaSet.add(item.satuanKerja.trim())
        }
      })
      
      satuanKerjaOptions = Array.from(filteredSatuanKerjaSet)
        .sort()
        .map(value => ({ value, label: value }))
    }

    return NextResponse.json({
      eselonI: eselonIOptions,
      satuanKerja: satuanKerjaOptions
    })

  } catch (error) {
    console.error('Error fetching PPK options:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengambil data PPK' },
      { status: 500 }
    )
  }
}
