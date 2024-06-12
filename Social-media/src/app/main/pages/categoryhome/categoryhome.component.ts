import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../shared/services/catetgory.service';
import  { Category} from '../../interface'
import { Router } from '@angular/router'; 
import { ConfigService } from '../../shared/services/config.service';
@Component({
  selector: 'app-categoryhome',
  templateUrl: './categoryhome.component.html',
  styleUrls: ['./categoryhome.component.scss']
})
export class CategoryhomeComponent implements OnInit {

  constructor(private categoryService: CategoryService, private router: Router, private config: ConfigService) {  }

  ngOnInit(): void {
      
  }

}
