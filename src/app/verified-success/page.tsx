"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function VerifiedSuccess() {
  const router = useRouter();
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => router.push("/login"), 500);
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: fadeOut ? 0 : 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-lg rounded-lg p-6 text-center max-w-md"
      >
        <h1 className="text-2xl font-bold text-green-600">
          Email Verified Successfully!
        </h1>
        <p className="text-gray-600 mt-2">Redirecting to login...</p>
      </motion.div>
    </div>
  );
}
