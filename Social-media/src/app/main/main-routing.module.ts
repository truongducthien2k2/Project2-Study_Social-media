import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { HomeComponent } from './pages/home/home.component';
import { PostComponent } from './components/post/post.component';
import { SearchComponent } from './pages/search/search.component';
import { NotificationComponent } from './pages/notification/notification.component';
import { AdminhomeComponent } from './components/adminhome/adminhome.component';
import { RepotformComponent } from './components/repotform/repotform.component';
import { CategoryComponent } from './pages/category/category.component';
import { CategoryhomeComponent } from './pages/categoryhome/categoryhome.component';
import { FavouriteComponent } from './pages/favourite/favourite.component';
const routes: Routes = [
  {
    path: '' , component:LayoutComponent, children : [
      {
        path: '', component: HomeComponent, pathMatch: 'full'
      },
      {
        path: 'admin/:id', component: AdminhomeComponent, pathMatch: 'full'
      },
      { path: 'notifications', component: NotificationComponent },
      {
        path: 'post/:id', component: PostComponent
      },
      {
        path: 'user/:id', component: UserProfileComponent
      },
      {
        path: 'search', component: SearchComponent
      },
      {
        path: 'favourite', component: FavouriteComponent
      },
      {
        path: 'adminhome', component: AdminhomeComponent
      },
      {
        path: 'reportform', component: RepotformComponent
      },
      {
        path: 'category', component: CategoryComponent,pathMatch: 'full'
      },
      { path: '', redirectTo: '/categories', pathMatch: 'full' },
      { path: 'categories', component: CategoryComponent },
      { path: 'categoryhome/:categoryid', component: CategoryhomeComponent }
    ]

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
