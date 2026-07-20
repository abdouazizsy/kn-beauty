"use client";

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Plus, Trash2, Wallet } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { listTransactions, createTransaction, deleteTransaction } from "@/lib/data/transactions";
import { formatDate, formatFCFA } from "@/lib/format";
import { PAYMENT_METHOD_LABELS, type PaymentMethod, type Transaction } from "@/types/transaction";

const METHODS = Object.keys(PAYMENT_METHOD_LABELS) as PaymentMethod[];

const EMPTY_FORM = {
  description: "",
  clientName: "",
  amount: "",
  method: "especes" as PaymentMethod,
};

function isSameMonth(iso: string, ref: Date) {
  const d = new Date(iso);
  return d.getMonth() === ref.getMonth() && d.getFullYear() === ref.getFullYear();
}

function isSameDay(iso: string, ref: Date) {
  return new Date(iso).toDateString() === ref.toDateString();
}

export default function AdminCaissePage() {
  const [transactions, setTransactions] = useState<Transaction[] | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  function refresh() {
    listTransactions().then(setTransactions);
  }

  useEffect(refresh, []);

  const { todayTotal, monthTotal } = useMemo(() => {
    const now = new Date();
    const list = transactions ?? [];
    return {
      todayTotal: list.filter((t) => isSameDay(t.createdAt, now)).reduce((s, t) => s + t.amount, 0),
      monthTotal: list.filter((t) => isSameMonth(t.createdAt, now)).reduce((s, t) => s + t.amount, 0),
    };
  }, [transactions]);

  function openCreate() {
    setForm(EMPTY_FORM);
    setModalOpen(true);
  }

  async function handleSave() {
    const amount = Number(form.amount);
    if (!form.description.trim()) {
      toast.error("Indiquez un motif pour cet encaissement.");
      return;
    }
    if (!amount || amount <= 0) {
      toast.error("Indiquez un montant valide.");
      return;
    }
    setSaving(true);
    try {
      await createTransaction({
        description: form.description.trim(),
        clientName: form.clientName.trim() || undefined,
        amount,
        method: form.method,
      });
      toast.success("Encaissement enregistré.");
      setModalOpen(false);
      refresh();
    } catch {
      toast.error("Une erreur est survenue.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer cet encaissement ?")) return;
    await deleteTransaction(id);
    toast.success("Encaissement supprimé.");
    refresh();
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-ink-900">Caisse</h1>
          <p className="text-ink-500">Enregistrez les paiements reçus en direct (clientes de passage, liquide, mobile money…).</p>
        </div>
        <Button onClick={openCreate} variant="primary" size="md">
          <Plus className="h-4 w-4" /> Encaissement rapide
        </Button>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-nude-200 bg-white p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-300/30">
            <Wallet className="h-5 w-5 text-gold-600" />
          </div>
          <p className="mt-3 text-xs uppercase tracking-wide text-ink-500">Encaissé aujourd&apos;hui</p>
          <p className="font-display text-xl text-ink-900">{formatFCFA(todayTotal)}</p>
        </div>
        <div className="rounded-2xl border border-nude-200 bg-white p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-300/30">
            <Wallet className="h-5 w-5 text-gold-600" />
          </div>
          <p className="mt-3 text-xs uppercase tracking-wide text-ink-500">Encaissé ce mois</p>
          <p className="font-display text-xl text-ink-900">{formatFCFA(monthTotal)}</p>
        </div>
      </div>

      <div className="mt-8 space-y-3">
        {transactions === null ? (
          Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-20 animate-pulse rounded-2xl bg-white" />)
        ) : transactions.length === 0 ? (
          <div className="rounded-2xl border border-nude-200 bg-white p-10 text-center text-ink-500">
            Aucun encaissement pour le moment.
          </div>
        ) : (
          transactions.map((t) => (
            <div key={t.id} className="flex items-center justify-between gap-4 rounded-2xl border border-nude-200 bg-white p-4">
              <div>
                <p className="font-medium text-ink-900">{t.description}</p>
                <p className="text-sm text-ink-500">
                  {t.clientName ? `${t.clientName} · ` : ""}
                  {PAYMENT_METHOD_LABELS[t.method]} · {formatDate(t.createdAt)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-semibold text-gold-600">{formatFCFA(t.amount)}</span>
                <button
                  onClick={() => handleDelete(t.id)}
                  className="rounded-full p-1.5 text-ink-500 hover:bg-blush-100 hover:text-blush-500"
                  aria-label="Supprimer l'encaissement"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Encaissement rapide">
        <div className="space-y-4">
          <label className="block text-sm">
            Motif
            <input
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Ex. Maquillage soirée"
              className="mt-1 w-full rounded-lg border border-nude-200 px-3 py-2.5 text-sm outline-none focus:border-ink-900"
            />
          </label>
          <label className="block text-sm">
            Cliente (optionnel)
            <input
              value={form.clientName}
              onChange={(e) => setForm((f) => ({ ...f, clientName: e.target.value }))}
              placeholder="Nom de la cliente"
              className="mt-1 w-full rounded-lg border border-nude-200 px-3 py-2.5 text-sm outline-none focus:border-ink-900"
            />
          </label>
          <label className="block text-sm">
            Montant (FCFA)
            <input
              type="number"
              min="0"
              value={form.amount}
              onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-nude-200 px-3 py-2.5 text-sm outline-none focus:border-ink-900"
            />
          </label>
          <label className="block text-sm">
            Moyen de paiement
            <select
              value={form.method}
              onChange={(e) => setForm((f) => ({ ...f, method: e.target.value as PaymentMethod }))}
              className="mt-1 w-full rounded-lg border border-nude-200 px-3 py-2.5 text-sm outline-none focus:border-ink-900"
            >
              {METHODS.map((m) => (
                <option key={m} value={m}>{PAYMENT_METHOD_LABELS[m]}</option>
              ))}
            </select>
          </label>
          <Button onClick={handleSave} variant="primary" size="lg" className="w-full" disabled={saving}>
            {saving ? "Enregistrement…" : "Enregistrer l'encaissement"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
