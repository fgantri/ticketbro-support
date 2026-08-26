import Form from "next/form";

export function SearchBar({ defaultValue = "" }: { defaultValue?: string }) {
  return (
    <Form action="/search" className="flex gap-2">
      <input
        type="search"
        name="q"
        defaultValue={defaultValue}
        placeholder="Describe your problem, e.g. ticket not received"
        aria-label="Search the help center"
        className="min-w-0 flex-1 rounded-lg border border-neutral-300 px-4 py-2.5 text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none"
      />
      <button
        type="submit"
        className="rounded-lg bg-neutral-900 px-5 py-2.5 font-medium text-white transition-colors hover:bg-neutral-700"
      >
        Search
      </button>
    </Form>
  );
}
