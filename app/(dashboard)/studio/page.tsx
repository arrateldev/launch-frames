import { LaunchFramesStudio } from '@/features/launchframes-studio/studio';
import { defaultLocale, type Locale } from '@/lib/i18n/config';

export default function StudioPage({
  locale = defaultLocale
}: {
  locale?: Locale;
}) {
  return <LaunchFramesStudio locale={locale} />;
}
