"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";

export function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const user = await login(phone, password);
      toast.success(`Bon retour, ${user.name.split(" ")[0]} !`);
      const next = searchParams.get("next");
      router.push(next || (user.role === "admin" ? "/admin/dashboard" : "/dashboard"));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Connexion impossible.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <h1 className="font-display text-2xl text-ink-900">Bon retour parmi nous</h1>
      <p className="mt-1 text-sm text-ink-500">Connectez-vous avec votre numéro WhatsApp.</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <label className="block text-sm">
          Numéro WhatsApp
          <input
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="77 123 45 67"
            className="mt-1 w-full rounded-lg border border-nude-200 px-3 py-2.5 text-sm outline-none focus:border-ink-900"
          />
        </label>
        <label className="block text-sm">
          Mot de passe
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-lg border border-nude-200 px-3 py-2.5 text-sm outline-none focus:border-ink-900"
          />
        </label>
        <Button type="submit" variant="primary" size="lg" className="w-full" disabled={submitting}>
          {submitting ? "Connexion…" : "Se connecter"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-500">
        Pas encore de compte ?{" "}
        <Link href="/register" className="font-medium text-ink-900 underline underline-offset-4">
          Créer un compte
        </Link>
      </p>

      <div className="mt-6 rounded-xl bg-nude-50 p-3 text-xs text-ink-500">
        Démo : cliente — 78 123 45 67 / cliente123 · admin — 77 000 00 00 / admin123
      </div>
    </>
  );
}
