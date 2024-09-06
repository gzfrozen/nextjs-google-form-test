"use client";

import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Session } from "next-auth";
import { signIn, signOut } from "next-auth/react";
import { useState } from "react";

export function HomePage({ session }: { session: Session | null }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [formUrl, setFormUrl] = useState<string | null>(null);

  const handleLoginWithGoogle = () => {
    signIn();
    toast({
      title: "Logged in successfully",
      description: "You've been logged in with Google.",
    });
  };

  const handleLogout = () => {
    signOut();
    setFormUrl(null);
    toast({
      title: "Logged out successfully",
      description: "You've been logged out.",
    });
  };

  const handleGenerateGoogleForm = async () => {
    setIsGenerating(true);
    setFormUrl(null);

    // API call to generate Google Form
    const response = await fetch("/api/forms", { method: "POST" });
    const data: { result: string; url?: string } = await response.json();
    if (data.result === "failed") return;
    if (!data.url) return;

    const generatedUrl = `${data.url}`;
    setFormUrl(generatedUrl);
    setIsGenerating(false);

    toast({
      title: "Google Form Generated",
      description: "Your Google Form has been generated successfully.",
    });
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
            <Button
              onClick={handleGenerateGoogleForm}
              className="w-full"
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Google Form"
              )}
            </Button>
            {formUrl && (
              <div className="p-4 bg-gray-100 rounded-md">
                <p className="text-sm font-medium text-gray-900">
                  Generated Form URL:
                </p>
                <a
                  href={formUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline break-all"
                >
                  {formUrl}
                </a>
              </div>
            )}
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
