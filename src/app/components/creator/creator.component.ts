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

  recieveOscillatorData(data: OscillatorChannelData) {
    // this.addOscillatorData(data.channel, {
    //   type: data.type,
    //   frequency: data.frequency,
    //   id: data.id,
    // });
    this.addOscillatorData(data);
  }

  //   addOscillatorData(channel: 'left' | 'right', data: OscillatorData) {
  //     channel === 'left'
  //       ? this.leftChannelOscillators.push(data)
  //       : this.rightChannelOscillators.push(data);
  //   }
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
}
