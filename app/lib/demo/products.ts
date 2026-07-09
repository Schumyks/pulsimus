/**
 * Catálogo de "La Espiga" — panadería ficticia de la demo El mostrador.
 *
 * Precios al público (moms 25% incluido, Dinamarca) y costo estimado por
 * unidad (~40-50% del precio). `batchSize` es la tanda del día: lo que se
 * hornea una vez y no se repone hasta mañana (soporta el panel "qué te
 * queda" / ⚠ se agota de El tablero, F4T).
 *
 * Calibración (ver docs/f4r-f4t-design-spec.md §2 + reporte de R1): estos
 * precios, combinados con los seeds de `seeds.ts`, cierran el día en
 * ~1.236 kr facturado / 14 pedidos / ticket prom. ~88 kr.
 */

export type Product = {
  id: string;
  name: string;
  /** kr., precio al público, moms 25% INCLUIDO */
  unitPrice: number;
  /** kr., costo estimado por unidad */
  unitCost: number;
  /** tanda del día — unidades horneadas, no se repone intradía */
  batchSize: number;
  /** asset de la curación de Alan, public/la-espiga/ */
  img: string;
};

export const PRODUCTS: readonly Product[] = [
  {
    id: 'medialunas',
    name: 'Medialunas',
    unitPrice: 16,
    unitCost: 7,
    batchSize: 60,
    img: '/la-espiga/medialunas-3.webp',
  },
  {
    id: 'pan',
    name: 'Pan de campo',
    unitPrice: 42,
    unitCost: 19,
    batchSize: 30,
    img: '/la-espiga/pan-2.webp',
  },
  {
    id: 'facturas',
    name: 'Facturas',
    unitPrice: 14,
    unitCost: 6,
    batchSize: 48,
    img: '/la-espiga/medialunas-canoncitos-1.webp',
  },
] as const;

export function getProduct(id: string): Product | undefined {
  return PRODUCTS.find((product) => product.id === id);
}
