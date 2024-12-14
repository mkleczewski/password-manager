"use server";

import crypto from "crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import * as z from "zod";

import { createClient } from "@/utils/supabase/server";

const RegistrationSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 8 characters"),
});

export async function signup(formData: FormData) {
  const supabase = createClient();

  const parsedData = RegistrationSchema.safeParse({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  });

  if (!parsedData.success) {
    const errors = parsedData.error.issues.map((issue) => issue.message);
    const errorMessage = errors.join("; ");
    return redirect(
      `/register?message=${encodeURIComponent(JSON.stringify(errorMessage))}`
    );
  }

  const registrationData = parsedData.data;

  const userSecret = crypto.randomBytes(32).toString("hex");

  const { data, error } = await supabase.auth.signUp(registrationData);

  if (error) {
    redirect("/register?message=Error singing up");
  }

  const userId = data.user?.id;

  if (!userId) {
    redirect(
      "/register?message=Error while creating user secret for password encryption"
    );
  }

  const { error: secretError } = await supabase.from("user_secrets").insert({
    user_id: userId,
    secret: userSecret,
  });

  if (secretError) {
    redirect(
      "/register?message=Error when adding user secret for password encryption"
    );
  }

  revalidatePath("/", "layout");
  redirect("/login?message=Account registered, please verify your email");
}
