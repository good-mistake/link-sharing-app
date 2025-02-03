"use client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="">
      <h1 className="">Welcome to Home</h1>
      <button onClick={() => router.push("/login")} className="">
        Logout
      </button>
    </div>
  );
}
