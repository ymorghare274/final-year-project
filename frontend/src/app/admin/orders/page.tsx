"use client";

import React, { useState, useEffect } from "react";
import { Search, ShoppingBag, Clock, CheckCircle, Package, Truck, User } from "lucide-react";
import api from "@/lib/api";
import toast from "react-hot-toast";

const AdminOrdersPage = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const fetchOrders = async () => {
        try {
            const { data } = await api.get("/admin/orders");
            setOrders(data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load orders");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const updateOrderStatus = async (orderId: string, status: string) => {
        try {
            // Need a backend route to update order status
            await api.put(`/admin/orders/${orderId}`, { order_status: status });
            toast.success(`Order set to ${status}`);
            fetchOrders();
        } catch (e) {
            toast.error("Status update failed");
        }
    };

    const filteredOrders = orders.filter(o =>
        o.id.toLowerCase().includes(search.toLowerCase()) ||
        o.users?.name?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 p-8 text-foreground">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold tracking-tight italic">Order Management</h1>
                    <div className="text-sm text-gray-400 font-bold uppercase tracking-widest">{orders.length} Total Orders</div>
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by Order ID or Customer Name..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-xl outline-none focus:ring-2 focus:ring-primary shadow-sm"
                    />
                </div>

                <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50 dark:bg-zinc-800/50 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
                                    <th className="px-8 py-5">Order Detail</th>
                                    <th className="px-8 py-5">Customer</th>
                                    <th className="px-8 py-5">Amount</th>
                                    <th className="px-8 py-5">Payment</th>
                                    <th className="px-8 py-5">Status</th>
                                    <th className="px-8 py-5">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-zinc-800">
                                {loading ? (
                                    <tr><td colSpan={6} className="p-20 text-center text-gray-400">Loading orders...</td></tr>
                                ) : filteredOrders.length === 0 ? (
                                    <tr><td colSpan={6} className="p-20 text-center text-gray-400 italic">No orders found</td></tr>
                                ) : filteredOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/20 transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <Package size={20} className="text-gray-300" />
                                                <div>
                                                    <div className="font-mono text-xs font-bold">#YKT-{order.id.slice(0, 8)}</div>
                                                    <div className="text-[10px] text-gray-400 font-medium">{new Date(order.created_at).toLocaleDateString()}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2">
                                                <User size={14} className="text-primary" />
                                                <div className="text-sm font-bold">{order.users?.name || 'Guest'}</div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 font-bold text-sm">₹{order.total_amount.toLocaleString()}</td>
                                        <td className="px-8 py-6">
                                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${order.payment_status === 'paid' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                                                }`}>
                                                {order.payment_status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${order.order_status === 'Delivered' ? 'bg-green-500 text-white' :
                                                    order.order_status === 'Shipped' ? 'bg-blue-500 text-white' :
                                                        'bg-orange-500 text-white'
                                                }`}>
                                                {order.order_status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <select
                                                value={order.order_status}
                                                onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                                className="bg-gray-50 dark:bg-zinc-800 border-none rounded p-1 text-[10px] font-bold uppercase outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                                            >
                                                <option value="Processing">Processing</option>
                                                <option value="Shipped">Shipped</option>
                                                <option value="Delivered">Delivered</option>
                                                <option value="Cancelled">Cancelled</option>
                                            </select>
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

export default AdminOrdersPage;