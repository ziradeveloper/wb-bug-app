import { Injectable, signal, computed, effect, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type ColorMode = 'light' | 'dark';

export interface ThemePreset {
  id: string;
  label: string;
  h: number;
  s: number;
  l: number;
  icon: string;
}

export interface ThemeConfig {
  colorMode: ColorMode;
  presetId: string;
  fontSize: number;   // rem multiplier, e.g. 1.0 = default
  borderRadius: number; // rem, e.g. 0.375 = default
}

export const THEME_PRESETS: ThemePreset[] = [
  { id: 'blue', label: 'Ocean Blue', h: 211, s: 72, l: 52, icon: 'bi-droplet-fill' },
  { id: 'violet', label: 'Royal Violet', h: 263, s: 72, l: 52, icon: 'bi-gem' },
  { id: 'teal', label: 'Teal Breeze', h: 174, s: 72, l: 52, icon: 'bi-wind' },
  { id: 'rose', label: 'Rose Quartz', h: 345, s: 72, l: 52, icon: 'bi-heart-fill' },
  { id: 'amber', label: 'Amber Glow', h: 38, s: 72, l: 52, icon: 'bi-sun-fill' },
  { id: 'emerald', label: 'Emerald', h: 152, s: 72, l: 52, icon: 'bi-tree-fill' },
  { id: 'whatsapp', label: 'WhatsApp Green', h: 155, s: 85, l: 35, icon: 'bi-whatsapp' },
  { id: 'sand', label: 'Sand', h: 28, s: 32, l: 71, icon: 'bi-brightness-high' },
  { id: 'black', label: 'Obsidian Black', h: 0, s: 0, l: 15, icon: 'bi-moon-fill' },
  { id: 'white', label: 'Pearl White', h: 0, s: 0, l: 96, icon: 'bi-snow' },
];

const STORAGE_KEY = 'wb-bug-theme';

const DEFAULT_CONFIG: ThemeConfig = {
  colorMode: 'light',
  presetId: 'sand',
  fontSize: 1.0,
  borderRadius: 0.375,
};

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private platformId = inject(PLATFORM_ID);

  // ── Signals ──────────────────────────────────────────────────────────────
  config = signal<ThemeConfig>(this._load());

  currentPreset = computed(() =>
    THEME_PRESETS.find(p => p.id === this.config().presetId) ?? THEME_PRESETS[0]
  );

  // ── Constructor: apply on every config change ─────────────────────────────
  constructor() {
    effect(() => {
      const cfg = this.config();
      this._apply(cfg);
      this._save(cfg);
    });
  }

  // ── Public API ────────────────────────────────────────────────────────────
  setColorMode(mode: ColorMode) {
    this.config.update(c => ({ ...c, colorMode: mode }));
  }

  setPreset(id: string) {
    this.config.update(c => ({ ...c, presetId: id }));
  }

  setFontSize(rem: number) {
    this.config.update(c => ({ ...c, fontSize: rem }));
  }

  setBorderRadius(rem: number) {
    this.config.update(c => ({ ...c, borderRadius: rem }));
  }

  resetToDefaults() {
    this.config.set({ ...DEFAULT_CONFIG });
  }

  // ── Private ───────────────────────────────────────────────────────────────
  private _apply(cfg: ThemeConfig) {
    if (!isPlatformBrowser(this.platformId)) return;
    const root = document.documentElement;

    // Bootstrap colour mode
    root.setAttribute('data-bs-theme', cfg.colorMode);

    // Accent colour (HSL-based Bootstrap variable overrides)
    const p = THEME_PRESETS.find(p => p.id === cfg.presetId) ?? THEME_PRESETS[0];

    // Calculate hover color (darker for light colors, lighter for dark colors)
    const hoverL = p.l > 50 ? Math.max(0, p.l - 15) : Math.min(100, p.l + 15);

    // Calculate contrast text (black or white)
    const contrastColor = p.l > 60 ? '#000' : '#fff';

    root.style.setProperty('--bs-primary', `hsl(${p.h}, ${p.s}%, ${p.l}%)`);
    root.style.setProperty('--bs-primary-rgb', this._hslToRgbTriplet(p.h, p.s, p.l));
    root.style.setProperty('--bs-primary-hover', `hsl(${p.h}, ${p.s}%, ${hoverL}%)`);
    root.style.setProperty('--bs-primary-contrast', contrastColor);

    root.style.setProperty('--bs-link-color', `hsl(${p.h}, ${p.s}%, ${p.l > 80 ? 40 : p.l}%)`);
    root.style.setProperty('--bs-link-hover-color', `hsl(${p.h}, ${p.s}%, ${p.l > 80 ? 20 : hoverL}%)`);

    // Font size scale
    root.style.setProperty('--theme-font-scale', `${cfg.fontSize}`);
    root.style.fontSize = `${cfg.fontSize}rem`;

    // Border radius
    root.style.setProperty('--bs-border-radius', `${cfg.borderRadius}rem`);
    root.style.setProperty('--bs-border-radius-sm', `${cfg.borderRadius * 0.6}rem`);
    root.style.setProperty('--bs-border-radius-lg', `${cfg.borderRadius * 1.5}rem`);
    root.style.setProperty('--bs-border-radius-xl', `${cfg.borderRadius * 2}rem`);
  }

  private _hslToRgbTriplet(h: number, s: number, l: number): string {
    s /= 100; l /= 100;
    const k = (n: number) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => Math.round(255 * (l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))));
    return `${f(0)}, ${f(8)}, ${f(4)}`;
  }

  private _load(): ThemeConfig {
    if (isPlatformBrowser(inject(PLATFORM_ID))) {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) return { ...DEFAULT_CONFIG, ...JSON.parse(raw) };
      } catch { /* ignore */ }
    }
    return { ...DEFAULT_CONFIG };
  }

  private _save(cfg: ThemeConfig) {
    if (isPlatformBrowser(this.platformId)) {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg)); } catch { /* ignore */ }
    }
  }
}
