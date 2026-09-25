"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button, Input } from "@/components/ui";
import { Github } from "lucide-react";
import { signIn, getProviders } from "next-auth/react";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const signUpSchema = z.object({
  username: z.string().min(3, "Deve avere almeno 3 caratteri").max(20, "Massimo 20 caratteri"),
  email: z.string().email("Email non valida"),
  name: z.string().min(1, "Nome obbligatorio"),
  password: z.string().min(8, "La password deve avere almeno 8 caratteri"),
});

type SignUpFormData = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [providers, setProviders] = useState<Record<string, any> | null>(null);

  useEffect(() => {
    // Check for registered query param on client side
    const params = new URLSearchParams(window.location.search);
    if (params.get("registered")) {
      setRegistered(true);
    }
    getProviders().then(setProviders);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Registrazione fallita");
      }

      window.location.href = "/auth/signin?registered=true";
    } catch (error: any) {
      console.error("Registration error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (registered) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Registrazione completata!</h2>
          <p className="text-muted-foreground mb-4">
            Ti abbiamo inviato un link di verifica via email. Controlla la tua casella.
          </p>
          <Button asChild>
            <a href="/auth/signin">Accedi ora</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Crea il tuo account</h1>
          <p className="text-muted-foreground">
            Unisciti alla community Artistica di BAZZIBA!
          </p>
        </div>

        <div className="space-y-3">
          {providers?.google && (
            <Button variant="outline" className="w-full" onClick={() => signIn("google")}>
              <span className="mr-2 h-4 w-4">🔷</span>
              Continua con Google
            </Button>
          )}

          {providers?.github && (
            <Button variant="outline" className="w-full" onClick={() => signIn("github")}>
              <Github className="mr-2 h-4 w-4" />
              Continua con GitHub
            </Button>
          )}

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-background text-muted-foreground">O con email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Nome completo</label>
              <Input
                placeholder="Mario Rossi"
                error={errors.name?.message}
                {...register("name")}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Username</label>
              <Input
                placeholder="mario_rossi"
                error={errors.username?.message}
                {...register("username")}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input
                type="email"
                placeholder="you@example.com"
                error={errors.email?.message}
                {...register("email")}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                error={errors.password?.message}
                {...register("password")}
                required
              />
            </div>

            <Button type="submit" className="w-full" loading={isSubmitting}>
              Crea account
            </Button>
          </form>
        </div>

        <div className="text-center text-sm">
          <p>
            Hai già un account?{" "}
            <a href="/auth/signin" className="text-brand-yellow font-medium">
              Accedi
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
