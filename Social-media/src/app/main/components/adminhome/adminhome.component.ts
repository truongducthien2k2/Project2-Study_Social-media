import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../../shared/services/config.service';

@Component({
  selector: 'app-adminhome',
  templateUrl: './adminhome.component.html',
  styleUrls: ['./adminhome.component.scss']
})
export class AdminhomeComponent implements OnInit {

  constructor(private config: ConfigService) { }

  ngOnInit(): void {
    this.config.updateHeaderSettings('Admin Home')
  }

}
