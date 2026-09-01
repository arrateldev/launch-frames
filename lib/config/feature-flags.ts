/**
 * Feature flags for the Arratel SaaS template.
 *
 * Control which features are enabled based on deployment mode
 */

export type DeploymentMode = 'full' | 'minimal';

export const deploymentMode = (process.env.DEPLOYMENT_MODE ||
  'full') as DeploymentMode;

/**
 * Minimal Mode: Only landing page, no auth/stripe/dashboard
 * Perfect for quick ideas and MVPs without external services
 */
export const isMinimalMode = deploymentMode === 'minimal';

/**
 * Feature flags based on deployment mode
 */
export const features = {
  // Authentication & Dashboard
  auth: !isMinimalMode,
  dashboard: !isMinimalMode,
  teamManagement: !isMinimalMode,
  activityLogging: !isMinimalMode,

  // Payments
  pricing: !isMinimalMode,
  stripe: !isMinimalMode,
  billing: !isMinimalMode,
  subscriptions: !isMinimalMode,

  // Database-dependent features
  userProfiles: !isMinimalMode,
  teamInvitations: !isMinimalMode
} as const;

/**
 * Pages that are always available (minimal mode safe)
 */
export const staticPages = [
  '/',
  '/[locale]',
  '/[locale]/faq',
  '/[locale]/studio',
  '/[locale]/imprint',
  '/[locale]/impressum',
  '/[locale]/datenschutz',
  '/[locale]/privacy-policy',
  '/[locale]/terms-of-use',
  '/[locale]/terms'
] as const;
