"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
      <p className="text-gray-500 mb-8">
        We encountered an error while loading your cart.
      </p>
      <div className="flex gap-4">
        <button
          onClick={() => reset()}
          className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors"
        >
          Try again
        </button>
        <Link
          href="/"
          className="bg-gray-100 text-black px-6 py-2 rounded-md hover:bg-gray-200 transition-colors"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}