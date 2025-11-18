import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChiligrinPage } from './chiligrin.page';

describe('ChiligrinPage', () => {
  let component: ChiligrinPage;
  let fixture: ComponentFixture<ChiligrinPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ChiligrinPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
