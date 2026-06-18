import type { Metadata } from "next";
import { Atkinson_Hyperlegible, Figtree, Noto_Sans, Noto_Sans_Arabic } from "next/font/google";
import "./globals.css";
import { getLocale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { dirOf } from "@/lib/i18n/config";
import { I18nProvider } from "@/lib/i18n/provider";
import { Header } from "./_components/Header";
import { Footer } from "./_components/Footer";

// ## [WHAT CAN WE EDIT] Primary UI font: Atkinson Hyperlegible (Braille
// Institute) — designed for low-vision readers; disambiguates I/l/1, O/0.
// Only 400/700 ship; 500/600 fall back to the nearest (browser uses 700 for
// semibold). Noto Sans Arabic still covers Arabic glyphs (see --font-sans).
const atkinson = Atkinson_Hyperlegible({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-atkinson",
  display: "swap",
});
const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
  display: "swap",
});
const notoSans = Noto_Sans({
  subsets: ["latin"],
  variable: "--font-noto-sans",
  display: "swap",
});
const notoArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-noto-arabic",
  display: "swap",
});

export const metadata: Metadata = {
  title: "3zwah — Care, together | UAE caregiver support",
  description:
    "3zwah helps family and domestic caregivers in the UAE: tailored care workshops, trusted services, a smart assistant, and a real person whenever you need one — in your language.",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const dir = dirOf(locale);

  return (
    <html
      lang={locale}
      dir={dir}
      suppressHydrationWarning
      className={`${atkinson.variable} ${figtree.variable} ${notoSans.variable} ${notoArabic.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* Restore the user's saved text-size / contrast before paint (no flash). */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var d=document.documentElement;d.setAttribute('data-text-size',localStorage.getItem('azwa-text-size')||'base');d.setAttribute('data-contrast',localStorage.getItem('azwa-contrast')||'normal');}catch(e){}})();",
          }}
        />
        <I18nProvider locale={locale} dict={dict}>
          <a href="#main" className="skip-link">
            {dict.nav.skipToContent}
          </a>
          <Header />
          <main id="main" className="flex-1 w-full">
            {children}
          </main>
          <Footer />
        </I18nProvider>
      </body>
    </html>
  );
}
