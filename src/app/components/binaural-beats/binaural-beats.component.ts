import { Component, inject } from '@angular/core';
import { SynthService } from '../../services/synth.service';
import { Channel } from '../../services/preset-creator.service';

@Component({
  standalone: true,
  templateUrl: './binaural-beats.html',
  selector: 'binaural-beats',
})
export class BinauralBeatsComponent {
  synthSvc = inject(SynthService);

  synthToggle() {
    this.isPlaying ? this.synthSvc.stop() : this.synthSvc.start();
  }

  get isPlaying() {
    return this.synthSvc.isBinauralPlaying;
  }

  changeFrequency(channel: Channel, value: string) {
    this.synthSvc.changeFrequency(channel, +value);
  }

  getChannelValue(channel: Channel) {
    return this.synthSvc.getChannelFrequencyValue(channel);
  }

  changeVolume(value: string) {
    this.synthSvc.changeMasterVolume(+value);
  }

  getVolume() {
    return this.synthSvc.volume;
  }
}
