import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { I18nService } from '../services/i18n.service';
import { BusinessDataService } from '../services/business-data.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule],
  template: `
    <style>
      @keyframes popIn {
        from { opacity: 0; transform: scale(0.85); }
        to { opacity: 1; transform: scale(1); }
      }
      .block-pop { animation: popIn 0.5s ease-out both; }
      .block-pop:nth-child(2) { animation-delay: 0.15s; }
      .block-pop:nth-child(3) { animation-delay: 0.3s; }
    </style>
    <section id="contact" class="py-20 bg-white" [attr.dir]="i18n.dir()">
      <div class="max-w-7xl mx-auto px-4">
        <div class="text-center mb-14" data-animate>
          <h2 class="text-4xl font-bold text-gray-900 mb-4">{{ i18n.t()('contact_title') }}</h2>
          <p class="text-lg text-gray-500">{{ i18n.t()('contact_subtitle') }}</p>
        </div>
        @if (submitted()) {
          <div class="text-center py-16" data-animate>
            <div class="text-5xl mb-4">✅</div>
            <h3 class="text-2xl font-bold text-blue-700 mb-2">{{ i18n.t()('contact_thanks_title') }}</h3>
            <p class="text-gray-600">{{ i18n.t()('contact_thanks_desc') }}</p>
          </div>
        } @else {
          <div class="grid md:grid-cols-3 gap-6" data-animate>
            <!-- Phone Block -->
            <div class="block-pop bg-blue-50 rounded-2xl p-8 flex flex-col items-center text-center">
              <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-3xl mb-5">📞</div>
              <h3 class="font-bold text-gray-900 mb-2">{{ i18n.t()('contact_call') }}</h3>
              @if (biz.business()?.phone_display) {
                <p class="text-gray-600 mb-4">{{ biz.business()?.phone_display }}</p>
                <a [href]="'tel:' + biz.business()?.phone" class="mt-auto bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                  {{ i18n.t()('contact_call') }}
                </a>
              }
            </div>
            <!-- WhatsApp Block -->
            <div class="block-pop bg-sky-50 rounded-2xl p-8 flex flex-col items-center text-center">
              <div class="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center text-3xl mb-5">💬</div>
              <h3 class="font-bold text-gray-900 mb-2">{{ i18n.t()('contact_whatsapp') }}</h3>
              @if (biz.business()?.whatsapp) {
                <p class="text-gray-600 mb-4">{{ biz.business()?.whatsapp }}</p>
                <a [href]="waUrl()" target="_blank" class="mt-auto bg-sky-600 text-white px-6 py-2.5 rounded-lg hover:bg-sky-700 transition-colors font-medium">
                  {{ i18n.t()('contact_whatsapp') }}
                </a>
              }
            </div>
            <!-- Form Block -->
            <div class="block-pop bg-gray-50 rounded-2xl p-8">
              <h3 class="font-bold text-gray-900 mb-5 text-center">{{ i18n.t()('contact_form_title') }}</h3>
              <form (ngSubmit)="onSubmit()" class="space-y-4">
                <input [(ngModel)]="formData.name" name="name" type="text" [placeholder]="i18n.t()('contact_name_placeholder')" class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white" />
                <input [(ngModel)]="formData.phone" name="phone" type="tel" [placeholder]="i18n.t()('contact_phone_placeholder')" class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white" />
                <textarea [(ngModel)]="formData.message" name="message" rows="3" [placeholder]="i18n.t()('contact_message_placeholder')" class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"></textarea>
                <button type="submit" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors">
                  {{ i18n.t()('contact_submit') }}
                </button>
              </form>
            </div>
          </div>
        }
      </div>
    </section>
  `
})
export class ContactComponent {
  protected i18n = inject(I18nService);
  protected biz = inject(BusinessDataService);
  protected submitted = signal(false);
  protected formData = { name: '', phone: '', message: '' };

  waUrl(): string {
    const b = this.biz.business();
    if (!b?.whatsapp) return '';
    const phone = (b.whatsapp ?? '').replace(/\D/g, '');
    return `https://wa.me/${phone}`;
  }

  onSubmit(): void {
    const b = this.biz.business();
    if (!b?.whatsapp) return;
    const phone = (b.whatsapp ?? '').replace(/\D/g, '');
    const t = this.i18n.t();
    const message = `${t('contact_wa_intro')} ${this.formData.name}.
${t('contact_wa_phone_label')} ${this.formData.phone}
${t('contact_wa_message_label')} ${this.formData.message || t('contact_wa_default_msg')}`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
    this.submitted.set(true);
  }
}
