import Form from "next/form";

export function SearchBar({ defaultValue = "" }: { defaultValue?: string }) {
  return (
    <Form action="/search" className="flex flex-col gap-3 sm:flex-row">
      <div className="relative min-w-0 flex-1">
        <svg
          viewBox="0 0 20 20"
          aria-hidden="true"
          className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-faint"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
        >
          <circle cx="9" cy="9" r="6" />
          <path d="m13.5 13.5 3.5 3.5" />
        </svg>
        <input
          type="search"
          name="q"
          required
          defaultValue={defaultValue}
          placeholder="Describe your problem, e.g. ticket not received"
          aria-label="Search the help center"
          className="field pl-11"
        />
      </div>
      <button type="submit" className="btn btn-primary">
        Search
      </button>
    </Form>
  );
}
