"use client";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const session = useSession();
  return (
    <nav className="bg-gray-800 text-white px-4 py-3 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="text-xl font-bold">TaskFlow</div>

        <div className="flex items-center gap-4">
          {session.data?.user && (
            <>
              <span className="text-sm">
                Welcome, {session.data?.user.name || session.data.user.email}
              </span>
              <button
                className="bg-gray-700 hover:bg-gray-600 focus:ring-2 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 py-2"
                onClick={() => signOut()}
              >
                Logout
              </button>
            </>
          )}

          {!session.data?.user && (
            <button
              className="bg-gray-700 hover:bg-gray-600 focus:ring-2 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 py-2"
              onClick={() => signIn()}
            >
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
