"use client";

import { MessageCircle } from "lucide-react";
import clsx from "clsx";
import { whatsappLink } from "@/lib/config";

export function WhatsAppButton({
  message,
  label = "Discuter sur WhatsApp",
  variant = "floating",
  className,
}: {
  message?: string;
  label?: string;
  variant?: "floating" | "inline";
  className?: string;
}) {
  if (variant === "inline") {
    return (
      <a
        href={whatsappLink(message)}
        target="_blank"
        rel="noopener noreferrer"
        className={clsx(
          "inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#1ebd5a]",
          className
        )}
      >
        <MessageCircle className="h-4 w-4" />
        {label}
      </a>
    );
  }

  return (
    <a
      href={whatsappLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/20 transition-transform hover:scale-105"
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  );
}
