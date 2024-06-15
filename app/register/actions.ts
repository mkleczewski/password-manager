"use server";

import crypto from "crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

export async function signup(formData: FormData) {
  const supabase = createClient();

  const registrationData = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const userSecret = crypto.randomBytes(32).toString("hex");

  const { data, error } = await supabase.auth.signUp(registrationData);

  if (error) {
    redirect("/register?message=Problem przy rejestracji");
  }

  const userId = data.user?.id;

  if (!userId) {
    redirect("/register?message=Problem podczas tworzenia sekretu");
  }

  const { error: secretError } = await supabase.from("user_secrets").insert({
    user_id: userId,
    secret: userSecret,
  });

  if (secretError) {
    redirect("/register?message=Problem podczas dodawania sekretu");
  }

  revalidatePath("/", "layout");
  redirect("/login?message=Zarejestrowano konto. ");
}
