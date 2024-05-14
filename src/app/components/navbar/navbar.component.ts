import { NgClass, NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

export interface NavItem {
  name: string;
  url: string;
}

@Component({
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgFor, NgClass],
  selector: 'navbar',
  template: `
    <div class="p-2 bg-slate-200/20 flex justify-center">
      <button
        class="p-2 border border-white bg-slate-200/20 text-white rounded-xl"
        [ngClass]="{ 'mr-2': !isLast }"
        *ngFor="let item of navItems; last as isLast"
        [routerLink]="item.url"
        [routerLinkActive]="'gradient-bg'"
      >
        {{ item.name }}
      </button>
    </div>
  `,
})
export class NavbarComponent {
  navItems: NavItem[] = [
    { name: 'binaural', url: 'binaural' },
    { name: 'creator', url: 'creator' },
    { name: 'presets', url: 'presets' },
  ];
}
