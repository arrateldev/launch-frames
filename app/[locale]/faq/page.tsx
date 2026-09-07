import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, CircleHelp, MessageSquareQuote } from 'lucide-react';
import { buildLocalizedMetadata } from '@/lib/i18n/metadata';
import { isLocale, localizePath } from '@/lib/i18n/config';
import { getMessages } from '@/lib/i18n/messages';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) {
    return {};
  }

  const content = getMessages(locale).faq;

  return {
    ...buildLocalizedMetadata(locale, '/faq'),
    title: content.title
  };
}

export default async function FaqPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const t = getMessages(locale).faq;

  return (
    <div className="bg-background">
      <div className="page-aura-surface border-b border-border/60">
        <section className="relative overflow-hidden">
          <div className="mx-auto max-w-7xl px-4 pb-10 pt-16 sm:px-6 sm:pb-12 sm:pt-18 lg:px-8">
            <div className="animate-enter max-w-3xl">
              <div className="flex flex-wrap gap-3">
                <span className="inline-flex items-center rounded-full border border-border/70 bg-background px-3 py-1 text-sm font-medium text-muted-foreground">
                  <CircleHelp className="mr-2 h-4 w-4 text-primary" />
                  {t.badgePrimary}
                </span>
                <span className="inline-flex items-center rounded-full border border-border/70 bg-background px-3 py-1 text-sm font-medium text-muted-foreground">
                  <MessageSquareQuote className="mr-2 h-4 w-4 text-primary" />
                  {t.badgeSecondary}
                </span>
              </div>

              <p className="mt-8 text-sm font-semibold uppercase tracking-[0.22em] text-primary">
                {t.eyebrow}
              </p>
              <h1 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                {t.title}
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
                {t.intro}
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 sm:pt-8 lg:px-8">
          <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="animate-enter-delay-1 space-y-6">
              {t.sections.map((section) => (
                <div
                  key={section.title}
                  className="rounded-[28px] border border-border/70 bg-card p-6 shadow-sm"
                >
                  <div className="mb-5 flex items-center justify-between gap-4">
                    <h2 className="text-xl font-semibold text-foreground">
                      {section.title}
                    </h2>
                    <div className="h-px flex-1 bg-gradient-to-r from-border/70 to-transparent" />
                  </div>

                  <div className="space-y-4">
                    {section.items.map((item) => (
                      <details
                        key={item.question}
                        className="group rounded-[20px] border border-border/60 bg-background/70 p-5 transition-colors open:bg-background open:shadow-sm"
                      >
                        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-base font-medium text-foreground">
                          <span>{item.question}</span>
                          <span className="text-xl leading-none text-muted-foreground transition-transform duration-200 group-open:rotate-45">
                            +
                          </span>
                        </summary>
                        <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
                          {item.answer}
                        </p>
                      </details>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <aside className="animate-enter-delay-2 xl:self-start">
              <div className="surface-card p-6">
                <div className="inline-flex rounded-[18px] bg-primary/10 p-3 text-primary">
                  <CircleHelp className="h-5 w-5" />
                </div>
                <h2 className="mt-5 text-2xl font-semibold tracking-tight text-foreground">
                  {t.supportTitle}
                </h2>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  {t.supportBody}
                </p>

                <div className="mt-8 flex flex-col gap-3">
                  <Button asChild size="lg" className="justify-between">
                    <Link href={localizePath(locale, '/studio')}>
                      {t.supportPrimary}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href={localizePath(locale, '/')}>{t.supportSecondary}</Link>
                  </Button>
                </div>
              </div>
            </aside>
          </div>
        </section>
      </div>
    </div>
  );
}
