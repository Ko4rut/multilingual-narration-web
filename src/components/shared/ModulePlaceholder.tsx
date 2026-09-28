import Link from "next/link";
import { PageHeader } from "@/components/shared/PageHeader";

export function ModulePlaceholder({ title, description }: { title: string; description: string }) {
  return <><PageHeader title={title} description={description} /><section className="card empty-state"><span className="eyebrow">READY FOR DEVELOPMENT</span><h2>{title}</h2><p>The route and workspace layout are ready. Connect this module to your API to add management workflows.</p><Link href="/dashboard" className="button">Back to dashboard</Link></section></>;
}
