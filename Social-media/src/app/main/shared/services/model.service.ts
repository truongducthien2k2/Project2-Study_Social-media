import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModelService {
  private _isOpen: boolean = false;
  private _isClose: boolean = false;
  private _isRegisterModelOpen: boolean = false;
  private _isLoginModelOpen: boolean = false;
  private _isEditModalOpen: boolean = false;
  private _isFollowModalOpen: boolean = false;
  private _followModalType: 'followers' | 'followings' = 'followers'; // Default to followers
  private _isReportModalOpen: boolean = false;
  private categoryId: string = '';
  constructor() { }

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
  
  get isFollowModalOpen(): boolean {
    return this._isFollowModalOpen;
  }

  set isFollowModalOpen(value: boolean) {
    this._isFollowModalOpen = value;
  }

  get followModalType(): 'followers' | 'followings' {
    return this._followModalType;
  }

  set followModalType(value: 'followers' | 'followings') {
    this._followModalType = value;
  }

  get isReportModalOpen(): boolean {
    return this._isReportModalOpen;
  }

  set isReportModalOpen(value: boolean) {
    this._isReportModalOpen = value;
  }
  set setCategoryId(categoryId: string) {
    this.categoryId = categoryId;
  }

  get getCategoryId(): string {
    return this.categoryId;
  }
}
