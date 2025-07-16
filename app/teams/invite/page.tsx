"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function InvitePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  console.log("InvitePage searchParams:", searchParams);

  const [status, setStatus] = useState("Checking invitation...");

  useEffect(() => {
    if (!token) {
      setStatus("No invitation token provided.");
      return;
    }
    const acceptInvitation = async () => {
      try {
        const res = await fetch(`/api/teams/invite/accept?token=${token}`);
        const data = await res.json();
        if (res.ok) {
          setStatus("Invitation accepted successfully!");
          //TODO: when in production, redirect to teams page
          // setTimeout(() => router.push("/teams"), 2000);
        } else {
          setStatus(data.error || "Failed to accept invitation.");
        }
      } catch (error) {
        console.error("Error accepting invitation:", error);
        setStatus("Failed to accept invitation.");
      }
    };
    acceptInvitation();
  }, [token]);

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-md rounded-lg p-6 text-center">
        <h1 className="text-xl font-semibold mb-4">Team Invitation</h1>
        <p>{status}</p>
      </div>
    </div>
  );
}
