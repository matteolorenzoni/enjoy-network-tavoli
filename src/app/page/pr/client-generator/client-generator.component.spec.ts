import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientGeneratorComponent } from './client-generator.component';

describe('ClientGeneratorComponent', () => {
  let component: ClientGeneratorComponent;
  let fixture: ComponentFixture<ClientGeneratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClientGeneratorComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ClientGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
