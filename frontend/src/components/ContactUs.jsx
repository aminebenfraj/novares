"use client"

import { FaPhoneAlt, FaEnvelope, FaLock, FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

export default function Footer() {
    return (
        <footer className="w-full py-12 text-white bg-gray-900">
            <div className="container px-4 mx-auto">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                    
                    {/* Contact Info */}
                    <div className="space-y-4">
                        <h4 className="pb-2 mb-4 text-xl font-bold border-b border-gray-700">BESOIN DAIDE?</h4>
                        <p className="flex items-center">
                            <FaPhoneAlt className="mr-2 text-primary" /> +216 50 548 028
                        </p>
                        <p className="flex items-center">
                            <FaPhoneAlt className="mr-2 text-primary" /> +216 26 167 722
                        </p>
                        <p className="flex items-center">
                            <FaEnvelope className="mr-2 text-primary" /> support@novares.com
                        </p>
                        <div className="mt-6">
                            <h5 className="mb-2 font-semibold">SÉCURITÉ DES DONNÉES</h5>
                            <div className="flex space-x-3">
                                <FaLock className="text-3xl text-green-500" />
                                <span className="text-sm text-gray-400">Transmissions sécurisées et cryptées</span>
                            </div>
                        </div>
                    </div>

                    {/* About Novares */}
                    <div>
                        <h4 className="pb-2 mb-4 text-xl font-bold border-b border-gray-700">À PROPOS</h4>
                        <ul className="space-y-2">
                            {["Notre mission", "Confidentialité & Sécurité", "Conditions d'utilisation", "Support Technique"].map((item, index) => (
                                <li key={index}>
                                    <a href="/" className="transition duration-300 ease-in-out hover:text-primary">
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Key Features (Documents & Stock) */}
                    <div>
                        <h4 className="pb-2 mb-4 text-xl font-bold border-b border-gray-700">NOS SERVICES</h4>
                        <ul className="space-y-2">
                            {["Partage de Documents", "Gestion des Stocks", "Collaboration d'Équipe", "Support Client"].map((item, index) => (
                                <li key={index}>
                                    <a href="/" className="transition duration-300 ease-in-out hover:text-primary">
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter Signup */}
                    <div>
                        <h4 className="pb-2 mb-4 text-xl font-bold border-b border-gray-700">RESTEZ INFORMÉ</h4>
                        <p className="mb-4 text-gray-300">Recevez les dernières mises à jour et conseils sur la gestion des documents et stocks.</p>
                        <form className="flex flex-col space-y-2">
                            <input
                                type="email"
                                placeholder="Votre email professionnel"
                                className="px-4 py-2 bg-gray-800 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                            <button
                                type="submit"
                                className="px-4 py-2 text-white transition duration-300 ease-in-out rounded bg-primary hover:bg-primary-dark"
                            >
                                Sinscrire
                            </button>
                        </form>
                    </div>
                </div>

                {/* Social Media Links */}
                <div className="flex justify-center mt-8 space-x-4">
                    {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn].map((Icon, index) => (
                        <a key={index} href="/" className="text-gray-400 transition duration-300 ease-in-out hover:text-primary">
                            <Icon className="text-2xl" />
                        </a>
                    ))}
                </div>

                {/* Bottom Footer */}
                <div className="pt-8 mt-8 text-center border-t border-gray-700">
                    <p className="text-sm text-gray-400">
                        Novares - Plateforme de gestion documentaire et de stock.
                    </p>
                    <p className="mt-2 text-sm text-gray-500">
                        © {new Date().getFullYear()} Novares. Tous droits réservés.
                    </p>
                </div>
            </div>
        </footer>
    );
}
