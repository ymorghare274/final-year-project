"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import toast from "react-hot-toast";

import { formatPrice } from "@/lib/utils";

interface ProductCardProps {
    product: {
        _id: string;
        id?: string;
        name: string;
        price: number;
        discount: number;
        images: string[];
        category: string;
    };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const [mounted, setMounted] = React.useState(false);
    const addItem = useCartStore((state) => state.addItem);
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();

    React.useEffect(() => {
        setMounted(true);
    }, []);

    const isFav = isInWishlist(product._id);

    const discountedPrice = product.price - (product.price * product.discount) / 100;

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        addItem({
            _id: (product._id || product.id) as string,
            name: product.name || "Unknown Product",
            price: product.price || 0,
            discount: product.discount || 0,
            image: (product.images && product.images[0]) || "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1974&auto=format&fit=crop",
            quantity: 1,
        });
        toast.success("Added to cart!");
    };

    const toggleWishlist = (e: React.MouseEvent) => {
        e.preventDefault();
        const productId = product._id || product.id;
        if (!productId) return;

        if (isFav) {
            removeFromWishlist(productId);
            toast.success("Removed from wishlist");
        } else {
            addToWishlist({
                _id: productId,
                name: product.name || "Unknown Product",
                price: product.price || 0,
                discount: product.discount || 0,
                image: (product.images && product.images[0]) || "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1974&auto=format&fit=crop",
                category: product.category || "General"
            });
            toast.success("Added to wishlist!");
        }
    };

    if (!mounted) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -10 }}
            className="group bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-lg overflow-hidden relative shadow-sm hover:shadow-xl transition-shadow duration-500"
        >
            {/* Wishlist Button */}
            <motion.button
                whileTap={{ scale: 0.8 }}
                onClick={toggleWishlist}
                className={`absolute top-4 right-4 z-20 p-2.5 bg-white/90 dark:bg-black/90 rounded-full hover:bg-red-50 dark:hover:bg-red-950 transition-colors shadow-sm ${isFav ? 'text-red-500' : 'text-gray-600 dark:text-gray-400'}`}
            >
                <Heart size={18} className={isFav ? "fill-current" : "group-hover:text-red-500 transition-colors"} />
            </motion.button>

            {/* Product Image */}
            <Link href={`/product/${product._id}`} className="block aspect-square relative overflow-hidden">
                <motion.div
                    whileHover={{ scale: 1.15 }}
                    transition={{ duration: 0.8 }}
                    className="h-full w-full"
                >
                    <Image
                        src={product.images?.[0] || "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1974&auto=format&fit=crop"}
                        alt={product.name || "Jewellery piece"}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                </motion.div>

                {product.discount > 0 && (
                    <div className="absolute top-4 left-4 bg-primary text-white text-[10px] font-bold px-3 py-1.5 rounded-sm uppercase tracking-widest shadow-lg z-10">
                        {product.discount}% OFF
                    </div>
                )}

                {/* Quick Add Overlay */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4">
                    <motion.button
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleAddToCart}
                        className="w-full bg-white text-black py-3 text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl rounded-sm hover:bg-primary hover:text-white transition-colors"
                    >
                        Quick Add
                    </motion.button>
                </div>
            </Link>

            {/* Product Info */}
            <div className="p-5 space-y-3">
                <div className="flex justify-between items-start">
                    <div className="text-[10px] text-primary font-bold uppercase tracking-[0.2em]">{product.category}</div>
                </div>
                <Link href={`/product/${product._id}`} className="block">
                    <h3 className="text-sm font-bold truncate group-hover:text-primary transition-colors tracking-tight">{product.name}</h3>
                </Link>
                <div className="flex items-center space-x-3">
                    <span className="text-xl font-black">₹{formatPrice(discountedPrice)}</span>
                    {product.discount > 0 && (
                        <span className="text-xs text-gray-400 line-through font-medium">₹{formatPrice(product.price)}</span>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;