"use client";

import { Button } from "@/components/ui/button";
import { Session } from "next-auth";
import { signIn, signOut } from "next-auth/react";

export function HomePage({ session }: { session: Session | null }) {
  const handleLoginWithGoogle = async () => {
    signIn();
  };

  const handleLogout = async () => {
    signOut();
  };

  const handleGenerateGoogleForm = async () => {
    const response = await fetch("/api/forms", { method: "POST" });
    const data: { result: string; url?: string } = await response.json();
    if (data.result === "failed") return;
    if (!data.url) return;
    window.open(data.url, "_blank");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-6 text-center text-2xl font-bold text-black">
          Welcome to Form Generator
        </h1>

        {!session ? (
          <Button onClick={handleLoginWithGoogle} className="w-full">
            Login with Google
          </Button>
        ) : (
          <div className="space-y-4">
            <Button onClick={handleGenerateGoogleForm} className="w-full">
              Generate Google Form
            </Button>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full text-black"
            >
              Logout
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
