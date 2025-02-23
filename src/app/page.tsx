"use client";
import "../styles/styles.scss";
import "../styles/reset.scss";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.replace("/home");
    } else {
      router.replace("/login");
    }
    setLoading(false);
  }, [router]);

  if (loading) return null;

  return null;
}
