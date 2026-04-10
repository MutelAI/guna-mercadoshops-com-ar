import { Component, inject } from '@angular/core';
import { I18nService } from '../services/i18n.service';
import { BusinessDataService } from '../services/business-data.service';

/**
 * About Variant I — "Split Columns"
 * Two equal columns: description left, stats grid right.
 */
@Component({
  selector: 'app-about',
  standalone: true,
  template: `
    <style>
      .split-left {
        opacity: 0;
        transform: translateX(-30px);
        animation: splitSlideLeft 0.7s ease forwards;
      }
      .split-right {
        opacity: 0;
        transform: translateX(30px);
        animation: splitSlideRight 0.7s ease 0.2s forwards;
      }
      @keyframes splitSlideLeft {
        to { opacity: 1; transform: translateX(0); }
      }
      @keyframes splitSlideRight {
        to { opacity: 1; transform: translateX(0); }
      }
      .split-stat-card {
        transition: transform 0.3s ease, box-shadow 0.3s ease;
      }
      .split-stat-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 24px rgba(0,0,0,0.08);
      }
      .split-accent-line {
        width: 4px;
        height: 40px;
        background: linear-gradient(to bottom, #3b82f6, #0ea5e9);
        border-radius: 2px;
      }
      .split-dot-grid {
        position: absolute;
        opacity: 0.04;
        background-image: radial-gradient(circle, #3b82f6 1px, transparent 1px);
        background-size: 20px 20px;
        inset: 0;
      }
    </style>
    <section id="about" class="py-20 bg-white relative" [attr.dir]="i18n.dir()">
      <div class="split-dot-grid"></div>
      <div class="max-w-6xl mx-auto px-6 relative z-10">
        <!-- Heading -->
        <div class="flex items-center gap-4 mb-14" data-animate>
          <div class="split-accent-line"></div>
          <div>
            <h2 class="text-4xl font-black text-gray-900">
              {{ i18n.t()('about_title') }}
            </h2>
            <p class="text-gray-400 text-sm mt-1">{{ i18n.t()('about_rating_label') }} · {{ i18n.t()('about_reviews_label') }}</p>
          </div>
        </div>

        <!-- Two columns -->
        <div class="grid md:grid-cols-2 gap-12 items-start">
          <!-- Left: description -->
          <div class="split-left" data-animate>
            <div class="text-6xl mb-6">{{ biz.business()?.logo_emoji || '🏢' }}</div>
            <p class="text-gray-600 text-lg leading-relaxed mb-8">
              {{ i18n.t()('about_desc') }}
            </p>

            <!-- Hours -->
            @if (biz.hours().length) {
              <div class="bg-gray-50 rounded-2xl p-6" data-animate>
                <h3 class="font-bold text-gray-800 mb-4 flex items-center gap-2 text-sm">
                  🕐 {{ i18n.t()('hours_title') }}
                </h3>
                <div class="space-y-2 text-sm">
                  @for (h of biz.hours(); track h.day_key) {
                    <div class="flex justify-between">
                      <span class="font-medium text-gray-600">{{ i18n.isPrimary() ? h.day_he : h.day_en }}</span>
                      <span [class]="h.is_open ? 'text-green-600 font-semibold' : 'text-red-400'">
                        {{ i18n.isPrimary() ? h.hours_he : h.hours_en }}
                      </span>
                    </div>
                  }
                </div>
              </div>
            }
          </div>

          <!-- Right: stats grid -->
          <div class="split-right grid grid-cols-2 gap-5" data-animate>
            <div class="split-stat-card bg-blue-50 rounded-2xl p-6 text-center">
              <div class="text-4xl font-black text-blue-700 mb-2">⭐ {{ biz.business()?.rating }}</div>
              <p class="text-blue-600 text-sm">{{ i18n.t()('about_rating_label') }}</p>
            </div>

            <div class="split-stat-card bg-sky-50 rounded-2xl p-6 text-center">
              <div class="text-4xl font-black text-sky-700 mb-2">{{ biz.business()?.reviews_count }}+</div>
              <p class="text-sky-600 text-sm">{{ i18n.t()('about_reviews_label') }}</p>
            </div>

            <div class="split-stat-card bg-blue-600 rounded-2xl p-6 text-center text-white">
              <div class="text-3xl font-black mb-2">🏆 {{ i18n.t()('about_years_value') }}</div>
              <p class="text-white/70 text-sm">{{ i18n.t()('about_years_label') }}</p>
            </div>

            <div class="split-stat-card bg-green-50 rounded-2xl p-6 text-center">
              <div class="text-3xl font-black text-green-700 mb-2">⚡ 24/7</div>
              <p class="text-green-600 text-sm">{{ i18n.t()('about_available_label') }}</p>
            </div>

            <!-- Wide bottom card -->
            <div class="split-stat-card col-span-2 bg-gradient-to-r from-blue-600 to-sky-500 rounded-2xl p-6 text-white flex items-center justify-between">
              <div>
                <div class="text-xl font-bold">{{ i18n.t()('about_title') }}</div>
                <p class="text-white/80 text-sm mt-1">{{ i18n.t()('about_desc').slice(0, 60) }}…</p>
              </div>
              <div class="text-4xl">{{ biz.business()?.logo_emoji || '🏢' }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class AboutComponent {
  protected i18n = inject(I18nService);
  protected biz = inject(BusinessDataService);
}
