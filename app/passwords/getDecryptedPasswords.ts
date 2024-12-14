"use server";

import { createClient } from "@/utils/supabase/server";
import argon2 from "argon2";
import { AES, enc } from "crypto-js";

export async function getDecryptedPasswords() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Not logged in.");
  }

  const { data: passwordsWithSalts, error: fetchError } = await supabase
    .from("passwords")
    .select("password, website, salt, inserted_at, id")
    .eq("user_id", user.id);
  if (fetchError) throw fetchError;

  const { data: userSecretData, error: secretError } = await supabase
    .from("user_secrets")
    .select("secret")
    .eq("user_id", user.id)
    .single();
  if (secretError) throw secretError;

  const decryptedPasswords = await Promise.all(
    passwordsWithSalts.map(async (pass) => {
      const key = await argon2.hash(userSecretData.secret, {
        salt: Buffer.from(pass.salt, "hex"),
      });
      const decryptedBytes = AES.decrypt(pass.password, key);
      return {
        id: pass.id,
        inserted_at: pass.inserted_at,
        website: pass.website,
        password: decryptedBytes.toString(enc.Utf8),
        user_id: "",
        salt: pass.salt,
      };
    })
  );

  decryptedPasswords.sort((a, b) => {
    const dateA = new Date(a.inserted_at);
    const dateB = new Date(b.inserted_at);
    return dateB.getTime() - dateA.getTime();
  });

  return decryptedPasswords;
}
