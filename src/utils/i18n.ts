import { container } from '@sapphire/framework';

import type { InternationalizationOptions } from '@sapphire/plugin-i18next';

export const fetchLanguage: InternationalizationOptions['fetchLanguage'] = context => {
  const locale = context.interactionLocale ?? context.guild?.preferredLocale;

  if (!locale || !container.i18n.languages.has(locale)) {
    return container.i18n.options.defaultName ?? 'en-US';
  }

  return locale;
};

export const formatI18n = (...args: Parameters<typeof container.i18n.format>): string => (
  container.i18n.format(...args)
);
