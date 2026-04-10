import { Injectable, computed, inject, signal } from '@angular/core';
import { BusinessDataService } from './business-data.service';

export type Lang = string; // ISO 639-1 code, e.g. 'he', 'hu', 'en'

/** Languages that render right-to-left. */
const RTL_LANGS = new Set(['he', 'ar', 'fa', 'ur']);

/** Static UI labels — identical for every business.
 *  'he' = primary-language version (used for Hebrew businesses and as fallback for other
 *          non-English languages that haven't overridden the key in translations).
 *  'en' = English version.
 */
const DEFAULTS: Record<string, { he: string; en: string }> = {
  nav_about:                { he: 'עלינו',                              en: 'About' },
  nav_services:             { he: 'שירותים',                            en: 'Services' },
  nav_gallery:              { he: 'גלריה',                              en: 'Gallery' },
  nav_reviews:              { he: 'ביקורות',                            en: 'Reviews' },
  nav_contact:              { he: 'צור קשר',                            en: 'Contact' },
  lang_toggle:              { he: 'English',                            en: 'עברית' },
  hero_cta_call:            { he: 'התקשר עכשיו',                        en: 'Call Now' },
  hero_cta_whatsapp:        { he: 'ווטסאפ',                             en: 'WhatsApp' },
  stars_out_of:             { he: 'מתוך 5',                             en: 'out of 5' },
  reviews_happy:            { he: 'ביקורות מרוצות',                     en: 'happy reviews' },
  about_title:              { he: 'עלינו',                              en: 'About Us' },
  hours_title:              { he: 'שעות פעילות',                        en: 'Working Hours' },
  about_rating_label:       { he: 'דירוג',                              en: 'Rating' },
  about_reviews_label:      { he: 'ביקורות מרוצות',                     en: 'Happy Reviews' },
  about_years_label:        { he: 'שנות ניסיון',                        en: 'Years Experience' },
  about_available_label:    { he: 'זמינות',                             en: 'Availability' },
  services_title:           { he: 'השירותים שלנו',                      en: 'Our Services' },
  gallery_title:            { he: 'גלריית עבודות',                      en: 'Work Gallery' },
  lightbox_close:           { he: 'סגור',                               en: 'Close' },
  lightbox_prev:            { he: 'הקודם',                              en: 'Previous' },
  lightbox_next:            { he: 'הבא',                                en: 'Next' },
  reviews_title:            { he: 'מה אומרים עלינו',                    en: 'What Our Customers Say' },
  reviews_subtitle:         { he: 'ביקורות אמיתיות מלקוחות מרוצים',    en: 'Real reviews from satisfied customers' },
  reviews_based_on:         { he: 'מבוסס על',                           en: 'Based on' },
  reviews_reviews:          { he: 'ביקורות',                            en: 'reviews' },
  reviews_local_guide:      { he: 'מדריך מקומי',                        en: 'Local Guide' },
  reviews_load_more:        { he: 'הצג עוד ביקורות',                    en: 'Show More Reviews' },
  contact_title:            { he: 'צור קשר',                            en: 'Contact Us' },
  contact_form_title:       { he: 'שלח לנו הודעה',                      en: 'Send us a message' },
  contact_name:             { he: 'שם מלא',                             en: 'Full Name' },
  contact_name_placeholder: { he: 'שם מלא',                             en: 'Full Name' },
  contact_phone:            { he: 'מספר טלפון',                         en: 'Phone Number' },
  contact_phone_placeholder:{ he: '05X-XXX-XXXX',                       en: '05X-XXX-XXXX' },
  contact_message:          { he: 'איך נוכל לעזור?',                    en: 'How can we help?' },
  contact_message_placeholder:{ he: 'תיאור הבעיה / בקשה...',            en: 'Describe the issue / request...' },
  contact_submit:           { he: 'שלח פנייה בווטסאפ 💬',               en: 'Send via WhatsApp 💬' },
  contact_call:             { he: 'התקשר',                              en: 'Call' },
  contact_whatsapp:         { he: 'ווטסאפ',                             en: 'WhatsApp' },
  contact_address:          { he: 'כתובת',                              en: 'Address' },
  contact_thanks_title:     { he: 'תודה! נחזור אליך בקרוב',            en: "Thank you! We'll be in touch soon" },
  contact_thanks_desc:      { he: 'הפנייה התקבלה ואנחנו ניצור איתך קשר בהקדם', en: "Your request was received and we'll contact you shortly" },
  contact_wa_intro:         { he: 'שלום! שמי',                          en: 'Hello! My name is' },
  contact_wa_phone_label:   { he: 'טלפון:',                             en: 'Phone:' },
  contact_wa_message_label: { he: 'הודעה:',                             en: 'Message:' },
  contact_wa_default_msg:   { he: 'מעוניין בשירות',                     en: 'Interested in service' },
  footer_quick_links:       { he: 'ניווט מהיר',                         en: 'Quick Links' },
  footer_rights:            { he: 'כל הזכויות שמורות',                  en: 'All Rights Reserved' },
  whatsapp_tooltip:         { he: 'שלח לנו ווטסאפ!',                    en: 'Send us a WhatsApp!' },
  location_title:           { he: 'איפה אנחנו?',                        en: 'Where to Find Us' },
  location_subtitle:        { he: 'בואו לבקר אותנו',                    en: 'Come visit us' },
  location_address:         { he: 'כתובת',                              en: 'Address' },
  location_phone:           { he: 'טלפון',                              en: 'Phone' },
  location_website:         { he: 'אתר אינטרנט',                        en: 'Website' },
  location_navigate:        { he: 'נווט אלינו בגוגל מפות',              en: 'Navigate with Google Maps' },
  nav_location:             { he: 'מיקום',                              en: 'Location' },
};

