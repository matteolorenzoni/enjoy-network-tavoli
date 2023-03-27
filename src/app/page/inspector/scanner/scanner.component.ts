import { faBan, faCircleCheck, faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import { Participation } from 'src/app/models/type';
import { Component } from '@angular/core';
import { BarcodeFormat } from '@zxing/library';
import { BehaviorSubject } from 'rxjs';
import { ParticipationService } from 'src/app/services/participation.service';
import { UserService } from 'src/app/services/user.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.component.html',
  styleUrls: ['./scanner.component.scss']
})
export class ScannerComponent {
  /* Icon */
  checkIcon = faCircleCheck;
  exclamationIcon = faCircleExclamation;
  banIcon = faBan;

  /* Label */
  lblButton = 'SCAN';
  lblCameraInfo = 'Nessuna camera selezionata';

  availableDevices: MediaDeviceInfo[] = [];
  availableDevicesChecked = false;
  currentDevice?: MediaDeviceInfo;
  hasDevices?: boolean;
  hasPermission?: boolean;
  formatsEnabled: BarcodeFormat[] = [BarcodeFormat.QR_CODE];
  enabled = false;

  /* Participation */
  participationUid = new BehaviorSubject('');
  participation?: Participation;
  isInScanRange = false;
  participationNoGoodMotivation = '';

  /* Employee */
  employeeUid = '';

  /* ------------------------------------ Constructor ------------------------------------ */
  constructor(
    private userService: UserService,
    private participationService: ParticipationService,
    private toastService: ToastService
  ) {
    // navigator.mediaDevices
    //   .getUserMedia({ video: true })
    //   .then((stream) => {
    //     this.hasPermission = true;
    //     stream.getTracks().forEach((track) => track.stop());
    //   })
    //   .catch(() => {
    //     this.hasPermission = false;
    //   });

    this.employeeUid = this.userService.getUserUid();

    this.participationUid.subscribe((newParticipation) => {
      if (newParticipation) {
        this.getParticipation(newParticipation);
      }
    });

    // setTimeout(() => {
    //   this.onScanSuccess('qkV4Ya1tZkooCIDO0g1D');
    // }, 3000);
  }

  /* ------------------------------------ HTTP Methods ------------------------------------ */
  getParticipation(participationUid: string) {
    this.participationService
      .scanAndGetParticipation(participationUid, this.employeeUid)
      .then((participation) => {
        this.participation = participation;

        const { isActive, scannedAt } = participation.props;

        if (!isActive) {
          this.isInScanRange = false;
          this.participationNoGoodMotivation = 'Il ticket non è valido';
          return;
        }

        if (scannedAt) {
          this.isInScanRange = (new Date().getTime() - scannedAt.getTime()) / 1000 < 5;

          if (!this.isInScanRange) {
            this.participationNoGoodMotivation = 'Il ticket è già stato scansionato';
          }
        }
      })
      .catch((error) => {
        this.toastService.showError(error);
      });
  }

  /* ------------------------------------ Methods ------------------------------------ */
  onCamerasFound(devices: MediaDeviceInfo[]): void {
    if (!this.availableDevicesChecked) {
      this.availableDevicesChecked = true;
      this.availableDevices = devices;
      this.hasDevices = Boolean(devices && devices.length);
    }
  }

  onCamerasNotFound(): void {
    if (!this.availableDevicesChecked) {
      this.availableDevicesChecked = true;
      this.lblCameraInfo = 'Nessuna camera trovata';
      this.toastService.showErrorMessage('Nessuna camera trovata');
    }
  }

  onDeviceSelectChange(event: Event) {
    const { value } = event.target as HTMLSelectElement;
    const device = this.availableDevices.find((x) => x.deviceId === value);
    this.enabled = Boolean(device);
    this.currentDevice = device;
  }

  onHasPermission(has: boolean) {
    this.hasPermission = has;
  }

  onScanSuccess(resultString: string) {
    this.participationUid.next(resultString);
  }

  onScanNoSuccess() {
    this.participationUid.next('');
    this.toastService.showErrorMessage('Si è verificato un errore durante la scansione, riprovare');
  }

  onResetParticipation() {
    this.participationUid.next('');
    this.isInScanRange = false;
    this.participation = undefined;
  }
}
