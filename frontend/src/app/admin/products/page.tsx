"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Search, Plus, Filter, Edit, Trash2, Check, X } from "lucide-react";

import api from "@/lib/api";
import toast from "react-hot-toast";
import AddProductModal from "@/components/admin/AddProductModal";

const AdminProductsPage = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchProducts = async () => {
        try {
            const { data } = await api.get("/products/admin");
            setProducts(data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load products");
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this product?")) return;
        try {
            // NOTE: We need a backend delete route. Assuming it exists.
            await api.delete(`/products/${id}`);
            toast.success("Product deleted");
            fetchProducts();
        } catch (error) {
            console.error(error);
            toast.error("Delete failed");
        }
    };

    const filtered = products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase())
    );

    const handleWipeInventory = async () => {
        if (!confirm("CRITICAL: This will permanently delete EVERY product in your shop. Continue?")) return;
        try {
            setLoading(true);
            await api.delete("/products/wipe-all-dangerous");
            toast.success("Inventory wiped clean");
            fetchProducts();
        } catch (error) {
            toast.error("Wipe failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Luxury Inventory</h1>
                    <div className="flex gap-4">
                        <button
                            onClick={handleWipeInventory}
                            className="px-6 py-3 border border-red-200 text-red-600 rounded-lg font-bold uppercase tracking-widest text-xs hover:bg-red-50 transition-colors"
                        >
                            Wipe Inventory
                        </button>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-primary text-white font-bold px-6 py-3 rounded-lg flex items-center space-x-2 hover:opacity-90 shadow-lg"
                        >
                            <Plus size={20} />
                            <span>Add New Item</span>
                        </button>
                    </div>
                </div>

                <AddProductModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={fetchProducts}
                />

                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by name, ID or category..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-lg outline-none focus:ring-2 focus:ring-primary shadow-sm text-foreground"
                        />
                    </div>
                </div>

                <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800 overflow-hidden">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-zinc-800/50 text-xs font-bold uppercase tracking-widest text-gray-500">
                                <th className="px-6 py-4">Product</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">Price</th>
                                <th className="px-6 py-4">Stock</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-zinc-800 text-foreground">
                            {loading ? (
                                <tr><td colSpan={6} className="p-12 text-center text-gray-400">Loading products...</td></tr>
                            ) : filtered.length === 0 ? (
                                <tr><td colSpan={6} className="p-12 text-center text-gray-400">No products found</td></tr>
                            ) : filtered.map((product) => (
                                <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/20 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-12 h-12 bg-accent/20 rounded relative overflow-hidden">
                                                <Image src={product.images[0] || "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1974&auto=format&fit=crop"} alt={product.name} fill className="object-cover" />
                                            </div>
                                            <div className="font-bold text-sm">{product.name}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{product.category}</td>
                                    <td className="px-6 py-4 text-sm font-bold">₹{product.price.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-sm font-medium">{product.stock}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${product.approved ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                                            {product.approved ? 'Approved' : 'Pending'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex space-x-2">
                                            {!product.approved && (
                                                <button
                                                    onClick={async () => {
                                                        try {
                                                            await api.put(`/products/${product.id}`, { approved: true });
                                                            toast.success("Product approved for sale");
                                                            fetchProducts();
                                                        } catch (e) {
                                                            toast.error("Approval failed");
                                                        }
                                                    }}
                                                    className="p-2 hover:bg-green-50 dark:hover:bg-green-900/20 rounded text-green-600 transition-colors"
                                                    title="Approve for sale"
                                                >
                                                    <Check size={16} />
                                                </button>
                                            )}
                                            <button className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded text-blue-600 transition-colors"><Edit size={16} /></button>
                                            <button
                                                onClick={() => handleDelete(product.id)}
                                                className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded text-red-600 transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminProductsPage;