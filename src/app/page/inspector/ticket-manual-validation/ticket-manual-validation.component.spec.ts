import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketManualValidationComponent } from './ticket-manual-validation.component';

describe('TicketManualValidationComponent', () => {
  let component: TicketManualValidationComponent;
  let fixture: ComponentFixture<TicketManualValidationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TicketManualValidationComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TicketManualValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
