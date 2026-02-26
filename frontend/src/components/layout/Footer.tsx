import React from "react";
import Link from "next/link";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
    return (
        <footer className="bg-secondary text-white py-16 px-4">
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
                {/* Brand */}
                <div className="space-y-6">
                    <Link href="/" className="text-2xl font-bold tracking-tighter text-primary">
                        YUKTA<span className="text-white">JEWELLERY</span>
                    </Link>
                    <p className="text-gray-400 text-sm leading-relaxed">
                        Crafting elegance since 1995. Yukta Jewellery brings you the finest
                        handcrafted pieces that celebrate your special moments.
                    </p>
                    <div className="flex space-x-4">
                        <Link href="#" className="hover:text-primary transition-colors"><Facebook size={20} /></Link>
                        <Link href="#" className="hover:text-primary transition-colors"><Instagram size={20} /></Link>
                        <Link href="#" className="hover:text-primary transition-colors"><Twitter size={20} /></Link>
                    </div>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="text-lg font-semibold mb-6 uppercase tracking-widest text-primary">Quick Links</h3>
                    <ul className="space-y-4 text-gray-400 text-sm">
                        <li><Link href="/products" className="hover:text-white transition-colors">Shop All</Link></li>
                        <li><Link href="/products?category=Bridal" className="hover:text-white transition-colors">Bridal Collection</Link></li>
                        <li><Link href="/products?category=Gold" className="hover:text-white transition-colors">Gold Jewellery</Link></li>
                        <li><Link href="/wishlist" className="hover:text-white transition-colors">My Wishlist</Link></li>
                    </ul>
                </div>

                {/* Policies */}
                <div>
                    <h3 className="text-lg font-semibold mb-6 uppercase tracking-widest text-primary">Customer Care</h3>
                    <ul className="space-y-4 text-gray-400 text-sm">
                        <li><Link href="/shipping" className="hover:text-white transition-colors">Shipping Policy</Link></li>
                        <li><Link href="/returns" className="hover:text-white transition-colors">Returns & Exchanges</Link></li>
                        <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                        <li><Link href="/faq" className="hover:text-white transition-colors">FAQs</Link></li>
                    </ul>
                </div>

                {/* Contact */}
                <div>
                    <Link href="/contact" className="text-lg font-semibold mb-6 uppercase tracking-widest text-primary block hover:underline">Contact Us</Link>
                    <ul className="space-y-4 text-gray-400 text-sm">
                        <li className="flex items-start space-x-3">
                            <MapPin size={18} className="text-primary mt-1" />
                            <span>123 Jewellery Lane, Diamond District, Mumbai - 400001</span>
                        </li>
                        <li className="flex items-center space-x-3">
                            <Phone size={18} className="text-primary" />
                            <span>+91 98765 43210</span>
                        </li>
                        <li className="flex items-center space-x-3">
                            <Mail size={18} className="text-primary" />
                            <span>support@yukta.com</span>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="container mx-auto mt-16 pt-8 border-t border-gray-800 text-center text-gray-500 text-xs">
                <p>&copy; {new Date().getFullYear()} Yukta Jewellery. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;