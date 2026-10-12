"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { usePreferences } from "@/features/settings/hooks/use-preferences";
import type { PermissionMatrixProps } from "../types/role.types";

export function PermissionMatrix({
  selectedRole,
  actions,
  rows,
  onPermissionChange,
}: PermissionMatrixProps) {
  const { t } = usePreferences();

  return (
    <Card className="min-w-0 gap-0 py-0 lg:min-h-[36rem]">
      {/* Header section with the title and selected role information */}
      <CardHeader className="border-b px-5 py-4">
        <CardTitle className="text-sm">{t("Permission Matrix")}</CardTitle>
        <p className="text-xs text-muted-foreground">
          {t("Selected Role")}: {t(selectedRole.name)}
        </p>
      </CardHeader>
      {/* Content section with the permission matrix table */}
      <CardContent className="p-4 overflow-hidden">
        <Table className="min-w-[760px] border-separate border-spacing-0">
          {/* Table header with management function and action headings */}
          <TableHeader className="bg-secondary/50">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-52 px-4 text-[10px] uppercase text-muted-foreground">
                {t("Management Function")}
              </TableHead>
              {actions.map(function renderActionHeading(action) {
                return (
                  <TableHead
                    key={action.id}
                    className="text-center text-[10px] uppercase text-foreground"
                  >
                    {t(action.name)}
                  </TableHead>
                );
              })}
            </TableRow>
          </TableHeader>
          {/* Table body with rows for each management function and corresponding permissions */}
          <TableBody>
            {rows.map(function renderPermissionRow(row) {
              return (
                <TableRow key={row.managementFunction.id}>
                  <TableCell className="px-4 py-3 text-xs font-medium whitespace-normal text-foreground">
                    {t(row.managementFunction.name)}
                  </TableCell>
                  {row.cells.map(function renderPermissionCell(cell) {
                    if (!cell.permission) {
                      return (
                        <TableCell
                          key={cell.action.id}
                          className="text-center text-muted-foreground/60"
                        >
                          <span aria-label={t("Not applicable")}>—</span>
                        </TableCell>
                      );
                    }
                    const permission = cell.permission;

                    return (
                      <TableCell key={cell.action.id} className="text-center">
                        <Switch
                          size="sm"
                          checked={cell.checked}
                          aria-label={`${t(cell.action.name)} · ${t(row.managementFunction.name)}`}
                          onCheckedChange={function updatePermission(checked) {
                            onPermissionChange(permission.id, checked);
                          }}
                        />
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
