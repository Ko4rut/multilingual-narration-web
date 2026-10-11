import { StatusBadge } from "@/components/shared/StatusBadge";
import { usePreferences } from "@/features/settings/hooks/use-preferences";
import {
  AUDIO_SOURCE_TYPE,
  AUDIO_SOURCE_TYPE_LABELS,
} from "../constants/audio.constants";
import type { AudioStatusBadgeProps } from "../types/audio.types";

export function AudioStatusBadge({ type }: AudioStatusBadgeProps) {
  const { t } = usePreferences();

  if (type === AUDIO_SOURCE_TYPE.RECORD) {
    return (
      <StatusBadge
        label={t(AUDIO_SOURCE_TYPE_LABELS[type])}
        tone="info"
      />
    );
  }

  return (
    <StatusBadge label={t(AUDIO_SOURCE_TYPE_LABELS[type])} tone="warning" />
  );
}
