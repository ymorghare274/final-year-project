"use client";

import React, { useState, useEffect } from "react";
import { Search, User as UserIcon, Shield, Mail, Phone, Calendar } from "lucide-react";
import api from "@/lib/api";
import toast from "react-hot-toast";

const AdminUsersPage = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const fetchUsers = async () => {
        try {
            const { data } = await api.get("/auth/users");
            setUsers(data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground italic">Customer Directory</h1>
                    <div className="text-sm text-gray-500 font-medium uppercase tracking-widest">{users.length} Total Users</div>
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search customers by name or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-xl outline-none focus:ring-2 focus:ring-primary shadow-sm text-foreground"
                    />
                </div>

                <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50 dark:bg-zinc-800/50 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
                                    <th className="px-8 py-5">Customer</th>
                                    <th className="px-8 py-5">Contact</th>
                                    <th className="px-8 py-5">Role</th>
                                    <th className="px-8 py-5">Joined Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-zinc-800 text-foreground">
                                {loading ? (
                                    <tr><td colSpan={4} className="p-20 text-center text-gray-400">Loading directory...</td></tr>
                                ) : filteredUsers.length === 0 ? (
                                    <tr><td colSpan={4} className="p-20 text-center text-gray-400 italic">No customers found matching your search</td></tr>
                                ) : filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/40 transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-lg">
                                                    {user.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-sm tracking-tight">{user.name}</div>
                                                    <div className="text-[10px] text-gray-400 font-mono">ID: {user.id.slice(0, 8)}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                                                    <Mail size={12} className="text-primary" />
                                                    {user.email}
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                                                    <Phone size={12} className="text-primary" />
                                                    {user.phone || 'N/A'}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${user.role === 'admin' ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-gray-100 text-gray-500'
                                                }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-xs text-gray-500">
                                            <div className="flex items-center gap-2">
                                                <Calendar size={14} />
                                                {new Date(user.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminUsersPage;