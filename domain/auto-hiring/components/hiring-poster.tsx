import {
  BASE,
  descLayout,
  FOOTER,
  GAP,
  GOLD,
  HEADER,
  HEIGHT,
  INK,
  MUTED,
  PAD_BOT,
  PAD_TOP,
  PAD_X,
  splitLines,
  TEMPLATES,
  type TemplateKey,
  titleSize,
  WIDTH,
} from "../poster-layout";

export type PosterVariant = TemplateKey;

export type HiringPosterProps = {
  variant?: PosterVariant;
  positionName?: string;
  qualification?: string;
  workAbout?: string;
  startingRate?: string;
  regularRate?: string;
  companyName?: string;
  companyAddress?: string;
  companyPhone?: string;
  qrCodeUrl?: string;
};

const SERIF = "'Playfair Display', Georgia, serif";
const SANS = "'Poppins', ui-sans-serif, system-ui, sans-serif";

// Layer the per-template background over the shared statue fallback; if the
// per-template file is absent the browser falls through (no broken image).
function bgLayers(variant: PosterVariant): string {
  return `url('/${TEMPLATES[variant].bg}'), url('/bg-hiring.png')`;
}

export function HiringPoster({
  variant = "admin",
  positionName = "Position Name",
  qualification = "Qualification",
  workAbout = "Qualification",
  startingRate = "Starting",
  regularRate = "Regular",
  companyAddress,
  companyPhone,
  qrCodeUrl,
}: HiringPosterProps) {
  const cfg = TEMPLATES[variant];
  const address = companyAddress ?? cfg.address;
  const phone = companyPhone ?? cfg.phone;
  const isCover = variant === "cover";

  const qualLines = splitLines(qualification);
  const workLines = splitLines(workAbout);
  // Same description budgeting the image route uses, so the preview matches.
  const desc = descLayout(positionName, qualLines, workLines);
  const dpx = (n: number) => Math.round(n * desc.scale);

  return (
    <article
      style={{
        width: WIDTH,
        maxWidth: "100%",
        aspectRatio: `${WIDTH} / ${HEIGHT}`,
        display: "flex",
        flexDirection: "column",
        padding: `${PAD_TOP}px ${PAD_X}px ${PAD_BOT}px`,
        backgroundColor: "#f4ece0",
        backgroundImage: bgLayers(variant),
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: INK,
        fontFamily: SANS,
        boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
      }}
    >
      {/* Header — fixed at top */}
      <header
        style={{
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          padding: `${HEADER.padY}px ${HEADER.padX}px`,
          border: "1px solid rgba(168,130,74,0.35)",
          borderRadius: 8,
          backgroundColor: "rgba(255,255,255,0.20)",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/${HEADER.logo}`}
          alt="Renaissance Park and Chapels"
          style={{ height: HEADER.logoHeight, objectFit: "contain" }}
        />
      </header>

      {/* Body — fills the middle, scaled to fit */}
      <div
        style={{
          display: "flex",
          flex: 1,
          flexDirection: "column",
          justifyContent: isCover ? "center" : "flex-start",
          alignItems: isCover ? "center" : "stretch",
          paddingTop: isCover ? 0 : GAP,
          overflow: "hidden",
        }}
      >
        {isCover ? (
          <div
            style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
          >
            <span style={{ fontSize: 26, letterSpacing: 8, color: GOLD }}>
              WE&apos;RE HIRING
            </span>
            <span
              style={{
                fontFamily: SERIF,
                marginTop: 28,
                fontSize: 104,
                fontWeight: 700,
                color: INK,
                lineHeight: 1,
              }}
            >
              Join Our Team
            </span>
            <span
              style={{
                marginTop: 36,
                width: 640,
                maxWidth: "100%",
                fontSize: 22,
                fontStyle: "italic",
                color: MUTED,
                textAlign: "center",
              }}
            >
              Build meaningful spaces for families and generations to come.
            </span>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{
                fontFamily: SERIF,
                fontSize: titleSize(positionName),
                fontWeight: 700,
                color: INK,
                lineHeight: 1.05,
              }}
            >
              {positionName}
            </span>

            <span
              style={{
                marginTop: BASE.gTitle,
                fontSize: BASE.sectionLabel,
                fontWeight: 600,
                fontStyle: "italic",
                color: INK,
              }}
            >
              What we are looking for :
            </span>
            <div
              style={{
                marginTop: BASE.gList,
                paddingLeft: 14,
                display: "flex",
                flexDirection: "column",
                maxHeight: desc.qualMaxH,
                overflow: "hidden",
              }}
            >
              {qualLines.map((line, i) => (
                <span
                  key={i}
                  style={{ fontSize: dpx(BASE.qual), color: INK, lineHeight: 1.4 }}
                >
                  {line}
                </span>
              ))}
            </div>

            <span
              style={{
                marginTop: BASE.gSection,
                fontSize: BASE.sectionLabel,
                fontWeight: 600,
                fontStyle: "italic",
                color: INK,
              }}
            >
              What is the work about :
            </span>
            <div
              style={{
                marginTop: BASE.gList,
                paddingLeft: 14,
                display: "flex",
                flexDirection: "column",
                maxHeight: desc.workMaxH,
                overflow: "hidden",
              }}
            >
              {workLines.map((line, i) => (
                <span
                  key={i}
                  style={{ fontSize: dpx(BASE.work), color: INK, lineHeight: 1.4 }}
                >
                  {line}
                </span>
              ))}
            </div>

            <span
              style={{
                marginTop: BASE.gComp,
                fontSize: BASE.compLabel,
                fontWeight: 600,
                fontStyle: "italic",
                color: INK,
              }}
            >
              Compensation and Benefits
            </span>
            <span
              style={{
                fontFamily: SERIF,
                marginTop: BASE.gPayLabel,
                fontSize: BASE.payLabel,
                fontWeight: 700,
                color: INK,
              }}
            >
              Starting :
            </span>
            <span
              style={{
                fontFamily: SERIF,
                marginTop: BASE.gPayValue,
                paddingLeft: 24,
                fontSize: BASE.payValue,
                fontWeight: 700,
                color: INK,
              }}
            >
              {startingRate}
            </span>
            <span
              style={{
                fontFamily: SERIF,
                marginTop: BASE.gRegular,
                fontSize: BASE.payLabel,
                fontWeight: 700,
                color: INK,
              }}
            >
              Regular :
            </span>
            <span
              style={{
                fontFamily: SERIF,
                marginTop: BASE.gPayValue,
                paddingLeft: 24,
                fontSize: BASE.payValue,
                fontWeight: 700,
                color: INK,
              }}
            >
              {regularRate}
            </span>
          </div>
        )}
      </div>

      {/* Footer — fixed at bottom */}
      <footer style={{ flexShrink: 0, display: "flex", flexDirection: "column" }}>
        <span
          style={{
            marginBottom: 12,
            fontSize: FOOTER.disclaimer,
            fontStyle: "italic",
            lineHeight: 1.35,
            color: MUTED,
          }}
        >
          Rates already reflect a performance-and-integrity allocation that may
          be given in full when work is carried out responsibly
        </span>
        <div style={{ borderTop: `2px solid ${INK}`, marginBottom: 14 }} />
        <span style={{ fontSize: FOOTER.heading, fontWeight: 600, color: INK }}>
          Please send your documents at:
        </span>
        <div style={{ marginTop: 10, display: "flex", alignItems: "center" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 104,
              height: 104,
              backgroundColor: "#fff",
              marginRight: 16,
              ...(qrCodeUrl
                ? {}
                : { border: `1px solid ${INK}`, fontSize: 12, color: INK }),
            }}
          >
            {qrCodeUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={qrCodeUrl}
                alt="QR code"
                style={{ width: 104, height: 104, objectFit: "contain" }}
              />
            ) : (
              "QR"
            )}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: FOOTER.contact,
              color: INK,
              lineHeight: 1.4,
            }}
          >
            <span>{address}</span>
            <span>{phone}</span>
          </div>
        </div>
      </footer>
    </article>
  );
}
