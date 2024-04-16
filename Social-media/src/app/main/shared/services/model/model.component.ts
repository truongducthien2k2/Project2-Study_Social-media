import { Component, OnInit, signal } from '@angular/core';

@Component({
  selector: 'app-model',
  templateUrl: './model.component.html',
  styleUrls: ['./model.component.scss']
})
export class ModelComponent implements OnInit {

  constructor() { }

  isOpen = signal<boolean>

  ngOnInit(): void {
  }

}
