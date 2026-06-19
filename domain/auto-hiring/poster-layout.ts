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

// Header is the logo image (public/logo-blk.png) at a fixed height, on the bare
// background (no box/fill) and centered.
export const HEADER = {
  logo: "logo-blk.png",
  logoHeight: 96,
  padX: 24,
  padY: 14,
};
export const FOOTER = {
  heading: 24,
  contact: 18,
  disclaimer: 14, // the "rates already reflect…" note, minimized into the footer
};

// Fixed (un-scaled) header/footer heights + breathing room, used to derive how
// much vertical space the body may occupy.
const HEADER_H = 124;
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

const LIST_W = WIDTH - PAD_X * 2 - 14;
export const DESC_LINE = 1.4; // line-height for description lines
const DESC_FLOOR = 0.5; // smallest description font scale before we just clip

// Estimated rendered height of a single description line at scale s.
function lineHeightPx(line: string, baseSize: number, s: number) {
  return wrapCount(line, baseSize * s, LIST_W) * baseSize * s * DESC_LINE;
}

// Estimated rendered height of a description block (qual or work) at scale s.
function descHeight(lines: string[], baseSize: number, s: number) {
  let h = 0;
  for (const l of lines) h += lineHeightPx(l, baseSize, s);
  return h;
}

// Keep only the leading lines that fully fit within maxH at the given scale, so
// the block clips on a whole-line boundary instead of CSS slicing through a
// line. Always keeps at least the first line (the maxHeight clip is the final
// guard if even that overflows).
export function clampLines(
  lines: string[],
  baseSize: number,
  scale: number,
  maxH: number,
): string[] {
  const out: string[] = [];
  let h = 0;
  for (const line of lines) {
    const lh = lineHeightPx(line, baseSize, scale);
    if (out.length > 0 && h + lh > maxH) break;
    out.push(line);
    h += lh;
  }
  return out;
}

// Height consumed by everything in the body EXCEPT the two description blocks
// (title, the two section labels, the compensation block, and their gaps). The
// descriptions get whatever vertical space is left.
function fixedBodyHeight(position: string) {
  const tBase = titleSize(position);
  const titleLines = wrapCount(position, tBase, WIDTH - PAD_X * 2, 0.62);
  const titleH = titleLines * tBase * 1.05;
  const labelH = BASE.sectionLabel * 1.3;
  const compH =
    BASE.gComp +
    BASE.compLabel * 1.3 +
    BASE.gPayLabel +
    BASE.payLabel * 1.2 +
    BASE.gPayValue +
    BASE.payValue * 1.1 +
    BASE.gRegular +
    BASE.payLabel * 1.2 +
    BASE.gPayValue +
    BASE.payValue * 1.1;
  return (
    titleH +
    BASE.gTitle +
    labelH +
    BASE.gList +
    BASE.gSection +
    labelH +
    BASE.gList +
    compH
  );
}

export type DescLayout = {
  scale: number; // font scale applied to BOTH description blocks
  qualMaxH: number; // hard max-height (px) for the qualifications block
  workMaxH: number; // hard max-height (px) for the work block
};

// Give the descriptions a height budget (the space left after the fixed parts)
// and shrink only their font to fit — title, salary, and footer stay uniform.
// The per-block max-heights are a hard clip so nothing can ever overlap, even
// if the estimate is slightly off.
export function descLayout(
  position: string,
  qualLines: string[],
  workLines: string[],
): DescLayout {
  const budget = Math.max(140, AVAILABLE_BODY - fixedBodyHeight(position));
  const qH = descHeight(qualLines, BASE.qual, 1);
  const wH = descHeight(workLines, BASE.work, 1);
  const total = qH + wH || 1;
  const scale = Math.max(DESC_FLOOR, Math.min(1, budget / total));
  // Split the budget proportionally to each block's content; +2px guard so the
  // clip never cuts a line that legitimately fits.
  return {
    scale,
    qualMaxH: Math.round((budget * qH) / total) + 2,
    workMaxH: Math.round((budget * wH) / total) + 2,
  };
}
