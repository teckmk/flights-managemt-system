import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth/auth";

export default async function Home() {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  } else {
    redirect("/dashboard");
  }
}
