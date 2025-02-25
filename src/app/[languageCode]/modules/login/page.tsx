'use client';

import { useAuth } from "@/app/AuthContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const { signInWithGoogle, signInWithEmail, user } = useAuth();
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/modules");
    }
  }, [user, router]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            signInWithEmail(loginEmail, loginPassword);
          }}
          className="w-full"
        >
          <input
            type="email"
            placeholder="Email"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
            className="w-full mb-4 p-2 border border-gray-300 rounded"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            className="w-full mb-4 p-2 border border-gray-300 rounded"
            required
          />
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 px-4 rounded-lg mb-4 hover:bg-green-600 transition duration-300"
          >
            Login with Email
          </button>
        </form>
        <div className="text-center text-gray-500 mb-4">Or</div>
        <button
          onClick={signInWithGoogle}
          className="w-full flex items-center justify-center bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
        >
          Login with Google
        </button>
        <p className="mt-4 text-center text-gray-600">
          Don&apos;t have an account?{" "}
          <Link href="/modules/signup" className="text-green-500 hover:text-green-600">
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
}