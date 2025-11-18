import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AnguiplastPage } from './anguiplast.page';

describe('AnguiplastPage', () => {
  let component: AnguiplastPage;
  let fixture: ComponentFixture<AnguiplastPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AnguiplastPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
