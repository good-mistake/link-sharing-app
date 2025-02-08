"use client";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

function VerificationFailedContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error =
    searchParams?.get("error") || "Something went wrong Try again later!";
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => router.push("/login"), 500);
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="h-screen flex items-center justify-center bg-red-100">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: fadeOut ? 0 : 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-lg rounded-lg p-6 text-center max-w-md"
      >
        <h1 className="text-2xl font-bold text-red-600">
          Verification Failed!
        </h1>
        <p className="text-gray-600 mt-2">{error}</p>
        <p className="text-sm text-gray-500 mt-1">Redirecting to login...</p>
      </motion.div>
    </div>
  );
}
export default function VerificationFailedPage() {
  return (
    <Suspense
      fallback={<p className="text-center mt-20 text-gray-500">Loading...</p>}
    >
      <VerificationFailedContent />
    </Suspense>
  );
}
