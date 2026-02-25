"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Heart, ShoppingCart, ShieldCheck, Truck, RotateCcw, Star } from "lucide-react";
import { motion } from "framer-motion";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import toast from "react-hot-toast";

import api from "@/lib/api";

const ProductDetailPage = () => {
    const { id } = useParams();
    const [product, setProduct] = useState<any>(null);
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [mounted, setMounted] = React.useState(false);
    const addItem = useCartStore((state) => state.addItem);
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();

    React.useEffect(() => {
        setMounted(true);
        const fetchData = async () => {
            try {
                const [productRes, reviewsRes] = await Promise.all([
                    api.get(`/products/${id}`),
                    api.get(`/reviews/${id}`)
                ]);
                setProduct(productRes.data);
                setReviews(reviewsRes.data);
            } catch (error) {
                console.error("Failed to fetch product data", error);
                toast.error("Product not found");
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchData();
    }, [id]);

    const isFav = product ? isInWishlist(product.id || product._id) : false;

    const handleAddToCart = () => {
        if (!product) return;
        addItem({
            _id: product.id || product._id,
            name: product.name,
            price: product.price,
            discount: product.discount,
            image: product.images?.[activeImage] || "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1974&auto=format&fit=crop",
            quantity: quantity,
        });
        toast.success(`${quantity} item(s) added to cart!`);
    };

    const toggleWishlist = () => {
        if (!product) return;
        const productId = product.id || product._id;
        if (isFav) {
            removeFromWishlist(productId);
            toast.success("Removed from wishlist");
        } else {
            addToWishlist({
                _id: productId,
                name: product.name,
                price: product.price,
                discount: product.discount,
                image: product.images?.[0] || "",
                category: product.category
            });
            toast.success("Added to wishlist!");
        }
    };

    if (!mounted || loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
    );

    if (!product) return <div className="text-center py-24">Product not found</div>;

    const discountedPrice = product.price - (product.price * (product.discount || 0)) / 100;

    return (
        <div className="bg-white dark:bg-black min-h-screen pt-12 pb-24">
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row gap-16 mb-24">
                    {/* Image Gallery */}
                    <div className="lg:w-1/2 flex gap-4">
                        <div className="flex flex-col gap-4">
                            {product.images && product.images.length > 0 ? (
                                product.images.map((img: string, idx: number) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveImage(idx)}
                                        className={`w-20 h-20 relative rounded-md overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-primary' : 'border-transparent opacity-60'}`}
                                    >
                                        <Image src={img || ""} alt={product.name || "Product"} width={80} height={80} className="object-cover" />
                                    </button>
                                ))
                            ) : (
                                <div className="w-20 h-20 bg-gray-100 rounded-md" />
                            )}
                        </div>
                        <div className="flex-1 aspect-square relative bg-accent/20 rounded-xl overflow-hidden">
                            {product.images && product.images.length > 0 ? (
                                <Image
                                    src={product.images[activeImage] || product.images[0]}
                                    alt={product.name || "Product"}
                                    fill
                                    className="object-cover hover:scale-110 transition-transform duration-700 cursor-zoom-in"
                                    unoptimized
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    <ShoppingCart size={48} />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="lg:w-1/2 space-y-8">
                        <div className="space-y-2">
                            <span className="text-primary font-bold uppercase tracking-widest text-sm">{product.category} | {product.purity}</span>
                            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{product.name}</h1>
                            <div className="flex items-center space-x-4">
                                <div className="flex text-yellow-500">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={18} fill={i < 4 ? "currentColor" : "none"} />
                                    ))}
                                </div>
                                <span className="text-sm text-gray-500">({reviews.length} Reviews)</span>
                            </div>
                        </div>

                        <div className="space-y-2 pb-8 border-b border-gray-100 dark:border-zinc-800">
                            <div className="flex items-end space-x-4">
                                <span className="text-4xl font-bold">₹{formatPrice(discountedPrice)}</span>
                                {product.discount > 0 && (
                                    <>
                                        <span className="text-xl text-gray-500 line-through">₹{formatPrice(product.price)}</span>
                                        <span className="text-green-600 font-bold uppercase tracking-tighter text-sm">Save {product.discount}%</span>
                                    </>
                                )}
                            </div>
                            <p className="text-xs text-gray-400">Inclusive of all taxes</p>
                        </div>

                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
                            {product.description}
                        </p>

                        <div className="grid grid-cols-2 gap-4 py-6 border-y border-gray-100 dark:border-zinc-800">
                            <div className="text-sm">
                                <span className="font-bold uppercase tracking-widest block text-gray-400 text-[10px]">Weight</span>
                                <span className="text-lg font-semibold">{product.weight}</span>
                            </div>
                            <div className="text-sm">
                                <span className="font-bold uppercase tracking-widest block text-gray-400 text-[10px]">Purity</span>
                                <span className="text-lg font-semibold">{product.purity}</span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex items-center border border-gray-200 dark:border-zinc-700 rounded overflow-hidden">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="px-4 py-4 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                                >-</button>
                                <span className="px-6 font-bold">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="px-4 py-4 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                                >+</button>
                            </div>
                            <button
                                onClick={handleAddToCart}
                                className="flex-1 bg-black dark:bg-white text-white dark:text-black font-bold uppercase tracking-[0.2em] py-4 rounded hover:bg-primary dark:hover:bg-primary transition-all"
                            >
                                Add to Cart
                            </button>
                            <button
                                onClick={toggleWishlist}
                                className={`p-4 border border-gray-200 dark:border-zinc-700 rounded hover:bg-red-50 dark:hover:bg-red-950 group transition-all ${isFav ? 'text-red-500 bg-red-50 dark:bg-red-950/20' : ''}`}
                            >
                                <Heart size={24} className={isFav ? "fill-current" : "group-hover:text-red-500"} />
                            </button>
                        </div>

                        {/* Perks */}
                        <div className="grid grid-cols-3 gap-4 pt-8">
                            <div className="text-center space-y-2">
                                <ShieldCheck size={24} className="mx-auto text-primary" />
                                <p className="text-[10px] font-bold uppercase tracking-widest">Certified Purity</p>
                            </div>
                            <div className="text-center space-y-2">
                                <Truck size={24} className="mx-auto text-primary" />
                                <p className="text-[10px] font-bold uppercase tracking-widest">Free Express Shipping</p>
                            </div>
                            <div className="text-center space-y-2">
                                <RotateCcw size={24} className="mx-auto text-primary" />
                                <p className="text-[10px] font-bold uppercase tracking-widest">30 Day Returns</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="border-t border-gray-100 dark:border-zinc-800 pt-16">
                    <div className="flex items-center justify-between mb-12">
                        <h2 className="text-3xl font-bold italic">Member Reviews</h2>
                        <button className="text-xs font-bold uppercase tracking-widest border-b-2 border-primary pb-1">Write a Review</button>
                    </div>

                    {reviews.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {reviews.map((review) => (
                                <div key={review.id} className="bg-gray-50 dark:bg-zinc-900 p-8 rounded-2xl space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex text-yellow-500">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} />
                                            ))}
                                        </div>
                                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{new Date(review.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed italic">"{review.comment}"</p>
                                    <div className="pt-4 border-t border-gray-200 dark:border-zinc-800">
                                        <p className="text-sm font-bold">— {review.users?.name || 'Verified Buyer'}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-12 bg-gray-50 dark:bg-zinc-900/50 rounded-2xl text-center">
                            <p className="text-gray-500 uppercase tracking-widest text-xs font-bold">No reviews yet. Be the first to share your experience!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;