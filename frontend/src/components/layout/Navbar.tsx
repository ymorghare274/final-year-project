"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, ShoppingCart, Heart, User, Menu, X, ShieldAlert, ShoppingBag, Gem } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [mounted, setMounted] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { user } = useAuthStore();
    const router = useRouter();
    const cart = useCartStore((state) => state.cart);
    const wishlist = useWishlistStore((state) => state.wishlist);

    const cartCount = cart ? cart.reduce((acc, item) => acc + (item?.quantity || 0), 0) : 0;
    const wishlistCount = wishlist ? wishlist.length : 0;

    React.useEffect(() => {
        setMounted(true);
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, ease: "circOut" }}
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${scrolled
                ? "bg-white/90 dark:bg-black/90 backdrop-blur-xl py-2 border-b border-gray-100 dark:border-gray-800 shadow-lg"
                : "bg-transparent py-5"
                }`}
        >
            <div className="container mx-auto px-4 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group relative z-50">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary transition-all duration-500">
                        <Gem className="text-primary group-hover:text-white transition-colors" size={24} />
                    </div>
                    <div className="flex flex-col -space-y-1">
                        <span className="text-xl font-black tracking-tighter text-gray-900 dark:text-white leading-none">YUKTA</span>
                        <span className="text-[8px] font-bold tracking-[0.4em] text-primary uppercase">Jewellery</span>
                    </div>
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center space-x-8 text-sm font-medium uppercase tracking-widest">
                    <Link href="/products" className="hover:text-primary transition-colors">Shop</Link>
                    <Link href="/products?category=Bridal" className="hover:text-primary transition-colors">Bridal</Link>
                    <Link href="/products?category=Gold" className="hover:text-primary transition-colors">Gold</Link>
                    <Link href="/products?category=Beauty" className="hover:text-primary transition-colors">Beauty</Link>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-4">
                    <form onSubmit={handleSearch} className="hidden lg:flex items-center bg-gray-100 dark:bg-gray-900 px-3 py-1.5 rounded-full">
                        <Search size={18} className="text-gray-500" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search jewellery..."
                            className="bg-transparent border-none focus:ring-0 text-sm ml-2 w-48"
                        />
                    </form>

                    <Link href="/wishlist" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors relative">
                        <Heart size={22} className={mounted && wishlistCount > 0 ? "text-primary fill-primary" : ""} />
                        {mounted && wishlistCount > 0 && (
                            <span className="absolute top-1 right-1 bg-primary text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full pointer-events-none">
                                {wishlistCount}
                            </span>
                        )}
                    </Link>

                    <Link
                        href="/cart"
                        id="navbar-cart-link"
                        className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-zinc-900 hover:bg-primary/10 rounded-full transition-all group relative border border-transparent hover:border-primary/20"
                        onClick={() => console.log("Directing to /cart via Link")}
                    >
                        <div className="relative">
                            <ShoppingCart size={20} className="group-hover:text-primary transition-colors" />
                            {mounted && cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-primary text-white text-[8px] w-4 h-4 flex items-center justify-center rounded-full animate-bounce pointer-events-none font-bold">
                                    {cartCount}
                                </span>
                            )}
                        </div>
                        <span className="hidden sm:inline text-[10px] font-black uppercase tracking-widest text-gray-600 dark:text-gray-400 group-hover:text-primary transition-colors">Bag</span>
                    </Link>

                    <Link href={user ? "/profile" : "/auth/login"} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors relative group">
                        <User size={22} className={user ? "text-primary" : ""} />
                        {user && (
                            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                        )}
                        <span className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 bg-black text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                            {user ? `Hi, ${user.name.split(' ')[0]}` : "Sign In"}
                        </span>
                    </Link>

                    {user?.role === 'admin' && (
                        <Link href="/admin/dashboard" className="p-2 hover:bg-primary/20 rounded-full transition-colors text-primary border border-primary/20">
                            <ShieldAlert size={22} />
                        </Link>
                    )}

                    <button
                        className="md:hidden p-2"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.5, ease: "circOut" }}
                        className="md:hidden bg-white dark:bg-black border-b border-gray-100 dark:border-gray-800 px-4 py-6 space-y-4 overflow-hidden"
                    >
                        <Link href="/products" className="block text-lg font-medium" onClick={() => setIsMenuOpen(false)}>Shop All</Link>
                        <Link href="/products?category=Bridal" className="block text-lg font-medium" onClick={() => setIsMenuOpen(false)}>Bridal</Link>
                        <Link href="/cart" className="flex items-center justify-between text-lg font-medium py-2 border-t border-gray-100 dark:border-zinc-800 mt-4" onClick={() => setIsMenuOpen(false)}>
                            <span>Your Shopping Bag</span>
                            {mounted && cartCount > 0 && (
                                <span className="bg-primary text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                                    {cartCount} Items
                                </span>
                            )}
                        </Link>
                        <Link href="/products?category=Gold" className="block text-lg font-medium" onClick={() => setIsMenuOpen(false)}>Gold</Link>
                        <Link href="/products?category=Diamond" className="block text-lg font-medium" onClick={() => setIsMenuOpen(false)}>Diamonds</Link>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
};

export default Navbar;