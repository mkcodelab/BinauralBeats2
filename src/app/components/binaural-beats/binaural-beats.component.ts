import { Component, inject } from '@angular/core';
import { Channel, SynthService } from '../../services/synth.service';

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
    return this.synthSvc.isPlaying;
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
