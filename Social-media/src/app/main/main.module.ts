import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { LayoutComponent } from './layout/layout.component';
import { SlidebarComponent } from './shared/components/slidebar.component';
import { SidebarItemsComponent } from './shared/components/sidebar-items.component';
import { HeaderComponent } from './shared/components/header.component';
import { FollowBarComponent } from './shared/components/follow-bar.component';
import { AvatarComponent } from './shared/components/avatar.component';
import { LoginModalComponent } from './shared/auth/login-modal/login-modal.component';
import { RegisterModalComponent } from './shared/auth/register-modal/register-modal.component';
import { ModalComponent } from './shared/components/modal.component';
import { ButtonComponent } from './shared/components/button.component';
import { ReactiveFormsModule } from '@angular/forms';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { HomeComponent } from './home/home.component';
import { FormComponent } from './components/form.component';
import { PostsComponent } from './components/posts/posts.component';
import { FormsModule } from '@angular/forms';
import { PostItemsComponent } from './components/posts/post-items.component';
import { LoaderComponent } from './shared/components/loader.component';
import { DateAgoPipe } from './shared/pipes/date-ago.pipe';
import { CommentsComponent } from './components/comments/comments.component';
import { PostComponent } from './post/post.component';
import { SearchComponent } from './components/search/search.component';
import { FollowUserComponent } from './follow-user/follow-user.component';

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
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    ReactiveFormsModule,
    FormsModule, 
  ]
})
export class MainModule { }
