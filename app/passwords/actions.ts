"use server";

import { Password } from "@/types/custom";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import crypto from "crypto";
import argon2 from "argon2";
import AES from "crypto-js/aes";

export async function addPassword(formData: FormData) {
  const supabase = createClient();
  const password = formData.get("password") as string;
  const website = formData.get("website") as string;

  if (!password || !website) {
    throw new Error("Enter your password and website address.");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("Not logged in.");
  }

  const { data: userSecretData, error: secretError } = await supabase
    .from("user_secrets")
    .select("secret")
    .eq("user_id", user.id)
    .single();

  if (secretError) {
    throw new Error(
      "Error while fetching user secret for decryption: " + secretError.message
    );
  }

  const salt = crypto.randomBytes(16);

  const key = await argon2.hash(userSecretData.secret, { salt });

  const encryptedPassword = AES.encrypt(password, key).toString();

  const { error: insertError } = await supabase.from("passwords").insert({
    user_id: user.id,
    password: encryptedPassword,
    website,
    salt: salt.toString("hex"),
  });

  if (insertError) {
    throw new Error("Error adding password: " + insertError.message);
  }

  revalidatePath("/passwords");
}

export async function deletePassword(id: number) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User is not logged in");
  }

  const { error } = await supabase.from("passwords").delete().match({
    user_id: user.id,
    id: id,
  });

  if (error) {
    throw new Error("Error deleting task");
  }

  revalidatePath("/passwords");
}

export async function updatePassword(password: Password) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User is not logged in");
  }

  const { error } = await supabase.from("passwords").update(password).match({
    user_id: user.id,
    id: password.id,
  });

  if (error) {
    throw new Error("Error updating task");
  }

  revalidatePath("/passwords");
}
