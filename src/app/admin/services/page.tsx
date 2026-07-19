"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { CategoryArt } from "@/components/ui/CategoryArt";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { listServices, createService, updateService, deleteService } from "@/lib/data/services";
import { formatFCFA, formatDuration } from "@/lib/format";
import { SERVICE_CATEGORY_LABELS, type Service, type ServiceCategory } from "@/types/service";

const EMPTY_FORM = {
  name: "",
  description: "",
  price: 0,
  duration: 60,
  category: "maquillage" as ServiceCategory,
  imageUrl: "",
  active: true,
};

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[] | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  function refresh() {
    listServices().then(setServices);
  }

  useEffect(refresh, []);

  function openCreate() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  }

  function openEdit(service: Service) {
    setEditing(service);
    setForm({
      name: service.name,
      description: service.description,
      price: service.price,
      duration: service.duration,
      category: service.category,
      imageUrl: service.imageUrl,
      active: service.active,
    });
    setModalOpen(true);
  }

  async function handleSave() {
    setSaving(true);
    try {
      if (editing) {
        await updateService(editing.id, form);
        toast.success("Service mis à jour.");
      } else {
        await createService(form);
        toast.success("Service ajouté.");
      }
      setModalOpen(false);
      refresh();
    } catch {
      toast.error("Une erreur est survenue.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer ce service ?")) return;
    await deleteService(id);
    toast.success("Service supprimé.");
    refresh();
  }

  async function toggleActive(service: Service) {
    await updateService(service.id, { active: !service.active });
    refresh();
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-ink-900">Services</h1>
          <p className="text-ink-500">Gérez les prestations proposées par KN Beauty Studio.</p>
        </div>
        <Button onClick={openCreate} variant="primary" size="md">
          <Plus className="h-4 w-4" /> Ajouter un service
        </Button>
      </div>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-nude-200 bg-white">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="border-b border-nude-200 text-left text-xs uppercase tracking-wide text-ink-500">
            <tr>
              <th className="px-4 py-3">Service</th>
              <th className="px-4 py-3">Catégorie</th>
              <th className="px-4 py-3">Durée</th>
              <th className="px-4 py-3">Prix</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {services === null ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-ink-500">Chargement…</td></tr>
            ) : services.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-ink-500">Aucun service.</td></tr>
            ) : (
              services.map((s) => (
                <tr key={s.id} className="border-b border-nude-100 last:border-0">
                  <td className="flex items-center gap-3 px-4 py-3">
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg">
                      {s.imageUrl ? <Image src={s.imageUrl} alt="" fill className="object-cover" /> : <CategoryArt category={s.category} />}
                    </div>
                    <span className="font-medium text-ink-900">{s.name}</span>
                  </td>
                  <td className="px-4 py-3 text-ink-700">{SERVICE_CATEGORY_LABELS[s.category]}</td>
                  <td className="px-4 py-3 text-ink-700">{formatDuration(s.duration)}</td>
                  <td className="px-4 py-3 text-ink-700">{formatFCFA(s.price)}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleActive(s)}
                      className={`rounded-full px-3 py-1 text-xs font-medium ${s.active ? "bg-emerald-100 text-emerald-700" : "bg-nude-100 text-ink-500"}`}
                    >
                      {s.active ? "Actif" : "Désactivé"}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openEdit(s)} className="rounded-full p-2 hover:bg-nude-100" aria-label="Modifier">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(s.id)} className="rounded-full p-2 hover:bg-blush-100" aria-label="Supprimer">
                        <Trash2 className="h-4 w-4 text-blush-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Modifier le service" : "Ajouter un service"}>
        <div className="space-y-4">
          <ImageUploadField value={form.imageUrl} onChange={(url) => setForm((f) => ({ ...f, imageUrl: url }))} />
          <label className="block text-sm">
            Nom
            <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="mt-1 w-full rounded-lg border border-nude-200 px-3 py-2.5 text-sm outline-none focus:border-ink-900" />
          </label>
          <label className="block text-sm">
            Description
            <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={3} className="mt-1 w-full rounded-lg border border-nude-200 px-3 py-2.5 text-sm outline-none focus:border-ink-900" />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block text-sm">
              Prix (FCFA)
              <input type="number" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) }))} className="mt-1 w-full rounded-lg border border-nude-200 px-3 py-2.5 text-sm outline-none focus:border-ink-900" />
            </label>
            <label className="block text-sm">
              Durée (minutes)
              <input type="number" value={form.duration} onChange={(e) => setForm((f) => ({ ...f, duration: Number(e.target.value) }))} className="mt-1 w-full rounded-lg border border-nude-200 px-3 py-2.5 text-sm outline-none focus:border-ink-900" />
            </label>
          </div>
          <label className="block text-sm">
            Catégorie
            <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as ServiceCategory }))} className="mt-1 w-full rounded-lg border border-nude-200 px-3 py-2.5 text-sm outline-none focus:border-ink-900">
              {Object.entries(SERVICE_CATEGORY_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.active} onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))} />
            Service actif (visible sur le site)
          </label>
          <Button onClick={handleSave} variant="primary" size="lg" className="w-full" disabled={saving}>
            {saving ? "Enregistrement…" : editing ? "Mettre à jour" : "Ajouter le service"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
