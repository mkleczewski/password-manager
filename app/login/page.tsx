import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { emailLogin } from "./actions";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { OAuthButtons } from "./oauth-signin";
import Link from "next/link";

export default async function Login({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    return redirect("/passwords");
  }

  return (
    <section className="h-[calc(100vh-57px)] flex justify-center items-center">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Zaloguj się</CardTitle>
          <CardDescription>Wprowadź dane swojego konta</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <form id="login-form" className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Adres E-mail"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Hasło</Label>
              </div>
              <Input
                minLength={6}
                name="password"
                id="password"
                type="password"
                placeholder="Hasło"
                required
              />
            </div>
            {searchParams.message && (
              <div className="text-sm font-medium text-destructive">
                {searchParams.message}
              </div>
            )}
            <Button formAction={emailLogin} className="w-full">
              Zaloguj mnie
            </Button>
          </form>
          <OAuthButtons />
          <div className="text-center text-sm">
            Nie masz konta?{" "}
            <Link href="/register" className="underline">
              Zarejestruj się
            </Link>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
