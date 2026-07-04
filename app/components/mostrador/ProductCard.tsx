"use client";

import Image from "next/image";

type ProductCardProps = {
  name: string;
  qty: number;
  img: string;
  ordered: boolean;
  onOrder: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

export default function ProductCard({
  name,
  qty,
  img,
  ordered,
  onOrder,
}: ProductCardProps) {
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
        <p className="text-sm text-bruma">×{qty}</p>
      </div>
      <button
        type="button"
        onClick={onOrder}
        disabled={ordered}
        aria-label={`Pedir ${name}`}
        className={
          ordered
            ? "cursor-default rounded-full bg-ambar px-4 py-2 text-sm font-medium text-noche opacity-70"
            : "rounded-full bg-ambar px-4 py-2 text-sm font-medium text-noche transition-colors hover:bg-ambar/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ambar"
        }
      >
        {ordered ? "✓ Pedido" : "Pedir"}
      </button>
    </div>
  );
}
