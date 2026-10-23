export interface CartItem {
    dish_id: number;
    menu_id: number;
    name: string;
    price: number;
    category: string;
    quantity: number;
    maxStock: number;
}
interface CartState {
    items: CartItem[];
    isOpen: boolean;
    addItem: (item: Omit<CartItem, 'quantity'>) => void;
    removeItem: (dish_id: number) => void;
    updateQuantity: (dish_id: number, delta: number) => void;
    clearCart: () => void;
    toggleCart: () => void;
    totalPrice: () => number;
    totalItems: () => number;
}
export declare const cartStore: import("zustand").UseBoundStore<Omit<import("zustand").StoreApi<CartState>, "setState" | "persist"> & {
    setState(partial: CartState | Partial<CartState> | ((state: CartState) => CartState | Partial<CartState>), replace?: false | undefined): unknown;
    setState(state: CartState | ((state: CartState) => CartState), replace: true): unknown;
    persist: {
        setOptions: (options: Partial<import("zustand/middleware").PersistOptions<CartState, unknown, unknown>>) => void;
        clearStorage: () => void;
        rehydrate: () => Promise<void> | void;
        hasHydrated: () => boolean;
        onHydrate: (fn: (state: CartState) => void) => () => void;
        onFinishHydration: (fn: (state: CartState) => void) => () => void;
        getOptions: () => Partial<import("zustand/middleware").PersistOptions<CartState, unknown, unknown>>;
    };
}>;
export {};
