import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReymaPage } from './reyma.page';

describe('ReymaPage', () => {
  let component: ReymaPage;
  let fixture: ComponentFixture<ReymaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ReymaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
