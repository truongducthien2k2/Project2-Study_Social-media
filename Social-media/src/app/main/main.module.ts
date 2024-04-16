import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { LayoutComponent } from './layout/layout.component';
import { SlidebarComponent } from './shared/components/slidebar.component';
import { SidebarItemsComponent } from './shared/components/sidebar-items.component';


@NgModule({
  declarations: [
    LayoutComponent,
    SlidebarComponent,
    SidebarItemsComponent
  ],
  imports: [
    CommonModule,
    MainRoutingModule
  ]
})
export class MainModule { }
