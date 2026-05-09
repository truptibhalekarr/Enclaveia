import { Dropzone } from "@/components/upload/dropzone";
import { SiteHeader } from "@/components/site-header";

export default function UploadPage() {
  return (
    <main className="min-h-screen">
      <SiteHeader />
      <section className="px-5 py-16 sm:px-8">
        <div className="mx-auto mb-10 max-w-4xl text-center">
          <p className="text-sm font-semibold uppercase text-wine-500">Upload</p>
          <h1 className="mt-4 font-display text-6xl font-bold text-ink">Start with a dataset</h1>
          <p className="mt-5 text-base leading-7 text-wine-700/78">
            After upload, the data preview page opens automatically with validation and profiling details.
          </p>
        </div>
        <Dropzone />
      </section>
    </main>
  );
}
