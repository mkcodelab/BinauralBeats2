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

  get volumeIconSrc(): string {
    const vol = this.getVolume();
    if (vol === 0) {
      return './assets/volume-x.svg';
    } else if (vol < 0.7) {
      return './assets/volume-1.svg';
    } else {
      return './assets/volume-2.svg';
    }
  }
}
