export interface SiteConfig {
  ownerName: string;
  role: { en: string; fr: string };
  siteUrl: string;
  email: string;
  github: string;
  linkedin: string;
  cvPath: { en: string; fr: string };
  demoBaseUrl?: string;
}

export const SITE_CONFIG: SiteConfig = {
  ownerName: 'Raphael Fernandes',
  role: {
    en: 'Software Developer',
    fr: 'Développeur de Logiciels',
  },
  siteUrl: 'https://raphaelfernandes.dev',
  email: 'raphael.fernandes.eng@gmail.com',
  github: 'https://github.com/iraphaelfernandes/portfolio',
  linkedin: 'https://www.linkedin.com/in/iraphaelfernandes',
  cvPath: {
    en: '/assets/cv/cv-en.pdf',
    fr: '/assets/cv/cv-fr.pdf',
  },
};
