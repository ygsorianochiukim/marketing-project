import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const runtime = "nodejs";

type TemplateKey = "admin" | "field" | "ck" | "cover";

// Per-template config. `bg` is the preferred background filename in /public;
// if it is missing we fall back to bg-hiring-small.png so the route always
// renders. `label` is the small location/branding line under the logo, which
// keeps the four variants visually distinct even before custom backgrounds
// are supplied.
const TEMPLATES: Record<
  TemplateKey,
  { bg: string; label: string; accent: string }
> = {
  admin: { bg: "bg-hiring-admin.png", label: "ADMIN OFFICE", accent: "#8a6a3b" },
  field: {
    bg: "bg-hiring-field.png",
    label: "FIELD OPERATIONS",
    accent: "#3b6a4f",
  },
  ck: { bg: "bg-hiring-ck.png", label: "CK OFFICE", accent: "#6a3b3b" },
  cover: { bg: "bg-hiring-cover.png", label: "", accent: "#8a6a3b" },
};

const FALLBACK_BG = "bg-hiring-small.png";

function parseTemplate(value: string | null): TemplateKey {
  if (value === "field" || value === "ck" || value === "cover") return value;
  return "admin";
}

async function loadBgDataUrl(preferred: string): Promise<string | null> {
  for (const name of [preferred, FALLBACK_BG]) {
    try {
      const buf = await readFile(join(process.cwd(), "public", name));
      return `data:image/png;base64,${buf.toString("base64")}`;
    } catch {
      // try the next candidate
    }
  }
  return null;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const template = parseTemplate(searchParams.get("template"));
    const isCover = template === "cover";
    const { label, accent } = TEMPLATES[template];

    const position = searchParams.get("position") ?? "Position Name";
    const qualification = searchParams.get("qualification") ?? "Qualification";
    const workAbout = searchParams.get("work_about") ?? "Qualification";
    const startingRate = searchParams.get("starting") ?? "Starting";
    const regularRate = searchParams.get("regular") ?? "Regular";
    const companyName =
      searchParams.get("company_name") ?? "Chiu Kim Enterprises Inc.";
    const companyAddress =
      searchParams.get("company_address") ??
      "Bldg, Osmena St., Zone I, City of Koronadal";
    const companyPhone = searchParams.get("company_phone") ?? "63 963 630 8117";
    const qrCodeUrl = searchParams.get("qr");
    const bgDataUrl = await loadBgDataUrl(TEMPLATES[template].bg);

    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            padding: "40px 56px",
            backgroundColor: "#f3e8cf",
            ...(bgDataUrl && {
              backgroundImage: `url(${bgDataUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }),
            color: "#2d2a26",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              style={{
                fontSize: 32,
                fontWeight: 700,
                letterSpacing: 8,
                color: "#111",
              }}
            >
              RENAISSANCE
            </div>
            <div
              style={{
                marginTop: 4,
                fontSize: 14,
                letterSpacing: 6,
                color: "#111",
              }}
            >
              PARK AND CHAPELS
            </div>
            {label ? (
              <div
                style={{
                  marginTop: 8,
                  fontSize: 12,
                  letterSpacing: 4,
                  color: accent,
                }}
              >
                {label}
              </div>
            ) : null}
            <div
              style={{
                marginTop: 10,
                width: 96,
                height: 3,
                backgroundColor: accent,
              }}
            />
          </div>

          {isCover ? (
            <div
              style={{
                marginTop: 120,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  fontSize: 20,
                  letterSpacing: 6,
                  color: accent,
                }}
              >
                WE&apos;RE HIRING
              </div>
              <div
                style={{
                  marginTop: 24,
                  fontSize: 80,
                  fontWeight: 700,
                  color: "#3a3a3a",
                  lineHeight: 1,
                }}
              >
                Join Our Team
              </div>
              <div
                style={{
                  marginTop: 32,
                  width: 520,
                  fontSize: 16,
                  fontStyle: "italic",
                  color: "#5a5a5a",
                  textAlign: "center",
                }}
              >
                Build meaningful spaces for families and generations to come.
              </div>
            </div>
          ) : (
            <div
              style={{
                marginTop: 32,
                fontSize: 64,
                fontWeight: 700,
                color: "#3a3a3a",
                lineHeight: 1,
              }}
            >
              {position}
            </div>
          )}

          {!isCover && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  marginTop: 32,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    fontSize: 14,
                    fontStyle: "italic",
                    color: "#5a5a5a",
                  }}
                >
                  What we are looking for :
                </div>
                <div
                  style={{
                    marginTop: 4,
                    paddingLeft: 16,
                    fontSize: 16,
                    color: "#2d2a26",
                  }}
                >
                  {qualification}
                </div>
              </div>

              <div
                style={{
                  marginTop: 32,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    fontSize: 14,
                    fontStyle: "italic",
                    color: "#5a5a5a",
                  }}
                >
                  What is the work about :
                </div>
                <div
                  style={{
                    marginTop: 4,
                    paddingLeft: 16,
                    fontSize: 16,
                    color: "#2d2a26",
                  }}
                >
                  {workAbout}
                </div>
              </div>

              <div
                style={{
                  marginTop: 40,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{ fontSize: 18, fontWeight: 600, color: "#3a3a3a" }}
                >
                  Compensation and Benefits
                </div>
                <div
                  style={{
                    marginTop: 12,
                    fontSize: 14,
                    fontStyle: "italic",
                    color: "#5a5a5a",
                  }}
                >
                  Starting :
                </div>
                <div
                  style={{
                    marginTop: 2,
                    paddingLeft: 16,
                    fontSize: 22,
                    fontWeight: 700,
                    color: "#2d2a26",
                  }}
                >
                  {startingRate}
                </div>
                <div
                  style={{
                    marginTop: 10,
                    fontSize: 14,
                    fontStyle: "italic",
                    color: "#5a5a5a",
                  }}
                >
                  Regular :
                </div>
                <div
                  style={{
                    marginTop: 2,
                    paddingLeft: 16,
                    fontSize: 22,
                    fontWeight: 700,
                    color: "#2d2a26",
                  }}
                >
                  {regularRate}
                </div>
              </div>

              <div
                style={{
                  marginTop: 24,
                  width: 560,
                  fontSize: 10,
                  lineHeight: 1.5,
                  color: "#6b6b6b",
                }}
              >
                Rates already reflect a performance-and-integrity allocation
                that may be given in full when work is carried out responsibly
              </div>
            </div>
          )}

          <div
            style={{
              marginTop: "auto",
              paddingTop: 16,
              borderTop: "1px solid #c9b88f",
              display: "flex",
              alignItems: "flex-end",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 80,
                height: 80,
                border: "1px solid #2d2a26",
                backgroundColor: "#fff",
                fontSize: 10,
                color: "#2d2a26",
                marginRight: 12,
              }}
            >
              {qrCodeUrl ? (
                <img
                  src={qrCodeUrl}
                  alt=""
                  width={78}
                  height={78}
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
                fontSize: 10,
                color: "#2d2a26",
                lineHeight: 1.3,
              }}
            >
              <div style={{ fontWeight: 700 }}>
                Please send your documents at:
              </div>
              <div style={{ marginTop: 2 }}>{`${companyName} ${companyAddress}`}</div>
              <div style={{ marginTop: 2 }}>{companyPhone}</div>
            </div>
          </div>
        </div>
      ),
      { width: 794, height: 1123 },
    );
  } catch (err) {
    return new Response(
      `Image route failed: ${err instanceof Error ? err.message : String(err)}\n${err instanceof Error ? err.stack : ""}`,
      { status: 500, headers: { "Content-Type": "text/plain" } },
    );
  }
}
