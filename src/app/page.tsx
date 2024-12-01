"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";
import Link from 'next/link';

export default function HomePage() {
  const { data: session } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignIn = async () => {
    console.log(email, password)
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (!res?.ok) {
      setError("Hibás e-mail vagy jelszó.");
    }
  };

  return (
    <div className="h-screen bg-black flex justify-center items-center">
      {session ? (
        <div className="text-white text-center">
          <p>Bejelentkezve: {session.user?.email}</p>
          <button
            onClick={() => signOut()}
            className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg"
          >
            Kijelentkezés
          </button>
        </div>
      ) : (
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-96 text-white">
          <p className="text-center text-xl mb-4">Nincs bejelentkezve</p>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 mb-4 border-2 text-black border-gray-600 rounded-lg"
          />
          <input
            type="password"
            placeholder="Jelszó"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 mb-4 border-2 text-black border-gray-600 rounded-lg"
          />
          <button
            onClick={handleSignIn}
            className="w-full py-2 bg-blue-600 text-white rounded-lg"
          >
            Bejelentkezés
          </button>
          {error && <p className="text-red-500 mt-2">{error}</p>}

          <div className="mt-4 text-center">
            <span className="text-gray-400">
              Még nincs fiókod?{' '}
              <Link href="/register">
                <p className="text-blue-500 hover:underline">Regisztrálj itt</p>
              </Link>
            </span>
          </div>

        </div>
      )}
    </div>
  );

}

