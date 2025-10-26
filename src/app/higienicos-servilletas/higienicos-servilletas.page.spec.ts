import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HigienicosServilletasPage } from './higienicos-servilletas.page';

describe('HigienicosServilletasPage', () => {
  let component: HigienicosServilletasPage;
  let fixture: ComponentFixture<HigienicosServilletasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HigienicosServilletasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