@Injectable({ providedIn: 'root' })
export class I18nService {
  private biz = inject(BusinessDataService);

  /** ISO code the user has explicitly chosen; null = follow site default. */
  private _userLang = signal<Lang | null>(null);

  /** The site's primary language as set by the generator (e.g. 'hu', 'he', 'en'). */
  readonly siteLang = computed(() => this.biz.business()?.site_lang ?? 'he');

  /** Currently active language: user override → site default. */
  readonly lang = computed<Lang>(() => this._userLang() ?? this.siteLang());

  /** True when the active language is the primary (non-English) one. */
  readonly isPrimary = computed(() => this.lang() !== 'en');

  readonly isRtl = computed(() => RTL_LANGS.has(this.lang()));
  readonly dir   = computed(() => this.isRtl() ? 'rtl' : 'ltr');

  /** Show language toggle only when the primary language is not English. */
  readonly showLangToggle = computed(() => this.siteLang() !== 'en');

  /** Returns the translation for the given key — checks business.json first, then static defaults. */
  t = computed(() => {
    const translations = this.biz.translations();
    const lang     = this.lang();
    const siteLang = this.siteLang();

    return (key: string, fallback?: string): string => {
      const bizEntry = translations[key];
      const defEntry = DEFAULTS[key];

      // Helper: pick primary or English value from an entry
      const pick = (entry: { he: string; en: string } | undefined) => {
        if (!entry) return null;
        return lang === 'en'
          ? (entry['en'] || entry['he'] || null)
          : (entry['he'] || entry['en'] || null);
      };

      // Business-specific translations always win
      if (bizEntry) return pick(bizEntry) ?? fallback ?? key;

      // Static defaults: for non-Hebrew sites, 'he' contains Hebrew text which is wrong
      // → fall back to English instead of showing Hebrew to Hungarian/French/etc. visitors
      if (defEntry) {
        if (lang === 'en' || siteLang !== 'he') {
          return defEntry['en'] || fallback || key;
        }
        return defEntry['he'] || defEntry['en'] || fallback || key;
      }

      return fallback || key;
    };
  });

  toggleLang(): void {
    const current  = this.lang();
    const siteLang = this.siteLang();
    this._userLang.set(current === 'en' ? siteLang : 'en');
  }

  setLang(lang: Lang): void {
    this._userLang.set(lang);
  }
}
