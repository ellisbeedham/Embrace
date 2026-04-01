import Link from "next/link";

type PlanCardProps = {
  name: string;
  price: number;
  period?: string;
  description: string;
  features: string[];
  cta: string;
  ctaHref: string;
  highlight?: boolean;
};

export function PlanCard({
  name,
  price,
  period = "",
  description,
  features,
  cta,
  ctaHref,
  highlight = false,
}: PlanCardProps) {
  return (
    <div
      className={`p-8 rounded-3xl flex flex-col transition-shadow ${
        highlight
          ? "bg-embrace-black text-white shadow-2xl"
          : "bg-embrace-gray border border-embrace-border"
      }`}
    >
      {highlight && (
        <span className="self-start text-[10px] font-semibold tracking-widest uppercase bg-white/15 text-white/80 px-3 py-1 rounded-full mb-6">
          Most Popular
        </span>
      )}

      <h3 className={`text-lg font-semibold tracking-tight mb-2 ${highlight ? "text-white" : "text-embrace-black"}`}>
        {name}
      </h3>

      <div className="mb-5">
        <span className={`text-4xl font-semibold tracking-tighter ${highlight ? "text-white" : "text-embrace-black"}`}>
          £{price === 0 ? "0" : price % 1 === 0 ? price : price.toFixed(2)}
        </span>
        {period && (
          <span className={`text-sm ml-1 ${highlight ? "text-white/50" : "text-embrace-muted"}`}>
            {period}
          </span>
        )}
      </div>

      <p className={`text-sm leading-relaxed mb-8 ${highlight ? "text-white/60" : "text-embrace-muted"}`}>
        {description}
      </p>

      <ul className="space-y-3 mb-10 flex-1">
        {features.map((f) => (
          <li key={f} className={`flex items-center gap-3 text-sm ${highlight ? "text-white/80" : "text-embrace-black"}`}>
            <span className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
              highlight ? "bg-white/20" : "bg-embrace-black"
            }`}>
              <svg className={`w-2.5 h-2.5 ${highlight ? "text-white" : "text-white"}`}
                   viewBox="0 0 10 10" fill="none">
                <path d="M2 5l2.5 2.5L8 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            {f}
          </li>
        ))}
      </ul>

      <Link
        href={ctaHref}
        className={`block text-center py-3 px-6 font-medium text-sm rounded-full transition-colors ${
          highlight
            ? "bg-white text-embrace-black hover:bg-white/90"
            : "bg-embrace-black text-white hover:bg-embrace-black/80"
        }`}
      >
        {cta}
      </Link>
    </div>
  );
}
