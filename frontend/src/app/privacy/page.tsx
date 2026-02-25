"use client";

import React from "react";
import { Shield, Eye, Lock, FileText } from "lucide-react";

const PrivacyPage = () => {
    return (
        <div className="bg-white dark:bg-black min-h-screen pt-24 pb-24">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="text-center mb-16 space-y-4">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight italic">Privacy Policy</h1>
                    <p className="text-gray-500 uppercase tracking-widest text-sm font-medium">Your Trust is Our Greatest Treasure</p>
                </div>

                <div className="space-y-12 text-gray-600 dark:text-gray-400 leading-relaxed">
                    <section className="space-y-4">
                        <div className="flex items-center gap-3 text-black dark:text-white">
                            <Shield className="text-primary" size={24} />
                            <h2 className="text-2xl font-bold uppercase tracking-widest">Introduction</h2>
                        </div>
                        <p>At Yukta Jewellery, we value your privacy and are committed to protecting your personal data. This policy outlines how we handle your information when you visit our website or make a purchase.</p>
                    </section>

                    <section className="space-y-4">
                        <div className="flex items-center gap-3 text-black dark:text-white">
                            <Eye className="text-primary" size={24} />
                            <h2 className="text-2xl font-bold uppercase tracking-widest">Information We Collect</h2>
                        </div>
                        <p>We collect information you provide directly to us, such as when you create an account, make a purchase, or contact our support team. This may include your name, email address, phone number, shipping address, and payment information (handled securely by Stripe).</p>
                    </section>

                    <section className="space-y-4">
                        <div className="flex items-center gap-3 text-black dark:text-white">
                            <Lock className="text-primary" size={24} />
                            <h2 className="text-2xl font-bold uppercase tracking-widest">Data Security</h2>
                        </div>
                        <p>We implement a variety of security measures to maintain the safety of your personal information. Your sensitive information is encrypted via Secure Socket Layer (SSL) technology and processed through a gateway provider (Stripe) and are not stored or processed on our servers.</p>
                    </section>

                    <section className="space-y-4">
                        <div className="flex items-center gap-3 text-black dark:text-white">
                            <FileText className="text-primary" size={24} />
                            <h2 className="text-2xl font-bold uppercase tracking-widest">Your Rights</h2>
                        </div>
                        <p>You have the right to access, correct, or delete your personal data. You can manage most of this directly through your profile settings or by contacting our support team.</p>
                    </section>

                    <div className="pt-12 border-t border-gray-100 dark:border-zinc-800 text-center">
                        <p className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400">Last Updated: January 2026</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPage;