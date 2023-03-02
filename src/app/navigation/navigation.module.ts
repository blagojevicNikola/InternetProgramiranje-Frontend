import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NavigationRoutingModule } from './navigation-routing.module';
import { NavigationComponent } from './navigation.component';
import { MaterialModule } from '../material/material.module';
import { SideNavComponent } from './components/side-nav/side-nav.component';
import { ArticlesOvereviewComponent } from '../articles-overeview/articles-overeview.component';
import { ArticlesListComponent } from '../articles-overeview/components/articles-list/articles-list.component';


@NgModule({
  declarations: [NavigationComponent, SideNavComponent, ArticlesOvereviewComponent,
    ArticlesListComponent],
  imports: [
    MaterialModule,
    CommonModule,
    NavigationRoutingModule,
  ],
  exports: [NavigationComponent, ArticlesOvereviewComponent]
})
export class NavigationModule { }
