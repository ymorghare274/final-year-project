"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

import api from "@/lib/api";

const ContactPage = () => {
    const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            await api.post("/contact", form);
            toast.success("Message sent! Our team will contact you shortly.");
            setForm({ name: "", email: "", subject: "", message: "" });
        } catch (error) {
            toast.error("Failed to send message. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-black min-h-screen pt-24 pb-24">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16 space-y-4">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight italic">Contact Us</h1>
                    <p className="text-gray-500 uppercase tracking-widest text-sm font-medium">We'd love to hear from you</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
                    {/* Contact Info */}
                    <div className="space-y-12">
                        <div className="space-y-8">
                            <h2 className="text-3xl font-bold uppercase tracking-widest">Get in Touch</h2>
                            <p className="text-gray-500 leading-relaxed">Whether you're looking for a specific design, need help with an order, or just want to say hello, our team is here for you.</p>
                        </div>

                        <div className="space-y-6">
                            <ContactItem
                                icon={<Phone className="text-primary" />}
                                title="Call Us"
                                detail="+91 98765 43210"
                                sub="Mon - Sat, 10am - 7pm"
                            />
                            <ContactItem
                                icon={<Mail className="text-primary" />}
                                title="Email Us"
                                detail="support@yukta.com"
                                sub="Response within 24 hours"
                            />
                            <ContactItem
                                icon={<MapPin className="text-primary" />}
                                title="Visit Flagship Store"
                                detail="123 Jewellery Lane, Diamond District"
                                sub="Mumbai, Maharashtra - 400001"
                            />
                        </div>

                        <div className="p-8 bg-gray-50 dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 flex items-center gap-6">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                                <MessageSquare size={32} />
                            </div>
                            <div>
                                <h4 className="font-bold">Live Chat</h4>
                                <p className="text-sm text-gray-500">Available 24/7 for immediate assistance with luxury purchases.</p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white dark:bg-zinc-900 p-8 md:p-12 rounded-3xl shadow-2xl border border-gray-100 dark:border-zinc-800"
                    >
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Your Name</label>
                                    <input
                                        required
                                        value={form.name}
                                        onChange={e => setForm({ ...form, name: e.target.value })}
                                        className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-xl p-4 outline-none focus:ring-2 focus:ring-primary transition-all font-medium"
                                        placeholder="Enter your name"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Email Address</label>
                                    <input
                                        required
                                        type="email"
                                        value={form.email}
                                        onChange={e => setForm({ ...form, email: e.target.value })}
                                        className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-xl p-4 outline-none focus:ring-2 focus:ring-primary transition-all font-medium"
                                        placeholder="name@example.com"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Subject</label>
                                <input
                                    required
                                    value={form.subject}
                                    onChange={e => setForm({ ...form, subject: e.target.value })}
                                    className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-xl p-4 outline-none focus:ring-2 focus:ring-primary transition-all font-medium"
                                    placeholder="How can we help?"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Message</label>
                                <textarea
                                    required
                                    rows={5}
                                    value={form.message}
                                    onChange={e => setForm({ ...form, message: e.target.value })}
                                    className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-xl p-4 outline-none focus:ring-2 focus:ring-primary transition-all font-medium resize-none"
                                    placeholder="Write your message here..."
                                />
                            </div>
                            <button
                                disabled={loading}
                                className="w-full bg-primary text-white font-bold py-5 rounded-xl uppercase tracking-[0.3em] shadow-xl shadow-primary/30 hover:bg-opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {loading ? "Sending..." : (
                                    <>
                                        <span>Send Message</span>
                                        <Send size={18} />
                                    </>
                                )}
                            </button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

const ContactItem = ({ icon, title, detail, sub }: { icon: React.ReactNode, title: string, detail: string, sub: string }) => (
    <div className="flex gap-6 items-start">
        <div className="w-12 h-12 bg-gray-50 dark:bg-zinc-800 rounded-xl flex items-center justify-center flex-shrink-0">
            {icon}
        </div>
        <div>
            <h4 className="font-bold text-gray-400 uppercase tracking-widest text-[10px] mb-1">{title}</h4>
            <p className="text-xl font-bold">{detail}</p>
            <p className="text-sm text-gray-500">{sub}</p>
        </div>
    </div>
);

export default ContactPage;