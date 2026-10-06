import type { Metadata } from "next";
import { AudioOverview } from "@/features/audio/components/AudioOverview";
import { 
  parseSearchQuery, 
  parseAudioSource, 
  parseAudioField, 
  parsePageNumber
} from "@/features/audio/utils/parsers";
import type { AudioPageProps } from "@/features/audio/types";

export const metadata: Metadata = {
  title: "Audio Management | MANS Admin",
  description: "Manage audio narration files and TTS generation.",
};

export default async function AudioPage({ searchParams }: AudioPageProps) {
  const params = await searchParams;

  const q = parseSearchQuery(params.q);
  const source = parseAudioSource(params.source);
  const field = parseAudioField(params.field);
  const page = parsePageNumber(params.page);

  return (
    <AudioOverview 
      q={q} 
      source={source} 
      field={field} 
      page={page} 
    />
  );
}