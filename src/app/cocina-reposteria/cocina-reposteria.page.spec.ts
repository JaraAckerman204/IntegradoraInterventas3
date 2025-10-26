import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CocinaReposteriaPage } from './cocina-reposteria.page';

describe('CocinaReposteriaPage', () => {
  let component: CocinaReposteriaPage;
  let fixture: ComponentFixture<CocinaReposteriaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CocinaReposteriaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
