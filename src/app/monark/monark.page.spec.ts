import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MonarkPage } from './monark.page';

describe('MonarkPage', () => {
  let component: MonarkPage;
  let fixture: ComponentFixture<MonarkPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MonarkPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
