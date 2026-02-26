import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
    _id: string;
    id?: string;
    name: string;
    price: number;
    discount: number;
    image: string;
    quantity: number;
}

interface CartState {
    cart: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    getTotal: () => number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            cart: [],
            addItem: (item) => {
                if (!item || (!item._id && !item.id)) {
                    console.error('Attempted to add invalid item to cart', item);
                    return;
                }
                const itemId = item._id || item.id;
                const cart = get().cart || [];
                const existingItem = cart.find((i) => i._id === itemId);

                if (existingItem) {
                    set({
                        cart: cart.map((i) =>
                            i._id === itemId ? { ...i, quantity: (i.quantity || 0) + (item.quantity || 1) } : i
                        )
                    });
                } else {
                    set({ cart: [...cart, { ...item, _id: itemId as string }] });
                }
            },
            removeItem: (id) => set({ cart: (get().cart || []).filter((i) => i._id !== id) }),
            updateQuantity: (id, quantity) =>
                set({
                    cart: (get().cart || []).map((i) => (i._id === id ? { ...i, quantity } : i))
                }),
            clearCart: () => set({ cart: [] }),
            getTotal: () => {
                const cart = get().cart || [];
                return cart.reduce((total, item) => {
                    if (!item) return total;
                    const price = (item.price || 0) - ((item.price || 0) * (item.discount || 0)) / 100;
                    return total + price * (item.quantity || 1);
                }, 0);
            }
        }),
        {
            name: 'cart-storage',
        }
    )
);
