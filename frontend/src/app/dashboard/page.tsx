"use client";
import { useUser, SignOutButton } from "@clerk/nextjs";

export default function Header() {
  const { user } = useUser();

  return (
    <div className="">
      {user && (
        <div className="flex items-center gap-4">
          <p>Welcome, {user.firstName}</p>
          <SignOutButton>
            <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors">Logout</button>
          </SignOutButton>
        </div>
      )}
    </div>
  );
}
