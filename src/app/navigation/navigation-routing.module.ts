import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArticlesOvereviewComponent } from '../articles-overeview/articles-overeview.component';

const routes: Routes = [
  // {path:"", component: ArticlesOvereviewComponent},
  // {path: 'category', component: ArticlesOvereviewComponent, outlet:"sub"},
  // {path: "category/:name", component: ArticlesOvereviewComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NavigationRoutingModule { }
