"use server";

import crypto from "crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import * as z from "zod";

import { createClient } from "@/utils/supabase/server";

const RegistrationSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function signup(formData: FormData) {
  const supabase = createClient();

  const parsedData = RegistrationSchema.safeParse({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  });

  if (!parsedData.success) {
    const formattedErrors = parsedData.error.format();
    return redirect(
      `/register?message=${encodeURIComponent(JSON.stringify(formattedErrors))}`
    );
  }

  const registrationData = parsedData.data;

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
  redirect("/login?message=Zarejestrowano konto, zweryfikuj email. ");
}
