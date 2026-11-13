
import { useNavigate } from "react-router";
import { XCircle, ArrowLeft } from "lucide-react";

export const PaymentCancelled = () => {
  const navigate = useNavigate();

  return (
    <main className="relative flex min-h-screen w-full flex-col items-center justify-start overflow-hidden bg-white px-4 pt-10 dark:bg-zinc-900">
      <div className="absolute top-1/4 -left-20 h-72 w-72 rounded-full bg-orange-500/20 blur-[100px]" />
      <div className="absolute bottom-1/4 -right-20 h-72 w-72 rounded-full bg-red-500/20 blur-[100px]" />

      <div className="relative z-10 mx-auto max-w-2xl text-center">
        <div className="mb-6 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-orange-100 bg-orange-50 dark:border-zinc-700 dark:bg-zinc-800">
            <XCircle className="h-8 w-8 text-orange-600" />
          </div>
        </div>

        <h1 className="text-5xl font-extrabold tracking-tight text-orange-600 sm:text-6xl">
          Payment Cancelled
        </h1>

        <h2 className="mt-4 text-2xl font-semibold text-zinc-900 dark:text-white">
          Your payment was not completed
        </h2>

        <p className="mx-auto mt-4 max-w-md text-base text-zinc-600 dark:text-zinc-400">
          You cancelled the payment process. You can return to checkout
          and try again whenever you are ready.
        </p>

        <div className="mt-10 flex justify-center">
          <button
            onClick={() => navigate("/checkout")}
            className="flex items-center justify-center gap-2 rounded-lg bg-orange-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-orange-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Return to Checkout
          </button>
        </div>
      </div>
    </main>
  );
};
