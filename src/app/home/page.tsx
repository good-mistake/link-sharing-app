"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getProfile } from "../../services/services";
type UserType = {
  _id: string;
  firstName: string;
  lastName: string;
  profileEmail: string;
  accountEmail: string;
  profilePicture?: string;
  links: { _id: string; url: string; platform: string }[];
};

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<UserType | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchUser = async () => {
      try {
        const data = await getProfile();
        setUser(data.profile);
      } catch (error) {
        console.error(error);
        localStorage.removeItem("token");
        router.push("/login");
      }
    };

    fetchUser();
  }, [router]);

  return (
    <div className="p-4">
      {user ? (
        <>
          <h1 className="text-xl font-bold">Welcome, {user?.firstName}!</h1>
          <p className="text-gray-600">Your email: {user?.accountEmail}</p>
        </>
      ) : (
        <p>Loading...</p>
      )}{" "}
      <button
        onClick={() => {
          localStorage.removeItem("token");
          router.push("/login");
        }}
        className="mt-4 p-2 bg-red-500 text-white rounded"
      >
        Logout
      </button>
    </div>
  );
}
