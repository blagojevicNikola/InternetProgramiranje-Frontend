import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticlesSearchPageComponent } from './articles-search-page.component';

describe('ArticlesSearchPageComponent', () => {
  let component: ArticlesSearchPageComponent;
  let fixture: ComponentFixture<ArticlesSearchPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArticlesSearchPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArticlesSearchPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
