import { Injectable, inject } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import { Oscillator } from './synth.service';

export interface Preset {
  name: string;
  leftChannel: Oscillator[];
  rightChannel: Oscillator[];
  masterVolume: number;
}

// move to the oscillators

@Injectable({
  providedIn: 'root',
})
export class PresetCreatorService {
  private lsSvc = inject(LocalStorageService);

  private presets: Preset[] = [];

  addPreset(preset: Preset) {
    this.presets.push(preset);
  }

  getPresets() {
    const presets = this.lsSvc.getItem('presets');
    if (presets !== null) {
      this.presets = JSON.parse(presets);
    }
  }

  savePresets() {
    this.lsSvc.setItem('presets', JSON.stringify(this.presets));
  }
}
