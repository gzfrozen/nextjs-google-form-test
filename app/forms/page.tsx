import { CreateFormButton } from "./CreateFormButton";
import { authOptions } from "@/app/libs/authOptions";
import { getServerSession } from "next-auth";

export default async function Page() {
  const session = await getServerSession(authOptions);
  return <CreateFormButton isLogin={session ? true : false} />;
}
