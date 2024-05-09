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
  freqLeft: number = 200;
  freqRight: number = 206;

  //   add declarations.d.ts
  // then
  // interface Window {
  //   webkitAudioContext: typeof AudioContext
  // }
  //   audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  audioCtx = new window.AudioContext();

  oscR = this.audioCtx.createOscillator();
  oscL = this.audioCtx.createOscillator();

  oscillators: OscillatorNode[] = [];

  //   master gain node
  masterGain = this.audioCtx.createGain();
  masterVolume = 0.4;

  //   merger
  merger = this.audioCtx.createChannelMerger(2);

  waveform: Waveform = 'sine';

  fade = true;

  isPlaying = false;
  firstStart = false;

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

    this.oscL.type = this.waveform;
    this.oscL.frequency.value = this.freqLeft;
    this.oscL.connect(this.merger, 0, 1);

    this.oscR.type = this.waveform;
    this.oscR.frequency.value = this.freqRight;
    this.oscR.connect(this.merger, 0, 0);

    // start oscillators on first start to prevent "user gesture warn" and other issues
    if (!this.firstStart) {
      this.oscL.start();
      this.oscR.start();
      this.firstStart = true;
    }

    // fade in
    if (this.fade)
      this.masterGain.gain.setValueAtTime(
        this.masterGain.gain.value,
        this.audioCtx.currentTime
      );
    this.masterGain.gain.exponentialRampToValueAtTime(
      this.masterVolume,
      this.audioCtx.currentTime + 1
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
        this.audioCtx.currentTime + 1
      );

      //  disconnect has to be delayed, because of the fade function
      let that = this;
      setTimeout(function () {
        that.oscR.disconnect();
        that.oscL.disconnect();
      }, 1000);
    } else {
      this.oscR.disconnect();
      this.oscL.disconnect();
    }

    this.isPlaying = false;
  }

  changeFrequency(channel: Channel, value: number) {
    switch (channel) {
      case 'left':
        this.freqLeft = value;
        this.oscL.frequency.value = this.freqLeft;
        break;
      case 'right':
        this.freqRight = value;
        this.oscR.frequency.value = this.freqRight;
        break;
    }
  }

  getChannelFrequencyValue(channel: Channel): number {
    return channel === 'left' ? this.freqLeft : this.freqRight;
  }
}
