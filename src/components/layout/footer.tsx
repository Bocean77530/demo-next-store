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
                            Sign up for exclusive drops, discounts, and get FREE US shipping on your first order, unsubscribe anytime.
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
                            HELP
                        </h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/shipping" className="hover:text-gray-300 transition-colors">
                                    Shipping
                                </Link>
                            </li>
                            <li>
                                <Link href="/returns" className="hover:text-gray-300 transition-colors">
                                    Returns
                                </Link>
                            </li>
                            <li>
                                <Link href="/faqs" className="hover:text-gray-300 transition-colors">
                                    FAQs
                                </Link>
                            </li>
                            <li>
                                <Link href="/privacy" className="hover:text-gray-300 transition-colors">
                                    Privacy
                                </Link>
                            </li>
                            <li>
                                <Link href="/wholesale" className="hover:text-gray-300 transition-colors">
                                    Wholesale
                                </Link>
                            </li>
                            <li>
                                <Link href="/accessibility" className="hover:text-gray-300 transition-colors">
                                    Accessibility
                                </Link>
                            </li>
                            <li>
                                <Link href="/sitemap.xml" className="hover:text-gray-300 transition-colors">
                                    Site Map
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

