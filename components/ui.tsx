import { CheckCircle2, ExternalLink, ShieldCheck } from "lucide-react";

export function Pill({ children, tone = "blue" }: { children: React.ReactNode; tone?: "blue" | "green" | "violet" | "amber" | "neutral" | "red" }) {
  const colors = {
    blue: "bg-blue-50 text-bridge",
    green: "bg-green-50 text-eucalypt",
    violet: "bg-violet-50 text-violet",
    amber: "bg-amber-50 text-amber",
    neutral: "bg-slate-100 text-muted",
    red: "bg-red-50 text-danger"
  };

  return <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-bold ${colors[tone]}`}>{children}</span>;
}

export function VerifiedLabel({ label = "Verified" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2.5 py-1 text-xs font-bold text-bridge">
      <ShieldCheck className="h-3.5 w-3.5" />
      {label}
    </span>
  );
}

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="panel grid place-items-center px-6 py-12 text-center">
      <CheckCircle2 className="mb-4 h-10 w-10 text-eucalypt" />
      <h3 className="text-lg font-extrabold">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-muted">{body}</p>
    </div>
  );
}

export function ExternalLinkButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a className="focus-ring inline-flex items-center justify-center gap-2 rounded-md bg-bridge px-4 py-2.5 text-sm font-extrabold text-white transition hover:bg-blue-700" href={href} target="_blank" rel="noreferrer">
      {children}
      <ExternalLink className="h-4 w-4" />
    </a>
  );
}
