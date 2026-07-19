"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { CategoryArt } from "@/components/ui/CategoryArt";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { listGalleryItems, createGalleryItem, updateGalleryItem, deleteGalleryItem } from "@/lib/data/gallery";
import { GALLERY_CATEGORY_LABELS, type GalleryCategory, type GalleryItem } from "@/types/gallery";

const EMPTY_FORM = {
  title: "",
  category: "maquillage" as GalleryCategory,
  imageUrl: "",
};

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[] | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<GalleryItem | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  function refresh() {
    listGalleryItems().then(setItems);
  }

  useEffect(refresh, []);

  function openCreate() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  }

  function openEdit(item: GalleryItem) {
    setEditing(item);
    setForm({
      title: item.title,
      category: item.category,
      imageUrl: item.imageUrl,
    });
    setModalOpen(true);
  }

  async function handleSave() {
    if (!form.imageUrl) {
      toast.error("Ajoutez une image avant d'enregistrer.");
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        await updateGalleryItem(editing.id, form);
        toast.success("Image mise à jour.");
      } else {
        await createGalleryItem(form);
        toast.success("Image ajoutée à la galerie.");
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
    if (!confirm("Supprimer cette image de la galerie ?")) return;
    await deleteGalleryItem(id);
    toast.success("Image supprimée.");
    refresh();
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-ink-900">Galerie</h1>
          <p className="text-ink-500">Photos maquillage, coiffure, ongles et avant/après.</p>
        </div>
        <Button onClick={openCreate} variant="primary" size="md">
          <Plus className="h-4 w-4" /> Ajouter une image
        </Button>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {items === null ? (
          Array.from({ length: 8 }).map((_, i) => <div key={i} className="aspect-square animate-pulse rounded-2xl bg-white" />)
        ) : items.length === 0 ? (
          <p className="col-span-full text-ink-500">Aucune image pour le moment.</p>
        ) : (
          items.map((item) => (
            <div key={item.id} className="group relative aspect-square overflow-hidden rounded-2xl border border-nude-200">
              {item.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover" />
              ) : (
                <CategoryArt category={item.category} label={item.title} />
              )}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-900/80 to-transparent p-3">
                <p className="truncate text-xs font-medium text-white">{item.title}</p>
                <p className="text-[10px] uppercase tracking-wide text-white/70">{GALLERY_CATEGORY_LABELS[item.category]}</p>
              </div>
              <div className="absolute right-2 top-2 flex gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  onClick={() => openEdit(item)}
                  className="rounded-full bg-white/90 p-1.5 hover:bg-nude-100"
                  aria-label="Modifier l'image"
                >
                  <Pencil className="h-4 w-4 text-ink-700" />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="rounded-full bg-white/90 p-1.5 hover:bg-blush-100"
                  aria-label="Supprimer l'image"
                >
                  <Trash2 className="h-4 w-4 text-blush-500" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Modifier l'image" : "Ajouter une image"}>
        <div className="space-y-4">
          <ImageUploadField value={form.imageUrl} onChange={(url) => setForm((f) => ({ ...f, imageUrl: url }))} />
          <label className="block text-sm">
            Titre
            <input
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-nude-200 px-3 py-2.5 text-sm outline-none focus:border-ink-900"
            />
          </label>
          <label className="block text-sm">
            Catégorie
            <select
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as GalleryCategory }))}
              className="mt-1 w-full rounded-lg border border-nude-200 px-3 py-2.5 text-sm outline-none focus:border-ink-900"
            >
              {Object.entries(GALLERY_CATEGORY_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </label>
          <Button onClick={handleSave} variant="primary" size="lg" className="w-full" disabled={saving}>
            {saving ? "Enregistrement…" : editing ? "Mettre à jour" : "Ajouter à la galerie"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
