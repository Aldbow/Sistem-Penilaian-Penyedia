"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Mail, Phone, MapPin, Clock, User, Building, MessageSquare, Send } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{type: "success" | "error" | null, message: string}>({type: null, message: ""});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({type: null, message: ""});
    
    try {
      // Simulasi pengiriman form (dalam implementasi nyata, ini akan mengirim ke API)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSubmitStatus({
        type: "success",
        message: "Pesan Anda telah berhasil dikirim. Kami akan segera menghubungi Anda."
      });
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: "Terjadi kesalahan saat mengirim pesan. Silakan coba lagi."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: <Mail className="h-6 w-6" />,
      title: "Email",
      content: "ukpbj@kemnaker.go.id",
      description: "Untuk pertanyaan umum dan permintaan informasi"
    },
    {
      icon: <Phone className="h-6 w-6" />,
      title: "Telepon",
      content: "(021) 12345678",
      description: "Senin - Jumat, 08:00 - 16:00 WIB"
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: "Alamat",
      content: "Jl. Jenderal Gatot Subroto No. 51",
      description: "Jakarta Selatan 12190, Indonesia"
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Jam Kerja",
      content: "Senin - Jumat",
      description: "08:00 - 17:00 WIB"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Link 
            href="/" 
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-300"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Kembali ke Beranda
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-700 to-blue-600 dark:from-blue-400 dark:to-blue-300 bg-clip-text text-transparent mb-4">
            Hubungi Kami
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Punya pertanyaan atau masukan? Tim kami siap membantu Anda. Silakan isi formulir di bawah 
            atau hubungi kami melalui informasi kontak yang tersedia.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <MessageSquare className="h-6 w-6 mr-3" />
                Kirim Pesan
              </h2>
              <p className="text-blue-100 mt-2">
                Kami akan merespon pesan Anda dalam 1x24 jam kerja
              </p>
            </div>
            
            <div className="p-6 sm:p-8">
              {submitStatus.type && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-xl mb-6 ${
                    submitStatus.type === "success" 
                      ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700" 
                      : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700"
                  }`}
                >
                  <p className={`text-center ${
                    submitStatus.type === "success" 
                      ? "text-green-700 dark:text-green-300" 
                      : "text-red-700 dark:text-red-300"
                  }`}>
                    {submitStatus.message}
                  </p>
                </motion.div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Nama Lengkap
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="block w-full pl-10 pr-3 py-4 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-2xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-base"
                      placeholder="Nama Anda"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="block w-full pl-10 pr-3 py-4 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-2xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-base"
                      placeholder="email@contoh.com"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Subjek
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Building className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="block w-full pl-10 pr-3 py-4 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-2xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-base"
                      placeholder="Subjek pesan"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Pesan
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="block w-full px-4 py-4 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-2xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-base resize-none"
                    placeholder="Tulis pesan Anda di sini..."
                  ></textarea>
                </div>
                
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-base disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Mengirim Pesan...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5 mr-2" />
                      Kirim Pesan
                    </>
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>
          
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-8"
          >
            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
                <h2 className="text-2xl font-bold text-white flex items-center">
                  <MapPin className="h-6 w-6 mr-3" />
                  Informasi Kontak
                </h2>
                <p className="text-blue-100 mt-2">
                  Hubungi kami melalui saluran berikut
                </p>
              </div>
              
              <div className="p-6 sm:p-8">
                <div className="space-y-6">
                  {contactInfo.map((info, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 * index }}
                      className="flex items-start"
                    >
                      <div className="flex-shrink-0 p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400">
                        {info.icon}
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-white">{info.title}</h3>
                        <p className="text-slate-600 dark:text-slate-300 font-medium mt-1">{info.content}</p>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{info.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-slate-800 dark:to-slate-700 rounded-3xl shadow-2xl p-8 border border-blue-200 dark:border-slate-600">
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">Jam Kerja</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-600">
                  <span className="text-slate-600 dark:text-slate-300">Senin - Jumat</span>
                  <span className="font-medium text-slate-800 dark:text-white">08:00 - 17:00 WIB</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-600">
                  <span className="text-slate-600 dark:text-slate-300">Istirahat</span>
                  <span className="font-medium text-slate-800 dark:text-white">12:00 - 13:00 WIB</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 dark:text-slate-300">Akhir Pekan</span>
                  <span className="font-medium text-slate-800 dark:text-white">Tutup</span>
                </div>
              </div>
              
              <div className="mt-8 p-4 bg-blue-100 dark:bg-blue-900/20 rounded-xl">
                <p className="text-slate-700 dark:text-slate-300 text-sm">
                  <span className="font-semibold">Catatan:</span> Untuk permintaan mendesak di luar jam kerja, 
                  silakan kirim email ke emergency@kemnaker.go.id
                </p>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-16 text-center p-8 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-slate-800 dark:to-slate-700 rounded-3xl border border-blue-200 dark:border-slate-600"
        >
          <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">
            Pertanyaan yang Sering Diajukan
          </h3>
          <p className="text-slate-600 dark:text-slate-300 mb-6 max-w-2xl mx-auto">
            Temukan jawaban untuk pertanyaan umum di halaman FAQ kami sebelum menghubungi tim support.
          </p>
          <Link 
            href="/faq"
            className="inline-flex items-center px-6 py-3 bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-medium rounded-xl border border-blue-200 dark:border-slate-600 hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors duration-300 shadow-lg hover:shadow-xl"
          >
            Lihat Pertanyaan Umum
            <ArrowLeft className="h-5 w-5 ml-2 rotate-180" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}