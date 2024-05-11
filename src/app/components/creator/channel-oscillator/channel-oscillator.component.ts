import { Component, EventEmitter, Input, Output } from '@angular/core';
import { OscillatorData } from '../../../services/preset-creator.service';
import { NgFor } from '@angular/common';

@Component({
  standalone: true,
  selector: 'channel-oscillator',
  imports: [NgFor],
  templateUrl: './channel-oscillator.html',
})
export class ChannelOscillatorComponent {
  @Input() oscillator: OscillatorData;
  //   must have some id
  @Output() deleteOscillator = new EventEmitter();
  ngOnInit() {
    console.log(this.oscillator);
  }

  onDeleteOscillator(id: number) {
    this.deleteOscillator.emit(id);
  }
}
