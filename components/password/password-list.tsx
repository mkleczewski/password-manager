"use client";
import { PasswordItem } from "./password-item";
import { PasswordForm } from "./password-form";
import { Password } from "@/types/custom";
import { useOptimistic } from "react";

export type Action = "delete" | "update" | "create";

export function passwordReducer(
  state: Array<Password>,
  { action, password }: { action: Action; password: Password }
) {
  switch (action) {
    case "delete":
      return state.filter(({ id }) => id !== password.id);
    case "update":
      return state.map((p) => (p.id === password.id ? password : p));
    case "create":
      return [password, ...state];
    default:
      return state;
  }
}

export type PasswordOptimisticUpdate = (action: {
  action: Action;
  password: Password;
}) => void;

export function PasswordList({ passwords }: { passwords: Array<Password> }) {
  const [optimisticPasswords, optimisticPasswordsUpdate] = useOptimistic(
    passwords,
    passwordReducer
  );
  return (
    <>
      <PasswordForm optimisticUpdate={optimisticPasswordsUpdate} />
      <div className="w-full flex flex-col gap-4">
        {optimisticPasswords?.map((password) => {
          return (
            <PasswordItem
              optimisticUpdate={optimisticPasswordsUpdate}
              password={password}
              key={password.id}
            />
          );
        })}
      </div>
    </>
  );
}
