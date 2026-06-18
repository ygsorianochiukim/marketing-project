import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const runtime = "nodejs";

type TemplateKey = "admin" | "field" | "ck" | "cover";

// Per-template config. `bg` is the preferred background filename in /public; if
// missing we fall back to the shared statue background. `address`/`phone` are
// the location-specific footer defaults (overridable via query params). The
// four templates share one layout and differ only by background + footer.
const TEMPLATES: Record<
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

const FALLBACK_BG = "bg-hiring.png";

const GOLD = "#a8824a";
const INK = "#2b2b2b";
const MUTED = "#6b6b6b";

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

    const [bg, playfairBold, poppinsReg, poppinsSemi, poppinsItalic, poppinsSemiItalic] =
      await Promise.all([
        loadAsset(cfg.bg, FALLBACK_BG),
        loadFont("PlayfairDisplay-Bold.woff"),
        loadFont("Poppins-Regular.ttf"),
        loadFont("Poppins-SemiBold.ttf"),
        loadFont("Poppins-Italic.ttf"),
        loadFont("Poppins-SemiBoldItalic.ttf"),
      ]);

    const bgDataUrl = bg ? `data:image/png;base64,${bg.toString("base64")}` : null;
    const qualLines = qualification.split("\n").filter((l) => l.trim().length);
    const workLines = workAbout.split("\n").filter((l) => l.trim().length);

    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            padding: "56px 64px 44px",
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
          {/* Header wordmark */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
              padding: "18px 24px",
              border: "1px solid rgba(168,130,74,0.35)",
              borderRadius: 8,
              backgroundColor: "rgba(255,255,255,0.20)",
            }}
          >
            <div
              style={{
                fontFamily: "Playfair",
                fontWeight: 700,
                fontSize: 46,
                letterSpacing: 10,
                color: GOLD,
              }}
            >
              RENAISSANCE
            </div>
            <div
              style={{
                marginTop: 4,
                fontSize: 16,
                letterSpacing: 8,
                color: MUTED,
              }}
            >
              PARK AND CHAPELS
            </div>
          </div>

          {isCover ? (
            <div
              style={{
                marginTop: 150,
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
                  marginTop: 28,
                  fontSize: 88,
                  fontWeight: 700,
                  color: INK,
                  lineHeight: 1,
                }}
              >
                {position}
              </div>

              <div
                style={{
                  marginTop: 24,
                  fontSize: 30,
                  fontWeight: 600,
                  fontStyle: "italic",
                  color: INK,
                }}
              >
                What we are looking for :
              </div>
              <div
                style={{
                  marginTop: 8,
                  paddingLeft: 14,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {qualLines.map((line, i) => (
                  <div
                    key={i}
                    style={{ fontSize: 22, color: INK, lineHeight: 1.4 }}
                  >
                    {line}
                  </div>
                ))}
              </div>

              <div
                style={{
                  marginTop: 18,
                  fontSize: 30,
                  fontWeight: 600,
                  fontStyle: "italic",
                  color: INK,
                }}
              >
                What is the work about :
              </div>
              <div
                style={{
                  marginTop: 8,
                  paddingLeft: 14,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {workLines.map((line, i) => (
                  <div
                    key={i}
                    style={{ fontSize: 26, color: INK, lineHeight: 1.4 }}
                  >
                    {line}
                  </div>
                ))}
              </div>

              <div
                style={{
                  marginTop: 30,
                  fontSize: 32,
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
                  marginTop: 14,
                  fontSize: 28,
                  fontWeight: 700,
                  color: INK,
                }}
              >
                Starting :
              </div>
              <div
                style={{
                  fontFamily: "Playfair",
                  marginTop: 2,
                  paddingLeft: 24,
                  fontSize: 60,
                  fontWeight: 700,
                  color: INK,
                }}
              >
                {startingRate}
              </div>
              <div
                style={{
                  fontFamily: "Playfair",
                  marginTop: 12,
                  fontSize: 28,
                  fontWeight: 700,
                  color: INK,
                }}
              >
                Regular :
              </div>
              <div
                style={{
                  fontFamily: "Playfair",
                  marginTop: 2,
                  paddingLeft: 24,
                  fontSize: 60,
                  fontWeight: 700,
                  color: INK,
                }}
              >
                {regularRate}
              </div>

              <div
                style={{
                  marginTop: 22,
                  width: 760,
                  fontSize: 16,
                  lineHeight: 1.4,
                  color: MUTED,
                }}
              >
                Rates already reflect a performance-and-integrity allocation
                that may be given in full when work is carried out responsibly
              </div>
            </div>
          )}

          {/* Footer */}
          <div
            style={{
              marginTop: "auto",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                borderTop: `2px solid ${INK}`,
                marginBottom: 16,
              }}
            />
            <div style={{ fontSize: 24, fontWeight: 600, color: INK }}>
              Please send your documents at:
            </div>
            <div
              style={{
                marginTop: 10,
                display: "flex",
                alignItems: "center",
              }}
            >
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
                  fontSize: 18,
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
        width: 1080,
        height: 1350,
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
