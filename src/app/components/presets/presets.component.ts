import { Component, inject } from '@angular/core';
import { Preset } from '../../services/preset-creator.service';
import { NgClass, NgFor } from '@angular/common';
import { SynthService } from '../../services/synth.service';

@Component({
  standalone: true,
  selector: 'presets',
  templateUrl: './presets.html',
  imports: [NgFor, NgClass],
})
export class PresetsComponent {
  synthSvc = inject(SynthService);
  presets: Preset[] = [];

  isPlaying = false;

  //   move to preset creator
  addSamplePreset() {
    let preset = new Preset('sample');
    preset.addOscillator('left', { type: 'sawtooth', frequency: 200 });
    preset.addOscillator('right', { type: 'sine', frequency: 280 });
    this.presets.push(preset);

    let preset2 = new Preset('sample2');
    preset2.addOscillator('left', { type: 'square', frequency: 150 });
    preset2.addOscillator('right', { type: 'square', frequency: 120 });

    this.presets.push(preset2);
  }

  ngOnInit() {
    this.addSamplePreset();
  }

  selectPreset(preset: Preset) {
    // preset.isSelected = true;
    this.synthSvc.selectPreset(preset);
    // move to synthSvc
    // deselect all
    for (let _preset of this.presets) {
      _preset.isSelected = false;
    }
    // // select chosen
    preset.isSelected = true;
  }

  getSelectedPreset() {
    this.synthSvc.currentPreset;
  }

  playPreset() {
    this.synthSvc.playPreset();
    if (this.synthSvc.isPresetSelected) {
      this.isPlaying = true;
    }
  }

  stopPreset() {
    this.synthSvc.stopPreset();
    this.isPlaying = false;
  }

  togglePreset() {
    this.isPlaying ? this.stopPreset() : this.playPreset();
  }
}
