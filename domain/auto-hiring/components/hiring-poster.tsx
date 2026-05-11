import Image from "next/image";

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

const DEFAULTS = {
  companyName: "Chiu Kim Enterprises Inc.",
  companyAddress: "Bldg, Osmeña St., Zone I, City of Koronadal",
  companyPhone: "63 963 630 8117",
} as const;

export function HiringPoster({
  variant = "admin",
  positionName = "Position Name",
  qualification = "Qualification",
  workAbout = "Qualification",
  startingRate = "Starting",
  regularRate = "Regular",
  companyName = DEFAULTS.companyName,
  companyAddress = DEFAULTS.companyAddress,
  companyPhone = DEFAULTS.companyPhone,
  qrCodeUrl,
}: HiringPosterProps) {
  if (variant === "cover") {
    return <CoverPoster />;
  }

  return (
    <article
      className="relative mx-auto flex w-[794px] max-w-full flex-col bg-[#f3e8cf] bg-cover bg-center bg-no-repeat px-14 py-10 font-serif text-[#2d2a26] shadow-xl"
      style={{
        aspectRatio: "210 / 297",
        backgroundImage: "url('/bg-hiring.png')",
      }}
    >
      <PosterHeader />

      <h1 className="mt-10 text-[64px] font-bold leading-none tracking-tight text-[#3a3a3a]">
        {positionName}
      </h1>

      <section className="mt-10 space-y-1">
        <p className="text-[14px] italic text-[#5a5a5a]">
          What we are looking for :
        </p>
        <p className="pl-4 text-[16px] text-[#2d2a26] whitespace-pre-line">
          {qualification}
        </p>
      </section>

      <section className="mt-10 space-y-1">
        <p className="text-[14px] italic text-[#5a5a5a]">
          What is the work about :
        </p>
        <p className="pl-4 text-[16px] text-[#2d2a26] whitespace-pre-line">
          {workAbout}
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-[18px] font-semibold text-[#3a3a3a]">
          Compensation and Benefits
        </h2>
        <dl className="mt-4 space-y-3">
          <div>
            <dt className="text-[14px] italic text-[#5a5a5a]">Starting :</dt>
            <dd className="pl-4 text-[22px] font-bold text-[#2d2a26]">
              {startingRate}
            </dd>
          </div>
          <div>
            <dt className="text-[14px] italic text-[#5a5a5a]">Regular :</dt>
            <dd className="pl-4 text-[22px] font-bold text-[#2d2a26]">
              {regularRate}
            </dd>
          </div>
        </dl>
        <p className="mt-6 max-w-[80%] text-[10px] leading-relaxed text-[#6b6b6b]">
          Rates already reflect a performance-and-integrity allocation that may
          be given in full when work is carried out responsibly
        </p>
      </section>

      <hr className="my-6 border-[#c9b88f]" />

      <PosterFooter
        companyName={companyName}
        companyAddress={companyAddress}
        companyPhone={companyPhone}
        qrCodeUrl={qrCodeUrl}
      />
    </article>
  );
}

function CoverPoster() {
  return (
    <article
      className="relative mx-auto flex w-[794px] max-w-full flex-col items-center justify-center bg-[#f3e8cf] bg-cover bg-center bg-no-repeat px-14 py-16 font-serif text-[#2d2a26] shadow-xl"
      style={{
        aspectRatio: "210 / 297",
        backgroundImage: "url('/bg-hiring.png')",
      }}
    >
      <PosterHeader />

      <div className="mt-24 flex flex-1 flex-col items-center justify-center text-center">
        <p className="text-[20px] tracking-[0.3em] text-[#8a6a3b] uppercase">
          We&apos;re Hiring
        </p>
        <h1 className="mt-6 text-[80px] font-bold leading-none tracking-tight text-[#3a3a3a]">
          Join Our Team
        </h1>
        <p className="mt-8 max-w-md text-[16px] italic text-[#5a5a5a]">
          Build meaningful spaces for families and generations to come.
        </p>
      </div>

      <PosterFooter
        companyName={DEFAULTS.companyName}
        companyAddress={DEFAULTS.companyAddress}
        companyPhone={DEFAULTS.companyPhone}
      />
    </article>
  );
}

function PosterHeader() {
  return (
    <header className="flex justify-center">
      <Image
        src="/logo-black.png"
        alt="Renaissance Park and Chapels"
        width={1500}
        height={450}
        priority
        className="h-auto w-48 object-contain mix-blend-multiply"
      />
    </header>
  );
}

type PosterFooterProps = {
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  qrCodeUrl?: string;
};

function PosterFooter({
  companyName,
  companyAddress,
  companyPhone,
  qrCodeUrl,
}: PosterFooterProps) {
  return (
    <footer className="flex items-end gap-4">
      <div className="flex h-20 w-20 shrink-0 items-center justify-center border border-[#2d2a26] bg-white">
        {qrCodeUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={qrCodeUrl}
            alt="QR code"
            className="h-full w-full object-contain"
          />
        ) : (
          <span className="text-[8px] text-[#2d2a26]">QR</span>
        )}
      </div>
      <div className="flex flex-col gap-1 text-[10px] leading-snug text-[#2d2a26]">
        <p className="font-semibold">Please send your documents at:</p>
        <p>
          {companyName} {companyAddress}
        </p>
        <p>{companyPhone}</p>
      </div>
    </footer>
  );
}
