import { Injectable, inject } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import { Channel, Waveform } from './synth.service';

export interface OscillatorData {
  type: Waveform;
  frequency: number;
  id: number;
}

export class Preset {
  constructor(public name: string) {}

  leftChannel: OscillatorData[] = [];
  rightChannel: OscillatorData[] = [];
  isSelected?: boolean;
  //   masterVolume: number;
  addOscillator(channel: Channel, oscillatorData: OscillatorData) {
    channel === 'left'
      ? this.leftChannel.push(oscillatorData)
      : this.rightChannel.push(oscillatorData);
  }
}

// move to the oscillators

@Injectable({
  providedIn: 'root',
})
export class PresetCreatorService {
  constructor() {
    // load presets
    // this.localStorageSvc.getItem('presets')

    this.addSamplePresets();
  }
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

  addSamplePresets() {
    let preset = new Preset('sample');
    preset.addOscillator('left', { type: 'sawtooth', frequency: 200, id: 0 });
    preset.addOscillator('right', { type: 'sine', frequency: 280, id: 0 });
    this.presets.push(preset);

    let preset2 = new Preset('sample2');
    preset2.addOscillator('left', { type: 'square', frequency: 150, id: 1 });
    preset2.addOscillator('right', { type: 'square', frequency: 120, id: 1 });

    this.presets.push(preset2);
  }

  getLoadedPresets() {
    return [...this.presets];
  }
}
