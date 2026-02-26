"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus, ArrowRight, Loader, MapPin, Check, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";

const CartPage = () => {
    const { cart: cartItems, removeItem, updateQuantity } = useCartStore();
    const { user } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [selectedAddressIdx, setSelectedAddressIdx] = useState(0);

    useEffect(() => {
        console.log("CartPage mounted status check");
        setMounted(true);
        if (cartItems) {
            console.log("Cart items found:", cartItems.length);
        }
    }, [cartItems]);

    const handleCheckout = () => {
        if (!user) {
            toast.error("Please login to proceed");
            return;
        }

        if (!user.addresses || user.addresses.length === 0) {
            toast.error("Please add a shipping address in your profile");
            return;
        }

        setLoading(true);
        // Redirect to Google Form
        const googleFormUrl = "https://docs.google.com/forms/d/e/1FAIpQLSex9o69aBOoN_Aq0fUaCvc5rjiIgdKo44b671wgjKnwz996mQ/viewform?usp=dialog";
        window.location.href = googleFormUrl;
    };

    const subtotal = (cartItems || []).reduce((acc, item) => {
        if (!item) return acc;
        return acc + ((item.price || 0) - ((item.price || 0) * (item.discount || 0)) / 100) * (item.quantity || 1);
    }, 0);
    const tax = subtotal * 0.03; // GST 3%
    const total = subtotal + tax;

    if (!mounted) return (
        <div className="bg-white dark:bg-black min-h-screen pt-24 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="bg-white dark:bg-black min-h-screen pt-12 pb-24">
            <div className="container mx-auto px-4">
                <h1 className="text-4xl font-bold mb-12 tracking-tight italic">Your Shopping Bag</h1>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Cart Items */}
                    <div className="flex-1 space-y-8">
                        {cartItems && cartItems.length > 0 ? (
                            cartItems.map((item) => {
                                if (!item) return null;
                                const itemPrice = (item.price || 0) - ((item.price || 0) * (item.discount || 0)) / 100;

                                return (
                                    <div key={item._id} className="flex gap-6 pb-8 border-b border-gray-100 dark:border-zinc-800">
                                        <div className="w-32 h-32 relative rounded-md overflow-hidden bg-accent/20">
                                            {item.image ? (
                                                <Image
                                                    src={item.image}
                                                    alt={item.name || "Product"}
                                                    fill
                                                    className="object-cover"
                                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                />
                                            ) : (
                                                <div className="flex items-center justify-center h-full bg-gray-200 dark:bg-zinc-800 text-gray-400">
                                                    <ShoppingBag size={24} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="font-bold text-lg">{item.name || "Unknown Item"}</h3>
                                                    <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest mt-1">Authentic Jewellery</p>
                                                </div>
                                                <button
                                                    onClick={() => removeItem(item._id)}
                                                    className="text-gray-400 hover:text-red-500 transition-colors p-2"
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            </div>

                                            <div className="flex justify-between items-end">
                                                <div className="flex items-center border border-gray-200 dark:border-zinc-700 rounded">
                                                    <button
                                                        onClick={() => updateQuantity(item._id, Math.max(1, (item.quantity || 1) - 1))}
                                                        className="px-3 py-1 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                                                    >
                                                        <Minus size={14} />
                                                    </button>
                                                    <span className="px-4 font-bold text-sm">{item.quantity || 1}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item._id, (item.quantity || 1) + 1)}
                                                        className="px-3 py-1 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                                                    >
                                                        <Plus size={14} />
                                                    </button>
                                                </div>
                                                <div className="text-right">
                                                    <span className="block font-bold">₹{formatPrice(itemPrice)}</span>
                                                    {(item.discount || 0) > 0 && (
                                                        <span className="text-xs text-gray-500 line-through">₹{formatPrice(item.price || 0)}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="text-center py-24 flex flex-col items-center">
                                <div className="w-24 h-24 bg-gray-50 dark:bg-zinc-900 rounded-full flex items-center justify-center mb-6">
                                    <ShoppingBag size={40} className="text-gray-300" />
                                </div>
                                <p className="text-gray-500 text-lg mb-8 uppercase tracking-[0.2em] font-medium">Your bag is empty.</p>
                                <Link href="/products" className="bg-primary text-white px-12 py-4 uppercase font-bold tracking-widest text-xs rounded-sm hover:opacity-90 transition-all">
                                    Start Shopping
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Checkout Summary */}
                    <div className="lg:w-[400px]">
                        <div className="bg-gray-50 dark:bg-zinc-900 p-8 rounded-xl shadow-sm space-y-8 sticky top-24 border border-gray-100 dark:border-zinc-800">

                            {/* Address Selector */}
                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-[0.2em] mb-4 flex items-center justify-between">
                                    Shipping Address
                                    <Link href="/profile" className="text-primary text-[10px] lowercase hover:underline">Change</Link>
                                </h3>
                                {user ? (
                                    user.addresses && user.addresses.length > 0 ? (
                                        <div className="space-y-3">
                                            {user.addresses.slice(0, 2).map((addr: any, idx: number) => (
                                                <div
                                                    key={idx}
                                                    onClick={() => setSelectedAddressIdx(idx)}
                                                    className={`p-3 border rounded-lg cursor-pointer transition-all ${selectedAddressIdx === idx ? 'border-primary bg-primary/5' : 'border-gray-200 dark:border-zinc-800 bg-white dark:bg-black'}`}
                                                >
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="text-[10px] font-bold uppercase text-gray-400">{addr.label}</span>
                                                        {selectedAddressIdx === idx && <Check size={14} className="text-primary" />}
                                                    </div>
                                                    <p className="text-xs font-bold">{addr.street}</p>
                                                    <p className="text-[10px] text-gray-500">{addr.city}, {addr.zip}</p>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-4 border border-dashed border-gray-300 dark:border-zinc-700 rounded-lg text-center">
                                            <p className="text-xs text-gray-500 mb-2">No address found</p>
                                            <Link href="/profile" className="text-xs font-bold text-primary underline">Add Address</Link>
                                        </div>
                                    )
                                ) : (
                                    <div className="p-4 border border-dashed border-gray-300 dark:border-zinc-700 rounded-lg text-center">
                                        <p className="text-xs text-gray-500 mb-2">Login to select address</p>
                                        <Link href="/auth/login" className="text-xs font-bold text-primary underline">Login Now</Link>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-zinc-800">
                                <h2 className="text-xs font-bold uppercase tracking-[0.2em] mb-4">Order Summary</h2>
                                <div className="flex justify-between text-gray-600 dark:text-gray-400 text-sm">
                                    <span>Subtotal</span>
                                    <span>₹{formatPrice(subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600 dark:text-gray-400 text-sm">
                                    <span>Shipping</span>
                                    <span className="text-green-600 font-bold">FREE</span>
                                </div>
                                <div className="flex justify-between text-gray-600 dark:text-gray-400 text-sm">
                                    <span>Estimated GST (3%)</span>
                                    <span>₹{formatPrice(tax)}</span>
                                </div>
                                <div className="flex justify-between text-2xl font-bold pt-4 border-t border-gray-200 dark:border-zinc-800">
                                    <span>Total</span>
                                    <span className="text-primary">₹{formatPrice(total)}</span>
                                </div>
                            </div>

                            <button
                                onClick={handleCheckout}
                                disabled={loading || cartItems.length === 0}
                                className="w-full bg-black dark:bg-white text-white dark:text-black font-bold uppercase tracking-[0.2em] py-4 rounded flex items-center justify-center space-x-2 hover:bg-primary dark:hover:bg-primary transition-all disabled:opacity-50"
                            >
                                {loading ? <Loader className="animate-spin" size={18} /> : (
                                    <>
                                        <span>Proceed to Checkout</span>
                                        <ArrowRight size={18} />
                                    </>
                                )}
                            </button>

                            <div className="text-center space-y-4 pt-4">
                                <p className="text-[10px] text-gray-400 uppercase tracking-widest">Order will be processed via Google Form</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;