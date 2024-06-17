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
  chart!: Chart;

  constructor(private userService: UserService, private postsService: PostsService) { }

  ngOnInit(): void {
    this.initializeChart();
    this.loadPostCounts();
    this.loadUserCounts();
  }

  initializeChart(): void {
    this.chart = new Chart({
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
        text: 'Report',
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
          'This Month',
          'Last Month',
          'Last 2 Months'
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
        },
        {
          name: "Toltal acount Create",
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
      this.postsService.countPostsByDateRange(startOfThisMonth, now),
      this.postsService.countPostsByDateRange(startOfLastMonth, endOfLastMonth),
      this.postsService.countPostsByDateRange(startOfTwoMonthsAgo, endOfTwoMonthsAgo)
    ]).subscribe(counts => {
      this.postCounts = counts;
      console.log('Post Counts:', this.postCounts);
      this.updateChartData();
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
      this.userService.countUsersByDateRange(startOfThisMonth, now),
      this.userService.countUsersByDateRange(startOfLastMonth, endOfLastMonth),
      this.userService.countUsersByDateRange(startOfTwoMonthsAgo, endOfTwoMonthsAgo)
    ]).subscribe(counts => {
      this.userCounts = counts;
      console.log('User Counts:', this.userCounts);
      this.updateUserChartData();
    });
  }

  updateChartData(): void {
    this.chart.ref$.subscribe(chart => {
      chart.series[0].setData(this.postCounts, true);
    });
  }
  updateUserChartData(): void {
    this.chart.ref$.subscribe(chart => {
      chart.series[1].setData(this.userCounts, true);
    });
  }
}
