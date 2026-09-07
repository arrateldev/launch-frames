import Link from 'next/link';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { defaultLocale, localizePath, type Locale } from '@/lib/i18n/config';
import { getMessages } from '@/lib/i18n/messages';
import { Button } from '@/components/ui/button';
import { LaunchFramesStudio } from '@/features/launchframes-studio/studio';

export default function HomePage({
  locale = defaultLocale
}: {
  locale?: Locale;
}) {
  const t = getMessages(locale);

  return (
    <main className="h-[calc(100vh-4rem)] snap-y snap-mandatory overflow-y-auto scroll-smooth bg-background text-foreground">
      <section className="page-aura-surface snap-start border-b border-border/60">
        <div className="section-shell py-10 sm:py-12">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              {t.home.heroEyebrow}
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              {t.home.heroTitle}
              <span className="mt-2 block text-primary">{t.home.heroAccent}</span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              {t.home.heroDescription}
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <a href="#studio">
                  {t.home.deployCta}
                  <ArrowDown className="h-4 w-4" />
                </a>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href={localizePath(locale, '/faq')}>
                  {t.common.faq}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div id="studio" className="snap-start">
        <LaunchFramesStudio locale={locale} />
      </div>
    </main>
  );
}
