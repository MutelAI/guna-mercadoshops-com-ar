import { Component, inject } from '@angular/core';
import { I18nService } from '../services/i18n.service';
import { BusinessDataService } from '../services/business-data.service';

@Component({
  selector: 'app-services',
  standalone: true,
  template: `
    <style>
      .pill-tag {
        display: inline-flex;
        align-items: center;
        gap: 0.75rem;
        padding: 1rem 2rem;
        border-radius: 9999px;
        transition: all 0.35s ease;
        cursor: default;
        position: relative;
        overflow: hidden;
      }
      .pill-tag::before {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(135deg, #3b82f6, #0ea5e9);
        opacity: 0;
        transition: opacity 0.35s ease;
        border-radius: 9999px;
      }
      .pill-tag:hover::before {
        opacity: 1;
      }
      .pill-tag:hover {
        transform: scale(1.05);
        box-shadow: 0 8px 25px rgba(59,130,246,0.3);
        color: white;
      }
      .pill-tag > * {
        position: relative;
        z-index: 1;
      }
      .pill-tooltip {
        position: absolute;
        bottom: 110%;
        left: 50%;
        transform: translateX(-50%) scale(0.9);
        opacity: 0;
        pointer-events: none;
        transition: all 0.3s ease;
        white-space: nowrap;
      }
      .pill-tag:hover .pill-tooltip {
        opacity: 1;
        transform: translateX(-50%) scale(1);
      }
      @keyframes popIn {
        from { opacity: 0; transform: scale(0.6); }
        to { opacity: 1; transform: scale(1); }
      }
      .pop-animate {
        animation: popIn 0.4s ease forwards;
      }
    </style>
    <section id="services" [attr.dir]="i18n.dir()" class="py-20 bg-white">
      <div class="max-w-5xl mx-auto px-4">
        <div class="text-center mb-16" data-animate>
          <h2 class="text-4xl font-bold text-blue-900 mb-4">{{ i18n.t()('services_title') }}</h2>
          <p class="text-lg text-gray-600">{{ i18n.t()('services_subtitle') }}</p>
        </div>
        <div class="flex flex-wrap justify-center gap-4">
          @for (svc of biz.services(); track svc.id) {
            <div class="pill-tag bg-sky-50 border-2 border-blue-200 text-blue-800 pop-animate" data-animate>
              <span class="text-2xl">{{ svc.icon }}</span>
              <span class="font-semibold text-lg">
                {{ i18n.isPrimary() ? svc.title_he : svc.title_en }}
              </span>
              <div class="pill-tooltip bg-gray-800 text-white text-xs rounded-lg px-3 py-2 shadow-lg">
                {{ i18n.isPrimary() ? svc.desc_he : svc.desc_en }}
              </div>
            </div>
          }
        </div>
        <div class="text-center mt-14" data-animate>
          <a href="#contact" (click)="scrollTo($event)"
             class="inline-block bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors shadow-md">
            {{ i18n.t()('services_cta') }}
          </a>
        </div>
      </div>
    </section>
  `
})
export class ServicesComponent {
  protected i18n = inject(I18nService);
  protected biz = inject(BusinessDataService);

  scrollTo(e: Event) {
    e.preventDefault();
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  }
}
