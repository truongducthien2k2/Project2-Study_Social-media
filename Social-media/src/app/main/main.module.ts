import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { LayoutComponent } from './layout/layout.component';
import { SlidebarComponent } from './components/small-components/slidebar.component';
import { SidebarItemsComponent } from './components/small-components/sidebar-items.component';
import { HeaderComponent } from './components/small-components/header.component';
import { FollowBarComponent } from './components/small-components/follow-bar.component';
import { AvatarComponent } from './components/small-components/avatar.component';
import { LoginModalComponent } from './shared/auth/login-modal/login-modal.component';
import { RegisterModalComponent } from './shared/auth/register-modal/register-modal.component';
import { ModalComponent } from './components/small-components/modal.component';
import { ButtonComponent } from './components/small-components/button.component';
import { ReactiveFormsModule } from '@angular/forms';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { EditUserComponent } from './components/edit-user/edit-user.component';
import { HomeComponent } from './pages/home/home.component';
import { FormComponent } from './components/form.component';
import { PostsComponent } from './components/posts/posts.component';
import { FormsModule } from '@angular/forms';
import { PostItemsComponent } from './components/posts/post-items.component';
import { LoaderComponent } from './components/small-components/loader.component';
import { DateAgoPipe } from './shared/pipes/date-ago.pipe';
import { CommentsComponent } from './components/comments/comments.component';
import { PostComponent } from './components/post/post.component';
import { SearchComponent } from './pages/search/search.component';
import { FollowUserComponent } from './components/follow-user/follow-user.component';
import { NotificationComponent } from './pages/notification/notification.component';
@NgModule({
  declarations: [
    LayoutComponent,
    SlidebarComponent,
    SidebarItemsComponent,
    HeaderComponent,
    FollowBarComponent,
    AvatarComponent,
    LoginModalComponent,
    RegisterModalComponent,
    ModalComponent,
    ButtonComponent,
    UserProfileComponent,
    EditUserComponent,
    HomeComponent,
    FormComponent,
    PostsComponent,
    PostItemsComponent,
    LoaderComponent,
    DateAgoPipe,
    CommentsComponent,
    PostComponent,
    SearchComponent,
    FollowUserComponent,
    NotificationComponent,
    
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    ReactiveFormsModule,
    FormsModule, 
    
  ]
})
export class MainModule { }
