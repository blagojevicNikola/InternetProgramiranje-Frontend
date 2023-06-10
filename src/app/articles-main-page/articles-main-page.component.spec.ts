import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticlesMainPageComponent } from './articles-main-page.component';

describe('ArticlesMainPageComponent', () => {
  let component: ArticlesMainPageComponent;
  let fixture: ComponentFixture<ArticlesMainPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArticlesMainPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArticlesMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
