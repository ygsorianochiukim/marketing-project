// Shared layout + auto-fit logic for the hiring poster, used by BOTH the image
// route (app/auto_hiring/image/route.tsx, what n8n posts to Facebook) and the
// browser preview (components/hiring-poster.tsx). Single source of truth so the
// two never drift.

export type TemplateKey = "admin" | "field" | "ck" | "cover";

export const WIDTH = 1080;
export const HEIGHT = 1350;
export const PAD_X = 64;
export const PAD_TOP = 56;
export const PAD_BOT = 44;

export const GOLD = "#a8824a";
export const INK = "#2b2b2b";
export const MUTED = "#6b6b6b";

// Per-template config. `bg` is the bare background filename (consumers prepend
// "/" for a URL, or read it from /public via fs). `address`/`phone` are the
// location-specific footer defaults (overridable per poster). The four
// templates share one layout and differ only by background + footer.
export const TEMPLATES: Record<
  TemplateKey,
  { bg: string; address: string; phone: string }
> = {
  admin: {
    bg: "bg-hiring-admin.png",
    address: "Bldg, Osmeña St., Zone I, City of Koronadal",
    phone: "+63 963 630 8117",
  },
  field: {
    bg: "bg-hiring-field.png",
    address: "San Felipe, Tantangan, South Cotabato",
    phone: "+63 922 588 3675",
  },
  ck: {
    bg: "bg-hiring-ck.png",
    address: "Bldg, Osmeña St., Zone I, City of Koronadal",
    phone: "+63 963 630 8117",
  },
  cover: {
    bg: "bg-hiring-cover.png",
    address: "Bldg, Osmeña St., Zone I, City of Koronadal",
    phone: "+63 963 630 8117",
  },
};

export const FALLBACK_BG = "bg-hiring.png";

// Base (un-scaled) body typography. Header + footer stay fixed across posters
// so the brand frame is identical everywhere; only the body scales to fit.
export const BASE = {
  title: 72, // cap; long titles shrink below this via titleSize()
  sectionLabel: 30,
  qual: 22,
  work: 26,
  compLabel: 32,
  payLabel: 24,
  payValue: 46,
  // vertical gaps
  gTitle: 28,
  gSection: 18,
  gList: 8,
  gComp: 30,
  gPayLabel: 14,
  gPayValue: 2,
  gRegular: 12,
};

// Fixed (un-scaled) header + footer typography, identical on every poster.
export const HEADER = {
  wordmark: 38,
  sub: 13,
  letter: 8,
  subLetter: 7,
  padX: 24,
  padY: 12,
};
export const FOOTER = {
  heading: 24,
  contact: 18,
  disclaimer: 14, // the "rates already reflect…" note, minimized into the footer
};

// Fixed (un-scaled) header/footer heights + breathing room, used to derive how
// much vertical space the body may occupy.
const HEADER_H = 84;
const FOOTER_H = 220;
export const GAP = 32;
const AVAILABLE_BODY = HEIGHT - PAD_TOP - PAD_BOT - HEADER_H - FOOTER_H - GAP;

export function splitLines(value: string): string[] {
  return value.split("\n").filter((l) => l.trim().length);
}

// Rough wrapped-line count. avgCharWidth ≈ factor * fontSize; conservative so
// the estimate never under-counts (worst case we scale down a touch extra).
export function wrapCount(
  text: string,
  fontSize: number,
  maxWidth: number,
  factor = 0.52,
) {
  if (!text) return 1;
  const widthPx = text.length * fontSize * factor;
  return Math.max(1, Math.ceil(widthPx / maxWidth));
}

// Adaptive position-title size: shrink to fit on a single line (down to a
// floor) and never exceed BASE.title, so long titles stay compact instead of
// wrapping into a huge multi-line block.
export function titleSize(position: string): number {
  const maxW = WIDTH - PAD_X * 2;
  const floor = 42;
  // Playfair Display Bold is wide; use a generous per-char factor so the size
  // we pick actually fits one line instead of just barely overflowing.
  const perChar = 0.62 * Math.max(1, position.length);
  const oneLine = Math.floor(maxW / perChar);
  return Math.max(floor, Math.min(BASE.title, oneLine));
}

// Estimate the rendered body height at a given scale.
function estimateBody(
  s: number,
  position: string,
  qualLines: string[],
  workLines: string[],
) {
  const bodyW = WIDTH - PAD_X * 2;
  const listW = bodyW - 14;
  const tBase = titleSize(position);
  let h = 0;
  h += wrapCount(position, tBase * s, bodyW, 0.5) * tBase * s;
  h += BASE.gTitle * s;
  h += BASE.sectionLabel * s * 1.3 + BASE.gList * s;
  for (const l of qualLines)
    h += wrapCount(l, BASE.qual * s, listW) * BASE.qual * s * 1.4;
  h += BASE.gSection * s;
  h += BASE.sectionLabel * s * 1.3 + BASE.gList * s;
  for (const l of workLines)
    h += wrapCount(l, BASE.work * s, listW) * BASE.work * s * 1.4;
  h += BASE.gComp * s + BASE.compLabel * s * 1.3;
  h += BASE.gPayLabel * s + BASE.payLabel * s * 1.2;
  h += BASE.gPayValue * s + BASE.payValue * s * 1.1;
  h += BASE.gRegular * s + BASE.payLabel * s * 1.2;
  h += BASE.gPayValue * s + BASE.payValue * s * 1.1;
  return h;
}

// Largest scale (≤ 1) at which the body fits the available space; floored so it
// never becomes unreadable.
export function fitScale(
  position: string,
  qualLines: string[],
  workLines: string[],
): number {
  const needed = estimateBody(1, position, qualLines, workLines);
  return Math.max(0.5, Math.min(1, AVAILABLE_BODY / needed));
}
