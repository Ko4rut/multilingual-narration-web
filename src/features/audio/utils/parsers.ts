
export function parseSearchQuery(value: string | string[] | undefined): string {
  const val = Array.isArray(value) ? value[0] : value;
  return val || "";
}

export function parseAudioSource(value: string | string[] | undefined): string {
  const val = Array.isArray(value) ? value[0] : value;
  
  if (val === "Recorded" || val === "TTS") {
    return val;
  }
  return "all";
}

export function parseAudioField(value: string | string[] | undefined): string {
  const val = Array.isArray(value) ? value[0] : value;
  const validFields = ["all", "name", "poi", "lang", "duration", "checksum", "date"];
  
  if (validFields.includes(val as string)) {
    return val as string;
  }
  return "all";
}

export function parsePageNumber(value: string | string[] | undefined): number {
  const val = Array.isArray(value) ? value[0] : value;
  
  if (!val) return 1;
  
  const parsed = parseInt(val, 10);
  if (isNaN(parsed) || parsed < 1) {
    return 1;
  }
  
  return parsed;
}