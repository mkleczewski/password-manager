"use client";
import { deletePassword, updatePassword } from "@/app/passwords/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Password } from "@/types/custom";
import { Trash2 } from "lucide-react";
import { useFormStatus } from "react-dom";
import { PasswordOptimisticUpdate } from "./password-list";

export function PasswordItem({
  password,
  optimisticUpdate,
}: {
  password: Password;
  optimisticUpdate: PasswordOptimisticUpdate;
}) {
  return (
    <form>
      <PasswordCard optimisticUpdate={optimisticUpdate} password={password} />
    </form>
  );
}

export function PasswordCard({
  password,
  optimisticUpdate,
}: {
  password: Password;
  optimisticUpdate: PasswordOptimisticUpdate;
}) {
  const { pending } = useFormStatus();

  return (
    <Card className={cn("w-full", pending && "opacity-50")}>
      <CardContent className="flex items-start gap-3 p-3">
        <p className={cn("flex-1 pt-2 min-w-0 break-words")}>
          {password.password}
        </p>
        <Button
          disabled={pending}
          formAction={async (data) => {
            optimisticUpdate({ action: "delete", password });
            await deletePassword(password.id);
          }}
          variant="ghost"
          size="icon"
        >
          <Trash2 className="h-5 w-5" />
          <span className="sr-only">Usuń hasło</span>
        </Button>
      </CardContent>
    </Card>
  );
}
