"use client"

import { FaPhoneAlt, FaEnvelope, FaLock } from "react-icons/fa"

export default function ContactUs() {
  return (
    <div className="w-full py-16 bg-[#111827]">
      <div className="container px-4 mx-auto max-w-7xl">
        <div className="max-w-2xl mx-auto mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">Contactez-nous</h2>
          <p className="text-lg leading-relaxed text-gray-400">
            Notre équipe est là pour vous aider. N'hésitez pas à nous contacter pour toute question.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-2">
          {/* Contact Information */}
          <div className="order-2 lg:order-1">
            <div className="grid gap-8">
              {/* Contact Cards */}
              <div className="p-6 transition-all duration-300 bg-[#1F2937] rounded-2xl hover:bg-[#1a232e]">
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-[#374151] to-[#1F2937]">
                    <FaPhoneAlt className="w-5 h-5 text-gray-300" />
                  </div>
                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-white">Téléphone</h3>
                    <p className="mb-1 text-gray-400 hover:text-white">+216 50 548 028</p>
                    <p className="text-gray-400 hover:text-white">+216 26 167 722</p>
                  </div>
                </div>
              </div>

              <div className="p-6 transition-all duration-300 bg-[#1F2937] rounded-2xl hover:bg-[#1a232e]">
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-[#374151] to-[#1F2937]">
                    <FaEnvelope className="w-5 h-5 text-gray-300" />
                  </div>
                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-white">Email</h3>
                    <p className="text-gray-400 hover:text-white">support@novares.com</p>
                  </div>
                </div>
              </div>

              <div className="p-6 transition-all duration-300 bg-[#1F2937] rounded-2xl hover:bg-[#1a232e]">
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-[#374151] to-[#1F2937]">
                    <FaLock className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-white">Sécurité des Données</h3>
                    <p className="text-gray-400">Transmissions sécurisées et cryptées</p>
                  </div>
                </div>
              </div>

              {/* Hours Card */}
              <div className="p-6 transition-all duration-300 bg-[#1F2937] rounded-2xl hover:bg-[#1a232e]">
                <h3 className="mb-4 text-lg font-semibold text-white">Heures d'ouverture</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Lundi - Vendredi</span>
                    <span className="text-gray-300">9:00 - 18:00</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Weekend</span>
                    <span className="text-gray-300">Fermé</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="order-1 p-8 transition-all duration-300 bg-[#1F2937] rounded-2xl lg:order-2">
            <form className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-300">
                    Nom
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-3 text-gray-300 transition-all duration-300 bg-[#374151] rounded-xl border border-gray-600 focus:border-gray-500 focus:ring-2 focus:ring-gray-900 focus:outline-none placeholder:text-gray-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-300">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-3 text-gray-300 transition-all duration-300 bg-[#374151] rounded-xl border border-gray-600 focus:border-gray-500 focus:ring-2 focus:ring-gray-900 focus:outline-none placeholder:text-gray-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block mb-2 text-sm font-medium text-gray-300">
                  Sujet
                </label>
                <input
                  type="text"
                  id="subject"
                  className="w-full px-4 py-3 text-gray-300 transition-all duration-300 bg-[#374151] rounded-xl border border-gray-600 focus:border-gray-500 focus:ring-2 focus:ring-gray-900 focus:outline-none placeholder:text-gray-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-300">
                  Message
                </label>
                <textarea
                  id="message"
                  rows="6"
                  className="w-full px-4 py-3 text-gray-300 transition-all duration-300 bg-[#374151] rounded-xl border border-gray-600 focus:border-gray-500 focus:ring-2 focus:ring-gray-900 focus:outline-none placeholder:text-gray-500"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full px-8 py-4 text-base font-medium text-white transition-all duration-300 rounded-xl bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-600 hover:to-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 focus:ring-offset-[#1F2937]"
              >
                Envoyer le message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

