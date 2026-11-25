import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import english from '../../assets/i18n/en.json';
import french from '../../assets/i18n/fr.json';

function translationKeys(value: object, prefix = ''): string[] {
  return Object.entries(value).flatMap(([key, child]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return typeof child === 'object' && child !== null ? translationKeys(child, path) : [path];
  });
}

function appSources(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      return appSources(path);
    }

    return /\.(html|ts)$/.test(entry.name) ? [path] : [];
  });
}

describe('translation files', () => {
  it('contain matching keys in English and French', () => {
    expect(translationKeys(english).sort()).toEqual(translationKeys(french).sort());
  });

  it('define every namespaced translation key referenced by app code', () => {
    const availableKeys = new Set(translationKeys(english));
    const referencedKeys = new Set(
      appSources('src/app').flatMap((path) => {
        const source = readFileSync(path, 'utf8');
        const pattern = path.endsWith('.html')
          ? /['"]([a-z][A-Za-z0-9]*(?:\.[A-Za-z][A-Za-z0-9]*)+)['"]\s*\|\s*transloco/g
          : /['"]([a-z][A-Za-z0-9]*(?:\.[A-Za-z][A-Za-z0-9]*)+)['"]/g;
        return [...source.matchAll(pattern)].map(([, key]) => key);
      }),
    );

    expect([...referencedKeys].filter((key) => !availableKeys.has(key)).sort()).toEqual([]);
  });
});
