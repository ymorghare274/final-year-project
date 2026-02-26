"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const Hero = () => {
    return (
        <section className="relative h-[95vh] flex items-center justify-center overflow-hidden bg-black">
            {/* Background Image with Scale Animation */}
            <motion.div
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.6 }}
                transition={{ duration: 2.5, ease: "easeOut" }}
                className="absolute inset-0 z-0"
            >
                <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1515562141207-7a88bb7ce338?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center" />
            </motion.div>

            <div className="container mx-auto px-4 relative z-10 text-center">
                <div className="overflow-hidden">
                    <motion.span
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        transition={{ duration: 0.8, ease: "circOut" }}
                        className="text-primary font-medium tracking-[0.4em] uppercase mb-6 block text-xs md:text-sm"
                    >
                        Exclusive Collection 2026
                    </motion.span>
                </div>

                <div className="overflow-hidden mb-8">
                    <motion.h1
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        transition={{ duration: 1, delay: 0.2, ease: "circOut" }}
                        className="text-6xl md:text-[10rem] font-bold text-white leading-[0.9] tracking-tighter"
                    >
                        Timeless <br /> <span className="text-outline-white">Elegance</span>
                    </motion.h1>
                </div>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-12 font-light italic"
                >
                    Discover a world where craftsmanship meets luxury. From bridal gold to everyday diamonds, find your shine.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.7 }}
                    className="flex flex-col md:flex-row items-center justify-center gap-6"
                >
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Link
                            href="/products"
                            className="px-12 py-5 bg-primary text-white font-bold uppercase tracking-widest hover:bg-opacity-90 transition-all rounded-sm inline-block"
                        >
                            Shop Now
                        </Link>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Link
                            href="/products?category=Bridal"
                            className="px-12 py-5 glass text-white font-bold uppercase tracking-widest hover:bg-white/20 transition-all rounded-sm inline-block"
                        >
                            Bridal Special
                        </Link>
                    </motion.div>
                </motion.div>
            </div>

            {/* Visual Accents */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.2, 0.3, 0.2]
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[80vw] h-64 bg-primary/20 blur-[120px] rounded-full pointer-events-none"
            />
        </section>
    );
};

export default Hero;