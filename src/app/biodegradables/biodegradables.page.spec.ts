import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BiodegradablesPage } from './biodegradables.page';

describe('BiodegradablesPage', () => {
  let component: BiodegradablesPage;
  let fixture: ComponentFixture<BiodegradablesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(BiodegradablesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
