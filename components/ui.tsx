import { CheckCircle2, ExternalLink, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle
} from "@/components/ui/empty";
import {
  Pagination as ShadPagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

export function Pill({ children, tone = "blue" }: { children: React.ReactNode; tone?: "blue" | "green" | "violet" | "amber" | "neutral" | "red" }) {
  const colors = {
    blue: "border-transparent bg-blue-50 text-bridge",
    green: "border-transparent bg-green-50 text-eucalypt",
    violet: "border-transparent bg-violet-50 text-violet",
    amber: "border-transparent bg-amber-50 text-amber",
    neutral: "border-transparent bg-slate-100 text-muted",
    red: "border-transparent bg-red-50 text-danger"
  };

  return <Badge variant="secondary" className={cn("h-auto rounded-md px-2.5 py-1 text-xs font-bold", colors[tone])}>{children}</Badge>;
}

export function VerifiedLabel({ label = "Verified" }: { label?: string }) {
  return (
    <Badge variant="secondary" className="h-auto gap-1 rounded-md border-transparent bg-blue-50 px-2.5 py-1 text-xs font-bold text-bridge">
      <ShieldCheck className="h-3.5 w-3.5" />
      {label}
    </Badge>
  );
}

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <Empty className="panel px-6 py-12">
      <EmptyHeader>
        <EmptyMedia variant="icon" className="bg-green-50 text-eucalypt">
          <CheckCircle2 />
        </EmptyMedia>
        <EmptyTitle className="text-lg font-extrabold">{title}</EmptyTitle>
        <EmptyDescription className="max-w-md text-sm leading-6 text-muted">{body}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}

export function ExternalLinkButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a className={cn(buttonVariants({ size: "lg" }), "h-10 gap-2 rounded-md px-4 py-2.5 text-sm font-extrabold")} href={href} target="_blank" rel="noreferrer">
      {children}
      <ExternalLink className="h-4 w-4" />
    </a>
  );
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
  label
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  label?: string;
}) {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-5 flex flex-col gap-3 rounded-md border border-line bg-white p-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm font-bold text-muted">{label ?? `Page ${page} of ${totalPages}`}</p>
      <ShadPagination className="mx-0 w-auto justify-start sm:justify-end">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              aria-disabled={page === 1}
              className={page === 1 ? "pointer-events-none opacity-40" : undefined}
              onClick={(event) => {
                event.preventDefault();
                onPageChange(Math.max(1, page - 1));
              }}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              href="#"
              aria-disabled={page === totalPages}
              className={page === totalPages ? "pointer-events-none opacity-40" : undefined}
              onClick={(event) => {
                event.preventDefault();
                onPageChange(Math.min(totalPages, page + 1));
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </ShadPagination>
    </div>
  );
}
