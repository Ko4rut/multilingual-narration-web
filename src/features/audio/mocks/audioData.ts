import type { AudioFile, AudioSourceType } from "../types";

const baseFiles: AudioFile[] = [
  { id: "1", name: "ben_thanh_vi_narration_v2...", size: "4.2 MB", poi: "Ben Thanh Market", langCode: "VI", lang: "Vietnamese", type: "Recorded", duration: "3:45", checksum: "a1b2c3d4", date: "Jan 12, 2026" },
  { id: "2", name: "notre_dame_en_brief.wav", size: "6.8 MB", poi: "Notre-Dame Cathedral", langCode: "EN", lang: "English", type: "TTS", duration: "2:15", checksum: "e5f67890", date: "Jan 10, 2026" },
  { id: "3", name: "war_remnants_zh_history.m...", size: "5.1 MB", poi: "War Remnants Museum", langCode: "ZH", lang: "Chinese", type: "Recorded", duration: "4:12", checksum: "bc9ef83a", date: "Jan 08, 2026" },
  { id: "4", name: "independence_vi_guide.mp3", size: "3.9 MB", poi: "Independence Palace", langCode: "VI", lang: "Vietnamese", type: "TTS", duration: "3:02", checksum: "ffd922c0", date: "Jan 05, 2026" },
  { id: "5", name: "jade_pagoda_en_mystic.wav", size: "7.2 MB", poi: "Jade Emperor Pagoda", langCode: "EN", lang: "English", type: "Recorded", duration: "5:30", checksum: "ff29bc01", date: "Dec 28, 2025" },
  { id: "6", name: "post_office_fr_eiffel.mp3", size: "4.8 MB", poi: "Central Post Office", langCode: "FR", lang: "French", type: "TTS", duration: "2:50", checksum: "ca88d302", date: "Dec 20, 2025" },
  { id: "7", name: "landmark_81_vi_intro.wav", size: "8.1 MB", poi: "Landmark 81", langCode: "VI", lang: "Vietnamese", type: "Recorded", duration: "6:15", checksum: "d3e4f5g6", date: "Jan 15, 2026" },
  { id: "8", name: "landmark_81_en_tts_v1.mp3", size: "3.5 MB", poi: "Landmark 81", langCode: "EN", lang: "English", type: "TTS", duration: "4:05", checksum: "1a2b3c4d", date: "Jan 14, 2026" },
  { id: "9", name: "cu_chi_tunnels_en_full.wav", size: "12.4 MB", poi: "Cu Chi Tunnels", langCode: "EN", lang: "English", type: "Recorded", duration: "10:20", checksum: "9f8e7d6c", date: "Jan 11, 2026" },
  { id: "10", name: "cu_chi_tunnels_fr_brief.mp3", size: "4.1 MB", poi: "Cu Chi Tunnels", langCode: "FR", lang: "French", type: "TTS", duration: "3:45", checksum: "5a6b7c8d", date: "Jan 11, 2026" },
  { id: "11", name: "opera_house_vi_history.mp3", size: "5.5 MB", poi: "Saigon Opera House", langCode: "VI", lang: "Vietnamese", type: "TTS", duration: "4:30", checksum: "b1c2d3e4", date: "Jan 09, 2026" },
  { id: "12", name: "bui_vien_ko_nightlife.wav", size: "6.2 MB", poi: "Bui Vien Walking Street", langCode: "KO", lang: "Korean", type: "Recorded", duration: "4:50", checksum: "f1e2d3c4", date: "Jan 07, 2026" },
  { id: "13", name: "saigon_zoo_ja_guide.mp3", size: "4.9 MB", poi: "Saigon Zoo & Botanical", langCode: "JA", lang: "Japanese", type: "TTS", duration: "3:55", checksum: "8a9b0c1d", date: "Jan 04, 2026" },
  { id: "14", name: "nguyen_hue_zh_walk.wav", size: "7.8 MB", poi: "Nguyen Hue Walking Street", langCode: "ZH", lang: "Chinese", type: "Recorded", duration: "5:40", checksum: "2b3c4d5e", date: "Jan 02, 2026" },
  { id: "15", name: "bitexco_en_skydeck.mp3", size: "3.2 MB", poi: "Bitexco Financial Tower", langCode: "EN", lang: "English", type: "Recorded", duration: "2:25", checksum: "6e7f8g9h", date: "Dec 30, 2025" },
  { id: "16", name: "thien_hau_zh_temple.wav", size: "5.7 MB", poi: "Thien Hau Temple", langCode: "ZH", lang: "Chinese", type: "Recorded", duration: "4:15", checksum: "0d9c8b7a", date: "Dec 25, 2025" },
  { id: "17", name: "fine_arts_fr_exhibit.mp3", size: "4.5 MB", poi: "Fine Arts Museum", langCode: "FR", lang: "French", type: "TTS", duration: "3:10", checksum: "3a4b5c6d", date: "Dec 22, 2025" },
  { id: "18", name: "starlight_bridge_vi_walk.wav", size: "6.0 MB", poi: "Starlight Bridge", langCode: "VI", lang: "Vietnamese", type: "Recorded", duration: "4:20", checksum: "7c8d9e0f", date: "Dec 18, 2025" },
  { id: "19", name: "binh_tay_vi_market.mp3", size: "3.8 MB", poi: "Binh Tay Market", langCode: "VI", lang: "Vietnamese", type: "TTS", duration: "2:55", checksum: "1f2e3d4c", date: "Dec 15, 2025" },
  { id: "20", name: "suoi_tien_en_park.wav", size: "9.5 MB", poi: "Suoi Tien Theme Park", langCode: "EN", lang: "English", type: "Recorded", duration: "7:30", checksum: "5g6h7i8j", date: "Dec 10, 2025" }
];

function generateMoreData(): AudioFile[] {
  const results: AudioFile[] = [];
  const langs = [
    { code: "VI", name: "Vietnamese" },
    { code: "EN", name: "English" },
    { code: "JA", name: "Japanese" },
    { code: "KO", name: "Korean" },
    { code: "FR", name: "French" }
  ];
  
  for (let i = 21; i <= 70; i++) {
    const langIndex = i % 5;
    const lang = langs[langIndex];
    const min = (i % 5) + 1;
    const sec = (i * 7) % 60;
    
    let type: AudioSourceType = "Recorded";
    if (i % 3 === 0) {
      type = "TTS";
    }
    
    let secStr = sec.toString();
    if (sec < 10) {
      secStr = "0" + sec;
    }

    results.push({
      id: i.toString(),
      name: "generated_audio_file_" + i + ".mp3",
      size: (3 + (i % 5)) + "." + (i % 9) + " MB",
      poi: "Demo Location " + i,
      langCode: lang.code,
      lang: lang.name,
      type: type,
      duration: min + ":" + secStr,
      checksum: "a" + i + "b" + (i * 2) + "c" + (i * 3),
      date: "Oct " + ((i % 30) + 1) + ", 2026"
    });
  }
  return results;
}

export const MOCK_AUDIO_FILES = baseFiles.concat(generateMoreData());
