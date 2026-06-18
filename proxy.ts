import { NextResponse, type NextRequest } from "next/server";

// NOTE (demo): This file originally redirected every request to a URL-prefixed
// locale path (/en, /ar, …). That scheme was scaffolding — no `app/[locale]/`
// routes were ever built against it, so it 307'd the whole site into a 404.
//
// The shipped app uses COOKIE-BASED locale instead: the LanguageSwitcher writes
// a `sanad_locale` cookie, and the root layout reads it (lib/i18n/locale.ts) to
// choose the dictionary and document direction (RTL for Arabic). Routes are not
// locale-prefixed.
//
// This proxy is therefore a pass-through. If you later prefer SEO-friendly
// URL-prefixed i18n, restore the redirect logic AND move the pages under
// `app/[locale]/`, then switch the layout/switcher to read the path segment.
export function proxy(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
