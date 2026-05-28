import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#FFF8E8] text-slate-900">

      {/* Top Bar */}
      <header className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="text-4xl font-semibold tracking-tight text-[#5A3B2A]">
          Dev Catalyst
        </h1>

        <div className="mt-3 h-1 w-54 rounded-full bg-[#5A3B2A]" />

        <p className="mt-3 text-slate-600 text-lg">
          Fast, secure developer tools. Everything stays local.
        </p>
      </header>

      {/* Content */}
      <section className="mx-auto max-w-5xl px-6">

        {/* Blog Section (placeholder like your WordPress blog vibe) */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-4 text-[#5A3B2A]">
            Latest Posts
          </h2>

          <div className="space-y-3 text-slate-700">

            <div className="rounded-2xl bg-[#FFFDF8] shadow-sm border border-orange-100 p-6 hover:shadow-md transition">
              <p className="font-medium">
                🚀 Building developer tools from scratch
              </p>
              <p className="text-sm text-slate-500">
                My journey of creating simple dev utilities...
              </p>
            </div>

            <div className="rounded-2xl bg-[#FFFDF8] shadow-sm border border-orange-100 p-6 hover:shadow-md transition">
              <p className="font-medium">
                ⚙️ Why I built this dev tools utility?
              </p>
              <p className="text-sm text-slate-500">
                A breakdown of schema-driven mock data...
              </p>
            </div>

          </div>
        </div>

        {/* Tools Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-[#5A3B2A]">
            Developer Tools
          </h2>

          <div className="grid gap-4 md:grid-cols-2">

            <Link
              href="/json-formatter"
              className="rounded-2xl bg-[#FFFDF8] shadow-sm border border-orange-100 p-6 hover:shadow-md transition"
            >
              <h3 className="text-lg font-semibold text-[#5A3B2A]">
                JSON Formatter
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Format, validate and minify JSON instantly.
              </p>
            </Link>

            <Link
              href="/json-schema-to-sample"
              className="rounded-2xl bg-[#FFFDF8] shadow-sm border border-orange-100 p-6 hover:shadow-md transition"
            >
              <h3 className="text-lg font-semibold text-[#5A3B2A]">
                Schema → JSON
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Generate realistic mock JSON from schema.
              </p>
            </Link>

            <Link
              href="/base64"
              className="rounded-2xl bg-[#FFFDF8] shadow-sm border border-orange-100 p-6 hover:shadow-md transition"
            >
              <h3 className="text-lg font-semibold text-[#5A3B2A]">
                Base64 Encoder / Decoder
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Encode and decode Base64 instantly.
              </p>
            </Link>

            <Link
              href="/jwt-decoder"
              className="rounded-2xl bg-[#FFFDF8] shadow-sm border border-orange-100 p-6 hover:shadow-md transition"
            >
              <h3 className="text-lg font-semibold text-[#5A3B2A]">
                JWT Decoder
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Decode and inspect JSON Web Tokens.
              </p>
            </Link>

            <Link
              href="/difference-checker"
              className="rounded-2xl bg-[#FFFDF8] shadow-sm border border-orange-100 p-6 hover:shadow-md transition"
            >
              <h3 className="text-lg font-semibold text-[#5A3B2A]">
                Diff Checker
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Compare text, code, logs, or configs side by side.
              </p>
            </Link>

            <Link
              href="/pgp-generator"
              className="rounded-2xl bg-[#FFFDF8] border border-orange-100 p-6 shadow-sm hover:shadow-md transition"
            >
              <h3 className="text-lg font-semibold text-[#5A3B2A]">
                PGP Key Generator
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Generate secure PGP public and
                private keys.
              </p>
            </Link>

            <Link
              href="/pdf-splitter"
              className="rounded-2xl bg-[#FFFDF8] border border-orange-100 p-6 shadow-sm hover:shadow-md transition"
            >
              <h3 className="text-lg font-semibold text-[#5A3B2A]">
                PDF Splitter
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Extract pages or split PDFs by ranges.
              </p>
            </Link>

          </div>
        </div>

      </section>

      {/* Footer */}
      <footer className="mx-auto max-w-5xl px-6 py-10 mt-16 text-sm text-slate-500">
        Built with ❤️ by Mousam · Developer Tools + Blog
      </footer>

    </main>
  );
}