"use client";

import React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import api from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";

const registerSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const RegisterPage = () => {
    const [loading, setLoading] = React.useState(false);
    const setUser = useAuthStore((state) => state.setUser);
    const router = useRouter();

    const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterFormValues) => {
        try {
            setLoading(true);
            const { data: userData } = await api.post("/auth/register", data);
            setUser(userData);
            toast.success("Account created successfully!");
            router.push("/");
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-accent/20 px-4 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full bg-white dark:bg-zinc-900 p-8 rounded-lg shadow-xl"
            >
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-primary italic">Join Yukta</h2>
                    <p className="text-gray-500 mt-2">Create an account for a premium experience</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold mb-1 uppercase tracking-widest text-gray-700 dark:text-gray-300">Full Name</label>
                        <input
                            {...register("name")}
                            className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded px-4 py-2.5 focus:ring-2 focus:ring-primary outline-none transition-all"
                            placeholder="John Doe"
                        />
                        {errors.name && <p className="text-red-500 text-[10px] mt-1">{errors.name.message}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-bold mb-1 uppercase tracking-widest text-gray-700 dark:text-gray-300">Email Address</label>
                        <input
                            {...register("email")}
                            className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded px-4 py-2.5 focus:ring-2 focus:ring-primary outline-none transition-all"
                            placeholder="name@example.com"
                        />
                        {errors.email && <p className="text-red-500 text-[10px] mt-1">{errors.email.message}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-bold mb-1 uppercase tracking-widest text-gray-700 dark:text-gray-300">Phone Number</label>
                        <input
                            {...register("phone")}
                            className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded px-4 py-2.5 focus:ring-2 focus:ring-primary outline-none transition-all"
                            placeholder="+91 98765 43210"
                        />
                        {errors.phone && <p className="text-red-500 text-[10px] mt-1">{errors.phone.message}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-bold mb-1 uppercase tracking-widest text-gray-700 dark:text-gray-300">Password</label>
                        <input
                            type="password"
                            {...register("password")}
                            className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded px-4 py-2.5 focus:ring-2 focus:ring-primary outline-none transition-all"
                            placeholder="••••••••"
                        />
                        {errors.password && <p className="text-red-500 text-[10px] mt-1">{errors.password.message}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black dark:bg-white text-white dark:text-black font-bold py-4 mt-4 uppercase tracking-[0.2em] rounded hover:bg-primary dark:hover:bg-primary transition-all shadow-lg flex items-center justify-center disabled:opacity-50"
                    >
                        {loading ? <Loader className="animate-spin" size={20} /> : "Create Account"}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-gray-500">
                    Already have an account?{" "}
                    <Link href="/auth/login" className="text-primary font-bold hover:underline">
                        Sign In
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default RegisterPage;