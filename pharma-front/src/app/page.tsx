import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  Lock,
  Truck,
  HeartPulse,
  CheckCircle2,
  Package,
  ClipboardCheck,
  Send,
} from "lucide-react";

const trustIndicators = [
  {
    icon: ShieldCheck,
    title: "Verified Supply Chain",
    description: "GMP-certified sourcing with batch-level quality assurance.",
  },
  {
    icon: Lock,
    title: "Private Checkout",
    description: "Encrypted payments with leading cryptocurrency processors.",
  },
  {
    icon: Truck,
    title: "Global Delivery",
    description: "Discreet, trackable shipping to 80+ countries worldwide.",
  },
  {
    icon: HeartPulse,
    title: "Clinical Guidance",
    description: "Licensed pharmacists available for treatment questions.",
  },
];

const workflowSteps = [
  {
    icon: Package,
    title: "1. Select Medication",
    description:
      "Browse by condition or prescription to find clinically backed generics.",
  },
  {
    icon: ClipboardCheck,
    title: "2. Review & Verify",
    description:
      "Upload documentation for pharmacist review and confirm recommended dosage.",
  },
  {
    icon: Send,
    title: "3. Ship Securely",
    description:
      "Choose preferred crypto payment method and receive discreet tracked delivery.",
  },
];

const categories = [
  {
    name: "Cardiovascular Care",
    description: "Statins, beta blockers, and blood pressure support.",
    href: "/products?category=cardiovascular",
    accent: "from-primary-100 via-white to-clinical-200",
  },
  {
    name: "Men’s Health",
    description: "Erectile dysfunction, hair loss, and hormone balance.",
    href: "/products?category=mens-health",
    accent: "from-clinical-100 via-white to-primary-50",
  },
  {
    name: "Mental Wellness",
    description: "SSRIs, anti-anxiety, and sleep support therapies.",
    href: "/products?category=mental-health",
    accent: "from-primary-50 via-white to-clinical-300",
  },
  {
    name: "Metabolic Support",
    description: "Diabetes management and thyroid regulation treatments.",
    href: "/products?category=diabetes",
    accent: "from-primary-100 via-white to-primary-200",
  },
  {
    name: "Antibiotics",
    description: "Trusted formulations for common bacterial infections.",
    href: "/products?category=antibiotics",
    accent: "from-clinical-200 via-white to-primary-100",
  },
  {
    name: "Pain Relief",
    description: "Non-opioid and targeted pain management solutions.",
    href: "/products?category=pain-management",
    accent: "from-primary-50 via-white to-clinical-100",
  },
];

const heroStats = [
  { label: "Orders fulfilled", value: "27k+" },
  { label: "Countries served", value: "82" },
  { label: "Avg. savings", value: "38%" },
];

