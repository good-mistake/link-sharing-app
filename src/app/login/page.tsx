"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import "../../styles/styles.scss";
import { motion } from "framer-motion";
import AnimatedButton from "../animationBtn/AnimatedBtn";

const pageVariants = {
  initial: { opacity: 0, x: -50 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, x: 50, transition: { duration: 0.3 } },
};

const Login = () => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [accountEmail, setAccountEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    if (!accountEmail || !password) {
      setError("Please fill in both email and password.");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ accountEmail, password }),
      });

      let data;
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        data = null;
      }
      if (!res.ok) {
        if (data?.error) {
          setError(data.error);
        } else {
          setError("An error occurred during login. Please try again.");
        }
        setLoading(false);
        return;
      }

      localStorage.setItem("token", data.token);
      setSuccess("Login successful! We are going Home now");
      setTimeout(() => {
        router.push("/home");
      }, 1000);
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };
  const handleSignUp = () => {
    setError("");
    router.push("/signup");
  };
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      className="w-full max-sm:m-0 flex justify-center flex-col loginContainer items-center"
    >
      <div className="logoC">
        <Image
          src="/images/logo-devlinks-large.svg"
          alt="logo"
          width="183"
          height="40"
          priority
        />
      </div>

      <form
        className="w-full max-sm:m-0 md:h-auto lg:scale-100 sm:max-w-xl 
        bg-white p-6 rounded-lg shadow-lg space-y-4"
        onSubmit={handleLogin}
      >
        <h1 className="header">Login</h1>
        <p>Add your details below to get back into the app</p>
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
            className="input sm:min-w-0 overflow-hidden text-ellipsis whitespace-nowrap placeholder-opacity-50"
            value={accountEmail}
            onChange={(e) => setAccountEmail(e.target.value)}
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
            Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            placeholder="Enter your password"
            className="input sm:min-w-0 overflow-hidden text-ellipsis whitespace-nowrap placeholder-opacity-50"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="cursor-pointer absolute top-1/2 transform -translate-y-[50%] right-2 flex items-center"
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
        <AnimatedButton
          type="submit"
          className="loginBtn w-full flex justify-center items-center gap-2"
        >
          {loading ? (
            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          ) : (
            "Login"
          )}
        </AnimatedButton>
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
        {error && (
          <motion.div
            className="w-full bg-red-100 border border-red-500 text-red-700 px-4 py-2 rounded-lg flex items-center gap-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {error}
          </motion.div>
        )}
        <p>
          Don’t have an account?
          <AnimatedButton
            type="button"
            onClick={handleSignUp}
            className="signupBtn"
          >
            Create account
          </AnimatedButton>
        </p>
      </form>
    </motion.div>
  );
};

export default Login;
