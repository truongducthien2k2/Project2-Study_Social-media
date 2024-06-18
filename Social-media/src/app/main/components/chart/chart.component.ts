import { Component, OnInit } from '@angular/core';
import { Chart } from 'angular-highcharts';
import { UserService } from '../../shared/services/user.service';
import { PostsService } from '../../shared/services/posts.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {
  users = this.userService.getAllUsers();
  postCounts: number[] = [];
  userCounts: number[] = [];
  postChart!: Chart;
  userChart!: Chart;

  constructor(private userService: UserService, private postsService: PostsService) { }

  ngOnInit(): void {
    this.initializePostChart();
    this.initializeUserChart();
    this.loadPostCounts();
    this.loadUserCounts();
  }

  initializePostChart(): void {
    this.postChart = new Chart({
      legend: {
        itemStyle: {
          color: 'white'
        }
      },
      chart: {
        type: 'line',
        height: 325,
        backgroundColor: "#000000"
      },
      title: {
        text: 'Posts Report',
        style: { color: "#ffffff" }
      },
      colorAxis: {
        gridLineColor: "ffffff",
      },
      xAxis: {
        labels: {
          style: { color: 'white' }
        },
        lineColor: '#ffffff',
        lineWidth: 3,
        categories: [
          'Last 2 Months',
          'Last Month',
          'This Month'
        ]
      },
      yAxis: {
        labels: {
          style: { color: 'white' }
        },
        lineColor: '#ffffff',
        lineWidth: 3,
        title: {
          text: 'Amount',
          style: { color: "#ffffff" }
        }
      },
      series: [
        {
          name: "Post",
          type: "line",
          color: '#02f737',
          data: [0, 0, 0],  // Initial dummy data
          dashStyle: 'Dash' 
        }
      ],
      credits: {
        enabled: false
      }
    });
  }

  initializeUserChart(): void {
    this.userChart = new Chart({
      legend: {
        itemStyle: {
          color: 'white'
        }
      },
      chart: {
        type: 'line',
        height: 325,
        backgroundColor: "#000000"
      },
      title: {
        text: 'User Account Creation Report',
        style: { color: "#ffffff" }
      },
      colorAxis: {
        gridLineColor: "ffffff",
      },
      xAxis: {
        labels: {
          style: { color: 'white' }
        },
        lineColor: '#ffffff',
        lineWidth: 3,
        categories: [
          'Last 2 Months',
          'Last Month',
          'This Month'
        ]
      },
      yAxis: {
        labels: {
          style: { color: 'white' }
        },
        lineColor: '#ffffff',
        lineWidth: 3,
        title: {
          text: 'Amount',
          style: { color: "#ffffff" }
        }
      },
      series: [
        {
          name: "Total Account Created",
          type: "line",
          color: '#ff0000',
          data: [0, 0, 0]
        }
      ],
      credits: {
        enabled: false
      }
    });
  }

  loadPostCounts(): void {
    const now = new Date();
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const startOfTwoMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    const endOfTwoMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 1, 0);

    forkJoin([
      this.postsService.countPostsByDateRange(startOfTwoMonthsAgo, endOfTwoMonthsAgo),
      this.postsService.countPostsByDateRange(startOfLastMonth, endOfLastMonth),
      this.postsService.countPostsByDateRange(startOfThisMonth, now)
    ]).subscribe(counts => {
      this.postCounts = counts;
      console.log('Post Counts:', this.postCounts);
      this.updatePostChartData();
    });
  }

  loadUserCounts(): void {
    const now = new Date();
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const startOfTwoMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    const endOfTwoMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 1, 0);

    forkJoin([
      this.userService.countUsersByDateRange(startOfTwoMonthsAgo, endOfTwoMonthsAgo),
      this.userService.countUsersByDateRange(startOfLastMonth, endOfLastMonth),
      this.userService.countUsersByDateRange(startOfThisMonth, now)
    ]).subscribe(counts => {
      this.userCounts = counts;
      console.log('User Counts:', this.userCounts);
      this.updateUserChartData();
    });
  }

  updatePostChartData(): void {
    this.postChart.ref$.subscribe(chart => {
      chart.series[0].setData(this.postCounts, true);
    });
  }

  updateUserChartData(): void {
    this.userChart.ref$.subscribe(chart => {
      chart.series[0].setData(this.userCounts, true);
    });
  }
}
