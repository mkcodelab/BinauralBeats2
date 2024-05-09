import { Injectable } from '@angular/core';
import { Preset } from './preset-creator.service';

export type Waveform = 'sine' | 'triangle' | 'sawtooth' | 'square';

export type Channel = 'left' | 'right';

@Injectable({
  providedIn: 'root',
})
export class SynthService {
  freqLeft: number = 200;
  freqRight: number = 206;

  currentPreset: Preset;
  isPresetSelected = false;

  //   add declarations.d.ts
  // then
  // interface Window {
  //   webkitAudioContext: typeof AudioContext
  // }
  //   audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  private audioCtx = new window.AudioContext();

  private oscR = this.audioCtx.createOscillator();
  private oscL = this.audioCtx.createOscillator();

  leftChannelOscillators: OscillatorNode[] = [];
  rightChannelOscillators: OscillatorNode[] = [];

  //   master gain node
  private masterVolume = 0.4;
  private masterGain = this.audioCtx.createGain();

  private binauralVolume = 0.4;
  private binauralGain = this.audioCtx.createGain();

  //   merger for presets
  private merger = this.audioCtx.createChannelMerger(2);

  //   merger for binaural
  private binauralMerger = this.audioCtx.createChannelMerger(2);

  private waveform: Waveform = 'sine';

  private isFadeOn = true;

  public isPlaying = false;
  private firstStart = false;

  constructor() {
    this.masterGain.gain.value = this.masterVolume;
    this.binauralGain.gain.value = this.binauralVolume;

    this.binauralMerger.connect(this.binauralGain);

    this.binauralGain.connect(this.masterGain);
    // add gain node for presets
    this.merger.connect(this.masterGain);

    this.masterGain.connect(this.audioCtx.destination);
  }

  start() {
    // add oscillators to the oscillators array later...

    this.oscL.type = this.waveform;
    this.oscL.frequency.value = this.freqLeft;
    this.oscL.connect(this.binauralMerger, 0, 1);

    this.oscR.type = this.waveform;
    this.oscR.frequency.value = this.freqRight;
    this.oscR.connect(this.binauralMerger, 0, 0);

    // start oscillators on first start to prevent "user gesture warn" and other issues
    if (!this.firstStart) {
      this.oscL.start();
      this.oscR.start();
      this.firstStart = true;
    }

    // fade in
    if (this.isFadeOn) {
      this.preventClickSound(this.binauralGain);
      this.fade('in', 1, this.binauralGain, this.binauralVolume);
    } else {
      this.masterGain.gain.value = this.masterVolume;
    }

    this.isPlaying = true;
  }

  playPreset() {
    if (this.isPresetSelected) {
      for (let oscillator of this.leftChannelOscillators) {
        oscillator.connect(this.merger, 0, 1);
      }
      for (let oscillator of this.rightChannelOscillators) {
        oscillator.connect(this.merger, 0, 0);
      }
    } else {
      console.warn('preset not selected');
    }
  }

  stopPreset() {
    for (let oscillator of this.rightChannelOscillators) {
      oscillator.disconnect();
    }
    for (let oscillator of this.leftChannelOscillators) {
      oscillator.disconnect();
    }
  }

  stop() {
    if (this.isFadeOn) {
      this.preventClickSound(this.binauralGain);
      this.fade('out', 1, this.binauralGain, this.binauralVolume);

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

  preventClickSound(gainNode: GainNode) {
    // this prevents clicking sound related to stopping oscillator at non-zero crossing point.

    // this.masterGain.gain.setTargetAtTime(
    //   this.masterGain.gain.value,
    //   this.audioCtx.currentTime,
    //   0.05
    // );
    gainNode.gain.setTargetAtTime(
      gainNode.gain.value,
      this.audioCtx.currentTime,
      0.05
    );
  }

  fade(
    direction: 'in' | 'out',
    time: number,
    gainNode: GainNode,
    gainNodeValue: number
  ) {
    // const gain = this.masterGain.gain;
    const gain = gainNode.gain;
    direction === 'in'
      ? gain.exponentialRampToValueAtTime(
          //   this.masterVolume,
          gainNodeValue,
          this.audioCtx.currentTime + time
        )
      : gain.exponentialRampToValueAtTime(
          0.0001,
          this.audioCtx.currentTime + time
        );
  }

  selectPreset(preset: Preset) {
    this.currentPreset = preset;
    this.isPresetSelected = true;
    this.clearPresetOscillators();
    this.createPresetOscillators();
  }

  //   pushing preset oscillators to the channel arrays (L, R)
  createPresetOscillators() {
    // left channel
    for (let preset of this.currentPreset.leftChannel) {
      const osc = this.audioCtx.createOscillator();
      osc.frequency.value = preset.frequency;
      osc.type = preset.type;
      osc.start();

      this.leftChannelOscillators.push(osc);
    }
    // right channel
    for (let preset of this.currentPreset.rightChannel) {
      const osc = this.audioCtx.createOscillator();
      osc.frequency.value = preset.frequency;
      osc.type = preset.type;
      osc.start();

      this.rightChannelOscillators.push(osc);
    }
  }

  clearPresetOscillators() {
    // this.oscillators = [];
    this.leftChannelOscillators.length = 0;
    this.rightChannelOscillators.length = 0;
  }
}
