"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    ShoppingBag,
    Users as UsersIcon,
    Package,
    Settings,
    ArrowLeft,
    ShieldCheck
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { user } = useAuthStore();
    const router = useRouter();

    React.useEffect(() => {
        if (!user || user.role !== 'admin') {
            router.push("/");
        }
    }, [user, router]);

    if (!user || user.role !== 'admin') return null;

    const navItems = [
        { href: "/admin/dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
        { href: "/admin/orders", label: "Orders", icon: <Package size={20} /> },
        { href: "/admin/products", label: "Inventory", icon: <ShoppingBag size={20} /> },
        { href: "/admin/users", label: "Customers", icon: <UsersIcon size={20} /> },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex flex-col md:flex-row">
            {/* Admin Sidebar */}
            <aside className="w-full md:w-64 bg-white dark:bg-zinc-900 border-r border-gray-100 dark:border-zinc-800 flex flex-col sticky top-0 h-screen">
                <div className="p-6 border-b border-gray-100 dark:border-zinc-800 flex items-center gap-3">
                    <ShieldCheck className="text-primary" size={24} />
                    <h2 className="font-bold text-lg tracking-tight uppercase">Admin Panel</h2>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm tracking-wide ${pathname === item.href
                                ? "bg-primary text-white shadow-lg shadow-primary/20"
                                : "text-gray-500 hover:bg-gray-50 dark:hover:bg-zinc-800 hover:text-primary"
                                }`}
                        >
                            {item.icon}
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-100 dark:border-zinc-800">
                    <Link
                        href="/"
                        className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-black dark:hover:text-white transition-colors text-xs font-bold uppercase tracking-widest"
                    >
                        <ArrowLeft size={16} />
                        Back to Shop
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}