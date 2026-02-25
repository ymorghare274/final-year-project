"use client";

import React, { useEffect, Suspense } from "react";
import Link from "next/link";
import { CheckCircle, ShoppingBag, ArrowRight, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useCartStore } from "@/store/useCartStore";
import { useSearchParams } from "next/navigation";
import api from "@/lib/api";

const PaymentSuccessContent = () => {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get("session_id");
    const { cart, clearCart } = useCartStore();
    const [status, setStatus] = React.useState<'loading' | 'success' | 'error'>('loading');

    useEffect(() => {
        const confirmOrder = async () => {
            // If no session ID, it's an error
            if (!sessionId) {
                setStatus('error');
                return;
            }

            // If cart is empty, maybe already processed
            if (cart.length === 0) {
                setStatus('success');
                return;
            }

            try {
                const subtotal = cart.reduce((acc, item) => acc + (item.price - (item.price * item.discount) / 100) * item.quantity, 0);
                const totalAmount = subtotal * 1.03; // Including 3% GST

                await api.post("/orders/confirm", {
                    sessionId,
                    cartItems: cart,
                    totalAmount
                });

                clearCart();
                setStatus('success');
            } catch (error) {
                console.error("Order confirmation failed:", error);
                setStatus('error');
            }
        };

        confirmOrder();
    }, [sessionId, cart, clearCart]);

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center space-y-4 bg-white dark:bg-black">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-gray-500 animate-pulse">Securing your order</p>
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center p-4">
                <div className="max-w-md w-full text-center space-y-6">
                    <XCircle className="mx-auto text-red-500" size={80} />
                    <h1 className="text-3xl font-bold tracking-tight">Something went wrong</h1>
                    <p className="text-gray-500 text-sm uppercase tracking-widest leading-relaxed">
                        We couldn't verify your payment. If you've been charged, please contact support with your session ID.
                    </p>
                    {sessionId && <p className="font-mono text-[10px] text-gray-400">ID: {sessionId}</p>}
                    <Link href="/contact" className="block w-full border border-gray-200 dark:border-zinc-800 py-4 font-bold uppercase tracking-widest text-xs hover:bg-gray-50 dark:hover:bg-zinc-900 transition-all">
                        Contact Support
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-black pt-24 pb-12 flex items-center justify-center">
            <div className="max-w-md w-full px-4 text-center">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 12 }}
                    className="mb-8"
                >
                    <CheckCircle className="mx-auto text-green-500" size={100} strokeWidth={1.5} />
                </motion.div>

                <h1 className="text-4xl font-bold mb-4 tracking-tight italic">Order Placed Successfully!</h1>
                <p className="text-gray-500 dark:text-gray-400 mb-12 uppercase tracking-widest text-sm font-medium">
                    Thank you for choosing Yukta Jewellery. Your elegance is our priority.
                </p>

                <div className="space-y-4">
                    <Link
                        href="/products"
                        className="flex items-center justify-center space-x-2 w-full bg-black dark:bg-white text-white dark:text-black py-4 rounded font-bold uppercase tracking-widest hover:bg-primary dark:hover:bg-primary transition-all"
                    >
                        <ShoppingBag size={20} />
                        <span>Continue Shopping</span>
                    </Link>

                    <Link
                        href="/profile"
                        className="flex items-center justify-center space-x-2 w-full py-4 text-gray-500 hover:text-primary transition-colors uppercase tracking-widest text-sm font-bold"
                    >
                        <span>View Order History</span>
                        <ArrowRight size={16} />
                    </Link>
                </div>
            </div>
        </div>
    );
};

const PaymentSuccessPage = () => {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Verifying Payment...</div>}>
            <PaymentSuccessContent />
        </Suspense>
    );
};

export default PaymentSuccessPage;