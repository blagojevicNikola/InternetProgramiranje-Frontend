import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArticlesOvereviewComponent } from './articles-overeview/articles-overeview.component';
import { LoginComponent } from './login/login.component';
import { NavigationComponent } from './navigation/navigation.component';
import { NewArticleComponent } from './new-article/new-article.component';
import { ProfileComponent } from './profile/profile.component';
import { RegisterComponent } from './register/register.component';
import { ReviewComponent } from './review/review.component';
import { SpinnerInterceptor } from './share/interceptors/spinner/spinner.interceptor';
import { UpdateArticleComponent } from './update-article/update-article.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { SupportChatComponent } from './support-chat/support-chat.component';

const routes: Routes = [
  {path: "login", component: LoginComponent},
  {path: "register", component: RegisterComponent},
  {path: '', component: NavigationComponent, children: [
    {path:'', component:ArticlesOvereviewComponent},
    {path: 'category', component: NavigationComponent},
    {path:'category/:name', component: ArticlesOvereviewComponent},
    {path:":id", component: ReviewComponent},
    {path: "profile/:name", component: ProfileComponent},
    {path: 'article/new', component: NewArticleComponent},
    {path: 'update/:id', component: UpdateArticleComponent},
    {path: 'profile/edit/:username', component: EditProfileComponent},
    {path: 'support/chat', component: SupportChatComponent},
  ]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass:SpinnerInterceptor, multi:true}
  ]
})
export class AppRoutingModule { }
