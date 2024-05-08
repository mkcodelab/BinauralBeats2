import { Injectable } from '@angular/core';

export interface Oscillator {
  type: string;
  frequency: number;
}

export type Waveform = 'sine' | 'triangle' | 'sawtooth' | 'square';

export type Channel = 'left' | 'right';

@Injectable({
  providedIn: 'root',
})
export class SynthService {
  freqLeft: number = 0;
  freqRight: number = 0;

  //   add declarations.d.ts
  // then
  // interface Window {
  //   webkitAudioContext: typeof AudioContext
  // }
  //   audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  audioCtx = new window.AudioContext();

  //   oscR = this.audioCtx.createOscillator();
  //   oscL = this.audioCtx.createOscillator();
  oscR!: OscillatorNode;
  oscL!: OscillatorNode;

  oscillators: OscillatorNode[] = [];

  //   master gain node
  masterGain = this.audioCtx.createGain();
  masterVolume = 0.4;

  //   merger
  merger = this.audioCtx.createChannelMerger(2);

  waveform: Waveform = 'sine';

  fade = true;

  isPlaying = false;

  constructor() {
    this.masterGain.gain.value = this.masterVolume;
    this.merger.connect(this.masterGain);
    this.masterGain.connect(this.audioCtx.destination);
  }

  changeMasterVolume(value: number) {
    this.masterGain.gain.value = value;
  }

  start() {
    // add oscillators to the oscillators array later...

    let osc2 = this.audioCtx.createOscillator();
    osc2.type = this.waveform;
    osc2.frequency.value = this.freqLeft;
    //connecting to the left channel
    osc2.connect(this.merger, 0, 1);

    let osc1 = this.audioCtx.createOscillator();
    osc1.type = this.waveform;
    osc1.frequency.value = this.freqRight;
    //connecting to the right channel
    osc1.connect(this.merger, 0, 0);

    this.oscR = osc1;
    this.oscL = osc2;

    osc1.start();
    osc2.start();

    if (this.fade)
      this.masterGain.gain.exponentialRampToValueAtTime(
        this.masterVolume,
        this.audioCtx.currentTime + 1.2
      );
    this.isPlaying = true;
  }

  stop() {
    if (this.fade) {
      this.masterGain.gain.setValueAtTime(
        this.masterGain.gain.value,
        this.audioCtx.currentTime
      );
      this.masterGain.gain.exponentialRampToValueAtTime(
        0.0001,
        this.audioCtx.currentTime + 1.2
      );

      let that = this;
      setTimeout(function () {
        that.oscR.stop();
        that.oscL.stop();
      }, 500);
    } else {
      this.oscR.stop();
      this.oscL.stop();
    }

    this.isPlaying = false;
  }

  changeFreq(channel: Channel, value: number) {
    switch (channel) {
      case 'left':
        this.oscL.frequency.value = value;
        break;
      case 'right':
        this.oscR.frequency.value = value;
        break;
    }
  }
}
