import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../shared/services/catetgory.service';
import { Category } from '../../interface';
import { Router } from '@angular/router';
import { ConfigService } from '../../shared/services/config.service';
import { ModelService } from '../../shared/services/model.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  categories: Category[] = [];
  showModal: boolean = false;
  newCategoryName: string = '';

  constructor(private modal: ModelService, private categoryService: CategoryService, private router: Router, private config: ConfigService) { }

  ngOnInit(): void {
    this.config.updateHeaderSettings('Category');
    this.categoryService.getCategories().subscribe(categories => {
      this.categories = categories;
    });
  }

  openAddCategoryModal(): void {
    this.showModal = true;
  }

  closeAddCategoryModal(): void {
    this.showModal = false;
    this.newCategoryName = '';
  }

  addCategory(): void {
    if (this.newCategoryName.trim()) {
      this.categoryService.addCategory(this.newCategoryName).then(() => {
        console.log('Category added successfully');
        this.closeAddCategoryModal();
      }).catch(error => {
        console.error('Error adding category:', error);
      });
    }
  }

  deleteCategory(categoryId: string): void {
    this.categoryService.deleteCategory(categoryId).then(() => {
      console.log('Category deleted successfully');
    }).catch(error => {
      console.error('Error deleting category:', error);
    });
  }

  navigateToCategoryPage(categoryId: string): void {
    this.router.navigate([`/categoryhome/${categoryId}`]);
  }
}
