import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WishlistItem {
    _id: string;
    name: string;
    price: number;
    discount: number;
    image: string;
    category: string;
}

interface WishlistState {
    wishlist: WishlistItem[];
    addToWishlist: (item: WishlistItem) => void;
    removeFromWishlist: (id: string) => void;
    isInWishlist: (id: string) => boolean;
}

export const useWishlistStore = create<WishlistState>()(
    persist(
        (set, get) => ({
            wishlist: [],
            addToWishlist: (item) => {
                if (!get().isInWishlist(item._id)) {
                    set({ wishlist: [...get().wishlist, item] });
                }
            },
            removeFromWishlist: (id) => {
                set({ wishlist: get().wishlist.filter((item) => item._id !== id) });
            },
            isInWishlist: (id) => {
                return get().wishlist.some((item) => item._id === id);
            },
        }),
        {
            name: 'wishlist-storage',
        }
    )
);
