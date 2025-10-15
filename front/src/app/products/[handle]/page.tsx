import { getProduct } from "@/lib/medusa/products";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  Leaf,
  Truck,
  ArrowRight,
  ClipboardList,
  CircleCheck,
} from "lucide-react";
import { formatPrice } from "@/lib/utils/format";
import AddToCartButton from "@/components/product/AddToCartButton";
import VariantSelector from "@/components/product/VariantSelector";
import { cn } from "@/lib/utils/cn";

const reassurance = [
  {
    icon: ShieldCheck,
    title: "Pharmacist verified",
    description: "Licensed professionals validate authenticity and dosage.",
  },
  {
    icon: Lock,
    title: "Private checkout",
    description: "Encrypted cryptocurrency processing for total discretion.",
  },
  {
    icon: Truck,
    title: "Tracked delivery",
    description: "Temperature-controlled logistics to 80+ countries worldwide.",
  },
];

const infoHighlights = [
  {
    title: "Clinical assurance",
    items: [
      "GMP-certified manufacturing partners",
      "Batch-level quality audits",
      "Therapeutic equivalence to brand medications",
    ],
  },
  {
    title: "Shipping & handling",
    items: [
      "Standard delivery: 10–14 business days",
      "Express routes available in select regions",
      "Discreet, tamper-evident packaging",
    ],
  },
  {
    title: "Payment options",
    items: [
      "Bitcoin & Lightning Network settlement",
      "Solana (SOL) and USDC stablecoins",
      "Escrow-protected transactions",
    ],
  },
];

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.handle);

  if (!product) {
    notFound();
  }

  const firstVariant = product.variants?.[0];
  const priceAmount =
    firstVariant?.calculated_price?.calculated_amount ??
    (firstVariant as any)?.prices?.[0]?.amount ??
    null;

  return (
    <div className="bg-slate-50">
      <section className="section-padding pt-10 lg:pt-14">
        <div className="container-custom space-y-12">
          <nav className="flex flex-wrap items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-500">
            <Link href="/" className="transition hover:text-primary-600">
              Home
            </Link>
            <span>/</span>
            <Link
              href="/products"
              className="transition hover:text-primary-600"
            >
              Products
            </Link>
            <span>/</span>
            <span className="text-slate-700">{product.title}</span>
          </nav>

          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
            <div className="space-y-6">
              <div className="card-surface overflow-hidden rounded-[32px] border border-primary-100/60 bg-white/90 p-6">
                <div className="relative h-[420px] overflow-hidden rounded-3xl bg-slate-100">
                  {product.thumbnail ? (
                    <Image
                      src={product.thumbnail}
                      alt={product.title}
                      fill
                      className="object-contain"
                      priority
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-slate-400">
                      Image preview unavailable
                    </div>
                  )}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {reassurance.map(({ icon: Icon, title, description }) => (
                  <div
                    key={title}
                    className="card-surface space-y-3 rounded-3xl border border-primary-100/60 bg-white/80 p-4 text-xs text-slate-500"
                  >
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-500/10 text-primary-600">
                      <Icon className="h-5 w-5" />
                    </span>
                    <p className="text-sm font-semibold text-slate-900">
                      {title}
                    </p>
                    <p>{description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-8">
              <div className="space-y-4">
                <span className="badge-soft bg-primary-100 text-primary-800">
                  {product.collection?.title ?? "Generic medication"}
                </span>
                <div className="space-y-3">
                  <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
                    {product.title}
                  </h1>
                  {product.subtitle && (
                    <p className="text-base text-slate-600">
                      {product.subtitle}
                    </p>
                  )}
                </div>
              </div>

              <div className="card-surface space-y-6 rounded-[28px] border border-primary-100/60 bg-white/90 p-6">
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Starting at
                    </p>
                    <p className="text-3xl font-semibold text-primary-600">
                      {priceAmount
                        ? formatPrice(priceAmount)
                        : "Contact support"}
                    </p>
                    <p className="text-xs text-slate-400">
                      Pricing varies by dosage and quantity
                    </p>
                  </div>

                  <div className="inline-flex items-center gap-2 rounded-full bg-primary-500/10 px-4 py-2 text-xs font-semibold text-primary-600">
                    <Leaf className="h-4 w-4" />
                    GMP-certified supply chain
                  </div>
                </div>

                <div className="space-y-4">
                  <VariantSelector product={product} />
                  <AddToCartButton product={product} />
                  <div className="flex flex-wrap items-center gap-3 text-[13px] text-slate-500">
                    <CircleCheck className="h-4 w-4 text-emerald-500" />
                    Pharmacy license verification required before first
                    shipment.
                  </div>
                </div>
              </div>

              <div className="card-surface space-y-6 rounded-[28px] border border-primary-100/60 bg-white/90 p-6">
                <h2 className="text-lg font-semibold text-slate-900">
                  Medication overview
                </h2>
                <div className="prose prose-slate max-w-none text-slate-600">
                  {product.description ? (
                    <div
                      dangerouslySetInnerHTML={{ __html: product.description }}
                    />
                  ) : (
                    <p>
                      Detailed clinical notes will appear here once they are
                      added for this medication.
                    </p>
                  )}
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {infoHighlights.map((panel) => (
                  <div
                    key={panel.title}
                    className="card-surface space-y-4 rounded-3xl border border-primary-100/60 bg-white/90 p-6"
                  >
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                      <ClipboardList className="h-4 w-4 text-primary-600" />
                      {panel.title}
                    </div>
                    <ul className="space-y-3 text-sm text-slate-600">
                      {panel.items.map((item) => (
                        <li key={item} className="flex gap-3">
                          <span className="mt-1 inline-flex h-2 w-2 flex-shrink-0 rounded-full bg-primary-400" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="card-surface flex flex-col gap-4 rounded-[28px] border border-primary-100/60 bg-white/90 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Questions about this medication?
                  </p>
                  <p className="text-xs text-slate-500">
                    Our licensed pharmacists can review medical history and
                    dosage suitability.
                  </p>
                </div>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-full border border-primary-200 bg-white px-5 py-2 text-sm font-semibold text-primary-700 transition hover:border-primary-300 hover:bg-primary-50"
                >
                  Contact support
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
