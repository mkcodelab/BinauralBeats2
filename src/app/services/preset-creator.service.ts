import { Injectable, inject } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import { Channel, Waveform } from './synth.service';

export interface OscillatorData {
  type: Waveform;
  frequency: number;
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
