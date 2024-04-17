import { Component, OnInit } from '@angular/core';
import { ModelService } from '../shared/services/model.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

  constructor(public modalservice: ModelService) { }

  ngOnInit(): void {
  }

}
