"use client";

import React from "react";
import Image from "next/image";
import {
    Users,
    ShoppingBag,
    IndianRupee,
    Clock,
    CheckCircle,
    Check,
    AlertCircle,
    Plus,
    BarChart3
} from "lucide-react";

import api from "@/lib/api";
import toast from "react-hot-toast";
import AddProductModal from "@/components/admin/AddProductModal";

const AdminDashboard = () => {
    const [isProductModalOpen, setIsProductModalOpen] = React.useState(false);
    const [statsData, setStatsData] = React.useState({
        revenue: 0,
        orders: 0,
        users: 0,
        pending: 0
    });
    const [recentOrders, setRecentOrders] = React.useState<any[]>([]);
    const [pendingProducts, setPendingProducts] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const { data: stats } = await api.get("/admin/stats");
            setStatsData(stats);

            const { data: orders } = await api.get("/admin/orders");
            setRecentOrders(orders);

            const { data: products } = await api.get("/products/admin");
            setPendingProducts(products.filter((p: any) => !p.approved));
        } catch (error: any) {
            console.error("Dashboard fetch error:", error);
            const errorMessage = error.response?.data?.message || error.message || "Failed to load dashboard data";
            toast.error(errorMessage);
            
            // If 401, the interceptor will handle redirect, but log for debugging
            if (error.response?.status === 401) {
                console.error("Authentication failed. Please log in again.");
            }
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchDashboardData();
    }, []);

    const stats = [
        { label: "Total Revenue", value: `₹${statsData.revenue.toLocaleString()}`, icon: <IndianRupee size={24} />, color: "bg-green-100 text-green-600" },
        { label: "Total Orders", value: statsData.orders.toString(), icon: <ShoppingBag size={24} />, color: "bg-blue-100 text-blue-600" },
        { label: "Total Users", value: statsData.users.toString(), icon: <Users size={24} />, color: "bg-purple-100 text-purple-600" },
        { label: "Pending Approvals", value: statsData.pending.toString(), icon: <Clock size={24} />, color: "bg-orange-100 text-orange-600" },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">Admin Dashboard</h1>
                        <p className="text-gray-500">Welcome back, manager. Here's your clear overview.</p>
                    </div>
                    <button
                        onClick={() => setIsProductModalOpen(true)}
                        className="bg-primary text-white font-bold px-6 py-3 rounded-lg flex items-center space-x-2 hover:opacity-90 transition-all shadow-lg"
                    >
                        <Plus size={20} />
                        <span>Add New Product</span>
                    </button>
                </div>

                <AddProductModal
                    isOpen={isProductModalOpen}
                    onClose={() => setIsProductModalOpen(false)}
                    onSuccess={fetchDashboardData}
                />

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, idx) => (
                        <div key={idx} className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800 flex items-center space-x-4">
                            <div className={`p-4 rounded-lg ${stat.color}`}>
                                {stat.icon}
                            </div>
                            <div className="text-foreground">
                                <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                                <p className="text-2xl font-bold">{stat.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Charts & Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-foreground">
                    {/* Main Chart Placeholder */}
                    <div className="lg:col-span-2 bg-white dark:bg-zinc-900 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800 h-96 flex flex-col items-center justify-center text-gray-400">
                        <BarChart3 size={64} className="mb-4 opacity-20" />
                        <p>No activity data available yet</p>
                    </div>

                    {/* Pending Approvals List */}
                    <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800 space-y-6">
                        <h3 className="font-bold text-lg border-b border-gray-100 dark:border-zinc-800 pb-4 flex items-center">
                            <Clock size={18} className="mr-2 text-orange-500" /> Pending Approvals
                        </h3>
                        {pendingProducts.length > 0 ? (
                            <div className="space-y-4">
                                {pendingProducts.map((product) => (
                                    <div key={product.id} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-lg transition-colors border border-transparent hover:border-gray-200">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-accent/20 rounded-md relative overflow-hidden">
                                                {product.images?.[0] && <Image src={product.images[0]} alt={product.name} fill className="object-cover" />}
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm line-clamp-1">{product.name}</p>
                                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{product.category}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={async () => {
                                                try {
                                                    await api.put(`/products/${product.id}`, { approved: true });
                                                    toast.success("Approved!");
                                                    fetchDashboardData();
                                                } catch (e) {
                                                    toast.error("Failed");
                                                }
                                            }}
                                            className="p-2 bg-green-50 text-green-600 rounded-full hover:bg-green-600 hover:text-white transition-all shadow-sm"
                                        >
                                            <Check size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 text-gray-400 text-sm italic">
                                All products have been approved
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Orders Table */}
                <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800 overflow-hidden text-foreground">
                    <div className="p-6 border-b border-gray-100 dark:border-zinc-800">
                        <h3 className="font-bold text-lg">Recent Orders</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50 dark:bg-zinc-800/50 text-xs font-bold uppercase tracking-widest text-gray-500">
                                    <th className="px-6 py-4">Order ID</th>
                                    <th className="px-6 py-4">Customer</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4">Amount</th>
                                    <th className="px-6 py-4">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders.length > 0 ? (
                                    recentOrders.map((order) => (
                                        <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/20 transition-colors">
                                            <td className="px-6 py-4 font-mono text-xs">#YKT-{order.id.slice(0, 8)}</td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-bold">{order.users?.name || 'Guest'}</div>
                                                <div className="text-[10px] text-gray-500">{order.users?.email || ''}</div>
                                            </td>
                                            <td className="px-6 py-4 text-xs text-gray-500">
                                                {new Date(order.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-sm font-bold">₹{order.total_amount.toLocaleString()}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${order.order_status === 'Delivered' ? 'bg-green-100 text-green-600' :
                                                    order.order_status === 'Processing' ? 'bg-blue-100 text-blue-600' :
                                                        'bg-orange-100 text-orange-600'
                                                    }`}>
                                                    {order.order_status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-gray-400 italic">
                                            You haven't received any orders yet
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;