"use client";
import { deletePassword, updatePassword } from "@/app/passwords/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Password } from "@/types/custom";
import { Trash2, FilePenLine } from "lucide-react";
import { useFormStatus } from "react-dom";
import { PasswordOptimisticUpdate } from "./password-list";
import { calculatePasswordStrength } from "@/utils/calculatePasswordStrength";
import { Toggle } from "@/components/ui/toggle";
import { useState } from "react";
import { isTimestampOlderThan30Days } from "@/utils/isTimestampOlderThan30Days";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  const strength = calculatePasswordStrength(password.password);

  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const isOld = isTimestampOlderThan30Days(password.inserted_at);

  return (
    <Card
      className={cn(
        "w-full",
        pending && "opacity-50",
        strength === "weak" && "shadow-[0_2px_0_0_#f87171]",
        strength === "medium" && "shadow-[0_2px_0_0_#facc15]",
        strength === "strong" && "shadow-[0_2px_0_0_#4ade80]",
        isOld && "shadow-[0_2px_0_0_#f87171] text-gray-500 bg-opacity-50"
      )}
    >
      <CardContent className="flex items-start gap-3 p-3">
        <p className={cn("flex-1 pt-2 min-w-0 break-words")}>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                {showPassword
                  ? password.password
                  : "*".repeat(password.password.length)}
              </TooltipTrigger>
              <TooltipContent>
                {isOld ? "Password is too old! " : ""}
                {strength === "weak" ? "Weak passowrd! " : ""}
                {strength === "medium" ? "Average password. " : ""}
                {strength === "strong" ? "Strong password. " : ""}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </p>
        <p className={cn("flex-1 pt-2 min-w-0 break-words text-right")}>
          {password.website}
        </p>
        <Toggle
          onClick={togglePasswordVisibility}
          aria-label="Show/Hide Password"
        >
          👀
        </Toggle>
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
          <span className="sr-only">Delete password</span>
        </Button>
      </CardContent>
    </Card>
  );
}
