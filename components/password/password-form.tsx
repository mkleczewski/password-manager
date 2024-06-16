"use client";
import { addPassword } from "@/app/passwords/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { useRef } from "react";
import { useFormStatus } from "react-dom";
import { PasswordOptimisticUpdate } from "./password-list";
import { Password } from "@/types/custom";

function FormContent() {
  const { pending } = useFormStatus();
  return (
    <>
      <Input
        disabled={pending}
        name="password"
        type="password"
        placeholder="Hasło"
        required
      />
      <Input
        disabled={pending}
        name="website"
        type="text"
        placeholder="Strona internetowa"
        required
      />
      <Button type="submit" size="icon" className="min-w-10" disabled={pending}>
        <Send className="h-5 w-5" />
        <span className="sr-only">Dodaj hasło</span>
      </Button>
    </>
  );
}

export function PasswordForm({
  optimisticUpdate,
}: {
  optimisticUpdate: PasswordOptimisticUpdate;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  return (
    <Card>
      <CardContent className="p-3">
        <form
          ref={formRef}
          className="flex gap-4"
          action={async (data) => {
            const newPassword: Password = {
              id: -1,
              user_id: "",
              password: data.get("password") as string,
              website: data.get("website") as string,
							inserted_at: "",
							salt: ""
            };
            optimisticUpdate({ action: "create", password: newPassword });
            await addPassword(data);
            formRef.current?.reset();
          }}
        >
          <FormContent />
        </form>
      </CardContent>
    </Card>
  );
}
