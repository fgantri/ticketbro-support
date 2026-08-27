import Link from "next/link";

export function BackLink({
  href = "/",
  children = "Back",
}: {
  href?: string;
  children?: string;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-ink"
    >
      <svg
        viewBox="0 0 20 20"
        aria-hidden="true"
        className="size-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M16 10H4m0 0 5-5m-5 5 5 5" />
      </svg>
      {children}
    </Link>
  );
}
