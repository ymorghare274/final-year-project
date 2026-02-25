"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Hero from "@/components/home/Hero";
import FeaturedCategories from "@/components/home/FeaturedCategories";
import ProductCard from "@/components/product/ProductCard";
import api from "@/lib/api";

export default function Home() {
  const [trendingProducts, setTrendingProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const { data } = await api.get("/products");
        // Just take the first 4 as "trending"
        setTrendingProducts(data.slice(0, 4));
      } catch (error) {
        console.error("Failed to fetch trending products", error);
      }
    };
    fetchTrending();
  }, []);

  return (
    <div>
      <Hero />
      <FeaturedCategories />

      {/* Trending Products */}
      <section className="py-24 px-4 bg-white dark:bg-black overflow-hidden">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex items-end justify-between mb-16"
          >
            <div className="space-y-4">
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter">Trending Now</h2>
              <div className="w-24 h-1.5 bg-primary" />
            </div>
            <Link href="/products" className="group flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-xs md:text-sm">
              View All Products
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >→</motion.span>
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {trendingProducts.length > 0 ? (
              trendingProducts.map((product) => (
                <ProductCard key={product.id || product._id} product={{ ...product, _id: product.id || product._id }} />
              ))
            ) : (
              <div className="col-span-full text-center py-24 text-gray-400 font-bold uppercase tracking-[0.3em] text-sm animate-pulse">
                New collections arriving soon...
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Testimonials or Vibe Section */}
      <section className="py-32 px-4 bg-secondary text-white text-center relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="container mx-auto max-w-4xl space-y-12 relative z-10"
        >
          <h2 className="text-4xl md:text-7xl font-light italic leading-tight">
            "Jewellery is like the perfect spice – it always <span className="text-primary font-bold not-italic">complements</span> what’s already there."
          </h2>
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-0.5 bg-primary" />
            <p className="text-primary tracking-[0.4em] uppercase font-black text-xs md:text-sm">
              — DIANE VON FURSTENBERG
            </p>
          </div>
        </motion.div>

        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      </section>
    </div>
  );
}
