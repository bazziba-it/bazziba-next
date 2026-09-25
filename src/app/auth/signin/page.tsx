"use client";

import { useState, useEffect, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button, Input } from "@/components/ui";
import { Google, GitHub } from "lucide-react";
import { signIn, getProviders } from "next-auth/react";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type SignInFormData = z.infer<typeof signInSchema>;

function SignInContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [providers, setProviders] = useState<Record<string, any> | null>(null);
  const [callbackUrl, setCallbackUrl] = useState("/");

  useEffect(() => {
    // Get callbackUrl from window.location on client side
    const params = new URLSearchParams(window.location.search);
    setCallbackUrl(params.get("callbackUrl") || "/");
    getProviders().then(setProviders);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignInFormData) => {
    setIsLoading(true);
    try {
      await signIn("email", {
        email: data.email,
        redirect: false,
        callbackUrl,
      });
      setEmailSent(true);
    } catch (error) {
      console.error("Sign in error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6 text-center">
          <h1 className="text-2xl font-bold">Controlla la tua email</h1>
          <p className="text-muted-foreground">
            Ti abbiamo inviato un link magico alla tua email. Clicca sul link per accedere.
          </p>
          <Button onClick={() => setEmailSent(false)} variant="outline">
            Usa una mail diversa
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Welcome to BAZZIBA!</h1>
          <p className="text-muted-foreground">Accedi al tuo account</p>
        </div>

        <div className="space-y-3">
          {providers?.google && (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => signIn("google", { callbackUrl })}
            >
              <Google className="mr-2 h-4 w-4" />
              Continua con Google
            </Button>
          )}

          {providers?.github && (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => signIn("github", { callbackUrl })}
            >
              <GitHub className="mr-2 h-4 w-4" />
              Continua con GitHub
            </Button>
          )}

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-background text-muted-foreground">O usa l'email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                error={errors.email?.message}
                {...register("email")}
                required
              />
            </div>

            <Button type="submit" className="w-full" loading={isLoading}>
              Invia Link Magico
            </Button>
          </form>
        </div>

        <div className="text-center text-sm">
          <p>
            Non hai un account?{" "}
            <a href="/auth/signup" className="text-brand-yellow font-medium">
              Registrati
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return <SignInContent />;
}
