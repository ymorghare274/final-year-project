"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
    User,
    ShoppingBag,
    Heart,
    MapPin,
    LogOut,
    ChevronRight,
    Package,
    Settings,
    ShieldCheck,
    CreditCard,
    Plus,
    Trash2,
    Edit3,
    Check
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import api from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import ProductCard from "@/components/product/ProductCard";

const ProfilePage = () => {
    const { user, logout: authLogout, updateUser } = useAuthStore();
    const { wishlist } = useWishlistStore();
    const [activeTab, setActiveTab] = useState("profile");
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const router = useRouter();

    const logout = () => {
        authLogout();
        router.push("/");
    };

    // Form states
    const [editForm, setEditForm] = useState({
        name: "",
        phone: "",
    });

    useEffect(() => {
        if (user) {
            setEditForm({
                name: user.name || "",
                phone: user.phone || "",
            });
        }
    }, [user]);

    const [newAddress, setNewAddress] = useState({
        label: "Home",
        street: "",
        city: "",
        state: "",
        zip: "",
    });

    useEffect(() => {
        if (!user) {
            router.push("/auth/login");
        }
    }, [user, router]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const { data } = await api.get("/orders/myorders");
            setOrders(data);
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === "orders") {
            fetchOrders();
        }
    }, [activeTab]);

    if (!user) return null;

    const menuItems = [
        { id: "profile", label: "My Profile", icon: <User size={20} />, color: "text-blue-500" },
        { id: "orders", label: "My Orders", icon: <ShoppingBag size={20} />, color: "text-orange-500" },
        { id: "wishlist", label: "Wishlist", icon: <Heart size={20} />, color: "text-red-500" },
        { id: "addresses", label: "Addresses", icon: <MapPin size={20} />, color: "text-emerald-500" },
        { id: "settings", label: "Settings", icon: <Settings size={20} />, color: "text-gray-500" },
    ];

    const handleSaveProfile = async () => {
        if (!editForm.name.trim()) return toast.error("Name is required");
        try {
            setLoading(true);
            const { data } = await api.put("/auth/profile", editForm);

            // Explicitly merging to be safe, although updateUser handles it
            updateUser(data);

            setIsEditing(false);
            toast.success("Profile updated successfully!");
        } catch (error: any) {
            console.error("Profile save error:", error);
            toast.error(error.response?.data?.message || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    const handleAddAddress = async () => {
        if (!newAddress.street || !newAddress.city) return toast.error("Please fill required fields");
        try {
            setLoading(true);
            const updatedAddresses = [...(user.addresses || []), newAddress];
            const { data } = await api.put("/auth/profile", { addresses: updatedAddresses });
            updateUser(data);
            setNewAddress({ label: "Home", street: "", city: "", state: "", zip: "" });
            toast.success("Address added!");
        } catch (error) {
            toast.error("Failed to add address");
        } finally {
            setLoading(false);
        }
    };

    const removeAddress = async (idx: number) => {
        try {
            setLoading(true);
            const updatedAddresses = user.addresses?.filter((_, i) => i !== idx);
            const { data } = await api.put("/auth/profile", { addresses: updatedAddresses });
            updateUser(data);
            toast.success("Address removed");
        } catch (error) {
            toast.error("Failed to remove address");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 pt-24 pb-12 px-4">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">

                {/* Sidebar */}
                <aside className="w-full md:w-80 flex flex-col gap-6">
                    <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-6 rounded-xl shadow-sm flex items-center gap-4">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-2xl">
                            {user.name.charAt(0)}
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Welcome,</p>
                            <h2 className="text-xl font-bold dark:text-white line-clamp-1">{user.name}</h2>
                            {user.role === 'admin' && (
                                <span className="text-[10px] bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter">Admin</span>
                            )}
                        </div>
                    </div>

                    <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-xl shadow-sm overflow-hidden">
                        <div className="p-2">
                            {menuItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={`w-full flex items-center justify-between p-4 rounded-lg transition-all ${activeTab === item.id
                                        ? "bg-primary text-white shadow-lg shadow-primary/20"
                                        : "hover:bg-gray-50 dark:hover:bg-zinc-800 text-gray-600 dark:text-gray-400"
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className={activeTab === item.id ? "text-white" : item.color}>{item.icon}</span>
                                        <span className="font-bold text-sm">{item.label}</span>
                                    </div>
                                    <ChevronRight size={16} className={activeTab === item.id ? "opacity-100" : "opacity-0"} />
                                </button>
                            ))}
                            {user.role === 'admin' && (
                                <Link
                                    href="/admin/dashboard"
                                    className="w-full flex items-center justify-between p-4 rounded-lg transition-all hover:bg-primary/10 text-primary mt-2 border border-primary/20"
                                >
                                    <div className="flex items-center gap-3">
                                        <ShieldCheck size={20} />
                                        <span className="font-bold text-sm uppercase tracking-widest">Admin Dashboard</span>
                                    </div>
                                    <ChevronRight size={16} />
                                </Link>
                            )}
                            <button
                                onClick={logout}
                                className="w-full flex items-center justify-between p-4 rounded-lg transition-all hover:bg-red-50 dark:hover:bg-red-950/20 text-red-500 mt-4 border border-red-100 dark:border-red-900/20"
                            >
                                <div className="flex items-center gap-3">
                                    <LogOut size={20} />
                                    <span className="font-bold text-sm uppercase tracking-widest">Logout</span>
                                </div>
                            </button>
                        </div>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1">
                    <AnimatePresence mode="wait">
                        {activeTab === "profile" && (
                            <motion.div
                                key="profile"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-xl shadow-sm p-8"
                            >
                                <div className="flex justify-between items-center mb-8">
                                    <h3 className="text-2xl font-bold dark:text-white">Profile Information</h3>
                                    {!isEditing ? (
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="text-primary text-sm font-bold uppercase tracking-widest hover:underline flex items-center gap-2"
                                        >
                                            <Edit3 size={16} /> Edit Details
                                        </button>
                                    ) : (
                                        <div className="flex gap-4">
                                            <button onClick={() => setIsEditing(false)} className="text-gray-400 text-xs font-bold uppercase">Cancel</button>
                                            <button
                                                onClick={handleSaveProfile}
                                                className="text-green-600 text-xs font-bold uppercase flex items-center gap-1"
                                            >
                                                <Check size={16} /> Save
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {isEditing ? (
                                        <>
                                            <EditField label="Full Name" value={editForm.name} onChange={(v) => setEditForm({ ...editForm, name: v })} />
                                            <EditField label="Phone Number" value={editForm.phone} onChange={(v) => setEditForm({ ...editForm, phone: v })} />
                                        </>
                                    ) : (
                                        <>
                                            <InfoField label="Full Name" value={user.name} />
                                            <InfoField label="Email Address" value={user.email} />
                                            <InfoField label="Phone Number" value={user.phone || "Not provided"} />
                                            <InfoField label="Account Type" value={user.role === 'admin' ? "Administrator" : "Standard Customer"} />
                                            <div className="md:col-span-2">
                                                <InfoField
                                                    label="Default Shipping Address"
                                                    value={user.addresses?.[0]
                                                        ? `${user.addresses[0].street}, ${user.addresses[0].city}`
                                                        : "No addresses saved"
                                                    }
                                                />
                                            </div>
                                        </>
                                    )}
                                </div>

                                {user.role === 'admin' && (
                                    <div className="mt-8 p-6 bg-primary/5 rounded-xl border border-primary/10 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <ShieldCheck className="text-primary" size={32} />
                                            <div>
                                                <h4 className="font-bold text-gray-900 dark:text-white">Admin Management</h4>
                                                <p className="text-sm text-gray-500">You have administrative privileges. Access the inventory and order controls.</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => router.push("/admin/dashboard")}
                                            className="bg-primary text-white px-6 py-2.5 rounded-lg font-bold uppercase tracking-widest text-[10px] hover:opacity-90 transition-all shadow-lg shadow-primary/20"
                                        >
                                            Go to Dashboard
                                        </button>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {activeTab === "wishlist" && (
                            <motion.div
                                key="wishlist"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-6"
                            >
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-2xl font-bold dark:text-white">My Wishlist</h3>
                                    <span className="text-sm text-gray-400">{wishlist.length} Items saved</span>
                                </div>

                                {wishlist.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {wishlist.map((item) => (
                                            <ProductCard
                                                key={item._id}
                                                product={{
                                                    _id: item._id,
                                                    name: item.name,
                                                    price: item.price,
                                                    discount: item.discount,
                                                    images: [item.image],
                                                    category: item.category
                                                }}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="bg-white dark:bg-zinc-900 border border-dashed border-gray-200 dark:border-zinc-800 rounded-xl p-16 text-center">
                                        <Heart size={48} className="mx-auto text-gray-200 mb-4" />
                                        <h4 className="text-xl font-bold text-gray-400 uppercase tracking-widest">Your wishlist is empty</h4>
                                        <p className="text-gray-500 mt-2 mb-8">Save your favorite treasures to view them here later.</p>
                                        <button
                                            onClick={() => router.push("/products")}
                                            className="bg-black dark:bg-white text-white dark:text-black px-8 py-3 rounded font-bold uppercase tracking-widest text-[10px]"
                                        >
                                            Explore Collection
                                        </button>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {activeTab === "addresses" && (
                            <motion.div
                                key="addresses"
                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                className="space-y-6"
                            >
                                <div className="bg-white dark:bg-zinc-900 p-8 rounded-xl border border-gray-100 dark:border-zinc-800 shadow-sm">
                                    <h3 className="text-2xl font-bold dark:text-white mb-6">Manage Addresses</h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                                        {user.addresses?.map((addr: any, idx: number) => (
                                            <div key={idx} className="p-6 bg-gray-50/50 dark:bg-zinc-800/20 border border-gray-100 dark:border-zinc-800 rounded-2xl relative group hover:border-primary/30 transition-all">
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="flex items-center gap-2">
                                                        <MapPin size={14} className="text-primary" />
                                                        <span className="text-[10px] bg-primary/10 text-primary px-3 py-1 rounded-full font-bold uppercase tracking-widest">{addr.label}</span>
                                                    </div>
                                                    <button
                                                        onClick={() => removeAddress(idx)}
                                                        className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                                        title="Remove Address"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-sm font-bold uppercase tracking-tight">{user.name}</p>
                                                    <p className="text-xs text-gray-500 leading-relaxed font-medium">
                                                        {addr.street}<br />
                                                        {addr.city}, {addr.state} - {addr.zip}
                                                    </p>
                                                </div>
                                                {idx === 0 && (
                                                    <div className="absolute -top-2 -right-2 bg-primary text-white text-[8px] font-bold px-2 py-1 rounded shadow-lg uppercase tracking-tighter">Default</div>
                                                )}
                                            </div>
                                        ))}
                                        {(!user.addresses || user.addresses.length === 0) && (
                                            <div className="col-span-2 py-12 text-center text-gray-400 border border-dashed border-gray-200 dark:border-zinc-800 rounded-2xl">
                                                <p className="text-sm italic uppercase tracking-widest">No shipping addresses saved yet</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="border-t border-gray-100 dark:border-zinc-800 pt-8 mt-8">
                                        <h4 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
                                            <Plus size={16} /> Add New Address
                                        </h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            <input
                                                placeholder="Address Label (e.g. Home, Office)"
                                                value={newAddress.label}
                                                onChange={e => setNewAddress({ ...newAddress, label: e.target.value })}
                                                className="col-span-2 p-4 bg-gray-50 dark:bg-zinc-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                                            />
                                            <input
                                                placeholder="Street Address"
                                                value={newAddress.street}
                                                onChange={e => setNewAddress({ ...newAddress, street: e.target.value })}
                                                className="col-span-2 p-4 bg-gray-50 dark:bg-zinc-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                                            />
                                            <input
                                                placeholder="City"
                                                value={newAddress.city}
                                                onChange={e => setNewAddress({ ...newAddress, city: e.target.value })}
                                                className="p-4 bg-gray-50 dark:bg-zinc-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                                            />
                                            <input
                                                placeholder="State"
                                                value={newAddress.state}
                                                onChange={e => setNewAddress({ ...newAddress, state: e.target.value })}
                                                className="p-4 bg-gray-50 dark:bg-zinc-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                                            />
                                            <input
                                                placeholder="ZIP / Postal Code"
                                                value={newAddress.zip}
                                                onChange={e => setNewAddress({ ...newAddress, zip: e.target.value })}
                                                className="col-span-2 p-4 bg-gray-50 dark:bg-zinc-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                                            />
                                        </div>
                                        <button
                                            disabled={loading}
                                            onClick={handleAddAddress}
                                            className="mt-6 w-full py-4 bg-black dark:bg-white text-white dark:text-black rounded-xl font-bold uppercase tracking-[0.2em] text-[10px] shadow-lg hover:bg-primary dark:hover:bg-primary transition-all disabled:opacity-50"
                                        >
                                            {loading ? "Processing..." : "Securely Save Address"}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === "orders" && (
                            <motion.div key="orders" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                                <h3 className="text-2xl font-bold dark:text-white mb-2">Order History</h3>
                                {orders.length > 0 ? orders.map((order) => (
                                    <div key={order.id} className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-xl shadow-sm overflow-hidden">
                                        <div className="bg-gray-50 dark:bg-zinc-800/50 p-4 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center">
                                            <div>
                                                <p className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Order Placed</p>
                                                <p className="text-sm font-bold dark:text-gray-300">{new Date(order.created_at).toLocaleDateString()}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Total</p>
                                                <p className="text-sm font-bold text-primary">₹{order.total_amount.toLocaleString()}</p>
                                            </div>
                                        </div>
                                        <div className="p-6">
                                            <div className="flex gap-4 items-center">
                                                <Package className="text-gray-300" size={24} />
                                                <div className="flex-1">
                                                    <h4 className="font-bold text-sm">Order #YKT-{order.id.slice(0, 8)}</h4>
                                                    <p className="text-xs text-gray-500">Status: {order.order_status}</p>
                                                </div>
                                                <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-[10px] font-bold uppercase tracking-wider">{order.payment_status}</span>
                                            </div>
                                            <div className="mt-4 pt-4 border-t border-gray-50 dark:border-zinc-800 flex justify-end">
                                                <button
                                                    onClick={() => toast.success(`Tracking info for #YKT-${order.id.slice(0, 8)} will be sent via SMS`)}
                                                    className="text-[10px] font-bold uppercase tracking-widest text-primary hover:underline"
                                                >
                                                    Track Package
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="p-12 text-center text-gray-400">No orders found</div>
                                )}
                            </motion.div>
                        )}

                        {activeTab === "settings" && <SettingsTab />}
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
};

const SettingsTab = () => {
    const { logout } = useAuthStore();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [showPassForm, setShowPassForm] = useState(false);
    const [passwords, setPasswords] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwords.newPassword !== passwords.confirmPassword) {
            return toast.error("New passwords do not match");
        }
        if (passwords.newPassword.length < 6) {
            return toast.error("Password must be at least 6 characters");
        }

        try {
            setLoading(true);
            await api.put("/auth/update-password", {
                currentPassword: passwords.currentPassword,
                newPassword: passwords.newPassword
            });
            toast.success("Password updated successfully!");
            setShowPassForm(false);
            setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to update password");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!window.confirm("ARE YOU SURE? This action is permanent and will delete all your data including orders and wishlist.")) {
            return;
        }

        try {
            setLoading(true);
            await api.delete("/auth/delete-account");
            toast.success("Account deleted. We're sorry to see you go.");
            logout();
            router.push("/");
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to delete account");
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            key="settings"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-xl shadow-sm p-8">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-2xl font-bold dark:text-white">Account Settings</h3>
                    <span className="text-[10px] bg-primary/10 text-primary px-3 py-1 rounded-full font-bold uppercase tracking-widest">v2.1 Stable</span>
                </div>

                <div className="space-y-8">
                    {/* Appearance */}
                    <section>
                        <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-6 flex items-center gap-2">
                            <div className="w-1 h-1 bg-primary rounded-full" />
                            Appearance & Theme
                        </h4>
                        <div className="bg-gray-50/50 dark:bg-zinc-800/20 border border-gray-100 dark:border-zinc-800 p-6 rounded-2xl flex items-center justify-between group hover:border-primary/20 transition-all">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                    <Settings size={20} />
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900 dark:text-white text-sm">Dark Mode</p>
                                    <p className="text-xs text-gray-500">Enable dark theme for a cinematic experience</p>
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    const isDark = document.documentElement.classList.toggle('dark');
                                    localStorage.setItem('theme', isDark ? 'dark' : 'light');
                                    toast.success(`Theme switched to ${isDark ? 'Dark' : 'Light'} Mode`);
                                }}
                                className="w-12 h-6 bg-gray-200 dark:bg-primary rounded-full relative transition-colors"
                            >
                                <div className="absolute top-1 left-1 dark:left-7 w-4 h-4 bg-white rounded-full transition-all shadow-sm" />
                            </button>
                        </div>
                    </section>

                    {/* Notifications */}
                    <section>
                        <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-6 flex items-center gap-2">
                            <div className="w-1 h-1 bg-orange-400 rounded-full" />
                            Notification Preferences
                        </h4>
                        <div className="space-y-4">
                            {[
                                { title: "Order Analytics", desc: "Real-time updates on your order journey", checked: true },
                                { title: "Exclusive Offers", desc: "Early access to new collections and sales", checked: false },
                                { title: "Security Alerts", desc: "Immediate notification of suspicious activity", checked: true }
                            ].map((opt, i) => (
                                <div key={i} className="bg-gray-50/50 dark:bg-zinc-800/20 border border-gray-100 dark:border-zinc-800 p-5 rounded-2xl flex items-center justify-between hover:bg-white dark:hover:bg-zinc-800 transition-all">
                                    <div>
                                        <p className="font-bold text-gray-900 dark:text-white text-sm">{opt.title}</p>
                                        <p className="text-[10px] text-gray-500 font-medium">{opt.desc}</p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        defaultChecked={opt.checked}
                                        className="w-5 h-5 rounded-lg border-2 border-gray-200 checked:bg-primary accent-primary cursor-pointer transition-all"
                                    />
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Privacy & Security */}
                    <section>
                        <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-6 flex items-center gap-2">
                            <div className="w-1 h-1 bg-emerald-400 rounded-full" />
                            Privacy & Security
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {!showPassForm ? (
                                <button
                                    onClick={() => setShowPassForm(true)}
                                    className="flex flex-col items-start p-6 bg-gray-50/50 dark:bg-zinc-800/20 border border-gray-100 dark:border-zinc-800 rounded-2xl hover:border-primary/30 hover:bg-white dark:hover:bg-zinc-800 transition-all text-left"
                                >
                                    <ShieldCheck className="text-emerald-500 mb-3" size={24} />
                                    <p className="font-bold text-gray-900 dark:text-white text-sm">Update Password</p>
                                    <p className="text-[10px] text-gray-500 mt-1">Keep your account secure with a strong password</p>
                                </button>
                            ) : (
                                <div className="col-span-1 md:col-span-2 bg-gray-50 dark:bg-zinc-800/50 border border-primary/20 p-8 rounded-2xl">
                                    <form onSubmit={handleUpdatePassword} className="space-y-4">
                                        <div className="flex justify-between items-center mb-4">
                                            <h5 className="font-bold text-sm uppercase tracking-widest text-primary">Secure Password Update</h5>
                                            <button type="button" onClick={() => setShowPassForm(false)} className="text-[10px] font-bold text-gray-400 uppercase">Cancel</button>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <input
                                                type="password"
                                                placeholder="Current Password"
                                                required
                                                value={passwords.currentPassword}
                                                onChange={e => setPasswords({ ...passwords, currentPassword: e.target.value })}
                                                className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-4 rounded-xl text-xs outline-none focus:ring-2 focus:ring-primary/20"
                                            />
                                            <input
                                                type="password"
                                                placeholder="New Password"
                                                required
                                                value={passwords.newPassword}
                                                onChange={e => setPasswords({ ...passwords, newPassword: e.target.value })}
                                                className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-4 rounded-xl text-xs outline-none focus:ring-2 focus:ring-primary/20"
                                            />
                                            <input
                                                type="password"
                                                placeholder="Confirm New Password"
                                                required
                                                value={passwords.confirmPassword}
                                                onChange={e => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                                                className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-4 rounded-xl text-xs outline-none focus:ring-2 focus:ring-primary/20"
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full py-4 bg-primary text-white rounded-xl font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20 hover:opacity-90 disabled:opacity-50"
                                        >
                                            {loading ? "Updating..." : "Verify & Change Password"}
                                        </button>
                                    </form>
                                </div>
                            )}

                            <button
                                onClick={handleDeleteAccount}
                                disabled={loading}
                                className="flex flex-col items-start p-6 bg-gray-50/50 dark:bg-zinc-800/20 border border-gray-100 dark:border-zinc-800 rounded-2xl hover:border-red-500/30 hover:bg-white dark:hover:bg-zinc-800 transition-all text-left group disabled:opacity-50"
                            >
                                <Trash2 className="text-red-400 mb-3 group-hover:text-red-600" size={24} />
                                <p className="font-bold text-gray-900 dark:text-white text-sm">Delete Account</p>
                                <p className="text-[10px] text-gray-500 mt-1">Permanently remove all your data from Yukta</p>
                            </button>
                        </div>
                    </section>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-100 dark:border-zinc-800 flex justify-center">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.3em]">Yukta Jewelers © 2026 Settings Hub</p>
                </div>
            </div>
        </motion.div>
    );
};

const InfoField = ({ label, value }: { label: string; value: string }) => (
    <div className="space-y-1">
        <p className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">{label}</p>
        <p className="text-lg font-bold dark:text-gray-200">{value}</p>
        <div className="h-px bg-gray-100 dark:bg-zinc-800 w-full mt-2" />
    </div>
);

const EditField = ({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) => (
    <div className="space-y-2">
        <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">{label}</label>
        <input
            value={value}
            onChange={e => onChange(e.target.value)}
            className="w-full bg-gray-50 dark:bg-zinc-800 border-b-2 border-primary/20 focus:border-primary p-2 outline-none font-bold"
        />
    </div>
);

export default ProfilePage;