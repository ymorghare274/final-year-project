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
        console.error(error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
            <h2 className="text-2xl font-bold mb-4 italic">Catalogue Error</h2>
            <p className="text-gray-500 mb-8 max-w-md">
                We were unable to load the exclusive collection. This might be a temporary connection issue.
            </p>
            <div className="flex gap-4">
                <button
                    onClick={() => reset()}
                    className="bg-primary text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest text-xs hover:opacity-90 transition-all"
                >
                    Try again
                </button>
                <Link
                    href="/"
                    className="bg-gray-100 text-black px-8 py-3 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-gray-200 transition-all"
                >
                    Return Home
                </Link>
            </div>
        </div>
    );
}