"use client";

import React, { useState, useRef } from "react";
import { X, Loader, Upload, Image as ImageIcon, Trash2 } from "lucide-react";
import api from "@/lib/api";
import toast from "react-hot-toast";

interface AddProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        category: "Jewellery",

        purity: "",
        weight: "",
        price: "",
        stock: "",
        images: [] as string[],
        discount: "0"
    });

    if (!isOpen) return null;

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            return toast.error("File size must be less than 5MB");
        }

        try {
            setUploading(true);
            const uploadFormData = new FormData();
            uploadFormData.append("image", file);

            const { data } = await api.post("/upload", uploadFormData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            setFormData(prev => ({
                ...prev,
                images: [...prev.images, data.url]
            }));
            toast.success("Image uploaded successfully!");
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Image upload failed");
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const removeImage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        const price = parseFloat(formData.price);
        const stock = parseInt(formData.stock);
        const discount = parseFloat(formData.discount);

        if (isNaN(price) || price < 0) {
            return toast.error("Please enter a valid price");
        }
        if (isNaN(stock) || stock < 0) {
            return toast.error("Please enter a valid stock quantity");
        }
        if (formData.images.length === 0) {
            return toast.error("Please upload at least one image");
        }

        try {
            setLoading(true);
            const payload = {
                ...formData,
                price,
                stock,
                discount: isNaN(discount) ? 0 : discount,
                images: formData.images
            };

            await api.post("/products", payload);
            toast.success("Product added successfully!");
            onSuccess();
            onClose();
            // Reset form
            setFormData({
                name: "",
                description: "",
                category: "Jewellery",

                purity: "",
                weight: "",
                price: "",
                stock: "",
                images: [],
                discount: "0"
            });
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to add product");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-zinc-900 w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
                <div className="p-6 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center">
                    <h2 className="text-xl font-bold uppercase tracking-widest">Add New Luxury Product</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-black dark:hover:text-white">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Product Name</label>
                            <input
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
                                placeholder="Golden Temple Necklace"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Category</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
                            >
                                <option>Jewellery</option>
                                <option>Beauty</option>
                                <option>Necklaces</option>
                                <option>Rings</option>
                                <option>Earrings</option>
                                <option>Bangles</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Price (INR)</label>
                            <input
                                required
                                type="number"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
                                placeholder="45000"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Stock</label>
                            <input
                                required
                                type="number"
                                value={formData.stock}
                                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
                                placeholder="10"
                            />
                        </div>


                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Weight / Volume</label>
                            <input
                                value={formData.weight}
                                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                                className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
                                placeholder="12g / 30ml"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Description</label>
                        <textarea
                            rows={2}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-primary resize-none"
                            placeholder="Tell the story of this product..."
                        />
                    </div>

                    <div className="space-y-4">
                        <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Product Images</label>

                        {/* Image Preview Grid */}
                        <div className="grid grid-cols-4 gap-4">
                            {formData.images.map((url, idx) => (
                                <div key={idx} className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200 dark:border-zinc-800">
                                    <img src={url} alt="Product" className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(idx)}
                                        className="absolute top-1 right-1 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 size={12} />
                                    </button>
                                </div>
                            ))}

                            {/* Upload Button */}
                            <button
                                type="button"
                                disabled={uploading}
                                onClick={() => fileInputRef.current?.click()}
                                className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-gray-200 dark:border-zinc-800 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
                            >
                                {uploading ? (
                                    <Loader className="animate-spin text-primary" size={24} />
                                ) : (
                                    <>
                                        <Upload className="text-gray-400 mb-2" size={24} />
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Upload Photo</span>
                                    </>
                                )}
                            </button>
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                            accept="image/*"
                            className="hidden"
                        />
                    </div>

                    <div className="pt-6 border-t border-gray-100 dark:border-zinc-800 flex gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-4 border border-gray-200 dark:border-zinc-700 rounded-lg font-bold uppercase tracking-widest text-sm hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || uploading}
                            className="flex-1 px-6 py-4 bg-black dark:bg-white text-white dark:text-black rounded-lg font-bold uppercase tracking-widest text-sm hover:bg-primary dark:hover:bg-primary transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                        >
                            {loading ? <Loader className="animate-spin" size={18} /> : <span>Publish Product</span>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProductModal;