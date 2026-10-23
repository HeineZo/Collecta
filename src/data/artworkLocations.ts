import type { ArtworkLocation } from "../models/ArtworkLocation";
import type { Artwork } from "../models/Artwork";

interface KnownPlace {
  keywords: string[];
  label: string;
  // [longitude, latitude]
  coordinates: [number, number];
}

// The Met gives no coordinates, only free-text cultures and countries, so the usual ones are mapped to an
// approximate place. More specific entries come first: "Greek, Attic" must match Attica before Greece.
// shortcut: covers the common cultures only; artworks outside this list simply show no map.
const KNOWN_PLACES: KnownPlace[] = [
  { keywords: ["Attic"], label: "Attica, Greece", coordinates: [23.73, 37.98] },
  { keywords: ["Cycladic"], label: "Cyclades, Greece", coordinates: [25.37, 37.05] },
  { keywords: ["Minoan", "Crete", "Cretan"], label: "Crete, Greece", coordinates: [25.16, 35.3] },
  { keywords: ["Mycenaean"], label: "Mycenae, Greece", coordinates: [22.76, 37.73] },
  { keywords: ["Greek", "Greece"], label: "Greece", coordinates: [23.73, 37.98] },
  { keywords: ["Etruscan"], label: "Etruria, Italy", coordinates: [11.76, 42.25] },
  { keywords: ["Roman"], label: "Rome, Italy", coordinates: [12.49, 41.89] },
  { keywords: ["Italian", "Italy"], label: "Italy", coordinates: [12.5, 41.9] },
  { keywords: ["Cypriot", "Cyprus"], label: "Cyprus", coordinates: [33.38, 35.13] },
  { keywords: ["Egyptian", "Egypt", "Coptic"], label: "Egypt", coordinates: [31.24, 30.04] },
  { keywords: ["Nubian", "Sudan"], label: "Nubia, Sudan", coordinates: [33.75, 16.94] },
  { keywords: ["Assyrian"], label: "Assyria, Iraq", coordinates: [43.15, 36.36] },
  { keywords: ["Babylonian", "Sumerian", "Mesopotamia", "Mesopotamian"], label: "Mesopotamia, Iraq", coordinates: [44.42, 32.54] },
  { keywords: ["Iraq"], label: "Iraq", coordinates: [44.36, 33.31] },
  { keywords: ["Achaemenid", "Sasanian", "Persian", "Iran", "Iranian"], label: "Iran", coordinates: [51.67, 32.65] },
  { keywords: ["Hittite", "Anatolian"], label: "Anatolia, Türkiye", coordinates: [32.85, 39.93] },
  { keywords: ["Byzantine", "Ottoman", "Turkey", "Turkish", "Türkiye"], label: "Istanbul, Türkiye", coordinates: [28.98, 41.01] },
  { keywords: ["Phoenician", "Lebanon"], label: "Lebanon", coordinates: [35.5, 33.89] },
  { keywords: ["Syrian", "Syria"], label: "Syria", coordinates: [36.29, 33.51] },
  { keywords: ["Gandhara", "Pakistan"], label: "Pakistan", coordinates: [73.05, 33.68] },
  { keywords: ["Indian", "India"], label: "India", coordinates: [77.21, 28.61] },
  { keywords: ["Nepalese", "Nepal"], label: "Nepal", coordinates: [85.32, 27.72] },
  { keywords: ["Tibetan", "Tibet"], label: "Tibet, China", coordinates: [91.11, 29.65] },
  { keywords: ["Chinese", "China"], label: "China", coordinates: [116.4, 39.9] },
  { keywords: ["Japanese", "Japan"], label: "Japan", coordinates: [135.77, 35.01] },
  { keywords: ["Korean", "Korea"], label: "Korea", coordinates: [126.98, 37.57] },
  { keywords: ["Khmer", "Cambodia", "Cambodian"], label: "Cambodia", coordinates: [103.87, 13.41] },
  { keywords: ["Thai", "Thailand"], label: "Thailand", coordinates: [100.5, 13.76] },
  { keywords: ["Vietnamese", "Vietnam"], label: "Vietnam", coordinates: [105.85, 21.03] },
  { keywords: ["Javanese", "Indonesia", "Indonesian"], label: "Java, Indonesia", coordinates: [110.37, -7.8] },
  { keywords: ["French", "France"], label: "France", coordinates: [2.35, 48.86] },
  { keywords: ["Spanish", "Spain"], label: "Spain", coordinates: [-3.7, 40.42] },
  { keywords: ["German", "Germany"], label: "Germany", coordinates: [13.4, 52.52] },
  { keywords: ["Flemish", "Netherlandish", "Belgium", "Belgian"], label: "Flanders, Belgium", coordinates: [4.4, 51.22] },
  { keywords: ["Dutch", "Netherlands"], label: "Netherlands", coordinates: [4.9, 52.37] },
  { keywords: ["British", "English", "England", "Scottish", "United Kingdom"], label: "United Kingdom", coordinates: [-0.13, 51.51] },
  { keywords: ["Austrian", "Austria"], label: "Austria", coordinates: [16.37, 48.21] },
  { keywords: ["Swiss", "Switzerland"], label: "Switzerland", coordinates: [7.45, 46.95] },
  { keywords: ["Russian", "Russia"], label: "Russia", coordinates: [37.62, 55.75] },
  { keywords: ["Hawaiian", "Hawaii"], label: "Hawaii, United States", coordinates: [-157.86, 21.31] },
  { keywords: ["American", "United States"], label: "United States", coordinates: [-98.58, 39.83] },
  { keywords: ["Aztec", "Mexican", "Mexico"], label: "Mexico", coordinates: [-99.13, 19.43] },
  { keywords: ["Maya"], label: "Maya region, Guatemala", coordinates: [-89.62, 17.22] },
  { keywords: ["Inca", "Moche", "Nasca", "Peruvian", "Peru"], label: "Peru", coordinates: [-77.04, -12.05] },
  { keywords: ["Colombian", "Colombia"], label: "Colombia", coordinates: [-74.07, 4.71] },
  { keywords: ["Edo"], label: "Benin City, Nigeria", coordinates: [5.63, 6.34] },
  { keywords: ["Yoruba"], label: "Yorubaland, Nigeria", coordinates: [4.56, 7.47] },
  { keywords: ["Nigeria", "Nigerian"], label: "Nigeria", coordinates: [7.49, 9.06] },
  { keywords: ["Asante", "Akan", "Ghana"], label: "Ghana", coordinates: [-1.62, 6.69] },
  { keywords: ["Dogon", "Bamana", "Mali"], label: "Mali", coordinates: [-8.0, 12.64] },
  { keywords: ["Baule", "Senufo", "Côte d'Ivoire"], label: "Côte d'Ivoire", coordinates: [-5.28, 6.82] },
  { keywords: ["Kongo", "Kuba", "Luba", "Congo"], label: "Congo basin", coordinates: [15.31, -4.32] },
  { keywords: ["Papua New Guinea", "Sepik"], label: "Papua New Guinea", coordinates: [147.18, -9.44] },
  { keywords: ["Australia", "Aboriginal"], label: "Australia", coordinates: [133.88, -23.7] },
  { keywords: ["Maori", "New Zealand"], label: "New Zealand", coordinates: [174.78, -41.29] },
];

// Whole words only, so "Roman" never matches "Romanian".
const PLACE_PATTERNS = KNOWN_PLACES.map((place) => ({
  place,
  pattern: new RegExp(`\\b(?:${place.keywords.join("|")})\\b`, "i"),
}));

export function findArtworkLocation(artwork: Pick<Artwork, "country" | "culture">): ArtworkLocation | null {
  // The country is more precise than the culture when the Met fills it in.
  for (const basis of ["country", "culture"] as const) {
    const basisValue = artwork[basis];
    if (!basisValue) continue;
    const match = PLACE_PATTERNS.find(({ pattern }) => pattern.test(basisValue));
    if (match) {
      const [longitude, latitude] = match.place.coordinates;
      return { label: match.place.label, longitude, latitude, basis, basisValue };
    }
  }
  return null;
}
