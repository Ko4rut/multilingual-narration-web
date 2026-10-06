"use client";

export default function AdminError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <section className="card empty-state" role="alert">
      <h2>Unable to load this page</h2>
      <p>Please try again. If the problem persists, check your connection or contact the workspace administrator.</p>
      <button className="button" onClick={() => retry()}>Try again</button>
    </section>
  )
}
