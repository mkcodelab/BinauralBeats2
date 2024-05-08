import { Component, inject } from '@angular/core';
import {
  Preset,
  PresetCreatorService,
} from '../../services/preset-creator.service';

@Component({
  standalone: true,
  selector: 'creator',
  templateUrl: './creator.html',
  imports: [],
})
export class CreatorComponent {
  private presetService = inject(PresetCreatorService);

  addPreset(preset?: Preset) {
    // this.presetService.addPreset(preset);
    this.displayMessage();
  }

  displayMessage() {
    alert('preset added!');
  }
}
