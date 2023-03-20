import { faCircleCheck, faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
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

  /* Label */
  lblButton = 'SCAN';

  availableDevices: MediaDeviceInfo[] = [];
  currentDevice?: MediaDeviceInfo;
  hasDevices?: boolean;
  hasPermission?: boolean;

  formatsEnabled: BarcodeFormat[] = [
    BarcodeFormat.CODE_128,
    BarcodeFormat.DATA_MATRIX,
    BarcodeFormat.EAN_13,
    BarcodeFormat.QR_CODE
  ];

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
    this.employeeUid = this.userService.getUserUid();

    this.participationUid.subscribe((newParticipation) => {
      if (newParticipation) {
        this.getParticipation(newParticipation);
      }
    });
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
    this.availableDevices = devices;
    this.hasDevices = Boolean(devices && devices.length);
  }

  onDeviceSelectChange(event: Event) {
    const { value } = event.target as HTMLSelectElement;
    const device = this.availableDevices.find((x) => x.deviceId === value);
    this.currentDevice = device;
  }

  onHasPermission(has: boolean) {
    this.hasPermission = has;
  }

  onNewParticipation(resultString: string) {
    this.participationUid.next(resultString);
  }

  onResetParticipation() {
    this.participationUid.next('');
    this.isInScanRange = false;
    this.participation = undefined;
  }
}
