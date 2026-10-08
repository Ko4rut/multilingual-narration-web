"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useStatCard } from "../hooks/use-stat-card";
import type { StatCardProps } from "../types";

export function StatCard({ stat }: StatCardProps) {
  const { label, value, change, changeClassName } = useStatCard(stat);

  return (
    <Card className="stat-card min-w-0 gap-4 py-5">
      <CardHeader className="gap-3 px-4">
        <CardTitle>
          <h2 className="text-[length:var(--type-small)] font-normal leading-relaxed text-muted-foreground">
            {label}
          </h2>
        </CardTitle>
        <Badge variant="secondary" className={changeClassName}>
          {change}
        </Badge>
      </CardHeader>
      <CardContent className="px-4">
        <strong className="text-[length:var(--type-metric)]">
          {value}
        </strong>
      </CardContent>
    </Card>
  );
}
