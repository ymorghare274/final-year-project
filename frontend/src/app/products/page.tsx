"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/product/ProductCard";
import { Filter, SlidersHorizontal, SearchX } from "lucide-react";
import api from "@/lib/api";

const categories = ["All", "Rings", "Necklaces", "Earrings", "Bracelets", "Bangles", "Pendants", "Bridal", "Beauty", "Skincare", "Fragrance"];


const ProductsContent = () => {
    const searchParams = useSearchParams();
    const categoryParam = searchParams.get("category");
    const searchParam = searchParams.get("search");

    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState(categoryParam || "All");

    const [sortBy, setSortBy] = useState("Featured");

    useEffect(() => {
        if (categoryParam) {
            setSelectedCategory(categoryParam);
        }
    }, [categoryParam]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await api.get("/products");
                setProducts(data);
            } catch (error) {
                console.error("Failed to fetch products", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const filteredProducts = (products || []).filter(p => {
        if (!p) return false;
        const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
        const matchesMetal = true;

        const name = p.name || "";
        const description = p.description || "";
        const category = p.category || "";

        const searchLower = (searchParam || "").toLowerCase();
        const matchesSearch = !searchParam ||
            name.toLowerCase().includes(searchLower) ||
            description.toLowerCase().includes(searchLower) ||
            category.toLowerCase().includes(searchLower);

        return matchesCategory && matchesMetal && matchesSearch;
    }).sort((a, b) => {
        const priceA = (a.price || 0) - ((a.price || 0) * (a.discount || 0) / 100);
        const priceB = (b.price || 0) - ((b.price || 0) * (b.discount || 0) / 100);

        if (sortBy === "Price: Low to High") return priceA - priceB;
        if (sortBy === "Price: High to Low") return priceB - priceA;
        if (sortBy === "Newest Arrivals") {
            const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
            const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
            return dateB - dateA;
        }
        return 0;
    });

    return (
        <div className="bg-white dark:bg-black min-h-screen">
            {/* Header */}
            <div className="bg-accent/30 py-16 text-center">
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 italic">
                    {searchParam ? `Search: "${searchParam}"` : "Exclusive Collection"}
                </h1>
                <p className="text-gray-500 max-w-2xl mx-auto uppercase tracking-widest text-sm font-medium">
                    {searchParam ? `Showing results for your custom search` : "Discover timeless beauty in our complete catalogue"}
                </p>
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Filters */}
                    <aside className="lg:w-64 space-y-8 flex-shrink-0">
                        <div>
                            <h3 className="text-xs font-bold uppercase tracking-[0.2em] mb-6 flex items-center">
                                <Filter size={16} className="mr-2" /> Categories
                            </h3>
                            <div className="space-y-3">
                                {categories.map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`block text-sm transition-colors ${selectedCategory === cat ? 'text-primary font-bold' : 'text-gray-500 hover:text-black dark:hover:text-white'}`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>


                    </aside>

                    {/* Main Content */}
                    <main className="flex-1">
                        <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100 dark:border-zinc-800">
                            <span className="text-sm text-gray-400">{filteredProducts.length} Products found</span>
                            <div className="flex items-center space-x-2 text-sm">
                                <SlidersHorizontal size={14} className="text-gray-400" />
                                <span className="font-semibold">Sort by:</span>
                                <select
                                    className="bg-transparent outline-none cursor-pointer font-bold text-primary"
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                >
                                    <option>Featured</option>
                                    <option>Price: Low to High</option>
                                    <option>Price: High to Low</option>
                                    <option>Newest Arrivals</option>
                                </select>
                            </div>
                        </div>

                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="h-[400px] bg-gray-100 dark:bg-zinc-800 animate-pulse rounded-lg" />
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                                {filteredProducts.map((product) => (
                                    <ProductCard key={product.id || product._id} product={{ ...product, _id: product.id || product._id }} />
                                ))}
                            </div>
                        )}

                        {filteredProducts.length === 0 && (
                            <div className="py-24 text-center">
                                <SearchX size={48} className="mx-auto text-gray-200 mb-4" />
                                <p className="text-gray-500 text-lg">No products found matching your search or filters.</p>
                                <button
                                    onClick={() => { setSelectedCategory("All"); window.history.replaceState(null, '', '/products'); }}
                                    className="mt-4 text-primary font-bold underline"
                                >
                                    Clear all filters & search
                                </button>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

const ProductsPage = () => {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading Products...</div>}>
            <ProductsContent />
        </Suspense>
    );
};

export default ProductsPage;