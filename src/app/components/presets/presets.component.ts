import { Component, inject } from '@angular/core';
import {
  Preset,
  PresetCreatorService,
} from '../../services/preset-creator.service';
import { AsyncPipe, NgClass, NgFor } from '@angular/common';
import { SynthService } from '../../services/synth.service';
import { Subscription } from 'rxjs';

@Component({
  standalone: true,
  selector: 'presets',
  templateUrl: './presets.html',
  imports: [NgFor, NgClass, AsyncPipe],
})
export class PresetsComponent {
  synthSvc = inject(SynthService);
  presetCreatorSvc = inject(PresetCreatorService);
  presets: Preset[] = [];

  isPlaying = false;
  playSubscription: Subscription;

  ngOnInit() {
    this.loadPresets();

    this.playSubscription = this.synthSvc
      .isPresetPlaying()
      .subscribe((value) => {
        this.isPlaying = value;
      });
  }

  loadPresets() {
    this.presets = this.presetCreatorSvc.getLoadedPresets();
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
  }

  stopPreset() {
    this.synthSvc.stopPreset();
  }

  togglePreset() {
    this.isPlaying ? this.stopPreset() : this.playPreset();
  }

  ngOnDestroy() {
    this.playSubscription.unsubscribe();
  }
}
