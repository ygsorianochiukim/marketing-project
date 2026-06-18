export type PosterVariant = "cover" | "admin" | "ck" | "field";

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

// Per-template footer defaults. The four templates share one layout and differ
// only by background + location footer. Kept in sync with
// app/auto_hiring/image/route.tsx (the canonical generator n8n calls).
const TEMPLATES: Record<PosterVariant, { bg: string; address: string; phone: string }> = {
  admin: {
    bg: "/bg-hiring-admin.png",
    address: "Bldg, Osmeña St., Zone I, City of Koronadal",
    phone: "+63 963 630 8117",
  },
  field: {
    bg: "/bg-hiring-field.png",
    address: "San Felipe, Tantangan, South Cotabato",
    phone: "+63 922 588 3675",
  },
  ck: {
    bg: "/bg-hiring-ck.png",
    address: "Bldg, Osmeña St., Zone I, City of Koronadal",
    phone: "+63 963 630 8117",
  },
  cover: {
    bg: "/bg-hiring-cover.png",
    address: "Bldg, Osmeña St., Zone I, City of Koronadal",
    phone: "+63 963 630 8117",
  },
};

// Layer the per-template background over the shared statue fallback; if the
// per-template file is absent the browser falls through (no broken image).
function bgLayers(variant: PosterVariant): string {
  return `url('${TEMPLATES[variant].bg}'), url('/bg-hiring.png')`;
}

function lines(value: string): string[] {
  return value.split("\n").filter((l) => l.trim().length);
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

  if (variant === "cover") {
    return <CoverPoster address={address} phone={phone} qrCodeUrl={qrCodeUrl} />;
  }

  return (
    <article
      className="relative mx-auto flex w-[1080px] max-w-full flex-col bg-[#f4ece0] bg-cover bg-center bg-no-repeat px-16 pb-11 pt-14 text-[#2b2b2b] shadow-xl"
      style={{ aspectRatio: "1080 / 1350", backgroundImage: bgLayers(variant) }}
    >
      <PosterHeader />

      <h1 className="mt-7 font-serif text-[88px] font-bold leading-none text-[#2b2b2b]">
        {positionName}
      </h1>

      <p className="mt-6 text-[30px] font-semibold italic text-[#2b2b2b]">
        What we are looking for :
      </p>
      <div className="mt-2 flex flex-col pl-3.5">
        {lines(qualification).map((line, i) => (
          <span key={i} className="text-[22px] leading-snug text-[#2b2b2b]">
            {line}
          </span>
        ))}
      </div>

      <p className="mt-[18px] text-[30px] font-semibold italic text-[#2b2b2b]">
        What is the work about :
      </p>
      <div className="mt-2 flex flex-col pl-3.5">
        {lines(workAbout).map((line, i) => (
          <span key={i} className="text-[26px] leading-snug text-[#2b2b2b]">
            {line}
          </span>
        ))}
      </div>

      <p className="mt-[30px] text-[32px] font-semibold italic text-[#2b2b2b]">
        Compensation and Benefits
      </p>
      <p className="mt-3.5 font-serif text-[28px] font-bold text-[#2b2b2b]">
        Starting :
      </p>
      <p className="mt-0.5 pl-6 font-serif text-[60px] font-bold text-[#2b2b2b]">
        {startingRate}
      </p>
      <p className="mt-3 font-serif text-[28px] font-bold text-[#2b2b2b]">
        Regular :
      </p>
      <p className="mt-0.5 pl-6 font-serif text-[60px] font-bold text-[#2b2b2b]">
        {regularRate}
      </p>

      <p className="mt-[22px] max-w-[760px] text-[16px] leading-snug text-[#6b6b6b]">
        Rates already reflect a performance-and-integrity allocation that may be
        given in full when work is carried out responsibly
      </p>

      <PosterFooter address={address} phone={phone} qrCodeUrl={qrCodeUrl} />
    </article>
  );
}

function CoverPoster({
  address,
  phone,
  qrCodeUrl,
}: {
  address: string;
  phone: string;
  qrCodeUrl?: string;
}) {
  return (
    <article
      className="relative mx-auto flex w-[1080px] max-w-full flex-col bg-[#f4ece0] bg-cover bg-center bg-no-repeat px-16 pb-11 pt-14 text-[#2b2b2b] shadow-xl"
      style={{ aspectRatio: "1080 / 1350", backgroundImage: bgLayers("cover") }}
    >
      <PosterHeader />

      <div className="mt-[150px] flex flex-1 flex-col items-center text-center">
        <p className="text-[26px] tracking-[0.3em] text-[#a8824a] uppercase">
          We&apos;re Hiring
        </p>
        <h1 className="mt-7 font-serif text-[104px] font-bold leading-none text-[#2b2b2b]">
          Join Our Team
        </h1>
        <p className="mt-9 max-w-[640px] text-[22px] italic text-[#6b6b6b]">
          Build meaningful spaces for families and generations to come.
        </p>
      </div>

      <PosterFooter address={address} phone={phone} qrCodeUrl={qrCodeUrl} />
    </article>
  );
}

function PosterHeader() {
  return (
    <header className="flex w-full flex-col items-center rounded-lg border border-[#a8824a]/35 bg-white/20 px-6 py-[18px]">
      <span className="font-serif text-[46px] font-bold tracking-[0.18em] text-[#a8824a]">
        RENAISSANCE
      </span>
      <span className="mt-1 text-[16px] tracking-[0.5em] text-[#6b6b6b]">
        PARK AND CHAPELS
      </span>
    </header>
  );
}

function PosterFooter({
  address,
  phone,
  qrCodeUrl,
}: {
  address: string;
  phone: string;
  qrCodeUrl?: string;
}) {
  return (
    <footer className="mt-auto flex flex-col">
      <hr className="mb-4 border-t-2 border-[#2b2b2b]" />
      <p className="text-[24px] font-semibold text-[#2b2b2b]">
        Please send your documents at:
      </p>
      <div className="mt-2.5 flex items-center">
        <div className="mr-4 flex h-[104px] w-[104px] shrink-0 items-center justify-center bg-white">
          {qrCodeUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={qrCodeUrl}
              alt="QR code"
              className="h-full w-full object-contain"
            />
          ) : (
            <span className="border border-[#2b2b2b] px-3 py-8 text-[12px] text-[#2b2b2b]">
              QR
            </span>
          )}
        </div>
        <div className="flex flex-col text-[18px] leading-snug text-[#2b2b2b]">
          <span>{address}</span>
          <span>{phone}</span>
        </div>
      </div>
    </footer>
  );
}
