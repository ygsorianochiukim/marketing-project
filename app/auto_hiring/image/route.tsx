import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const runtime = "nodejs";

async function loadBgDataUrl(): Promise<string | null> {
  try {
    const buf = await readFile(
      join(process.cwd(), "public", "bg-hiring-small.png"),
    );
    return `data:image/png;base64,${buf.toString("base64")}`;
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const template = searchParams.get("template") ?? "admin";
    const isCover = template === "cover";
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
    const bgDataUrl = await loadBgDataUrl();

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
                  color: "#8a6a3b",
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
