import { Component, OnInit } from '@angular/core';
import { Chart } from 'angular-highcharts';
import { UserService } from '../../shared/services/user.service';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {

  
  constructor(private userService: UserService) { }

  ngOnInit(): void {
  }

  users = this.userService.getAllUsers();

  chart = new Chart({
    legend: {
      itemStyle: {
          color: 'white'
      }},
    chart: {
      type: 'line',
      height: 325,
      backgroundColor: "#000000"
    },
    title: {
      text: 'Dashboard',
      style: {color: "#ffffff"}
    },
    colorAxis: {
      gridLineColor: "ffffff",
    },
    xAxis: {
      labels: {
        style: {color: 'white'}
      },
      lineColor: '#ffffff',
      lineWidth: 3,
      categories: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'
      ]
    },
    yAxis: {
      labels: {
        style: {color: 'white'}
      },
      lineColor: '#ffffff',
      lineWidth: 3,
      title: {
        text: 'Amount',
        style: {color: "#ffffff"}
      }
    },
    series: [
      {
        name: "User registered",
        type: "line",
        color: '#02f737',
        data: [70, 69, 95, 145, 182, 215, 252, 265, 233, 183, 139, 196]
      }
    ],
    credits: {
      enabled: false
    }
  });
}
