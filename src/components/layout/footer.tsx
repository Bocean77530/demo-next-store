import Link from 'next/link';
import { Facebook, Youtube, Instagram, Music, Twitter } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-gray-800 text-white">
            {/* Main Footer Content */}
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    
                    {/* Left Section - Newsletter */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold uppercase tracking-wide">
                            SIGN UP FOR OUR NEWSLETTER
                        </h3>
                        <p className="text-sm leading-relaxed">
                            Sign up for exclusive drops, discounts, and get a 10% discount on your first order, unsubscribe anytime.
                        </p>
                        <Link 
                            href="/newsletter" 
                            className="inline-block text-sm underline hover:text-gray-300 transition-colors"
                        >
                            Sign up
                        </Link>
                    </div>

                    {/* Middle Section - Help */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold uppercase tracking-wide">
                            Our Services
                        </h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/shipping" className="hover:text-gray-300 transition-colors">
                                    Shipping
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms-and-conditions" className="hover:text-gray-300 transition-colors">
                                    Terms and Conditions
                                </Link>
                            </li>
                            <li>
                                <Link href="/help-center" className="hover:text-gray-300 transition-colors">
                                    Help Center
                                </Link>
                            </li>
                            <li>
                                <Link href="/privacy" className="hover:text-gray-300 transition-colors">
                                    Privacy
                                </Link>
                            </li>
                            <li>
                                <Link href="/Orders" className="hover:text-gray-300 transition-colors">
                                    Orders
                                </Link>
                            </li>
                            <li>
                                <Link href="/size-guide" className="hover:text-gray-300 transition-colors">
                                    Size Guide
                                </Link>
                            </li>
                            <li>
                                <Link href="/care-instructions" className="hover:text-gray-300 transition-colors">
                                    Care Instructions
                                </Link>
                            </li>
                            <li>
                                <Link href="/sitemap.xml" className="hover:text-gray-300 transition-colors">
                                    Site Map
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="hover:text-gray-300 transition-colors">
                                    Contact Us
                                </Link>
                            </li>
                        </ul>
                    </div>


                    {/* Right Section - Contact */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold uppercase tracking-wide">
                            CONTACT US
                        </h3>
                        <div className="space-y-2 text-sm">
                            <p>emial address is coming soon</p>
                            
                        </div>
                        
                        {/* Social Media Icons */}
                        <div className="flex space-x-4 pt-2">
                            <Link 
                                href="https://facebook.com" 
                                className="hover:text-gray-300 transition-colors"
                                aria-label="Facebook"
                            >
                                <Facebook size={20} />
                            </Link>
                            <Link 
                                href="https://youtube.com" 
                                className="hover:text-gray-300 transition-colors"
                                aria-label="YouTube"
                            >
                                <Youtube size={20} />
                            </Link>
                            <Link 
                                href="https://instagram.com" 
                                className="hover:text-gray-300 transition-colors"
                                aria-label="Instagram"
                            >
                                <Instagram size={20} />
                            </Link>
                            <Link 
                                href="https://tiktok.com" 
                                className="hover:text-gray-300 transition-colors"
                                aria-label="TikTok"
                            >
                                <Music size={20} />
                            </Link>
                            <Link 
                                href="https://x.com" 
                                className="hover:text-gray-300 transition-colors"
                                aria-label="X (Twitter)"
                            >
                                <Twitter size={20} />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Divider Line */}
            <div className="border-t border-gray-700"></div>

            {/* Copyright */}
            <div className="max-w-7xl mx-auto px-6 py-4">
                <p className="text-sm text-gray-400">
                    © 2025 RoyJW.
                </p>
            </div>
        </footer>
    );
}

