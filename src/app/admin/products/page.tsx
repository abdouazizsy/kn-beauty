"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { CategoryArt } from "@/components/ui/CategoryArt";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { listProducts, createProduct, updateProduct, deleteProduct } from "@/lib/data/products";
import { formatFCFA } from "@/lib/format";
import { PRODUCT_CATEGORY_LABELS, type Product, type ProductCategory } from "@/types/product";

const EMPTY_FORM = {
  name: "",
  description: "",
  price: 0,
  stock: 0,
  category: "pyjamas" as ProductCategory,
  images: [""] as string[],
  sizes: "",
  colors: "",
  active: true,
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  function refresh() {
    listProducts().then(setProducts);
  }

  useEffect(refresh, []);

  function openCreate() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  }

  function openEdit(product: Product) {
    setEditing(product);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.category,
      images: product.images.length ? product.images : [""],
      sizes: product.sizes.join(", "),
      colors: product.colors.join(", "),
      active: product.active,
    });
    setModalOpen(true);
  }

  async function handleSave() {
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        description: form.description,
        price: form.price,
        stock: form.stock,
        category: form.category,
        images: form.images.filter(Boolean),
        sizes: form.sizes.split(",").map((s) => s.trim()).filter(Boolean),
        colors: form.colors.split(",").map((c) => c.trim()).filter(Boolean),
        active: form.active,
      };
      if (editing) {
        await updateProduct(editing.id, payload);
        toast.success("Produit mis à jour.");
      } else {
        await createProduct(payload);
        toast.success("Produit ajouté.");
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
    if (!confirm("Supprimer ce produit ?")) return;
    await deleteProduct(id);
    toast.success("Produit supprimé.");
    refresh();
  }

  async function toggleActive(product: Product) {
    await updateProduct(product.id, { active: !product.active });
    refresh();
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-ink-900">Produits</h1>
          <p className="text-ink-500">Gérez le catalogue de la boutique KN Beauty Studio.</p>
        </div>
        <Button onClick={openCreate} variant="primary" size="md">
          <Plus className="h-4 w-4" /> Ajouter un produit
        </Button>
      </div>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-nude-200 bg-white">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="border-b border-nude-200 text-left text-xs uppercase tracking-wide text-ink-500">
            <tr>
              <th className="px-4 py-3">Produit</th>
              <th className="px-4 py-3">Catégorie</th>
              <th className="px-4 py-3">Prix</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products === null ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-ink-500">Chargement…</td></tr>
            ) : products.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-ink-500">Aucun produit.</td></tr>
            ) : (
              products.map((p) => (
                <tr key={p.id} className="border-b border-nude-100 last:border-0">
                  <td className="flex items-center gap-3 px-4 py-3">
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg">
                      {p.images[0] ? <Image src={p.images[0]} alt="" fill className="object-cover" /> : <CategoryArt category={p.category} />}
                    </div>
                    <span className="font-medium text-ink-900">{p.name}</span>
                  </td>
                  <td className="px-4 py-3 text-ink-700">{PRODUCT_CATEGORY_LABELS[p.category]}</td>
                  <td className="px-4 py-3 text-ink-700">{formatFCFA(p.price)}</td>
                  <td className="px-4 py-3 text-ink-700">{p.stock}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleActive(p)}
                      className={`rounded-full px-3 py-1 text-xs font-medium ${p.active ? "bg-emerald-100 text-emerald-700" : "bg-nude-100 text-ink-500"}`}
                    >
                      {p.active ? "Actif" : "Désactivé"}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openEdit(p)} className="rounded-full p-2 hover:bg-nude-100" aria-label="Modifier">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(p.id)} className="rounded-full p-2 hover:bg-blush-100" aria-label="Supprimer">
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

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Modifier le produit" : "Ajouter un produit"}>
        <div className="space-y-4">
          <ImageUploadField value={form.images[0] ?? ""} onChange={(url) => setForm((f) => ({ ...f, images: [url] }))} />
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
              Stock
              <input type="number" value={form.stock} onChange={(e) => setForm((f) => ({ ...f, stock: Number(e.target.value) }))} className="mt-1 w-full rounded-lg border border-nude-200 px-3 py-2.5 text-sm outline-none focus:border-ink-900" />
            </label>
          </div>
          <label className="block text-sm">
            Catégorie
            <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as ProductCategory }))} className="mt-1 w-full rounded-lg border border-nude-200 px-3 py-2.5 text-sm outline-none focus:border-ink-900">
              {Object.entries(PRODUCT_CATEGORY_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block text-sm">
              Tailles (séparées par virgule)
              <input value={form.sizes} onChange={(e) => setForm((f) => ({ ...f, sizes: e.target.value }))} className="mt-1 w-full rounded-lg border border-nude-200 px-3 py-2.5 text-sm outline-none focus:border-ink-900" />
            </label>
            <label className="block text-sm">
              Couleurs (séparées par virgule)
              <input value={form.colors} onChange={(e) => setForm((f) => ({ ...f, colors: e.target.value }))} className="mt-1 w-full rounded-lg border border-nude-200 px-3 py-2.5 text-sm outline-none focus:border-ink-900" />
            </label>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.active} onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))} />
            Produit actif (visible en boutique)
          </label>
          <Button onClick={handleSave} variant="primary" size="lg" className="w-full" disabled={saving}>
            {saving ? "Enregistrement…" : editing ? "Mettre à jour" : "Ajouter le produit"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
