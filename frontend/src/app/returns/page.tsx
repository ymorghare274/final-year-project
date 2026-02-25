"use client";

import React from "react";
import { RotateCcw, ShieldAlert, CheckCircle } from "lucide-react";

const InformationPage = ({ title, content }: { title: string, content: React.ReactNode }) => (
    <div className="bg-white dark:bg-black min-h-screen pt-24 pb-24">
        <div className="container mx-auto px-4 max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-12 italic border-b pb-8 border-gray-100 dark:border-zinc-800">{title}</h1>
            <div className="prose prose-lg dark:prose-invert max-w-none text-gray-600 dark:text-gray-400 leading-relaxed space-y-8">
                {content}
            </div>
        </div>
    </div>
);

export const ReturnsPage = () => (
    <InformationPage
        title="Returns & Exchanges"
        content={
            <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    <div className="p-6 bg-red-50 dark:bg-red-950/20 rounded-xl space-y-4">
                        <RotateCcw size={32} className="text-red-600" />
                        <h3 className="font-bold uppercase tracking-widest text-xs">30 Day Return</h3>
                        <p className="text-sm">Change of heart? Return your unworn jewellery within 30 days for a full refund.</p>
                    </div>
                    <div className="p-6 bg-green-50 dark:bg-green-950/20 rounded-xl space-y-4">
                        <CheckCircle size={32} className="text-green-600" />
                        <h3 className="font-bold uppercase tracking-widest text-xs">Free Exchange</h3>
                        <p className="text-sm">Exchange for a different size or design with no additional service charges.</p>
                    </div>
                    <div className="p-6 bg-yellow-50 dark:bg-yellow-950/20 rounded-xl space-y-4">
                        <ShieldAlert size={32} className="text-yellow-600" />
                        <h3 className="font-bold uppercase tracking-widest text-xs">Quality Check</h3>
                        <p className="text-sm">Items must be returned with original tags and hallmark certificate intact.</p>
                    </div>
                </div>
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-black dark:text-white uppercase tracking-widest">Easy Returns Process</h2>
                    <p>Simply log into your profile, go to "My Orders", and select "Request Return". We will arrange a secure pickup from your address. Once the item passes our lab inspection, your refund will be processed within 5-7 business days.</p>
                </section>
            </>
        }
    />
);

export default ReturnsPage;
