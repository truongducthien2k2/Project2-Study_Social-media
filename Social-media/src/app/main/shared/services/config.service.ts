import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  private _headerTitle: string = "";
  private _showBackArrow: boolean = false;

  constructor() { }

  get headerTitle(): string {
    return this._headerTitle;
  }

  set headerTitle(value: string) {
    this._headerTitle = value;
  }

  get showBackArrow(): boolean {
    return this._showBackArrow;
  }

  set showBackArrow(value: boolean) {
    this._showBackArrow = value;
  }

  updateHeaderSettings(title: string, showBackArrow: boolean = false) {
    setTimeout(() => {
      this._headerTitle = title;
      this._showBackArrow = showBackArrow;
    }, 0);
  }
}
