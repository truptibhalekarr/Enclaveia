import Link from "next/link";
import { UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="no-print sticky top-0 z-40 border-b border-white/38 bg-blush-200/72 backdrop-blur-xl">
      <div className="mx-auto flex h-24 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link href="/" className="flex items-center text-wine-700">
          <img
            src="/enclaveia-logo.png"
            alt="Enclaveia"
            className="h-16 w-auto object-contain object-left drop-shadow-sm md:h-20"
          />
        </Link>

        <nav className="hidden items-center gap-3 md:flex">
          <Button asChild variant="ghost">
            <Link href="/">Home</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/about">About</Link>
          </Button>
          <Button asChild>
            <Link href="/upload">
              <UploadCloud className="h-4 w-4" aria-hidden />
              Upload
            </Link>
          </Button>
        </nav>

        <Button asChild className="md:hidden" size="sm">
          <Link href="/upload">
            <UploadCloud className="h-4 w-4" aria-hidden />
            Upload
          </Link>
        </Button>
      </div>
    </header>
  );
}
