import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ProfileInfoCardProps } from "../types/profile.types";

/** Hiển thị một nhóm thông tin hồ sơ dưới dạng danh sách mô tả. */
export function ProfileInfoCard({
  title,
  description,
  items,
}: ProfileInfoCardProps) {
  return (
    <Card className="gap-5">
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription className="text-xs">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <dl className="grid gap-3 sm:grid-cols-2">
          {items.map(function renderProfileInfoItem(item) {
            const Icon = item.icon;

            return (
              <div
                key={item.id}
                className="flex min-w-0 items-start gap-3 rounded-lg border bg-muted/20 p-3.5"
              >
                <span
                  className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary"
                  aria-hidden="true"
                >
                  <Icon className="size-4" />
                </span>
                <div className="min-w-0">
                  <dt className="text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
                    {item.label}
                  </dt>
                  <dd className="mt-1 truncate text-sm font-medium text-card-foreground">
                    {item.value}
                  </dd>
                </div>
              </div>
            );
          })}
        </dl>
      </CardContent>
    </Card>
  );
}
