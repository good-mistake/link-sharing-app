"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import "../../styles/styles.scss";
const Login = () => {
  const router = useRouter();
  return (
    <div className="w-full flex justify-center flex-col loginContainer items-center">
      <div className="">
        <Image
          src="/images/logo-devlinks-large.svg"
          alt="logo"
          width="183"
          height="40"
          priority
        />
      </div>

      <form className=" bg-white p-6 rounded-lg shadow-lg space-y-4">
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
            className="input "
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
            type="password"
            id="password"
            placeholder="Enter your password"
            className="input"
          />
        </div>
        <button
          onClick={() => router.push("/home")}
          className="loginBtn w-full"
        >
          Login
        </button>
        <p>
          Don’t have an account?
          <button
            type="button"
            onClick={() => router.push("/signup")}
            className="signupBtn"
          >
            Create account
          </button>
        </p>
      </form>
    </div>
  );
};

export default Login;
