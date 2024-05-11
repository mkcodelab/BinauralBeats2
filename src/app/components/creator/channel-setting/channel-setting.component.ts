import { NgFor } from '@angular/common';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef,
  inject,
} from '@angular/core';
import { Waveform } from '../../../services/synth.service';
import { OscillatorData } from '../../../services/preset-creator.service';

export interface ChannelData extends OscillatorData {
  channel: 'left' | 'right';
}

@Component({
  standalone: true,
  imports: [NgFor],
  templateUrl: './channel-setting.html',
  selector: 'channel-setting',
})
export class ChannelSettingComponent {
  waveFormOptions: Waveform[] = ['sine', 'sawtooth', 'triangle', 'square'];

  cdr = inject(ChangeDetectorRef);

  @Input({ required: true }) channel: 'left' | 'right';

  @Output() oscillatorData = new EventEmitter<ChannelData>();

  sendOscillatorData(type: string, frequency: number) {
    let waveformType = type as Waveform;

    this.oscillatorData.emit({
      type: waveformType,
      frequency: frequency,
      channel: this.channel,
    });
  }
}
