import { Component, OnInit } from '@angular/core';
import { ReportService } from '../../shared/services/report.service';
import { AuthService } from '../../shared/services/auth.service';
import { Report, User } from '../../interface';
import { ConfigService } from '../../shared/services/config.service';
import { UserService } from '../../shared/services/user.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-repotform',
  templateUrl: './repotform.component.html',
  styleUrls: ['./repotform.component.scss']
})
export class RepotformComponent implements OnInit {
  reports: Report[] = [];
  users: { [key: string]: User } = {};
  reportIds: Set<string> = new Set();

  constructor(
    private reportService: ReportService,
    private userService: UserService,
    private router: Router,
    private authService: AuthService,
    private config: ConfigService
  ) { }

  ngOnInit() {
    this.config.updateHeaderSettings('Report');
    this.reportService.getAllReports().subscribe(reports => {
      reports.forEach(report => {
        if (!this.reportIds.has(report.id)) {
          this.reports.push(report);
          this.reportIds.add(report.id);
          this.userService.getUser(report.userIdFrom).subscribe(user => {
            if (user) {
              this.users[report.userIdFrom] = user;
            }
          });
        }
      });
    });
  }

  gohome() {
    this.router.navigate(['/']);
  }

  gotouser(id: string) {
    this.router.navigate([`/user/${id}`]);
  }

  gotopost(id: string) {
    if (id !== "") {
      this.router.navigate([`/post/${id}`]);
    }
  }

  markAsSeen(reportId: string) {
    this.reportService.markAsSeen(reportId);
  }

  deleteReport(id: string) {
    this.reportService.deleteReport(id); // You need to add this method in ReportService
  }
}
