"use client";

import React from "react";
import { Truck, ShieldCheck, Clock } from "lucide-react";

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

export const ShippingPage = () => (
    <InformationPage
        title="Shipping Policy"
        content={
            <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    <div className="p-6 bg-accent/20 rounded-xl space-y-4">
                        <Truck size={32} className="text-primary" />
                        <h3 className="font-bold uppercase tracking-widest text-xs">Free Delivery</h3>
                        <p className="text-sm">Enjoy free express shipping on all orders above ₹5,000 across India.</p>
                    </div>
                    <div className="p-6 bg-accent/20 rounded-xl space-y-4">
                        <Clock size={32} className="text-primary" />
                        <h3 className="font-bold uppercase tracking-widest text-xs">Delivery Time</h3>
                        <p className="text-sm">Metros: 2-3 business days. Rest of India: 5-7 business days.</p>
                    </div>
                    <div className="p-6 bg-accent/20 rounded-xl space-y-4">
                        <ShieldCheck size={32} className="text-primary" />
                        <h3 className="font-bold uppercase tracking-widest text-xs">Insured Transit</h3>
                        <p className="text-sm">Every shipment is fully insured by us until it reaches your doorstep.</p>
                    </div>
                </div>
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-black dark:text-white uppercase tracking-widest">Global Shipping</h2>
                    <p>We partner with premium couriers like BlueDart, DHL, and FedEx to ensure your luxury items reach you safely. International shipping is available at a flat rate of $50, with duty-free delivery where applicable.</p>
                </section>
            </>
        }
    />
);

export default ShippingPage;
