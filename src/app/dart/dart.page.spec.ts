import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DartPage } from './dart.page';

describe('DartPage', () => {
  let component: DartPage;
  let fixture: ComponentFixture<DartPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DartPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
