/**
 * Project theme configuration — overrides base with project-specific values.
 * Protected by merge=ours in .gitattributes — engine updates won't overwrite.
 *
 * Customize this file for your project. Available fields: see ThemeConfig.
 */
import base, { type ThemeConfig } from './theme.config.base';

const theme: ThemeConfig = {
  ...base,
  title: 'TIMining CORE — Inteligencia Multimodal',
  lang: 'es',
  brand: 'TIMining',
  brandAccent: 'CORE',
  logo: { src: '/logo_idemax.png', alt: 'IDEMAX' },
};

export default theme;
