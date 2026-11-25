import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { ThemeService } from '../core/theme.service';

@Component({
  selector: 'app-theme-toggle',
  imports: [TranslocoPipe],
  templateUrl: './theme-toggle.component.html',
  styleUrl: './theme-toggle.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeToggleComponent {
  private readonly themeService = inject(ThemeService);

  protected readonly isDark = this.themeService.theme;
  protected readonly label = computed(() =>
    this.themeService.theme() === 'dark' ? 'theme.switchToLight' : 'theme.switchToDark',
  );

  protected toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
