import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { SITE_CONFIG } from '../site.config';

@Component({
  selector: 'app-site-footer',
  imports: [TranslocoPipe],
  templateUrl: './site-footer.component.html',
  styleUrl: './site-footer.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SiteFooterComponent {
  protected readonly site = SITE_CONFIG;
  protected readonly year = new Date().getFullYear();
}
