import { A11yModule } from '@angular/cdk/a11y';
import { CdkConnectedOverlay, CdkOverlayOrigin, ConnectedPosition } from '@angular/cdk/overlay';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  input,
  output,
  signal,
  ViewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { SITE_CONFIG } from '../site.config';
import { Language } from './language';
import { LanguageToggleComponent } from './language-toggle.component';
import { ThemeToggleComponent } from './theme-toggle.component';

@Component({
  selector: 'app-site-header',
  imports: [
    A11yModule,
    CdkConnectedOverlay,
    CdkOverlayOrigin,
    LanguageToggleComponent,
    RouterLink,
    ThemeToggleComponent,
    TranslocoPipe,
  ],
  templateUrl: './site-header.component.html',
  styleUrl: './site-header.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SiteHeaderComponent {
  protected readonly site = SITE_CONFIG;
  protected readonly menuOpen = signal(false);
  protected readonly mobileMenuPositions: ConnectedPosition[] = [
    { originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'top', offsetY: 8 },
  ];

  readonly language = input<Language>('en');
  readonly languageChange = output<Language>();

  @ViewChild('menuButton') private menuButton?: ElementRef<HTMLButtonElement>;

  protected selectLanguage(language: Language): void {
    this.languageChange.emit(language);
  }

  protected toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
    this.menuButton?.nativeElement.focus();
  }
}
