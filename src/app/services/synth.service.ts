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
  private audioCtx = new window.AudioContext();

  private oscR = this.audioCtx.createOscillator();
  private oscL = this.audioCtx.createOscillator();

  oscillators: OscillatorNode[] = [];

  //   master gain node
  private masterVolume = 0.4;
  private masterGain = this.audioCtx.createGain();

  //   merger
  private merger = this.audioCtx.createChannelMerger(2);

  private waveform: Waveform = 'sine';

  private isFadeOn = true;

  public isPlaying = false;
  private firstStart = false;

  constructor() {
    this.masterGain.gain.value = this.masterVolume;
    this.merger.connect(this.masterGain);
    this.masterGain.connect(this.audioCtx.destination);
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
    if (this.isFadeOn) {
      this.preventClickSound();
      this.fade('in', 1);
    } else {
      this.masterGain.gain.value = this.masterVolume;
    }

    this.isPlaying = true;
  }

  stop() {
    if (this.isFadeOn) {
      this.preventClickSound();
      this.fade('out', 1);

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
  get volume() {
    return this.masterVolume;
  }

  changeMasterGain(value: number) {
    // this.masterGain.gain.value = value;
    this.masterGain.gain.setTargetAtTime(
      value,
      this.audioCtx.currentTime,
      0.05
    );
  }

  changeMasterVolume(value: number) {
    this.masterVolume = value;
    this.changeMasterGain(value);
  }

  preventClickSound() {
    // this prevents clicking sound related to stopping oscillator at non-zero crossing point.

    this.masterGain.gain.setTargetAtTime(
      this.masterGain.gain.value,
      this.audioCtx.currentTime,
      0.05
    );
  }

  fade(direction: 'in' | 'out', time: number) {
    const gain = this.masterGain.gain;
    direction === 'in'
      ? gain.exponentialRampToValueAtTime(
          this.masterVolume,
          this.audioCtx.currentTime + time
        )
      : gain.exponentialRampToValueAtTime(
          0.0001,
          this.audioCtx.currentTime + time
        );
  }
}
