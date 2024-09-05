"use client";

import Link from "next/link";
import { useState } from "react";

export const CreateFormButton = ({ isLogin }: { isLogin: boolean }) => {
  const [url, setUrl] = useState("");

  const createForm = async () => {
    const response = await fetch("/api/forms", { method: "POST" });
    const data: { result: string; url?: string } = await response.json();
    if (data.result === "failed") return;
    if (!data.url) return;
    setUrl(data.url);
    window.open(data.url, "_blank");
  };

  if (!isLogin)
    return (
      <>
        <p>Please Login to Create a Form</p>
        <Link href={"/api/auth/signin"} className="p-8">
          Login with Google
        </Link>
      </>
    );
  return (
    <>
      <button onClick={createForm}>Create Form</button>
      <br />
      {url && <a href={url}>Open the Form</a>}
    </>
  );
};
