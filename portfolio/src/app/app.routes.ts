import { Routes } from '@angular/router';
import { LanguageRedirectComponent } from './core/language-redirect.component';

const localizedRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    data: { titleKey: 'home.hero.title' },
    loadComponent: () =>
      import('./features/localized-page.component').then(
        ({ LocalizedPageComponent }) => LocalizedPageComponent,
      ),
  },
  {
    path: 'projects',
    data: { titleKey: 'pages.projects.title' },
    loadComponent: () =>
      import('./features/localized-page.component').then(
        ({ LocalizedPageComponent }) => LocalizedPageComponent,
      ),
  },
  {
    path: 'about',
    data: { titleKey: 'pages.about.title' },
    loadComponent: () =>
      import('./features/localized-page.component').then(
        ({ LocalizedPageComponent }) => LocalizedPageComponent,
      ),
  },
  {
    path: '**',
    data: {
      titleKey: 'notFound.title',
      messageKey: 'notFound.message',
    },
    loadComponent: () =>
      import('./features/localized-page.component').then(
        ({ LocalizedPageComponent }) => LocalizedPageComponent,
      ),
  },
];

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: LanguageRedirectComponent,
  },
  { path: 'en', children: localizedRoutes },
  { path: 'fr', children: localizedRoutes },
  {
    path: '**',
    data: {
      titleKey: 'notFound.title',
      messageKey: 'notFound.message',
    },
    loadComponent: () =>
      import('./features/localized-page.component').then(
        ({ LocalizedPageComponent }) => LocalizedPageComponent,
      ),
  },
];
