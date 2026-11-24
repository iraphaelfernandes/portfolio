import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';

export type Theme = 'dark' | 'light';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly currentTheme = signal<Theme>(this.readInitialTheme());

  readonly theme = this.currentTheme.asReadonly();

  constructor() {
    this.applyTheme(this.currentTheme());
  }

  toggleTheme(): void {
    this.setTheme(this.currentTheme() === 'dark' ? 'light' : 'dark');
  }

  setTheme(theme: Theme): void {
    this.currentTheme.set(theme);
    this.applyTheme(theme);

    if (!this.isBrowser) {
      return;
    }

    try {
      this.document.defaultView?.localStorage.setItem('theme', theme);
    } catch {
      // The selected theme remains applied for this page when storage is unavailable.
    }
  }

  private readInitialTheme(): Theme {
    if (!this.isBrowser) {
      return 'dark';
    }

    try {
      const savedTheme = this.document.defaultView?.localStorage.getItem('theme');
      if (savedTheme === 'dark' || savedTheme === 'light') {
        return savedTheme;
      }
    } catch {
      // Continue with the pre-paint attribute or system preference when storage is unavailable.
    }

    const prePaintTheme = this.document.documentElement?.getAttribute('data-theme');
    if (prePaintTheme === 'dark' || prePaintTheme === 'light') {
      return prePaintTheme;
    }

    return this.document.defaultView?.matchMedia?.('(prefers-color-scheme: dark)')?.matches
      ? 'dark'
      : 'light';
  }

  private applyTheme(theme: Theme): void {
    this.document.documentElement?.setAttribute('data-theme', theme);
  }
}
