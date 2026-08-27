import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-line bg-surface">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="text-xl font-extrabold tracking-tight text-brand"
        >
          ticketbro
        </Link>
        <span className="text-sm font-medium text-muted">Help center</span>
      </div>
    </header>
  );
}
