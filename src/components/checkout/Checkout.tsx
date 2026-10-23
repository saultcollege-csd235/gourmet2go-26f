
import { useState } from "react";
import { cartStore } from "../../store/cartStore.ts";
import { useAuth } from "../../context/AuthContext.tsx";
import { supabase } from "../../../supabase-client.ts";
import { useNavigate } from "react-router";
import {
  ArrowLeft,
  ShoppingBag,
  FileText,
  Plus,
  Minus,
  Trash2,
} from "lucide-react";
import { Loader } from "../Loader.tsx";
import { toast } from "sonner";

const MAX_TOTAL_ITEMS = 5;
const MAX_QTY_PER_ITEM = 5;

export const Checkout = () => {
  const {
    items,
    totalPrice,
    totalItems,
    updateQuantity,
    removeItem,
    clearCart,
  } = cartStore();

  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState("");

  const subtotal = totalPrice();
  const itemCount = totalItems();

  const handleConfirmOrder = async () => {
    if (!user) {
      toast.error("Please sign in to place an order.");
      return;
    }

    if (items.length === 0 || loading) return;

    setLoading(true);
    const toastId = toast.loading("Processing your order...");

    try {
      const menuId = items[0].menu_id;

      const { data: existingOrders, error: existingOrdersError } =
        await supabase
          .from("Orders")
          .select("order_id")
          .eq("user_id", user.id)
          .eq("menu_id", menuId)
          .limit(1);

      if (existingOrdersError) throw existingOrdersError;

      if (existingOrders && existingOrders.length > 0) {
        throw new Error(
          "You've already placed an order for this menu. We have a strict one order per menu policy. You can delete your current order and re-order if you'd like."
        );
      }

      const orderItemsPayload = items.map((item) => ({
        dish_id: item.dish_id,
        quantity: item.quantity,
      }));

      const { error: rpcError } = await supabase.rpc("place_order", {
        p_menu_id: menuId,
        p_items: orderItemsPayload,
        p_notes: notes.trim() || null,
      });

      if (rpcError) {
        throw new Error(rpcError.message);
      }

      toast.success("Order confirmed!", { id: toastId });
      clearCart();
      navigate("/successful-order");
    } catch (err: unknown) {
      console.error(err);

      const error = err as { code?: string; message?: string };

      if (error.code === "23505") {
        toast.error(
          "Small issue processing your order, please try again.",
          { id: toastId }
        );
      } else {
        toast.error(
          error.message || "Failed to place order. Please try again.",
          { id: toastId }
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900 py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Go back"
            className="flex items-center justify-center w-10 h-10 border border-gray-200 dark:border-zinc-800 rounded-full hover:border-[#00659B] transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>

          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              Checkout
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Review your order and confirm details
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
              Add some dishes before checking out.
            </p>

            <button
              type="button"
              onClick={() => navigate("/")}
              className="mt-6 bg-[#00659B] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#005082]"
            >
              Browse Menu
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
                  disabled={loading}
                  className="w-full h-40 p-4 rounded-lg bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white resize-none focus:outline-none focus:ring-2 focus:ring-[#00659B]"
                />

                <p className="text-xs text-gray-500 mt-2 text-right">
                  {notes.length}/500 characters
                </p>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-zinc-800 sticky top-24">
                <div className="flex items-center justify-between gap-2 mb-6">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-[#00659B]" />
                    Order Summary
                  </h2>

                  <span className="text-sm text-gray-500 whitespace-nowrap">
                    {itemCount}/5 items
                  </span>
                </div>

                <div className="space-y-5 mb-6 max-h-96 overflow-y-auto">
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

                          <span className="font-bold text-gray-900 dark:text-white whitespace-nowrap">
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
                              disabled={loading || item.quantity <= 1}
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
                              disabled={loading || cannotIncrease}
                              aria-label={`Increase ${item.name} quantity`}
                              className="w-8 h-8 flex items-center justify-center bg-white dark:bg-zinc-700 rounded-md disabled:opacity-40"
                            >
                              <Plus size={15} />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeItem(item.dish_id)}
                            disabled={loading}
                            aria-label={`Remove ${item.name}`}
                            className="text-gray-400 hover:text-red-500 p-2 rounded-full disabled:opacity-40"
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
                  onClick={handleConfirmOrder}
                  disabled={loading || !user}
                  className="w-full bg-linear-to-r from-[#00659B] to-[#005082] hover:from-[#005082] hover:to-[#004060] text-white py-4 rounded-xl font-bold text-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed flex justify-center items-center"
                >
                  {loading ? (
                    <Loader fullScreen={false} text="Processing..." />
                  ) : (
                    "Confirm Order"
                  )}
                </button>

                {!user && (
                  <p className="text-xs text-gray-500 text-center mt-3">
                    Please sign in to place an order.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
