import { Component, inject, signal } from '@angular/core';
import { I18nService } from '../services/i18n.service';
import { BusinessDataService } from '../services/business-data.service';

/**
 * Reviews Variant L — "Newspaper Clippings"
 * Reviews styled as torn newspaper cut-out clippings
 * with rough edges, sepia tones, and slight rotations.
 */
@Component({
  selector: 'app-reviews',
  standalone: true,
  template: `
    <section id="reviews" class="py-20 bg-gray-100" [attr.dir]="i18n.dir()">
      <style>
        @keyframes clip-drop {
          from { opacity: 0; transform: rotate(var(--rot, -2deg)) translateY(-30px); }
          to   { opacity: 1; transform: rotate(var(--rot, -2deg)) translateY(0); }
        }
        .clip {
          animation: clip-drop 0.5s ease-out both;
          box-shadow: 2px 3px 12px rgba(0,0,0,0.12);
        }
        .clip:nth-child(3n+1) { --rot: -1.5deg; }
        .clip:nth-child(3n+2) { --rot: 1deg; }
        .clip:nth-child(3n+3) { --rot: -0.5deg; }
        .clip:hover { transform: rotate(0deg) scale(1.02); transition: transform 0.3s; }
        .clip-edge {
          background-image: linear-gradient(135deg, transparent 33%, #f5f0e8 33%, #f5f0e8 66%, transparent 66%);
          background-size: 6px 6px;
          height: 6px;
        }
        .newsprint {
          font-family: 'Georgia', 'Times New Roman', serif;
        }
      </style>

      <div class="max-w-6xl mx-auto px-6">
        <div class="text-center mb-14" data-animate>
          <h2 class="text-4xl font-black text-gray-900 mb-2 newsprint">{{ i18n.t()('reviews_title') }}</h2>
          <p class="text-gray-500 text-lg">{{ i18n.t()('reviews_subtitle') }}</p>
          @if (biz.business(); as b) {
            <div class="inline-flex items-center gap-3 mt-5 bg-white px-6 py-3 rounded-sm shadow-sm border border-gray-200">
              <span class="text-3xl font-black text-gray-800 newsprint">{{ b.rating }}</span>
              <div class="flex gap-0.5 text-yellow-500 text-xl">
                @for (s of stars(b.rating); track $index) {<span>{{ s }}</span>}
              </div>
              <span class="text-sm text-gray-500">{{ i18n.t()('reviews_based_on') }} {{ b.reviews_count }} {{ i18n.t()('reviews_reviews') }}</span>
            </div>
          }
        </div>

        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
          @for (review of visibleReviews(); track review.author; let idx = $index) {
            <div class="clip bg-[#faf6ee] rounded-sm p-6 border border-gray-200"
                 [style.animation-delay]="idx * 100 + 'ms'" data-animate>
              <div class="clip-edge -mt-6 -mx-6 mb-4"></div>
              <div class="flex items-center justify-between mb-3">
                <span class="newsprint font-bold text-gray-800 text-sm uppercase tracking-wide">{{ review.author }}</span>
                <span class="text-xs text-gray-400 italic">{{ review.date }}</span>
              </div>
              <div class="flex gap-0.5 text-yellow-500 text-sm mb-3">
                @for (s of stars(review.rating); track $index) {<span>{{ s }}</span>}
              </div>
              <p class="newsprint text-gray-700 text-sm leading-relaxed italic">"{{ i18n.isPrimary() ? review.text_he : review.text_en }}"</p>
              <div class="flex items-center gap-2 mt-4 pt-3 border-t border-dashed border-gray-300">
                @if (review.is_local_guide) {
                  <span class="text-xs text-blue-600 font-semibold">🏅 {{ i18n.t()('reviews_local_guide') }}</span>
                }
                <span class="ms-auto text-xs text-gray-400 italic">{{ i18n.t()('reviews_happy') }}</span>
              </div>
              <div class="clip-edge -mb-6 -mx-6 mt-4 rotate-180"></div>
            </div>
          }
        </div>

        @if (showMore()) {
          <div class="text-center mt-10">
            <button (click)="loadMore()" class="bg-gray-800 text-white font-bold px-8 py-3 rounded-sm hover:bg-gray-900 transition-colors newsprint tracking-wide">
              {{ i18n.t()('reviews_load_more') }}
            </button>
          </div>
        }
      </div>
    </section>
  `,
})
export class ReviewsComponent {
  protected i18n = inject(I18nService);
  protected biz = inject(BusinessDataService);
  private visibleCount = signal(6);

  visibleReviews() {
    return this.biz.reviews().slice(0, this.visibleCount());
  }

  showMore() {
    return this.biz.reviews().length > this.visibleCount();
  }

  loadMore(): void {
    this.visibleCount.update((n) => n + 6);
  }

  stars(rating: number): string[] {
    return Array.from({ length: 5 }, (_, i) => (i < rating ? '★' : '☆'));
  }
}
