import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticlesOvereviewComponent } from './articles-overeview.component';

describe('ArticlesOvereviewComponent', () => {
  let component: ArticlesOvereviewComponent;
  let fixture: ComponentFixture<ArticlesOvereviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArticlesOvereviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArticlesOvereviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
