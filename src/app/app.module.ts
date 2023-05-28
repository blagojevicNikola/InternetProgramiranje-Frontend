import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { NavigationModule } from './navigation/navigation.module';
import { RegisterComponent } from './register/register.component';
import { ReviewComponent } from './review/review.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfileComponent } from './profile/profile.component';
import { ImageSliderComponent } from './review/components/image-slider/image-slider.component';
import { NewArticleComponent } from './new-article/new-article.component';
import { AttributesDialogComponent } from './new-article/components/attributes-dialog/attributes-dialog.component';
import { WarningDialogComponent } from './new-article/components/warning-dialog/warning-dialog.component';
import { TokenInterceptorInterceptor } from './share/interceptors/token/token-interceptor.interceptor';
import { ApproveDialogComponent } from './review/components/approve-dialog/approve-dialog.component';
import { UpdateArticleComponent } from './update-article/update-article.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { SupportChatComponent } from './support-chat/support-chat.component';
import { MessagesListComponent } from './support-chat/components/messages-list/messages-list.component';
import { FilterDialogComponent } from './articles-overeview/components/filter-dialog/filter-dialog/filter-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ReviewComponent,
    ProfileComponent,
    ImageSliderComponent,
    NewArticleComponent,
    AttributesDialogComponent,
    WarningDialogComponent,
    ApproveDialogComponent,
    UpdateArticleComponent,
    EditProfileComponent,
    SupportChatComponent,
    MessagesListComponent,
    FilterDialogComponent,
  ],
  imports: [
    BrowserModule,
    MaterialModule,
    NavigationModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS, useClass: TokenInterceptorInterceptor, multi:true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
