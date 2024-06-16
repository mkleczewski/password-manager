import { PasswordList } from "@/components/password/password-list";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { getDecryptedPasswords } from "./getDecryptedPasswords";

export default async function PasswordsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const passwords = await getDecryptedPasswords();

  return (
    <section className="p-3 pt-6 max-w-2xl w-full flex flex-col gap-4">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Twoje hasła
      </h1>
      <Separator className="w-full " />
      <PasswordList passwords={passwords ?? []} />
    </section>
  );
}
