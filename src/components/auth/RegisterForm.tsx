"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";

export function RegisterForm() {
  const { registerCliente } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [district, setDistrict] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }
    setSubmitting(true);
    try {
      await registerCliente({ name, phone, password, address, district });
      toast.success("Bienvenue chez KN Beauty Studio !");
      router.push("/dashboard");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Inscription impossible.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <h1 className="font-display text-2xl text-ink-900">Créer mon compte</h1>
      <p className="mt-1 text-sm text-ink-500">Quelques informations pour réserver et commander en ligne.</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <label className="block text-sm">
          Nom complet
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-lg border border-nude-200 px-3 py-2.5 text-sm outline-none focus:border-ink-900"
          />
        </label>
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
        <div className="grid grid-cols-2 gap-3">
          <label className="block text-sm">
            Adresse
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="mt-1 w-full rounded-lg border border-nude-200 px-3 py-2.5 text-sm outline-none focus:border-ink-900"
            />
          </label>
          <label className="block text-sm">
            Quartier
            <input
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="mt-1 w-full rounded-lg border border-nude-200 px-3 py-2.5 text-sm outline-none focus:border-ink-900"
            />
          </label>
        </div>
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
          {submitting ? "Création…" : "Créer mon compte"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-500">
        Déjà cliente ?{" "}
        <Link href="/login" className="font-medium text-ink-900 underline underline-offset-4">
          Se connecter
        </Link>
      </p>
    </>
  );
}
