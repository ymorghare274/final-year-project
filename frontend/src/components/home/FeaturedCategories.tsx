"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const categories = [
    { name: "Bridal", image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1974&auto=format&fit=crop", span: "col-span-2 md:col-span-1 row-span-2" },
    { name: "Gold", image: "https://images.unsplash.com/photo-1611591437281-460bfbe1574a?q=80&w=2070&auto=format&fit=crop", span: "col-span-1 row-span-1" },
    { name: "Diamond", image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1974&auto=format&fit=crop", span: "col-span-1 row-span-1" },
    { name: "Beauty", image: "https://images.unsplash.com/photo-1596462502278-27bfdc4033c8?q=80&w=2080&auto=format&fit=crop", span: "col-span-2 row-span-1" },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.8 }
    }
};

const FeaturedCategories = () => {
    return (
        <section className="py-24 px-4 bg-accent/30 dark:bg-zinc-950">
            <div className="container mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16 space-y-4"
                >
                    <h2 className="text-4xl md:text-6xl font-bold tracking-tight">Curated Collections</h2>
                    <div className="w-24 h-1.5 bg-primary mx-auto" />
                    <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto text-lg">Explore our diverse range of jewellery and luxury beauty products, each piece telling a story of elegance.</p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-2 lg:grid-cols-3 grid-rows-2 gap-6 h-[600px] md:h-[800px]"
                >
                    {categories.map((cat, idx) => (
                        <motion.div
                            key={idx}
                            variants={itemVariants}
                            className={`${cat.span} group relative overflow-hidden rounded-lg`}
                        >
                            <Link href={`/products?category=${cat.name}`} className="block h-full w-full">
                                <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    transition={{ duration: 0.7 }}
                                    className="absolute inset-0 bg-cover bg-center"
                                    style={{ backgroundImage: `url(${cat.image})` }}
                                />
                                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-500 flex items-center justify-center">
                                    <div className="text-center p-4">
                                        <motion.h3
                                            initial={{ y: 10, opacity: 0 }}
                                            whileInView={{ y: 0, opacity: 1 }}
                                            transition={{ delay: 0.3 + idx * 0.1 }}
                                            className="text-white text-3xl md:text-5xl font-bold mb-4 uppercase tracking-widest drop-shadow-lg"
                                        >
                                            {cat.name}
                                        </motion.h3>
                                        <div className="h-0.5 w-0 group-hover:w-full bg-primary mx-auto transition-all duration-500" />
                                        <span className="mt-4 block text-primary font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 uppercase tracking-widest">
                                            View Collection
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default FeaturedCategories;