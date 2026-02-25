"use client";

import React from "react";
import ProductCard from "@/components/product/ProductCard";
import { Heart, ArrowLeft } from "lucide-react";
import { useWishlistStore } from "@/store/useWishlistStore";
import Link from "next/link";
import { motion } from "framer-motion";

const WishlistPage = () => {
    const { wishlist } = useWishlistStore();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="bg-white dark:bg-black min-h-screen pt-12 pb-24">
            <div className="container mx-auto px-4">
                <div className="flex items-center gap-4 mb-12">
                    <Link href="/products" className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
                        <ArrowLeft size={24} />
                    </Link>
                    <h1 className="text-4xl font-bold tracking-tight italic">My Wishlist</h1>
                </div>

                {wishlist.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {wishlist.map((item) => (
                            <ProductCard
                                key={item._id}
                                product={{
                                    _id: item._id,
                                    name: item.name,
                                    price: item.price,
                                    discount: item.discount,
                                    images: [item.image],
                                    category: item.category
                                }}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="max-w-md mx-auto text-center py-24 space-y-6">
                        <div className="w-24 h-24 bg-red-50 dark:bg-red-950/20 rounded-full flex items-center justify-center mx-auto">
                            <Heart size={40} className="text-red-500" />
                        </div>
                        <h2 className="text-2xl font-bold">Your wishlist is empty</h2>
                        <p className="text-gray-500">Seems like you haven't found your perfect piece yet. Explore our collections and save what you love!</p>
                        <Link
                            href="/products"
                            className="inline-block bg-black dark:bg-white text-white dark:text-black px-12 py-4 font-bold uppercase tracking-widest text-sm hover:bg-primary dark:hover:bg-primary transition-all"
                        >
                            Start Exploring
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WishlistPage;
