import { Component, OnInit } from '@angular/core';
import { ModelService } from '../shared/services/model.service';
import { ConfigService } from '../shared/services/config.service';
@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

  constructor(public modalservice: ModelService, public config: ConfigService) { }

  ngOnInit(): void {
  }

}
