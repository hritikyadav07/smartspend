'use client';

import { useEffect, useState } from 'react';
import { useAuth, SignOutButton } from '@clerk/nextjs';

export default function Page() {
  const [message, setMessage] = useState('Loading...');
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        // Use Clerk JWT template for backend
        const token = await getToken({ template: "backend" });
        if (!token) {
          setMessage('No token found. Please login.');
          return;
        }
        const res = await fetch('http://localhost:8000/dashboard', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          setMessage(data.message);
        } else {
          setMessage(`Error: ${data.detail || 'Unknown error'}`);
        }
      } catch (err) {
        setMessage('Network or server error.');
      }
    };
    fetchDashboard();
  }, [getToken]);

  return (
    <>
      <p>Welcome,</p>
      <SignOutButton>
        <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors">Logout</button>
      </SignOutButton>
      <div className="p-4 text-xl font-semibold">
        {message}
      </div>
    </>
  );
}
