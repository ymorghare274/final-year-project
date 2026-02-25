"use client";

import React from "react";
import { motion } from "framer-motion";
import { Gem } from "lucide-react";

export default function Loading() {
    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{
                    scale: [0.8, 1.2, 1],
                    opacity: [0, 1, 1],
                }}
                transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="relative"
            >
                <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center">
                    <Gem className="text-primary" size={48} />
                </div>
                <motion.div
                    animate={{
                        rotate: 360,
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="absolute -inset-4 border-t-2 border-primary rounded-full"
                />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-8 text-center"
            >
                <h2 className="text-white text-xl font-bold tracking-[0.5em] uppercase">Yukta</h2>
                <p className="text-primary text-[10px] font-bold tracking-[0.3em] uppercase mt-2">CRAFTING RADIANCE</p>
            </motion.div>
        </div>
    );
}
