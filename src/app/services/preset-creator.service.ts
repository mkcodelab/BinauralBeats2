import { Injectable, inject } from '@angular/core';
import { LocalStorageService } from './local-storage.service';

export type Waveform = 'sine' | 'triangle' | 'sawtooth' | 'square';

export type Channel = 'left' | 'right';

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
    //  this.getPresets()
    this.addSamplePresets();
  }

  private presetsLoaded = false;

  private lsSvc = inject(LocalStorageService);

  private presets: Preset[] = [];

  addPreset(preset: Preset) {
    this.presets.push(preset);
  }

  getPresets() {
    const presets = this.lsSvc.getItem('presets');
    if (presets !== null) {
      this.presets = JSON.parse(presets);
      this.presetsLoaded = true;
    }
  }

  savePresets() {
    this.lsSvc.setItem('presets', JSON.stringify(this.presets));
  }

  addSamplePresets() {
    // testing purposes only
    let preset = new Preset('sample');
    preset.addOscillator('left', { type: 'sawtooth', frequency: 200, id: 0 });
    preset.addOscillator('right', { type: 'sine', frequency: 280, id: 0 });
    this.presets.push(preset);

    let preset2 = new Preset('sample2');
    preset2.addOscillator('left', { type: 'sine', frequency: 300, id: 1 });
    preset2.addOscillator('right', { type: 'sine', frequency: 300, id: 1 });
    this.presets.push(preset2);

    let preset3 = new Preset('sample3');
    preset3.addOscillator('left', { type: 'square', frequency: 100, id: 1 });
    preset3.addOscillator('right', { type: 'square', frequency: 100, id: 1 });
    this.presets.push(preset3);

    this.presetsLoaded = true;
  }

  getLoadedPresets() {
    if (this.presetsLoaded) {
      return [...this.presets];
    } else return [];
  }
}
