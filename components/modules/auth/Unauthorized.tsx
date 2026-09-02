import Link from "next/link";
import { Home, ShieldAlert } from "lucide-react";
import BackButton from "@/components/ui/BackButton";


export default function UnauthorizedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-lg text-center">

        {/* Icon */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
          <ShieldAlert className="h-10 w-10 text-destructive" />
        </div>

        {/* Error Code */}
        <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          Error 403
        </p>

        {/* Heading */}
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
          Access Denied
        </h1>

        {/* Description */}
        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-muted-foreground sm:text-base">
          Sorry, you don&apos;t have permission to access this page.
          Please contact an administrator if you believe this is a mistake.
        </p>

        {/* Buttons */}
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
          >
            <Home className="h-4 w-4" />
            Go to Home
          </Link>

          <BackButton />

        </div>
      </div>
    </main>
  );
}