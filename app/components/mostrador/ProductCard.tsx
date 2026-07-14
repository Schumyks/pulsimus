"use client";

import Image from "next/image";
import type { Product } from "../../lib/demo/products";

type ProductCardProps = {
  product: Product;
  qty: number;
  onQtyChange: (next: number) => void;
  disabled?: boolean;
};

export default function ProductCard({
  product,
  qty,
  onQtyChange,
  disabled = false,
}: ProductCardProps) {
  const { name, unitPrice, img } = product;

  return (
    <div className="flex items-center gap-4 rounded-xl bg-noche/[0.03] p-4">
      <Image
        src={img}
        alt=""
        width={96}
        height={96}
        className="object-contain"
        style={{ filter: "drop-shadow(0 6px 8px rgba(27,33,64,.18))" }}
      />
      <div className="flex-1">
        <p className="font-medium text-noche">{name}</p>
        <p className="text-sm text-bruma">{unitPrice} kr c/u</p>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onQtyChange(Math.max(0, qty - 1))}
          disabled={disabled || qty === 0}
          aria-label={`Quitar ${name}`}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-noche/10 text-lg leading-none font-medium text-noche transition-colors hover:bg-noche/15 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ambar"
        >
          −
        </button>
        <span
          aria-live="polite"
          className="w-5 text-center text-sm font-medium tabular-nums text-noche"
        >
          {qty}
        </span>
        <button
          type="button"
          onClick={() => onQtyChange(qty + 1)}
          disabled={disabled}
          aria-label={`Sumar ${name}`}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-ambar text-lg leading-none font-medium text-noche transition-colors hover:bg-ambar/90 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ambar"
        >
          +
        </button>
      </div>
    </div>
  );
}
