"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { ImagePlus, X, Loader2 } from "lucide-react";
import { isCloudinaryConfigured, uploadImageToCloudinary } from "@/lib/cloudinary";

export function ImageUploadField({
  value,
  onChange,
  label = "Image",
}: {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    if (!isCloudinaryConfigured) {
      toast.error("Cloudinary n'est pas configuré. Ajoutez vos identifiants dans .env.local.");
      return;
    }
    setUploading(true);
    try {
      const url = await uploadImageToCloudinary(file);
      onChange(url);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Échec de l'upload.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <span className="text-xs font-semibold uppercase tracking-wide text-ink-500">{label}</span>
      <div className="mt-2 flex items-center gap-3">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-nude-100">
          {value ? (
            <Image src={value} alt="" fill className="object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-ink-500">
              <ImagePlus className="h-6 w-6" />
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 rounded-full border border-nude-200 px-4 py-2 text-xs font-medium text-ink-700 hover:border-ink-900/40 disabled:opacity-50"
          >
            {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ImagePlus className="h-3.5 w-3.5" />}
            {uploading ? "Envoi…" : "Choisir une image (Cloudinary)"}
          </button>
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="flex items-center gap-1.5 text-xs text-ink-500 hover:text-blush-500"
            >
              <X className="h-3 w-3" /> Retirer
            </button>
          )}
        </div>
      </div>
      {!isCloudinaryConfigured && (
        <p className="mt-2 text-xs text-ink-500">
          Sans image, un visuel de remplacement élégant sera affiché automatiquement.
        </p>
      )}
    </div>
  );
}
