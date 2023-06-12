import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Article } from 'src/app/share/models/article';

@Component({
  selector: 'app-articles-list',
  templateUrl: './articles-list.component.html',
  styleUrls: ['./articles-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArticlesListComponent {
  @Input() articles: Article[] = [];

  constructor(){}

}
