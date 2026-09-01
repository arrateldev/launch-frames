'use client';

import Link from 'next/link';
import { Suspense, useState, type ReactNode } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { Home, LogOut, Menu, X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { signOut } from '@/app/(login)/actions';
import {
  localizeLegalPath,
  localizePath,
  replaceLocaleInPathname,
  type Locale
} from '@/lib/i18n/config';
import { getMessages } from '@/lib/i18n/messages';
import { AppLogo } from '@/components/app-logo';
import { socialIcons } from '@/components/social-icons';
import { getPublicSocialLinks, siteConfig } from '@/lib/site-config';

type SiteChromeFeatures = {
  auth: boolean;
  dashboard: boolean;
  pricing: boolean;
};

export function SiteChrome({
  children,
  locale,
  user,
  features
}: {
  children: ReactNode;
  locale: Locale;
  user: {
    name: string | null;
    email: string;
  } | null;
  features: SiteChromeFeatures;
}) {
  const t = getMessages(locale);
  const socialLinks = getPublicSocialLinks();

  return (
    <section className="flex min-h-screen flex-col">
      <Header locale={locale} user={user} features={features} />
      <main className="flex-1 pt-[73px]">{children}</main>
      <footer className="border-t border-border/70 bg-slate-950 text-slate-300">
        <div className="section-shell grid gap-8 py-12 lg:grid-cols-3">
          <div>
            <div className="flex items-center">
              <AppLogo className="h-5 w-5" />
              <span className="ml-2 text-base font-semibold text-white">
                {siteConfig.product.name}
              </span>
            </div>
            <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              {siteConfig.product.makerLabel}
            </p>
            <p className="mt-3 max-w-sm text-sm leading-7 text-slate-400">
              {t.home.footerDescription}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {socialLinks.map((item) => {
                const SocialIcon = socialIcons[item.icon];

                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    aria-label={item.label}
                    title={item.label}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-800 bg-slate-900/60 text-slate-400 transition-colors hover:border-slate-700 hover:bg-slate-900 hover:text-white"
                  >
                    <SocialIcon className="h-4 w-4" aria-hidden="true" />
                  </Link>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">
              {t.header.navigation}
            </h3>
            <div className="mt-3 flex flex-col gap-2 text-sm text-slate-400">
              <Link
                href={localizePath(locale, '/')}
                className="transition-colors hover:text-white"
              >
                {t.common.home}
              </Link>
              {features.pricing ? (
                <Link
                  href={localizePath(locale, '/pricing')}
                  className="transition-colors hover:text-white"
                >
                  {t.common.pricing}
                </Link>
              ) : null}
              <Link
                href={localizePath(locale, '/studio')}
                className="transition-colors hover:text-white"
              >
                {t.common.studio}
              </Link>
              <Link
                href={localizePath(locale, '/faq')}
                className="transition-colors hover:text-white"
              >
                {t.common.faq}
              </Link>
              <Link
                href={localizePath(locale, '/links')}
                className="transition-colors hover:text-white"
              >
                {t.common.links}
              </Link>
              {user && features.dashboard ? (
                <Link
                  href={localizePath(locale, '/dashboard')}
                  className="transition-colors hover:text-white"
                >
                  {t.common.dashboard}
                </Link>
              ) : null}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">
              {t.common.legal}
            </h3>
            <div className="mt-3 flex flex-col gap-2 text-sm text-slate-400">
              <Link
                href={localizeLegalPath(locale, 'imprint')}
                className="transition-colors hover:text-white"
              >
                {t.home.legalLinks.imprint}
              </Link>
              <Link
                href={localizeLegalPath(locale, 'privacy')}
                className="transition-colors hover:text-white"
              >
                {t.home.legalLinks.privacy}
              </Link>
              <Link
                href={localizeLegalPath(locale, 'terms')}
                className="transition-colors hover:text-white"
              >
                {t.home.legalLinks.terms}
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800/80">
          <div className="section-shell flex flex-col gap-2 py-4 text-sm text-slate-500 md:flex-row md:justify-between">
            <span>
              (c) {new Date().getFullYear()} {siteConfig.product.name}{' '}
              <Link
                href={siteConfig.brand.urls.homepage}
                className="font-medium text-slate-400 transition-colors hover:text-white"
              >
                {siteConfig.product.makerLabel}
              </Link>
              . {t.common.allRightsReserved}
            </span>
          </div>
        </div>
      </footer>
    </section>
  );
}

function Header({
  locale,
  user,
  features
}: {
  locale: Locale;
  user: {
    name: string | null;
    email: string;
  } | null;
  features: SiteChromeFeatures;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);
  const t = getMessages(locale);
  const alternateLocale = locale === 'de' ? 'en' : 'de';
  const query = searchParams.toString();
  const alternateHref = `${replaceLocaleInPathname(
    pathname,
    alternateLocale
  )}${query ? `?${query}` : ''}`;

  const navItems = [
    { href: localizePath(locale, '/'), label: t.common.home },
    { href: localizePath(locale, '/studio'), label: t.common.studio },
    ...(features.pricing
      ? [{ href: localizePath(locale, '/pricing'), label: t.common.pricing }]
      : []),
    { href: localizePath(locale, '/faq'), label: t.common.faq },
    { href: localizePath(locale, '/links'), label: t.common.links },
    ...(user && features.dashboard
      ? [{ href: localizePath(locale, '/dashboard'), label: t.common.dashboard }]
      : [])
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-background">
      <div className="section-shell flex items-center justify-between py-4">
        <Link
          href={localizePath(locale, '/')}
          className="flex items-center text-foreground"
        >
          <AppLogo className="h-6 w-6" priority />
          <span className="font-title ml-2 text-xl font-semibold tracking-normal">
            {siteConfig.product.name}
          </span>
        </Link>

        <nav className="hidden items-center gap-2 rounded-full border border-border/70 bg-background p-1 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                pathname === item.href
                  ? 'bg-secondary text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Button asChild variant="outline" size="sm">
            <Link
              href={alternateHref}
              aria-label={`Switch language to ${alternateLocale.toUpperCase()}`}
            >
              {alternateLocale.toUpperCase()}
            </Link>
          </Button>
          {user && features.dashboard ? (
            <Suspense
              fallback={<div className="h-9 w-24 rounded-full border border-border/70" />}
            >
              <UserMenu locale={locale} user={user} />
            </Suspense>
          ) : !user && features.auth ? (
            <Button asChild variant="ghost" size="sm">
              <Link href={localizePath(locale, '/sign-in')}>{t.header.signIn}</Link>
            </Button>
          ) : null}
        </div>

        <Button
          type="button"
          variant="outline"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileOpen((value) => !value)}
          aria-label={mobileOpen ? t.header.closeMenu : t.header.openMenu}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {mobileOpen ? (
        <div className="border-t border-border/60 bg-background md:hidden">
          <div className="section-shell flex flex-col gap-2 py-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-2xl px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 flex items-center gap-2">
              <Button asChild variant="outline" size="sm">
                <Link href={alternateHref} onClick={() => setMobileOpen(false)}>
                  {alternateLocale.toUpperCase()}
                </Link>
              </Button>
              {user && features.dashboard ? (
                <form action={signOut}>
                  <input type="hidden" name="locale" value={locale} />
                  <Button
                    type="submit"
                    variant="outline"
                    size="sm"
                    onClick={() => setMobileOpen(false)}
                  >
                    <LogOut className="h-4 w-4" />
                    {t.header.signOut}
                  </Button>
                </form>
              ) : !user && features.auth ? (
                <Button asChild variant="outline" size="sm">
                  <Link
                    href={localizePath(locale, '/sign-in')}
                    onClick={() => setMobileOpen(false)}
                  >
                    {t.header.signIn}
                  </Link>
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}

function UserMenu({
  locale,
  user
}: {
  locale: Locale;
  user: {
    name: string | null;
    email: string;
  };
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const t = getMessages(locale);
  const label = user.name || user.email;

  return (
    <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="max-w-44 justify-between">
          <span className="truncate">{label}</span>
          <Home className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="flex flex-col gap-1">
        <DropdownMenuItem className="cursor-pointer">
          <Link
            href={localizePath(locale, '/dashboard')}
            className="flex w-full items-center"
          >
            <Home className="mr-2 h-4 w-4" />
            <span>{t.common.dashboard}</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="p-0">
          <form action={signOut}>
            <input type="hidden" name="locale" value={locale} />
            <Button
              type="submit"
              variant="ghost"
              size="sm"
              className="h-auto w-full justify-start px-2 py-1.5"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>{t.header.signOut}</span>
            </Button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
