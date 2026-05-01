import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThemeService, THEME_PRESETS, ColorMode } from '../../services/theme';

@Component({
  selector: 'app-theme-controller',
  imports: [CommonModule, FormsModule],
  templateUrl: './theme-controller.html',
  styleUrl: './theme-controller.css'
})
export class ThemeControllerComponent {
  theme = inject(ThemeService);

  readonly presets = THEME_PRESETS;
  isOpen = signal(false);

  togglePanel() { this.isOpen.update(v => !v); }
  closePanel()  { this.isOpen.set(false); }

  setMode(mode: ColorMode) { this.theme.setColorMode(mode); }
  setPreset(id: string)    { this.theme.setPreset(id); }

  get fontSize(): number       { return this.theme.config().fontSize; }
  get borderRadius(): number   { return this.theme.config().borderRadius; }
  get colorMode(): ColorMode   { return this.theme.config().colorMode; }
  get activePreset(): string   { return this.theme.config().presetId; }

  onFontSize(e: Event) {
    this.theme.setFontSize(+((e.target as HTMLInputElement).value));
  }

  onBorderRadius(e: Event) {
    this.theme.setBorderRadius(+((e.target as HTMLInputElement).value));
  }

  reset() { this.theme.resetToDefaults(); }
}
