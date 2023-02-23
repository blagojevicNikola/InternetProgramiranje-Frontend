import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArticlesOvereviewComponent } from './articles-overeview/articles-overeview.component';

const routes: Routes = [
  {path: "category", component: ArticlesOvereviewComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
