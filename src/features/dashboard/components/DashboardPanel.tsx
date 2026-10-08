"use client";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useDashboardPanel } from "../hooks/use-dashboard-panel";
import type {
  DashboardPanelActionProps,
  DashboardPanelProps,
} from "../types";

function DashboardPanelAction({ action }: DashboardPanelActionProps) {
  if (action === undefined || action === null) {
    return null;
  }

  return (
    <CardAction className="col-start-1 row-start-3 justify-self-start">
      {action}
    </CardAction>
  );
}

export function DashboardPanel(props: DashboardPanelProps) {
  const { action, children } = props;
  const { titleId, titleLabel, descriptionLabel } = useDashboardPanel(props);

  return (
    <Card
      role="region"
      aria-labelledby={titleId}
      className="min-w-0 gap-5 py-5"
    >
      <CardHeader className="gap-2 px-5 has-data-[slot=card-action]:grid-cols-1">
        <CardTitle>
          <h2 id={titleId} className="text-body leading-snug">
            {titleLabel}
          </h2>
        </CardTitle>
        <CardDescription className="text-[length:var(--type-small)]">
          {descriptionLabel}
        </CardDescription>
        <DashboardPanelAction action={action} />
      </CardHeader>
      <CardContent className="min-w-0 px-5">
        {children}
      </CardContent>
    </Card>
  );
}
