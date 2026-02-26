"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import api from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";
import toast from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader } from "lucide-react";

const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginContent = () => {
    const [loading, setLoading] = React.useState(false);
    const setUser = useAuthStore((state) => state.setUser);
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirect = searchParams.get("redirect") || "/";

    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormValues) => {
        try {
            setLoading(true);
            const { data: userData } = await api.post("/auth/login", data);
            setUser(userData);
            toast.success("Welcome back!");
            router.push(redirect);
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Login failed. Please check your credentials.");
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
                    <h2 className="text-3xl font-bold text-primary italic">Welcome Back</h2>
                    <p className="text-gray-500 mt-2">Sign in to your Yukta account</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold mb-2 uppercase tracking-widest text-gray-500">Email Address</label>
                        <input
                            {...register("email")}
                            className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all"
                            placeholder="name@example.com"
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-bold mb-2 uppercase tracking-widest text-gray-500">Password</label>
                        <input
                            type="password"
                            {...register("password")}
                            className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all"
                            placeholder="••••••••"
                        />
                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary text-white font-bold py-4 uppercase tracking-[0.2em] rounded hover:opacity-90 transition-all shadow-lg flex items-center justify-center disabled:opacity-50"
                    >
                        {loading ? <Loader className="animate-spin" size={20} /> : "Validate & Log In"}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-gray-500">
                    Don't have an account?{" "}
                    <Link href={/auth/register?redirect=${encodeURIComponent(redirect)}} className="text-primary font-bold hover:underline">
                        Create one
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

const LoginPage = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <LoginContent />
        </Suspense>
    );
};

export default LoginPage;