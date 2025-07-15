"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function InvitePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  console.log("InvitePage searchParams:", searchParams);

  // const [status, setStatus] = useState("Checking invitation...");

  // useEffect(() => {
  //   if (!token) {
  //     setStatus("No invitation token provided.");
  //     return;
  //   }
  //   const acceptInvitation = async () => {
  //     try {
  //
  //   }catch (error) {
  //   console.error("Error accepting invitation:", error);
  //   setStatus("Failed to accept invitation.");
  //   }
  // })

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {token}
    </div>
  );
}
