"use client";

import { Button } from "@/components/ui/button";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
  ComboboxValue,
} from "@/components/ui/combobox";
import { usePreferences } from "@/features/settings/hooks/use-preferences";
import type { DataTableFilterOption } from "@/types/shared/data-table.types";
import type { PoiContentPoiComboboxProps } from "../types/poi-content.types";

export function PoiContentPoiCombobox({
  id,
  name,
  options,
  defaultValue,
  disabled,
  required,
}: PoiContentPoiComboboxProps) {
  const { t } = usePreferences();
  const selectedOption =
    options.find(function findSelectedOption(option) {
      return option.value === defaultValue;
    }) ?? null;

  function getOptionLabel(option: DataTableFilterOption) {
    return option.label;
  }

  function getOptionValue(option: DataTableFilterOption) {
    return option.value;
  }

  function filterOption(option: DataTableFilterOption, query: string) {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    const searchValue = `${option.label} ${option.description ?? option.value}`;
    return searchValue.toLocaleLowerCase().includes(normalizedQuery);
  }

  function renderOption(option: DataTableFilterOption) {
    return (
      <ComboboxItem
        key={option.value}
        value={option}
        className="items-start py-2 data-highlighted:bg-hover! data-highlighted:text-foreground!"
      >
        <div className="flex min-w-0 flex-col gap-0.5">
          <span className="truncate font-medium text-foreground">
            {option.label}
          </span>
          <span className="truncate font-mono text-xs text-muted-foreground">
            {option.description ?? option.value}
          </span>
        </div>
      </ComboboxItem>
    );
  }

  return (
    <Combobox
      name={name}
      items={options}
      defaultValue={selectedOption}
      disabled={disabled}
      required={required}
      itemToStringLabel={getOptionLabel}
      itemToStringValue={getOptionValue}
      filter={filterOption}
    >
      <ComboboxTrigger
        id={id}
        disabled={disabled}
        aria-required={required}
        render={
          <Button
            type="button"
            variant="outline"
            className="h-8 w-full justify-between bg-background px-2.5 text-xs font-normal"
          />
        }
      >
        <span className="truncate">
          <ComboboxValue placeholder={t("Select a POI")} />
        </span>
      </ComboboxTrigger>
      <ComboboxContent>
        <ComboboxInput
          aria-label={t("Search POIs by name or ID...")}
          placeholder={t("Search POIs by name or ID...")}
          showTrigger={false}
          className="border-transparent! has-[[data-slot=input-group-control]:focus-visible]:border-transparent! has-[[data-slot=input-group-control]:focus-visible]:ring-0! [&_[data-slot=input-group-control]:focus-visible]:outline-none!"
        />
        <ComboboxEmpty>{t("No POIs found.")}</ComboboxEmpty>
        <ComboboxList className="scrollbar-hidden">
          {renderOption}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
