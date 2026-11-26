
import { useState } from "react";
import {
  ArrowLeft,
  FileText,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
} from "lucide-react";

interface PreviewItem {
  dish_id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
  maxStock: number;
}

const initialItems: PreviewItem[] = [
  {
    dish_id: 1,
    name: "Chicken Sandwich",
    category: "Lunch",
    price: 8.99,
    quantity: 2,
    maxStock: 5,
  },
  {
    dish_id: 2,
    name: "French Fries",
    category: "Sides",
    price: 3.99,
    quantity: 1,
    maxStock: 5,
  },
];

const MAX_TOTAL_ITEMS = 5;
const MAX_QTY_PER_ITEM = 5;

export const CheckoutPreview = () => {
  const [items, setItems] = useState<PreviewItem[]>(initialItems);
  const [notes, setNotes] = useState("");

  const itemCount = items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const updateQuantity = (dishId: number, change: number) => {
    setItems((currentItems) => {
      const totalItems = currentItems.reduce(
        (total, item) => total + item.quantity,
        0
      );

      return currentItems.map((item) => {
        if (item.dish_id !== dishId) return item;

        if (change > 0 && totalItems >= MAX_TOTAL_ITEMS) {
          return item;
        }

        const maxQuantity = Math.min(
          MAX_QTY_PER_ITEM,
          item.maxStock
        );

        const newQuantity = Math.max(
          1,
          Math.min(maxQuantity, item.quantity + change)
        );

        return {
          ...item,
          quantity: newQuantity,
        };
      });
    });
  };

  const removeItem = (dishId: number) => {
    setItems((currentItems) =>
      currentItems.filter((item) => item.dish_id !== dishId)
    );
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900 py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div className="flex items-center justify-center w-10 h-10 border border-gray-200 dark:border-zinc-800 rounded-full">
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </div>

          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              Checkout Preview
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Design preview only - no orders will be placed
            </p>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20 border border-gray-200 dark:border-zinc-800 rounded-xl">
            <ShoppingBag className="w-12 h-12 mx-auto mb-4 text-gray-400" />

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Your cart is empty
            </h2>

            <p className="text-gray-500 dark:text-gray-400 mt-2">
              All sample dishes have been removed.
            </p>

            <button
              onClick={() => setItems(initialItems)}
              className="mt-6 bg-[#00659B] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#005082]"
            >
              Reset Sample Cart
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-gray-200 dark:border-zinc-800">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#00659B]" />
                  Order Notes (Optional)
                </h2>

                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any special instructions?"
                  maxLength={500}
                  className="w-full h-40 p-4 rounded-lg bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white resize-none focus:outline-none focus:ring-2 focus:ring-[#00659B]"
                />

                <p className="text-xs text-gray-500 mt-2 text-right">
                  {notes.length}/500 characters
                </p>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-zinc-800">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-[#00659B]" />
                    Order Summary
                  </h2>

                  <span className="text-sm text-gray-500">
                    {itemCount}/5 items
                  </span>
                </div>

                <div className="space-y-5 mb-6">
                  {items.map((item) => {
                    const maxQuantity = Math.min(
                      MAX_QTY_PER_ITEM,
                      item.maxStock
                    );

                    const cannotIncrease =
                      itemCount >= MAX_TOTAL_ITEMS ||
                      item.quantity >= maxQuantity;

                    return (
                      <div
                        key={item.dish_id}
                        className="border-b border-gray-100 dark:border-zinc-800 pb-4"
                      >
                        <div className="flex justify-between gap-3">
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {item.name}
                            </p>

                            <p className="text-xs text-gray-500">
                              {item.category}
                            </p>

                            <p className="text-sm text-gray-500 mt-1">
                              ${item.price.toFixed(2)} each
                            </p>
                          </div>

                          <span className="font-bold text-gray-900 dark:text-white">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>

                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-3 bg-gray-50 dark:bg-zinc-800 rounded-lg p-1">
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(item.dish_id, -1)
                              }
                              disabled={item.quantity <= 1}
                              aria-label={`Decrease ${item.name} quantity`}
                              className="w-8 h-8 flex items-center justify-center bg-white dark:bg-zinc-700 rounded-md disabled:opacity-40"
                            >
                              <Minus size={15} />
                            </button>

                            <span className="text-sm font-bold w-4 text-center">
                              {item.quantity}
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(item.dish_id, 1)
                              }
                              disabled={cannotIncrease}
                              aria-label={`Increase ${item.name} quantity`}
                              className="w-8 h-8 flex items-center justify-center bg-white dark:bg-zinc-700 rounded-md disabled:opacity-40"
                            >
                              <Plus size={15} />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeItem(item.dish_id)}
                            aria-label={`Remove ${item.name}`}
                            className="text-gray-400 hover:text-red-500 p-2 rounded-full"
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="bg-gray-50 dark:bg-zinc-800 rounded-lg p-4 space-y-3 mb-6">
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>

                  <div className="border-t border-gray-200 dark:border-zinc-700 pt-3 flex justify-between">
                    <span className="font-bold text-gray-900 dark:text-white">
                      Total
                    </span>

                    <span className="text-xl font-extrabold text-[#00659B]">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  disabled
                  className="w-full bg-[#00659B] text-white py-4 rounded-xl font-bold opacity-60 cursor-not-allowed"
                >
                  Confirm Order (Preview Only)
                </button>

                <p className="text-xs text-gray-500 text-center mt-3">
                  Preview mode - no payment or order submission
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
