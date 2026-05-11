import {
  HiringPoster,
  type PosterVariant,
} from "@/domain/auto-hiring/components/hiring-poster";

const VARIANTS: ReadonlySet<PosterVariant> = new Set([
  "cover",
  "admin",
  "ck",
  "field",
]);

function first(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

function parseVariant(value: string | undefined): PosterVariant {
  if (value && (VARIANTS as Set<string>).has(value)) {
    return value as PosterVariant;
  }
  return "admin";
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;

  return (
    <main className="flex min-h-full justify-center bg-[#e9ddc4] p-6">
      <HiringPoster
        variant={parseVariant(first(params.template))}
        positionName={first(params.position)}
        qualification={first(params.qualification)}
        workAbout={first(params.work_about)}
        startingRate={first(params.starting)}
        regularRate={first(params.regular)}
        companyName={first(params.company_name)}
        companyAddress={first(params.company_address)}
        companyPhone={first(params.company_phone)}
        qrCodeUrl={first(params.qr)}
      />
    </main>
  );
}
