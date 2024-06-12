import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfigService } from '../../shared/services/config.service';

@Component({
  selector: 'app-adminhome',
  templateUrl: './adminhome.component.html',
  styleUrls: ['./adminhome.component.scss']
})
export class AdminhomeComponent implements OnInit {

  constructor(private config: ConfigService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.config.updateHeaderSettings('Admin Home');
  }

  navigateToReportForm(): void {
    this.router.navigate(['/reportform'])
  }
}
