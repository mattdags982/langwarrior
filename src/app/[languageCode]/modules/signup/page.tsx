'use client';

import { useAuth } from "@/app/AuthContext";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignUp() {
  const { signUpWithEmail, user } = useAuth();
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/modules");
    }
  }, [user, router]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Sign Up</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            signUpWithEmail(signUpEmail, signUpPassword);
          }}
          className="w-full"
        >
          <input
            type="email"
            placeholder="Email"
            value={signUpEmail}
            onChange={(e) => setSignUpEmail(e.target.value)}
            className="w-full mb-4 p-2 border border-gray-300 rounded"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={signUpPassword}
            onChange={(e) => setSignUpPassword(e.target.value)}
            className="w-full mb-4 p-2 border border-gray-300 rounded"
            required
          />
          <button
            type="submit"
            className="w-full bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-600 transition duration-300"
          >
            Sign Up with Email
          </button>
        </form>
        <p className="mt-4 text-center text-gray-600">
          Already have an account?{" "}
          <Link href="/modules/login" className="text-purple-500 hover:text-purple-600">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
} 