import { Component, inject } from '@angular/core';
import {
  OscillatorData,
  Preset,
  PresetCreatorService,
} from '../../services/preset-creator.service';
import { Waveform } from '../../services/synth.service';
import { NgFor } from '@angular/common';
import {
  ChannelData,
  ChannelSettingComponent,
} from './channel-setting/channel-setting.component';

@Component({
  standalone: true,
  selector: 'creator',
  templateUrl: './creator.html',
  imports: [NgFor, ChannelSettingComponent],
})
export class CreatorComponent {
  private presetService = inject(PresetCreatorService);

  leftChannelOscillators: OscillatorData[] = [];
  rightChannelOscillators: OscillatorData[] = [];

  presetTitle: string;

  //   waveFormOptions: Waveform[] = ['sine', 'sawtooth', 'triangle', 'square'];

  addPreset() {
    const preset = this.createPreset();
    this.presetService.addPreset(preset);
    this.displayMessage();
  }

  displayMessage() {
    alert('preset added!');
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

  recieveOscillatorData(data: ChannelData) {
    console.log(data);
    this.addOscillatorData(data.channel, {
      type: data.type,
      frequency: data.frequency,
    });
  }

  addOscillatorData(channel: 'left' | 'right', data: OscillatorData) {
    channel === 'left'
      ? this.leftChannelOscillators.push(data)
      : this.rightChannelOscillators.push(data);
  }
}
