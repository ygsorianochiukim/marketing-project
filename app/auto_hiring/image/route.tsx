import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import {
  BASE,
  clampLines,
  descLayout,
  FALLBACK_BG,
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
} from "@/domain/auto-hiring/poster-layout";

export const runtime = "nodejs";

function parseTemplate(value: string | null): TemplateKey {
  if (value === "field" || value === "ck" || value === "cover") return value;
  return "admin";
}

async function loadAsset(...candidates: string[]): Promise<Buffer | null> {
  for (const name of candidates) {
    try {
      return await readFile(join(process.cwd(), "public", name));
    } catch {
      // try the next candidate
    }
  }
  return null;
}

async function loadFont(file: string): Promise<Buffer> {
  return readFile(join(process.cwd(), "public", "fonts", file));
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const template = parseTemplate(searchParams.get("template"));
    const isCover = template === "cover";
    const cfg = TEMPLATES[template];

    const position = searchParams.get("position") ?? "Position Name";
    const qualification = searchParams.get("qualification") ?? "Qualification";
    const workAbout = searchParams.get("work_about") ?? "Qualification";
    const startingRate = searchParams.get("starting") ?? "Starting";
    const regularRate = searchParams.get("regular") ?? "Regular";
    const companyAddress = searchParams.get("company_address") ?? cfg.address;
    const companyPhone = searchParams.get("company_phone") ?? cfg.phone;
    const qrCodeUrl = searchParams.get("qr");

    const [bg, logo, playfairBold, poppinsReg, poppinsSemi, poppinsItalic, poppinsSemiItalic] =
      await Promise.all([
        loadAsset(cfg.bg, FALLBACK_BG),
        loadAsset(HEADER.logo),
        loadFont("PlayfairDisplay-Bold.woff"),
        loadFont("Poppins-Regular.ttf"),
        loadFont("Poppins-SemiBold.ttf"),
        loadFont("Poppins-Italic.ttf"),
        loadFont("Poppins-SemiBoldItalic.ttf"),
      ]);

    const bgDataUrl = bg ? `data:image/png;base64,${bg.toString("base64")}` : null;
    const logoDataUrl = logo
      ? `data:image/png;base64,${logo.toString("base64")}`
      : null;
    const qualLines = splitLines(qualification);
    const workLines = splitLines(workAbout);

    // Descriptions get a height budget and their own font scale; title, salary,
    // and footer stay at base size. dpx() scales only the description text.
    const desc = descLayout(position, qualLines, workLines);
    const dpx = (n: number) => Math.round(n * desc.scale);
    // Clip to whole lines that fit the per-block budget, so an over-long
    // description never bleeds into the compensation block below.
    const qualShown = clampLines(qualLines, BASE.qual, desc.scale, desc.qualMaxH);
    const workShown = clampLines(workLines, BASE.work, desc.scale, desc.workMaxH);

    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            padding: `${PAD_TOP}px ${PAD_X}px ${PAD_BOT}px`,
            backgroundColor: "#f4ece0",
            ...(bgDataUrl && {
              backgroundImage: `url(${bgDataUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }),
            color: INK,
            fontFamily: "Poppins",
          }}
        >
          {/* Header — fixed at top */}
          <div
            style={{
              display: "flex",
              flexShrink: 0,
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
              padding: `${HEADER.padY}px ${HEADER.padX}px`,
              border: "1px solid rgba(168,130,74,0.35)",
              borderRadius: 8,
              backgroundColor: "rgba(255,255,255,0.20)",
            }}
          >
            {logoDataUrl ? (
              <img
                src={logoDataUrl}
                alt="Renaissance Park and Chapels"
                height={HEADER.logoHeight}
                style={{ height: HEADER.logoHeight, objectFit: "contain" }}
              />
            ) : (
              <div
                style={{
                  fontFamily: "Playfair",
                  fontWeight: 700,
                  fontSize: 38,
                  letterSpacing: 8,
                  color: GOLD,
                }}
              >
                RENAISSANCE
              </div>
            )}
          </div>

          {/* Body — fills the middle; descriptions are clipped to their budget */}
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
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <div style={{ fontSize: 26, letterSpacing: 8, color: GOLD }}>
                  WE&apos;RE HIRING
                </div>
                <div
                  style={{
                    fontFamily: "Playfair",
                    marginTop: 28,
                    fontSize: 104,
                    fontWeight: 700,
                    color: INK,
                    lineHeight: 1,
                  }}
                >
                  Join Our Team
                </div>
                <div
                  style={{
                    marginTop: 36,
                    width: 640,
                    fontSize: 22,
                    fontStyle: "italic",
                    color: MUTED,
                    textAlign: "center",
                  }}
                >
                  Build meaningful spaces for families and generations to come.
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div
                  style={{
                    fontFamily: "Playfair",
                    fontSize: titleSize(position),
                    fontWeight: 700,
                    color: INK,
                    lineHeight: 1.05,
                  }}
                >
                  {position}
                </div>

                <div
                  style={{
                    marginTop: BASE.gTitle,
                    fontSize: BASE.sectionLabel,
                    fontWeight: 600,
                    fontStyle: "italic",
                    color: INK,
                  }}
                >
                  What we are looking for :
                </div>
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
                  {qualShown.map((line, i) => (
                    <div
                      key={i}
                      style={{ fontSize: dpx(BASE.qual), color: INK, lineHeight: 1.4 }}
                    >
                      {line}
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    marginTop: BASE.gSection,
                    fontSize: BASE.sectionLabel,
                    fontWeight: 600,
                    fontStyle: "italic",
                    color: INK,
                  }}
                >
                  What is the work about :
                </div>
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
                  {workShown.map((line, i) => (
                    <div
                      key={i}
                      style={{ fontSize: dpx(BASE.work), color: INK, lineHeight: 1.4 }}
                    >
                      {line}
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    marginTop: BASE.gComp,
                    fontSize: BASE.compLabel,
                    fontWeight: 600,
                    fontStyle: "italic",
                    color: INK,
                  }}
                >
                  Compensation and Benefits
                </div>
                <div
                  style={{
                    fontFamily: "Playfair",
                    marginTop: BASE.gPayLabel,
                    fontSize: BASE.payLabel,
                    fontWeight: 700,
                    color: INK,
                  }}
                >
                  Starting :
                </div>
                <div
                  style={{
                    fontFamily: "Playfair",
                    marginTop: BASE.gPayValue,
                    paddingLeft: 24,
                    fontSize: BASE.payValue,
                    fontWeight: 700,
                    color: INK,
                  }}
                >
                  {startingRate}
                </div>
                <div
                  style={{
                    fontFamily: "Playfair",
                    marginTop: BASE.gRegular,
                    fontSize: BASE.payLabel,
                    fontWeight: 700,
                    color: INK,
                  }}
                >
                  Regular :
                </div>
                <div
                  style={{
                    fontFamily: "Playfair",
                    marginTop: BASE.gPayValue,
                    paddingLeft: 24,
                    fontSize: BASE.payValue,
                    fontWeight: 700,
                    color: INK,
                  }}
                >
                  {regularRate}
                </div>
              </div>
            )}
          </div>

          {/* Footer — fixed at bottom */}
          <div
            style={{
              flexShrink: 0,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                marginBottom: 12,
                fontSize: FOOTER.disclaimer,
                fontStyle: "italic",
                lineHeight: 1.35,
                color: MUTED,
              }}
            >
              Rates already reflect a performance-and-integrity allocation that
              may be given in full when work is carried out responsibly
            </div>
            <div style={{ borderTop: `2px solid ${INK}`, marginBottom: 14 }} />
            <div style={{ fontSize: FOOTER.heading, fontWeight: 600, color: INK }}>
              Please send your documents at:
            </div>
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
                  <img
                    src={qrCodeUrl}
                    alt=""
                    width={104}
                    height={104}
                    style={{ objectFit: "contain" }}
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
                <div>{companyAddress}</div>
                <div>{companyPhone}</div>
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: WIDTH,
        height: HEIGHT,
        fonts: [
          { name: "Playfair", data: playfairBold, weight: 700, style: "normal" },
          { name: "Poppins", data: poppinsReg, weight: 400, style: "normal" },
          { name: "Poppins", data: poppinsSemi, weight: 600, style: "normal" },
          { name: "Poppins", data: poppinsItalic, weight: 400, style: "italic" },
          {
            name: "Poppins",
            data: poppinsSemiItalic,
            weight: 600,
            style: "italic",
          },
        ],
      },
    );
  } catch (err) {
    return new Response(
      `Image route failed: ${err instanceof Error ? err.message : String(err)}\n${err instanceof Error ? err.stack : ""}`,
      { status: 500, headers: { "Content-Type": "text/plain" } },
    );
  }
}
