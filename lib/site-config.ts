import type { Locale } from '@/lib/i18n/config';

type LocalizedText = Record<Locale, string>;

type CompanyAddress = {
  street: string;
  postalCode: string;
  city: string;
  country: LocalizedText;
};

type PrivacyProvider = {
  id: 'hosting' | 'database' | 'payments';
  name: string;
  purpose: LocalizedText;
  location: LocalizedText;
};

export type SocialIconName =
  | 'github'
  | 'linkedin'
  | 'x'
  | 'bluesky'
  | 'instagram'
  | 'tiktok'
  | 'youtube'
  | 'productHunt'
  | 'npm'
  | 'dockerHub'
  | 'reddit';

export type SocialLink = {
  id: SocialIconName;
  label: string;
  href: string;
  icon: SocialIconName;
};

const arratelSocial = [
  {
    id: 'github',
    label: 'GitHub',
    href: 'https://github.com/arrateldev',
    icon: 'github'
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/arrateldev',
    icon: 'linkedin'
  },
  {
    id: 'x',
    label: 'X',
    href: 'https://x.com/arrateldev',
    icon: 'x'
  },
  {
    id: 'bluesky',
    label: 'Bluesky',
    href: 'https://bsky.app/profile/arrateldev.bsky.social',
    icon: 'bluesky'
  },
  {
    id: 'instagram',
    label: 'Instagram',
    href: 'https://www.instagram.com/arrateldev',
    icon: 'instagram'
  },
  {
    id: 'tiktok',
    label: 'TikTok',
    href: 'https://www.tiktok.com/@arrateldev',
    icon: 'tiktok'
  },
  {
    id: 'youtube',
    label: 'YouTube',
    href: 'https://www.youtube.com/@arrateldev',
    icon: 'youtube'
  },
  {
    id: 'productHunt',
    label: 'Product Hunt',
    href: 'https://www.producthunt.com/@arrateldev',
    icon: 'productHunt'
  },
  {
    id: 'npm',
    label: 'npm',
    href: 'https://www.npmjs.com/~arrateldev',
    icon: 'npm'
  },
  {
    id: 'dockerHub',
    label: 'Docker Hub',
    href: 'https://hub.docker.com/u/arrateldev',
    icon: 'dockerHub'
  },
  {
    id: 'reddit',
    label: 'Reddit',
    href: 'https://www.reddit.com/user/arrateldev',
    icon: 'reddit'
  }
] satisfies SocialLink[];

export const siteConfig = {
  brand: {
    name: 'Arratel',
    domain: 'arratel.dev',
    urls: {
      homepage: 'https://arratel.dev'
    },
    contact: {
      email: 'contact@arratel.dev'
    },
    icons: {
      logo: '/favicon.ico'
    },
    claim: {
      de: 'Precision software.',
      en: 'Precision software.'
    },
    social: arratelSocial
  },
  product: {
    name: 'LaunchFrames',
    makerLabel: 'by Arratel',
    contact: {
      email: null as string | null
    },
    urls: {
      defaultBaseUrl: 'https://launchframes.arratel.dev'
    },
    icons: {
      logo: '/favicon.ico',
      favicon: '/favicon.ico',
      appIcon: '/icon.png',
      appleIcon: '/apple-icon.png'
    },
    claim: {
      de: 'Store-ready screenshots in minutes.',
      en: 'Store-ready screenshots in minutes.'
    },
    metadata: {
      title: {
        de: 'LaunchFrames',
        en: 'LaunchFrames'
      },
      description: {
        de: 'Erzeuge professionelle Store- und Social-Marketingbilder aus App-URLs oder Screenshots.',
        en: 'Generate polished store and social marketing assets from app URLs or screenshots.'
      }
    },
    social: null as SocialLink[] | null
  },
  company: {
    legalName: 'Ricardo Valente de Matos',
    representative: null as LocalizedText | null,
    address: null as CompanyAddress | null,
    contact: {
      email: 'contact@arratel.dev',
      phone: null as string | null
    },
    register: null as { court: LocalizedText; number: string } | null,
    vatId: null as string | null
  },
  billing: {
    portalHeadline: 'Manage your subscription'
  },
  privacy: {
    providers: [
      {
        id: 'hosting',
        name: 'Vercel Inc.',
        purpose: {
          de: 'Hosting, Auslieferung der Anwendung, Sicherheit und technische Protokolle',
          en: 'hosting, application delivery, security, and technical logs'
        },
        location: {
          de: 'USA und weitere Standorte, abhängig von der konkreten Bereitstellung',
          en: 'United States and other locations depending on the deployment'
        }
      },
      {
        id: 'payments',
        name: 'Stripe Payments Europe, Ltd. / Stripe, Inc.',
        purpose: {
          de: 'Zahlungsabwicklung, Abonnementverwaltung, Betrugsprävention und Rechnungsprozesse',
          en: 'payment processing, subscription management, fraud prevention, and billing workflows'
        },
        location: {
          de: 'EU, USA und weitere Stripe-Unternehmensstandorte',
          en: 'EU, United States, and other Stripe group locations'
        }
      },
      {
        id: 'database',
        name: 'Externer Postgres-Anbieter',
        purpose: {
          de: 'Speicherung von Account-, Team-, Abonnement- und Aktivitätsdaten',
          en: 'storage of account, team, subscription, and activity data'
        },
        location: {
          de: 'abhängig vom gewählten Datenbankanbieter',
          en: 'depending on the selected database provider'
        }
      }
    ] satisfies PrivacyProvider[],
    retention: {
      accountData:
        'Account- und Teamdaten werden gespeichert, solange das Konto besteht. Nach einer Kontolöschung wird der Account im System als gelöscht markiert und die E-Mail-Adresse zur Wahrung technischer Eindeutigkeit pseudonymisiert.',
      activityLogs:
        'Aktivitätsprotokolle werden für Sicherheits-, Nachweis- und Produktbetriebszwecke gespeichert und regelmäßig überprüft.',
      billingData:
        'Abrechnungs- und steuerrelevante Daten werden entsprechend gesetzlicher Aufbewahrungspflichten gespeichert.'
    }
  }
} as const;

export function getSiteMetadata(locale: Locale) {
  return {
    title: siteConfig.product.metadata.title[locale],
    description: siteConfig.product.metadata.description[locale]
  };
}

export function getBaseUrl() {
  return process.env.BASE_URL || siteConfig.product.urls.defaultBaseUrl;
}

export function getPublicContactEmail() {
  return siteConfig.product.contact.email || siteConfig.brand.contact.email;
}

export function getPublicSocialLinks() {
  return siteConfig.product.social?.length
    ? siteConfig.product.social
    : siteConfig.brand.social;
}
