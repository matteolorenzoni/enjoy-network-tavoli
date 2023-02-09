import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InspectorParticipationListComponent } from './inspector-participation-list.component';

describe('InspectorParticipationListComponent', () => {
  let component: InspectorParticipationListComponent;
  let fixture: ComponentFixture<InspectorParticipationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InspectorParticipationListComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(InspectorParticipationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
