import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrActiveComponent } from './pr-active.component';

describe('PrActiveComponent', () => {
  let component: PrActiveComponent;
  let fixture: ComponentFixture<PrActiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrActiveComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PrActiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
