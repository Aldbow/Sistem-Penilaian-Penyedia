import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Image from 'next/image'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { ThemeToggle } from '@/components/theme-toggle'
import { ThemeScript } from './theme-script'
import { AnimatedLayout } from '@/components/animated-layout'
import { Toaster } from '@/components/ui/toaster'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { MapPin, Phone } from 'lucide-react'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-inter'
})

export const metadata: Metadata = {
  title: 'Sistem Penilaian Penyedia UKPBJ Kemnaker',
  description: 'Sistem penilaian penyedia barang/jasa untuk PPK sesuai standar UKPBJ Kemnaker',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-192x192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className={`${inter.variable} font-sans`} suppressHydrationWarning>
        <ThemeProvider
          defaultTheme="light"
          storageKey="kemnaker-theme"
        >
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex flex-col">
          <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50 sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
              <div className="flex justify-between items-center py-3 lg:py-4">
                <div className="flex items-center space-x-2 lg:space-x-3">
                  <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg flex items-center justify-center p-1">
                    <Image 
                      src="/Logo_Kemnaker.png" 
                      alt="Logo Kemnaker" 
                      width={32}
                      height={32}
                      className="w-full h-full object-contain"
                      priority
                    />
                  </div>
                  {/* <h1 className="hidden md:block text-lg lg:text-2xl font-bold text-slate-800 dark:text-white">
                    Sistem Penilaian Penyedia UKPBJ Kemnaker
                  </h1> */}
                </div>
                <nav className="flex items-center space-x-1 sm:space-x-2">
                  <a href="/" className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-300">
                    <span className="hidden sm:inline">Beranda</span>
                    <span className="sm:hidden">Home</span>
                  </a>
                  <a href="/penilaian" className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-300">
                    <span className="hidden sm:inline">Penilaian</span>
                    <span className="sm:hidden">Nilai</span>
                  </a>
                  <a href="/laporan" className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-300">
                    Laporan
                  </a>
                  <a href="/dashboard" className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-300">
                    Dashboard
                  </a>
                  <ThemeToggle />
                </nav>
              </div>
            </div>
          </header>
          <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full mb-24">
            <AnimatedLayout>
              {children}
            </AnimatedLayout>
          </main>
          <footer className="bg-gradient-to-r from-slate-900 to-blue-900 text-white mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {/* Brand and Description */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Image 
                      src="/Logo_Kemnaker.png" 
                      alt="Logo Kemnaker" 
                      width={32}
                      height={32}
                      className="w-10 h-10 object-contain"
                    />
                    <span className="text-xl font-bold">UKPBJ Kemnaker</span>
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    Sistem penilaian penyedia barang/jasa untuk Pejabat Pembuat Komitmen sesuai standar UKPBJ Kemnaker.
                  </p>
                  <div className="flex space-x-4">
                    <a href="#" className="text-slate-300 hover:text-white transition-colors">
                      <span className="sr-only">Instagram</span>
                      <div className="bg-white/10 rounded-full p-2">
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </a>
                    <a href="#" className="text-slate-300 hover:text-white transition-colors">
                      <span className="sr-only">GitHub</span>
                      <div className="bg-white/10 rounded-full p-2">
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </a>
                    <a href="#" className="text-slate-300 hover:text-white transition-colors">
                      <span className="sr-only">LinkedIn</span>
                      <div className="bg-white/10 rounded-full p-2">
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                        </svg>
                      </div>
                    </a>
                  </div>
                </div>

                {/* Quick Links */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Navigasi</h3>
                  <ul className="space-y-3">
                    <li>
                      <a href="/" className="text-slate-300 hover:text-white transition-colors flex items-center">
                        <span className="ml-2">Beranda</span>
                      </a>
                    </li>
                    <li>
                      <a href="/penilaian" className="text-slate-300 hover:text-white transition-colors flex items-center">
                        <span className="ml-2">Penilaian</span>
                      </a>
                    </li>
                    <li>
                      <a href="/laporan" className="text-slate-300 hover:text-white transition-colors flex items-center">
                        <span className="ml-2">Laporan</span>
                      </a>
                    </li>
                    <li>
                      <a href="/dashboard" className="text-slate-300 hover:text-white transition-colors flex items-center">
                        <span className="ml-2">Dashboard</span>
                      </a>
                    </li>
                  </ul>
                </div>

                {/* Resources */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Sumber Daya</h3>
                  <ul className="space-y-3">
                    <li>
                      <a href="#" className="text-slate-300 hover:text-white transition-colors flex items-center">
                        <span className="ml-2">Dokumentasi</span>
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-slate-300 hover:text-white transition-colors flex items-center">
                        <span className="ml-2">Panduan Pengguna</span>
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-slate-300 hover:text-white transition-colors flex items-center">
                        <span className="ml-2">FAQ</span>
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-slate-300 hover:text-white transition-colors flex items-center">
                        <span className="ml-2">Kebijakan Privasi</span>
                      </a>
                    </li>
                  </ul>
                </div>

                {/* Contact Info */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Kontak</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <MapPin className="h-5 w-5 text-slate-400 mt-0.5 flex-shrink-0" />
                      <span className="ml-3 text-slate-300">Jl. Jenderal Gatot Subroto No. 51, Jakarta Selatan 12190</span>
                    </li>
                    <li className="flex items-center">
                      <Phone className="h-5 w-5 text-slate-400 flex-shrink-0" />
                      <span className="ml-3 text-slate-300">(021) 12345678</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="ml-3 text-slate-300">info@kemnaker.go.id</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="border-t border-slate-700/50 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
                <p className="text-slate-400 text-sm">
                  © {new Date().getFullYear()} Sistem Penilaian Penyedia UKPBJ Kemnaker. Hak Cipta Dilindungi.
                </p>
                <div className="mt-4 md:mt-0">
                  <ul className="flex space-x-6">
                    <li>
                      <a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">
                        Syarat & Ketentuan
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">
                        Kebijakan Privasi
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </footer>
          </div>
          <Toaster />
          <SpeedInsights />
        </ThemeProvider>
        <div id="modal-root" />
      </body>
    </html>
  )
}
