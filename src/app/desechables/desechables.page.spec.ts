import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DesechablesPage } from './desechables.page';

describe('DesechablesPage', () => {
  let component: DesechablesPage;
  let fixture: ComponentFixture<DesechablesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DesechablesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
