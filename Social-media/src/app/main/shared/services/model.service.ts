import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModelService {

  constructor() { }

  private _isOpen: boolean = false;
  private _isClose: boolean = false;
  private _isRegisterModelOpen: boolean = false;
  private _isLoginModelOpen: boolean = false;
  private _isEditModalOpen: boolean = false;

  get isOpen(): boolean {
    return this._isOpen;
  }

  set isOpen(value: boolean) {
    this._isOpen = value;
  }

  get isClose(): boolean {
    return this._isClose;
  }

  set isClose(value: boolean) {
    this._isClose = value;
  }

  get isRegisterModelOpen(): boolean {
    return this._isRegisterModelOpen;
  }

  set isRegisterModelOpen(value: boolean) {
    this._isRegisterModelOpen = value;
  }

  get isLoginModelOpen(): boolean {
    return this._isLoginModelOpen;
  }

  set isLoginModelOpen(value: boolean) {
    this._isLoginModelOpen = value;
  }

  get isEditModalOpen(): boolean {
    return this._isEditModalOpen;
  }

  set isEditModalOpen(value: boolean) {
    this._isEditModalOpen = value;
  }
}
