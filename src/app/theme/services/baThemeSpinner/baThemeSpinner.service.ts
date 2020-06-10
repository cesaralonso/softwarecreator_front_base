import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BaThemeSpinner {

  private _selector: string = 'preloader';
  private _element: HTMLElement;

  constructor() {
    this._element = document.getElementById(this._selector);
  }

  show(): void {
    this._element.style['display'] = 'block';
  }

  hide(delay: number = 0): void {
    setTimeout(() => {
      this._element.style['display'] = 'none';
    }, delay);
  }
}
