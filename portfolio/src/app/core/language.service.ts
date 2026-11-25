import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';
import { filter } from 'rxjs';
import { SITE_CONFIG } from '../site.config';
import { Language } from '../shared/language';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly router = inject(Router);
  private readonly transloco = inject(TranslocoService);
  private readonly currentLanguage = signal<Language>(this.detectInitialLanguage());

  readonly language = this.currentLanguage.asReadonly();

  constructor() {
    this.activateLanguage(this.currentLanguage(), false);
    const currentLanguage = this.languageFromUrl(this.router.url);
    if (currentLanguage) {
      this.updateLocaleLinks(this.router.url, currentLanguage);
    }

    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        const language = this.languageFromUrl(event.urlAfterRedirects);
        if (language) {
          this.activateLanguage(language, true);
          this.updateLocaleLinks(event.urlAfterRedirects, language);
        }
      });
  }

  switchLanguage(language: Language): void {
    if (language === this.currentLanguage()) {
      this.activateLanguage(language, true);
      return;
    }

    const localizedPath = this.router.url.replace(/^\/(?:en|fr)(?=\/|$)/, '');
    this.activateLanguage(language, true);
    void this.router.navigateByUrl(`/${language}${localizedPath}`);
  }

  private detectInitialLanguage(): Language {
    if (!this.isBrowser) {
      return 'en';
    }

    const routeLanguage = this.languageFromUrl(this.document.defaultView?.location.pathname ?? '/');
    if (routeLanguage) {
      return routeLanguage;
    }

    try {
      const savedLanguage = this.document.defaultView?.localStorage.getItem('lang');
      if (savedLanguage === 'en' || savedLanguage === 'fr') {
        return savedLanguage;
      }
    } catch {
      // Continue with the browser language when storage is unavailable.
    }

    return this.document.defaultView?.navigator.language.toLowerCase().startsWith('fr')
      ? 'fr'
      : 'en';
  }

  private activateLanguage(language: Language, persist: boolean): void {
    this.currentLanguage.set(language);
    this.transloco.setActiveLang(language);
    this.document.documentElement?.setAttribute('lang', language);

    if (!persist || !this.isBrowser) {
      return;
    }

    try {
      this.document.defaultView?.localStorage.setItem('lang', language);
    } catch {
      // The selected language remains active for this page when storage is unavailable.
    }
  }

  private languageFromUrl(url: string): Language | null {
    const match = /^\/(en|fr)(?:\/|$)/.exec(url);
    return match?.[1] === 'en' || match?.[1] === 'fr' ? match[1] : null;
  }

  private updateLocaleLinks(url: string, language: Language): void {
    const pathname = url.split(/[?#]/, 1)[0] ?? '/';
    const pathWithoutLanguage = pathname.replace(/^\/(?:en|fr)(?=\/|$)/, '');
    const localizedPath = pathWithoutLanguage === '/' ? '' : pathWithoutLanguage;
    const urls: Record<Language, string> = {
      en: `${SITE_CONFIG.siteUrl}/en${localizedPath}`,
      fr: `${SITE_CONFIG.siteUrl}/fr${localizedPath}`,
    };

    this.setLink('canonical', null, urls[language]);
    this.setLink('alternate', 'en', urls.en);
    this.setLink('alternate', 'fr', urls.fr);
    this.setLink('alternate', 'x-default', urls.en);
  }

  private setLink(rel: string, language: string | null, href: string): void {
    const selector = language ? `link[rel="${rel}"][hreflang="${language}"]` : `link[rel="${rel}"]`;
    let link = this.document.head.querySelector<HTMLLinkElement>(selector);
    if (!link) {
      link = this.document.createElement('link');
      link.rel = rel;
      if (language) {
        link.hreflang = language;
      }
      this.document.head.appendChild(link);
    }
    link.href = href;
  }
}
