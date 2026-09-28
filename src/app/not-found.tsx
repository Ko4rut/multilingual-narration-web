import Link from "next/link";

export default function NotFound() {
  return <main className="standalone"><span className="eyebrow">404</span><h1>Page not found</h1><p>This page does not exist.</p><Link className="button" href="/dashboard">Back to dashboard</Link></main>;
}
