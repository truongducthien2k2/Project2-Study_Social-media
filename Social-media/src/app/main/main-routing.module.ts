import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { HomeComponent } from './pages/home/home.component';
import { PostComponent } from './components/post/post.component';
import { SearchComponent } from './pages/search/search.component';

const routes: Routes = [
  {
    path: '' , component:LayoutComponent, children : [
      {
        path: '', component: HomeComponent, pathMatch: 'full'
      },
      {
        path: 'post/:id', component: PostComponent
      },
      {
        path: 'user/:id', component: UserProfileComponent
      },
      {
        path: 'search', component: SearchComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
