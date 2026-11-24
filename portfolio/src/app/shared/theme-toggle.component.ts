import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { Language } from './language';
import { ThemeService } from '../core/theme.service';

@Component({
  selector: 'app-theme-toggle',
  templateUrl: './theme-toggle.component.html',
  styleUrl: './theme-toggle.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeToggleComponent {
  private readonly themeService = inject(ThemeService);

  readonly language = input<Language>('en');
  protected readonly isDark = this.themeService.theme;
  protected readonly label = computed(() => {
    if (this.language() === 'fr') {
      return this.themeService.theme() === 'dark'
        ? 'Passer au thème clair'
        : 'Passer au thème sombre';
    }

    return this.themeService.theme() === 'dark' ? 'Switch to light theme' : 'Switch to dark theme';
  });

  protected toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
