"use client";

import { useState, type FormEvent } from "react";
import toast from "react-hot-toast";
import { Container, SectionHeading } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import type { AppUser } from "@/types/user";

export default function ProfilePage() {
  const { profile } = useAuth();

  return (
    <Container className="py-10">
      <SectionHeading eyebrow="Espace cliente" title="Mon profil" />
      {profile && <ProfileForm key={profile.id} profile={profile} />}
    </Container>
  );
}

function ProfileForm({ profile }: { profile: AppUser }) {
  const { updateProfile } = useAuth();
  const [name, setName] = useState(profile.name);
  const [phone, setPhone] = useState(profile.phone);
  const [address, setAddress] = useState(profile.address ?? "");
  const [district, setDistrict] = useState(profile.district ?? "");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await updateProfile({ name, phone, address, district });
      toast.success("Profil mis à jour.");
    } catch {
      toast.error("Une erreur est survenue.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 max-w-lg space-y-4 rounded-2xl border border-nude-200 bg-white p-6">
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
          className="mt-1 w-full rounded-lg border border-nude-200 px-3 py-2.5 text-sm outline-none focus:border-ink-900"
        />
      </label>
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
      <Button type="submit" variant="primary" size="lg" disabled={submitting}>
        {submitting ? "Enregistrement…" : "Enregistrer les modifications"}
      </Button>
    </form>
  );
}
