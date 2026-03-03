/**
 * Base theme configuration — engine defaults.
 * This file flows normally from main via merges.
 * Do NOT put project-specific values here — use theme.config.ts instead.
 */
export interface ThemeConfig {
  title: string;
  lang: string;
  brand: string;
  brandAccent: string;
  storageKey: string;
  logo?: { src: string; alt: string };
}

const base: ThemeConfig = {
  title: 'Presentation',
  lang: 'en',
  brand: 'Brand',
  brandAccent: 'Product',
  storageKey: 'pd-theme',
  logo: { src: '/logo.svg', alt: 'Logo' },
};

export default base;
