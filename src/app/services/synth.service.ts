import { Injectable } from '@angular/core';
import { Preset } from './preset-creator.service';
import { BehaviorSubject } from 'rxjs';

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

  //   binaural gain node
  private binauralVolume = 0.4;
  private binauralGain = this.audioCtx.createGain();

  //   preset gain node

  private presetVolume = 0.5;
  private presetGain = this.audioCtx.createGain();

  //   merger for presets
  private presetMerger = this.audioCtx.createChannelMerger(2);

  //   merger for binaural
  private binauralMerger = this.audioCtx.createChannelMerger(2);

  private waveform: Waveform = 'sine';

  private isFadeOn = true;

  public isBinauralPlaying = false;

  private presetPlaying$ = new BehaviorSubject(false);

  isPresetPlaying() {
    return this.presetPlaying$.asObservable();
  }

  private firstStart = false;

  constructor() {
    this.masterGain.gain.value = this.masterVolume;
    this.binauralGain.gain.value = this.binauralVolume;
    this.presetGain.gain.value = this.presetVolume;

    this.binauralMerger.connect(this.binauralGain);

    this.binauralGain.connect(this.masterGain);

    this.presetMerger.connect(this.presetGain);

    this.presetGain.connect(this.masterGain);

    this.masterGain.connect(this.audioCtx.destination);
  }

  start() {
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
      this.fade('in', 0.5, this.binauralGain, this.binauralVolume);
    } else {
      this.masterGain.gain.value = this.masterVolume;
    }

    this.isBinauralPlaying = true;
  }

  playPreset() {
    if (this.isPresetSelected) {
      this.preventClickSound(this.presetGain);
      this.fade('in', 0.5, this.presetGain, this.presetVolume);

      for (let oscillator of this.leftChannelOscillators) {
        oscillator.connect(this.presetMerger, 0, 1);
      }
      for (let oscillator of this.rightChannelOscillators) {
        oscillator.connect(this.presetMerger, 0, 0);
      }

      this.presetPlaying$.next(true);
    } else {
      console.warn('preset not selected');
    }
  }

  stopPreset() {
    this.preventClickSound(this.presetGain);
    this.fade('out', 0.5, this.presetGain, this.presetVolume);

    setTimeout(() => {
      for (let oscillator of this.rightChannelOscillators) {
        oscillator.disconnect();
      }
      for (let oscillator of this.leftChannelOscillators) {
        oscillator.disconnect();
      }
    }, 500);

    this.presetPlaying$.next(false);
  }

  stop() {
    if (this.isFadeOn) {
      this.preventClickSound(this.binauralGain);
      this.fade('out', 0.5, this.binauralGain, this.binauralVolume);

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

    this.isBinauralPlaying = false;
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
    this.stopPreset();
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
    this.leftChannelOscillators.length = 0;
    this.rightChannelOscillators.length = 0;
  }
}
