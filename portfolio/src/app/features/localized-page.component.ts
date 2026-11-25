import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-localized-page',
  imports: [TranslocoPipe],
  template: `
    <h1>{{ titleKey() | transloco }}</h1>
    @if (messageKey()) {
      <p>{{ messageKey()! | transloco }}</p>
    }
  `,
  styles: `
    :host {
      display: block;
    }

    h1 {
      margin: 0;
      font-size: clamp(1.75rem, 5vw, 2.5rem);
      font-weight: 500;
    }

    p {
      margin-block: 1rem 0;
      color: var(--muted);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocalizedPageComponent {
  readonly titleKey = input.required<string>();
  readonly messageKey = input<string | null>(null);
}
