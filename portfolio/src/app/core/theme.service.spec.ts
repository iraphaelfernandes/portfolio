import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  const savedValues = new Map<string, string>();
  const storage = {
    getItem: (key: string) => savedValues.get(key) ?? null,
    setItem: (key: string, value: string) => savedValues.set(key, value),
  };

  beforeEach(() => {
    savedValues.clear();
    Object.defineProperty(document.defaultView, 'localStorage', {
      configurable: true,
      value: storage,
    });
    document.documentElement.dataset['theme'] = '';
  });

  afterEach(() => {
    savedValues.clear();
    document.documentElement.dataset['theme'] = '';
  });

  it('uses the saved theme and applies it to the document', () => {
    storage.setItem('theme', 'light');

    const service = TestBed.inject(ThemeService);

    expect(service.theme()).toBe('light');
    expect(TestBed.inject(DOCUMENT).documentElement.dataset['theme']).toBe('light');
  });

  it('uses the pre-paint theme when there is no saved choice', () => {
    document.documentElement.dataset['theme'] = 'dark';

    const service = TestBed.inject(ThemeService);

    expect(service.theme()).toBe('dark');
  });

  it('updates and persists a theme change', () => {
    const service = TestBed.inject(ThemeService);

    service.setTheme('light');

    expect(service.theme()).toBe('light');
    expect(storage.getItem('theme')).toBe('light');
    expect(document.documentElement.dataset['theme']).toBe('light');
  });
});
