"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import "../../styles/styles.scss";
import { useState } from "react";
import { motion } from "framer-motion";

export default function Signup() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value.trim(),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { email, password, confirmPassword } = formData;

    if (!email.includes("@")) {
      setError("Please enter a valid email.");
      setLoading(false);
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }
    try {
      console.log("Sending request with data:", formData);

      const res = await fetch(`/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accountEmail: formData.email,
          password: formData.password,
        }),
      });
      console.log("Response status:", res.status);

      const data = await res.json();
      console.log("Response data:", data);
      if (!res.ok) throw new Error(data.message || "Signup failed");
      setSuccess(
        "Signup successful! Please check your email for verification."
      );
      setError("");
      setTimeout(() => {
        router.push("/login");
      }, 1000);
    } catch (err: unknown) {
      console.error("Signup error:", err);

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full flex justify-center flex-col loginContainer items-center"
    >
      <div className="">
        <Image
          src="/images/logo-devlinks-large.svg"
          alt="logo"
          width="183"
          height="40"
          priority
        />
      </div>
      <motion.form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-lg space-y-4 "
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="header">Create account</h1>
        <p>Let’s get you started sharing your links!</p>
        <div className="relative w-full">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email address
          </label>
          <span className="absolute top-1/2 transform -translate-y-[60%] left-4 flex items-center">
            <Image
              src="/images/icon-email.svg"
              alt=""
              width="16"
              height="16"
              className="imageIcon"
            />
          </span>
          <input
            type="email"
            id="email"
            placeholder="e.g. alex@email.com"
            className="input "
            onChange={handleChange}
            autoFocus
          />
        </div>
        <div className="relative w-full">
          <span className="absolute top-1/2 transform -translate-y-[60%] left-4 flex items-center">
            <Image
              src="/images/icon-password.svg"
              alt=""
              width="16"
              height="16"
              className="imageIcon"
            />
          </span>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Create password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            placeholder="At least 8 characters"
            className="input"
            onChange={handleChange}
            autoFocus
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-1/2 transform -translate-y-[60%] right-2 flex items-center"
          >
            {showPassword ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                fill="currentColor"
              >
                <path d="M12 4C6 4 2 12 2 12s4 8 10 8 10-8 10-8-4-8-10-8zm0 14c-3.3 0-6-2.7-6-6 0-1.1.3-2.2.9-3.2L5 8.1C4.3 9.4 4 10.7 4 12c0 3.3 2.7 6 6 6 1.3 0 2.6-.4 3.6-1.2l-1.5-1.5c-.5.2-1 .3-1.5.3-2.2 0-4-1.8-4-4 0-.5.1-1 .3-1.5l-1.5-1.5C4.4 9.4 4 10.7 4 12c0 3.3 2.7 6 6 6 1.3 0 2.6-.4 3.6-1.2l-1.5-1.5c-.5.2-1 .3-1.5.3-2.2 0-4-1.8-4-4 0-.5.1-1 .3-1.5l-1.5-1.5C4.4 9.4 4 10.7 4 12c0 3.3 2.7 6 6 6 1.3 0 2.6-.4 3.6-1.2l-1.5-1.5c-.5.2-1 .3-1.5.3-2.2 0-4-1.8-4-4 0-.5.1-1 .3-1.5l-1.5-1.5C4.4 9.4 4 10.7 4 12c0 3.3 2.7 6 6 6 1.3 0 2.6-.4 3.6-1.2l-1.5-1.5c-.5.2-1 .3-1.5.3-2.2 0-4-1.8-4-4 0-.5.1-1 .3-1.5l-1.5-1.5C4.4 9.4 4 10.7 4 12c0 3.3 2.7 6 6 6 1.3 0 2.6-.4 3.6-1.2l-1.5-1.5c-.5.2-1 .3-1.5.3-2.2 0-4-1.8-4-4 0-.5.1-1 .3-1.5l-1.5-1.5C4.4 9.4 4 10.7 4 12c0 3.3 2.7 6 6 6 1.3 0 2.6-.4 3.6-1.2l-1.5-1.5c-.5.2-1 .3-1.5.3-2.2 0-4-1.8-4-4 0-.5.1-1 .3-1.5l-1.5-1.5C4.4 9.4 4 10.7 4 12c0 3.3 2.7 6 6 6 1.3 0 2.6-.4 3.6-1.2l-1.5-1.5c-.5.2-1 .3-1.5.3-2.2 0-4-1.8-4-4 0-.5.1-1 .3-1.5l-1.5-1.5C4.4 9.4 4 10.7 4 12c0 3.3 2.7 6 6 6 1.3 0 2.6-.4 3.6-1.2l-1.5-1.5c-.5.2-1 .3-1.5.3-2.2 0-4-1.8-4-4 0-.5.1-1 .3-1.5l-1.5-1.5C4.4 9.4 4 10.7 4 12c0 3.3 2.7 6 6 6 1.3 0 2.6-.4 3.6-1.2l-1.5-1.5c-.5.2-1 .3-1.5.3-2.2 0-4-1.8-4-4 0-.5.1-1 .3-1.5l-1.5-1.5C4.4 9.4 4 10.7 4 12c0 3.3 2.7 6 6 6 1.3 0 2.6-.4 3.6-1.2l-1.5-1.5c-.5.2-1 .3-1.5.3-2.2 0-4-1.8-4-4 0-.5.1-1 .3-1.5l-1.5-1.5C4.4 9.4 4 10.7 4 12c0 3.3 2.7 6 6 6z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                fill="currentColor"
              >
                <path d="M12 4C6 4 2 12 2 12s4 8 10 8 10-8 10-8-4-8-10-8zm0 14c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6zm0-10a4 4 0 100 8 4 4 0 000-8z" />
              </svg>
            )}{" "}
          </span>
        </div>
        <div className="relative w-full">
          <span className="absolute top-1/2 transform -translate-y-[60%] left-4 flex items-center">
            <Image
              src="/images/icon-password.svg"
              alt=""
              width="16"
              height="16"
              className="imageIcon"
            />
          </span>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700"
          >
            Confirm password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            id="confirmPassword"
            placeholder="At least 8 characters"
            className="input"
            onChange={handleChange}
            autoFocus
          />{" "}
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-1/2 transform -translate-y-[60%] right-2 flex items-center"
          >
            {showPassword ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                fill="currentColor"
              >
                <path d="M12 4C6 4 2 12 2 12s4 8 10 8 10-8 10-8-4-8-10-8zm0 14c-3.3 0-6-2.7-6-6 0-1.1.3-2.2.9-3.2L5 8.1C4.3 9.4 4 10.7 4 12c0 3.3 2.7 6 6 6 1.3 0 2.6-.4 3.6-1.2l-1.5-1.5c-.5.2-1 .3-1.5.3-2.2 0-4-1.8-4-4 0-.5.1-1 .3-1.5l-1.5-1.5C4.4 9.4 4 10.7 4 12c0 3.3 2.7 6 6 6 1.3 0 2.6-.4 3.6-1.2l-1.5-1.5c-.5.2-1 .3-1.5.3-2.2 0-4-1.8-4-4 0-.5.1-1 .3-1.5l-1.5-1.5C4.4 9.4 4 10.7 4 12c0 3.3 2.7 6 6 6 1.3 0 2.6-.4 3.6-1.2l-1.5-1.5c-.5.2-1 .3-1.5.3-2.2 0-4-1.8-4-4 0-.5.1-1 .3-1.5l-1.5-1.5C4.4 9.4 4 10.7 4 12c0 3.3 2.7 6 6 6 1.3 0 2.6-.4 3.6-1.2l-1.5-1.5c-.5.2-1 .3-1.5.3-2.2 0-4-1.8-4-4 0-.5.1-1 .3-1.5l-1.5-1.5C4.4 9.4 4 10.7 4 12c0 3.3 2.7 6 6 6 1.3 0 2.6-.4 3.6-1.2l-1.5-1.5c-.5.2-1 .3-1.5.3-2.2 0-4-1.8-4-4 0-.5.1-1 .3-1.5l-1.5-1.5C4.4 9.4 4 10.7 4 12c0 3.3 2.7 6 6 6 1.3 0 2.6-.4 3.6-1.2l-1.5-1.5c-.5.2-1 .3-1.5.3-2.2 0-4-1.8-4-4 0-.5.1-1 .3-1.5l-1.5-1.5C4.4 9.4 4 10.7 4 12c0 3.3 2.7 6 6 6 1.3 0 2.6-.4 3.6-1.2l-1.5-1.5c-.5.2-1 .3-1.5.3-2.2 0-4-1.8-4-4 0-.5.1-1 .3-1.5l-1.5-1.5C4.4 9.4 4 10.7 4 12c0 3.3 2.7 6 6 6 1.3 0 2.6-.4 3.6-1.2l-1.5-1.5c-.5.2-1 .3-1.5.3-2.2 0-4-1.8-4-4 0-.5.1-1 .3-1.5l-1.5-1.5C4.4 9.4 4 10.7 4 12c0 3.3 2.7 6 6 6 1.3 0 2.6-.4 3.6-1.2l-1.5-1.5c-.5.2-1 .3-1.5.3-2.2 0-4-1.8-4-4 0-.5.1-1 .3-1.5l-1.5-1.5C4.4 9.4 4 10.7 4 12c0 3.3 2.7 6 6 6 1.3 0 2.6-.4 3.6-1.2l-1.5-1.5c-.5.2-1 .3-1.5.3-2.2 0-4-1.8-4-4 0-.5.1-1 .3-1.5l-1.5-1.5C4.4 9.4 4 10.7 4 12c0 3.3 2.7 6 6 6z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                fill="currentColor"
              >
                <path d="M12 4C6 4 2 12 2 12s4 8 10 8 10-8 10-8-4-8-10-8zm0 14c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6zm0-10a4 4 0 100 8 4 4 0 000-8z" />
              </svg>
            )}
          </span>
        </div>
        <motion.button
          type="submit"
          disabled={loading}
          className="loginBtn w-full flex justify-center items-center gap-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95, rotate: [0, -5, 5, 0] }}
        >
          {loading ? (
            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          ) : (
            "Create new account"
          )}
        </motion.button>
        {success && (
          <motion.div
            className="w-full bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded-lg flex items-center gap-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {success}
          </motion.div>
        )}
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <p>
          Already have an account?
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="signupBtn"
          >
            Login
          </button>
        </p>
      </motion.form>
    </motion.div>
  );
}
