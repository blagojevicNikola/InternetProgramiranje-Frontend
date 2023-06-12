import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NavigationRoutingModule } from './navigation-routing.module';
import { NavigationComponent } from './navigation.component';
import { MaterialModule } from '../material/material.module';
import { SideNavComponent } from './components/side-nav/side-nav.component';
import { ArticlesOvereviewComponent } from '../articles-overeview/articles-overeview.component';
import { ArticlesListComponent } from '../articles-overeview/components/articles-list/articles-list.component';
import { AttributesDialogComponent } from '../new-article/components/attributes-dialog/attributes-dialog.component';


@NgModule({
  declarations: [NavigationComponent, SideNavComponent, ArticlesOvereviewComponent, AttributesDialogComponent,
    ArticlesListComponent],
  imports: [
    MaterialModule,
    CommonModule,
    NavigationRoutingModule,
    ReactiveFormsModule
  ],
  exports: [NavigationComponent, ArticlesOvereviewComponent, ArticlesListComponent]
})
export class NavigationModule { }
