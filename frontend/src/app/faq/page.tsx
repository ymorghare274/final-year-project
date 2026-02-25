"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
    {
        q: "What is the purity of your gold jewellery?",
        a: "All our gold jewellery is BIS Hallmarked. We primarily offer 18K and 22K gold. Each piece comes with an authentic certificate of purity."
    },
    {
        q: "Do you offer international shipping?",
        a: "Yes, we ship to over 50 countries. International shipping usually takes 7-14 business days. Please note that customs duties may apply depending on your country."
    },
    {
        q: "How can I track my order?",
        a: "Once your order is shipped, you will receive an email and SMS with the tracking ID. You can also track your package directly from your Profile > My Orders section."
    },
    {
        q: "What is your return policy?",
        a: "We offer a 30-day no-questions-asked return policy for all unworn jewellery in its original packaging with all certificates intact."
    },
    {
        q: "Can I customize a design?",
        a: "Absolutely! We love creating bespoke pieces. You can contact our design team via the Contact Us page or visit any of our flagship stores for a consultation."
    },
    {
        q: "Are your diamonds conflict-free?",
        a: "Yes, all our diamonds are ethically sourced and are IGI/GIA certified. We strictly adhere to the Kimberley Process."
    }
];

const FAQPage = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <div className="bg-white dark:bg-black min-h-screen pt-24 pb-24">
            <div className="container mx-auto px-4 max-w-3xl">
                <div className="text-center mb-16 space-y-4">
                    <HelpCircle className="mx-auto text-primary" size={48} />
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight italic">Frequently Asked Questions</h1>
                    <p className="text-gray-500 uppercase tracking-widest text-sm font-medium">Everything you need to know about Yukta</p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, idx) => (
                        <div
                            key={idx}
                            className="border border-gray-100 dark:border-zinc-800 rounded-xl overflow-hidden bg-gray-50/50 dark:bg-zinc-900/50"
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                                className="w-full flex items-center justify-between p-6 text-left hover:bg-white dark:hover:bg-zinc-800 transition-all"
                            >
                                <span className="font-bold text-lg">{faq.q}</span>
                                {openIndex === idx ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </button>
                            <AnimatePresence>
                                {openIndex === idx && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="p-6 pt-0 text-gray-500 dark:text-gray-400 leading-relaxed border-t border-gray-100 dark:border-zinc-800 mt-2 pt-4">
                                            {faq.a}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>

                <div className="mt-16 bg-primary/10 p-8 rounded-2xl text-center border border-primary/20">
                    <h3 className="text-xl font-bold mb-2">Still have questions?</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">Our concierge team is available 24/7 to assist you with your luxury experience.</p>
                    <a href="/contact" className="inline-block bg-primary text-white px-8 py-3 rounded-lg font-bold uppercase tracking-widest text-xs shadow-lg shadow-primary/20">Contact Support</a>
                </div>
            </div>
        </div>
    );
};

export default FAQPage;