export default function Home() {
  return (
    <div className="space-y-0">
      {/* Hero */}
      <section className="hero-surface section-padding pb-10 lg:pb-12">
        <div className="container-custom grid gap-16 lg:grid-cols-[1.1fr_minmax(0,0.9fr)] lg:items-center">
          <div className="space-y-8">
            <span className="badge-soft bg-primary-100 text-primary-800">
              Licensed international fulfillment
            </span>

            <div className="space-y-6">
              <h1 className="text-4xl font-semibold leading-tight text-slate-900 sm:text-5xl lg:text-6xl">
                Clinical-grade generics delivered with crypto-level privacy
              </h1>
              <p className="max-w-xl text-lg text-slate-600">
                Oceanica Pharma combines regulated pharmaceutical sourcing with
                secure cryptocurrency checkout, ensuring authentic medications,
                transparent pricing, and discreet international shipping.
              </p>
            </div>

            <ul className="grid gap-3 sm:grid-cols-2">
              {[
                "Genuine, GMP-certified medications",
                "Consult with licensed pharmacists",
                "Discreet, trackable shipping",
                "Secure cryptocurrency checkout",
              ].map((bullet) => (
                <li
                  key={bullet}
                  className="flex items-start gap-3 text-sm text-slate-600"
                >
                  <span className="mt-1 inline-flex rounded-full bg-primary-500/10 p-1 text-primary-600">
                    <CheckCircle2 className="h-4 w-4" />
                  </span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link
                href="/products"
                className="inline-flex items-center justify-center rounded-full bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-500/30 ring-1 ring-primary-400 transition hover:bg-primary-500 hover:shadow-primary-400/60"
              >
                Shop Medications
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full border border-primary-200 bg-white px-6 py-3 text-sm font-semibold text-primary-700 transition hover:border-primary-300 hover:bg-primary-50"
              >
                Consult Pharmacist
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="card-surface relative overflow-hidden rounded-[32px] border-primary-100/60 bg-white/80 p-6">
              <div className="relative h-[420px] overflow-hidden rounded-3xl">
                <Image
                  src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80"
                  alt="Pharmacy technician preparing medication"
                  fill
                  priority
                  className="object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-primary-900/10 via-transparent to-transparent" />
            </div>

            <div className="card-surface absolute -bottom-10 left-1/2 flex -translate-x-1/2 gap-6 whitespace-nowrap rounded-full border-primary-100/50 bg-white/90 px-6 py-4 text-sm text-slate-600 shadow-ambient lg:px-8">
              {heroStats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-lg font-semibold text-primary-600">
                    {stat.value}
                  </p>
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="section-padding pt-20 lg:pt-28">
        <div className="container-custom space-y-10">
          <div className="max-w-3xl space-y-4">
            <h2 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
              Pharmaceutical standards, patient-first care
            </h2>
            <p className="text-lg text-slate-600">
              Our international network of licensed pharmacists and accredited
              laboratories ensures every order meets rigorous quality and safety
              benchmarks before it reaches your door.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {trustIndicators.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="card-surface h-full p-6">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-500/10 text-primary-600">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-lg font-semibold text-slate-900">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-500">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section-padding bg-white">
        <div className="container-custom space-y-14">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-4">
              <h2 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
                Seamless ordering with compliant oversight
              </h2>
              <p className="max-w-2xl text-lg text-slate-600">
                Oceanica streamlines the entire journey—from selecting the right
                treatment to receiving discreet delivery—while safeguarding data
                privacy and regulatory compliance each step of the way.
              </p>
            </div>
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-full border border-primary-200 bg-white px-5 py-3 text-sm font-semibold text-primary-700 transition hover:border-primary-300 hover:bg-primary-50"
            >
              Create an account
            </Link>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {workflowSteps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.title}
                  className="card-surface relative h-full overflow-hidden p-6"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 via-white to-white" />
                  <div className="relative space-y-4">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-500/10 text-primary-600">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="text-xl font-semibold text-slate-900">
                      {step.title}
                    </h3>
                    <p className="text-sm text-slate-500">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section-padding bg-slate-50">
        <div className="container-custom space-y-12">
          <div className="space-y-4 text-center">
            <span className="badge-soft inline-flex">
              Tailored treatment categories
            </span>
            <h2 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
              Find medications aligned to your care plan
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-slate-600">
              Explore common therapeutic areas curated by clinical specialists
              with transparent pricing and pharmacist-reviewed guidance.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className="group relative overflow-hidden rounded-3xl border border-primary-100/60 bg-gradient-to-br p-8 shadow-subtle transition hover:border-primary-200 hover:shadow-ambient"
                style={{ backgroundImage: undefined }}
              >
                <div
                  className={`absolute inset-0 opacity-90 transition group-hover:opacity-100 bg-gradient-to-br ${category.accent}`}
                />
                <div className="relative space-y-5">
                  <div className="inline-flex rounded-full bg-white/70 px-4 py-1 text-xs font-semibold text-primary-700">
                    {category.name}
                  </div>
                  <p className="text-sm text-slate-600">
                    {category.description}
                  </p>
                  <span className="inline-flex items-center text-sm font-semibold text-primary-700">
                    View treatments
                    <ArrowRight className="ml-2 h-4 w-4 transition group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="card-surface overflow-hidden rounded-[32px] border border-primary-200 bg-white p-10 text-slate-900 shadow-ambient lg:p-14">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-center">
              <div className="space-y-6">
                <p className="badge-soft bg-primary-100 text-primary-700">
                  Ready to begin?
                </p>
                <h2 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
                  Start your secure treatment journey with Oceanica today
                </h2>
                <p className="max-w-xl text-base text-slate-600">
                  Create an account to access pharmacist consultations, saved
                  prescriptions, and real-time order tracking with encrypted
                  payment options.
                </p>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Link
                    href="/register"
                    className="inline-flex items-center justify-center rounded-full bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-500/30 transition hover:bg-primary-500 hover:shadow-primary-400/60"
                  >
                    Create account
                  </Link>
                  <Link
                    href="/products"
                    className="inline-flex items-center justify-center rounded-full border border-primary-200 bg-white px-6 py-3 text-sm font-semibold text-primary-600 transition hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700"
                  >
                    Browse catalog
                  </Link>
                </div>
              </div>
              <div className="rounded-3xl border border-primary-100 bg-primary-50/60 p-8 text-sm text-slate-600">
                <p className="font-semibold uppercase tracking-wide text-primary-700">
                  Regulatory assurance
                </p>
                <ul className="mt-4 space-y-3">
                  <li>• Pharmacist verification on every new order</li>
                  <li>• Multi-point temperature and chain-of-custody checks</li>
                  <li>• HIPAA-aligned data handling and storage</li>
                  <li>• 24/7 live patient support across time zones</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
