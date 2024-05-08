import { Routes } from '@angular/router';
import { BinauralBeatsComponent } from './components/binaural-beats/binaural-beats.component';
import { CreatorComponent } from './components/creator/creator.component';
import { PresetsComponent } from './components/presets/presets.component';

export const routes: Routes = [
  {
    path: 'binaural',
    component: BinauralBeatsComponent,
  },
  {
    path: 'creator',
    component: CreatorComponent,
  },
  {
    path: 'presets',
    component: PresetsComponent,
  },
];
