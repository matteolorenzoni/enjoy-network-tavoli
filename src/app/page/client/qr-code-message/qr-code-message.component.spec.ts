import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QrCodeMessageComponent } from './qr-code-message.component';

describe('QrCodeMessageComponent', () => {
  let component: QrCodeMessageComponent;
  let fixture: ComponentFixture<QrCodeMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QrCodeMessageComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(QrCodeMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
