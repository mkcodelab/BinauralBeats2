import { Component, inject } from '@angular/core';
import {
  OscillatorData,
  Preset,
  PresetCreatorService,
} from '../../services/preset-creator.service';
import { NgFor } from '@angular/common';
import {
  OscillatorChannelData,
  ChannelSettingComponent,
} from './channel-setting/channel-setting.component';
import { ChannelOscillatorComponent } from './channel-oscillator/channel-oscillator.component';

enum Messages {
  noNameWarn = 'Please add preset name',
  presetAdded = 'Preset has been added!',
}

@Component({
  standalone: true,
  selector: 'creator',
  templateUrl: './creator.html',
  imports: [NgFor, ChannelSettingComponent, ChannelOscillatorComponent],
})
export class CreatorComponent {
  private presetService = inject(PresetCreatorService);

  leftChannelOscillators: OscillatorData[] = [];
  rightChannelOscillators: OscillatorData[] = [];

  presetTitle: string;

  message: Messages | '';

  addPreset() {
    if (!this.presetTitle) {
      this.displayMessage(Messages.noNameWarn);
    } else {
      const preset = this.createPreset();
      this.presetService.addPreset(preset);

      this.clearOscillators();

      this.displayMessage(Messages.presetAdded);
    }
  }

  displayMessage(message: Messages) {
    // alert('preset added!');
    this.message = message;
  }

  createPreset(): Preset {
    let preset = new Preset(this.presetTitle);
    for (let osc of this.leftChannelOscillators) {
      preset.addOscillator('left', osc);
    }
    for (let osc of this.rightChannelOscillators) {
      preset.addOscillator('right', osc);
    }
    return preset;
  }

  recieveOscillatorData(data: OscillatorChannelData) {
    this.addOscillatorData(data);
  }

  addOscillatorData(data: OscillatorChannelData) {
    data.channel === 'left'
      ? this.leftChannelOscillators.push(data)
      : this.rightChannelOscillators.push(data);
  }

  deleteOscillator(oscillator: OscillatorChannelData) {
    console.log('deleting ', oscillator);
    if (oscillator.channel === 'left') {
      this.leftChannelOscillators = this.leftChannelOscillators.filter(
        (osc) => osc.id !== oscillator.id
      );
    } else {
      this.rightChannelOscillators = this.rightChannelOscillators.filter(
        (osc) => osc.id !== oscillator.id
      );
    }
  }

  clearOscillators() {
    this.rightChannelOscillators.length = 0;
    this.leftChannelOscillators.length = 0;
  }
}
