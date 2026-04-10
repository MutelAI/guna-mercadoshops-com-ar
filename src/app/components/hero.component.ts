import { Component, inject } from '@angular/core';
import { I18nService } from '../services/i18n.service';
import { BusinessDataService } from '../services/business-data.service';

/**
 * Hero Variant F — "Glassmorphism"
 * Dark backdrop with frosted glass card centered. Blurred gradient blobs behind.
 * Clean, modern SaaS-like aesthetic.
 */
@Component({
  selector: 'app-hero',
  standalone: true,
  template: `
    <section id="hero" class="relative overflow-hidden bg-blue-950 min-h-screen flex items-center justify-center" [attr.dir]="i18n.dir()">
      <!-- Background blobs -->
      <div class="absolute inset-0 pointer-events-none">
        <div class="absolute top-0 start-0 w-[600px] h-[600px] bg-blue-500/30 rounded-full blur-[150px]"></div>
        <div class="absolute bottom-0 end-0 w-[500px] h-[500px] bg-sky-400/25 rounded-full blur-[130px]"></div>
        <div class="absolute top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-sky-300/20 rounded-full blur-[100px]"></div>
      </div>

      <style>
        .glass-rise { animation: glassRise 0.7s ease-out both; }
        @keyframes glassRise { from { opacity:0; transform:translateY(30px) scale(0.97); } to { opacity:1; transform:translateY(0) scale(1); } }
      </style>

      <div class="relative z-10 w-full max-w-2xl mx-auto px-6">
        <!-- Glass card -->
        <div class="glass-rise bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-10 md:p-14 shadow-2xl text-center">
          <div class="text-6xl mb-4">{{ biz.business()?.logo_emoji || '🏢' }}</div>

          <h1 class="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
            {{ i18n.isPrimary() ? biz.business()?.name : biz.business()?.name_en }}
          </h1>

          <div class="text-white/65 text-sm font-medium mb-6">
            {{ i18n.t()('hero_badge') }}
          </div>

          <p class="text-white/80 text-lg mb-8 leading-relaxed">
            {{ i18n.t()('hero_subtitle') }}
          </p>

          @if (biz.business(); as b) {
            <div class="flex items-center justify-center gap-6 mb-8">
              <div class="text-center">
                <div class="text-yellow-300 font-black text-xl">⭐ {{ b.rating }}</div>
                <div class="text-sky-300 text-xs">{{ i18n.t()('about_rating_label') }}</div>
              </div>
              <div class="w-px h-8 bg-white/20"></div>
              <div class="text-center">
                <div class="text-white font-black text-xl">{{ b.reviews_count }}+</div>
                <div class="text-sky-300 text-xs">{{ i18n.t()('reviews_happy') }}</div>
              </div>
              <div class="w-px h-8 bg-white/20"></div>
              <div class="text-center">
                <div class="text-green-300 text-sm font-semibold">✅</div>
                <div class="text-sky-300 text-xs">{{ i18n.t()('hero_available') }}</div>
              </div>
            </div>
          }

          <div class="flex flex-col sm:flex-row gap-3">
            <a [href]="'tel:' + biz.business()?.phone"
              class="flex-1 bg-sky-500 text-white font-bold py-4 rounded-2xl hover:bg-sky-400 hover:scale-[1.03] transition-all duration-200 text-center shadow-lg shadow-sky-500/30">
              📞 {{ i18n.t()('hero_cta_call') }}
            </a>
            <a [href]="whatsappUrl()" target="_blank" rel="noopener"
              class="flex-1 bg-green-500 text-white font-bold py-4 rounded-2xl hover:bg-green-400 hover:scale-[1.03] transition-all duration-200 text-center shadow-lg shadow-green-500/30">
              💬 {{ i18n.t()('hero_cta_whatsapp') }}
            </a>
          </div>
        </div>
      </div>

      <div class="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-50 to-transparent"></div>
    </section>
  `,
})
export class HeroComponent {
  protected i18n = inject(I18nService);
  protected biz = inject(BusinessDataService);

  whatsappUrl() {
    const phone = this.biz.business()?.whatsapp?.replace(/\D/g, '') ?? '';
    const msg = this.i18n.t()('contact_wa_hello');
    return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
  }
}
