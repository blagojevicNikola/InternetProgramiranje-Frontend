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
import { ArticlesMainPageComponent } from './articles-main-page/articles-main-page.component';
import { ArticlesSearchPageComponent } from './articles-search-page/articles-search-page.component';
import { PaymentComponent } from './payment/payment.component';
import { ActivateProfileComponent } from './activate-profile/activate-profile.component';
import { SignedInGuard } from './share/guards/signed-in.guard';
import { CanActivateGuard } from './share/guards/can-activate.guard';
import { NotFoundComponent } from './not-found/not-found.component';

const routes: Routes = [
  {path: "login", component: LoginComponent},
  {path: "register", component: RegisterComponent},
  {path:"activate", component:ActivateProfileComponent, canActivate:[CanActivateGuard]},
  {path: '', component: NavigationComponent, children: [
    {path:'', component:ArticlesMainPageComponent},
    {path:'search', component: ArticlesSearchPageComponent},
    {path:':name', component: ArticlesOvereviewComponent},
    {path: 'article/new', component: NewArticleComponent, canActivate:[SignedInGuard]},
    {path:"article/:id", component: ReviewComponent},
    {path: "profile/:name", component: ProfileComponent},
    {path: 'update/:id', component: UpdateArticleComponent, canActivate:[SignedInGuard]},
    {path: 'profile/edit/:username', component: EditProfileComponent, canActivate:[SignedInGuard]},
    {path: 'support/chat', component: SupportChatComponent, canActivate:[SignedInGuard]},
    {path: 'buy/:id', component: PaymentComponent, canActivate:[SignedInGuard]}
  ]},
  {path:'**', component:NotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass:SpinnerInterceptor, multi:true}
  ]
})
export class AppRoutingModule { }
