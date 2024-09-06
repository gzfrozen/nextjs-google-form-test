// import Image from "next/image";
import { HomePage } from "@/components/home-page";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";

export default async function Home() {
  const session = await getServerSession(authOptions);
  return <HomePage session={session} />;
}
