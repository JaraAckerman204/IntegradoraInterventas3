import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BolsasPage } from './bolsas.page';

describe('BolsasPage', () => {
  let component: BolsasPage;
  let fixture: ComponentFixture<BolsasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(BolsasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
