import { faBan, faCircleCheck, faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import { Participation } from 'src/app/models/type';
import { Component, ViewChild } from '@angular/core';
import { BarcodeFormat } from '@zxing/library';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ParticipationService } from 'src/app/services/participation.service';
import { UserService } from 'src/app/services/user.service';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from '../../../services/toast.service';

const PARTICIPATION_COUNT = 5;

@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.component.html',
  styleUrls: ['./scanner.component.scss']
})
export class ScannerComponent {
  @ViewChild('cameraContainer') cameraContainer: any;
  @ViewChild('infoContainer') infoContainer: any;

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

  /* Event */
  eventUid?: string;

  /* Participation */
  participationUid = new BehaviorSubject('');
  participation?: Participation;
  participationScannedBefore = false;
  participationNoGoodMotivation?: string;
  participationsActive: Participation[] = [];
  participationsToScan: { participation: Participation; time: number }[] = [];
  participationSubscription?: Subscription;

  /* Employee */
  employeeUid = '';

  /* ------------------------------------ Constructor ------------------------------------ */
  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private participationService: ParticipationService,
    private toastService: ToastService
  ) {
    this.employeeUid = this.userService.getUserUid();
    this.eventUid = this.route.snapshot.queryParams['event'] || undefined;

    this.participationUid.subscribe((newParticipation) => {
      if (newParticipation) {
        this.getParticipation(newParticipation);
      } else if (this.currentDevice) {
        this.cameraContainer.nativeElement.style.display = 'flex';
        this.infoContainer.nativeElement.style.display = 'none';
      } else {
        if (!this.cameraContainer || !this.infoContainer) return;
        this.cameraContainer.nativeElement.style.display = 'none';
        this.infoContainer.nativeElement.style.display = 'flex';
      }
    });
  }

  /* ------------------------------------ Lifecycle Hooks ------------------------------------ */
  ngOnInit(): void {
    this.getParticipationsActive();
  }

  ngOnDestroy(): void {
    if (this.participationSubscription) this.participationSubscription.unsubscribe();
    this.scanParticipations();
  }

  /* ------------------------------------ HTTP Methods ------------------------------------ */
  getParticipationsActive() {
    if (!this.eventUid) {
      this.toastService.showErrorMessage('Errore, parametri non validi');
      return;
    }

    this.participationService
      .getParticipationsNotScannedByEventUid(this.eventUid)
      .then((participations) => {
        this.participationsActive = participations;
      })
      .catch((error) => {
        this.toastService.showError(error);
      });
  }

  getParticipationFromNoList(participationUid: string) {
    this.participationService
      .getParticipationByUid(participationUid)
      .then((participation) => {
        this.participation = participation;

        const { isActive, isScanned } = participation.props;
        if (!isActive) {
          this.participationNoGoodMotivation = 'Il ticket non è valido';
          return;
        }
        if (isScanned) {
          this.participationScannedBefore = true;
          this.participationNoGoodMotivation = 'Il ticket è già stato scansionato';
        }
      })
      .catch((error) => {
        this.onResetParticipation();
        this.toastService.showError(error);
      });
  }

  scanParticipations() {
    if (this.participationsToScan.length === 0) return;

    const currentTime = new Date().getTime();

    const participationsToManage = this.participationsToScan
      .filter((participation) => currentTime >= participation.time)
      .map((participation) => participation.participation);

    this.participationService
      .scanMultipleParticipations(participationsToManage)
      .then(() => {
        this.participationsToScan = this.participationsToScan.filter(
          (participation) => currentTime < participation.time
        );
        this.toastService.showSuccess('Partecipazioni salvate con successo');
      })
      .catch((error) => {
        this.toastService.showError(error);
      });
  }

  /* ------------------------------------ Camera methods ------------------------------------ */
  onCamerasFound(devices: MediaDeviceInfo[]): void {
    if (!this.availableDevicesChecked) {
      this.availableDevicesChecked = true;
      this.cameraContainer.nativeElement.style.display = 'none';
      this.infoContainer.nativeElement.style.display = 'flex';
      this.availableDevices = devices;
      this.hasDevices = Boolean(devices && devices.length);
    }
  }

  onCamerasNotFound(): void {
    if (!this.availableDevicesChecked) {
      this.availableDevicesChecked = true;
      this.cameraContainer.nativeElement.style.display = 'none';
      this.infoContainer.nativeElement.style.display = 'flex';
      this.lblCameraInfo = 'Nessuna camera trovata';
      this.toastService.showErrorMessage('Nessuna camera trovata');
    }
  }

  onDeviceSelectChange(event: Event) {
    const { value } = event.target as HTMLSelectElement;
    const device = this.availableDevices.find((x) => x.deviceId === value);
    this.cameraContainer.nativeElement.style.display = 'none';
    if (!device) this.infoContainer.nativeElement.style.display = 'flex';
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

  /* ------------------------------------ Methods ------------------------------------ */
  getParticipation(participationUid: string) {
    this.cameraContainer.nativeElement.style.display = 'none';
    this.infoContainer.nativeElement.style.display = 'none';

    const participationNotScannedYet = this.participationsActive.find(
      (participation) => participation.uid === participationUid
    );

    // Participation active and not scanned
    if (!participationNotScannedYet) {
      this.getParticipationFromNoList(participationUid);

      return;
    }

    this.getParticipationFromList(participationNotScannedYet);
  }
  getParticipationFromList(participation: Participation) {
    this.participation = participation;

    /* If participation is already scanned, show error */
    if (this.participation.props.isScanned) {
      this.participationScannedBefore = true;
      this.participationNoGoodMotivation = 'Il ticket è già stato scansionato';
      return;
    }

    /* If participation is not already scanned, update and add it to the list of participations to scan */
    this.participation.props.isScanned = true;
    this.participation.props.scannedAt = new Date();
    this.participation.props.scannedFrom = this.employeeUid;
    this.participationsToScan.push({
      participation: this.participation,
      time: new Date().getTime()
    });

    /* If the list of participations to scan is full, scan them */
    if (this.participationsToScan.length === PARTICIPATION_COUNT) {
      this.scanParticipations();
    }
  }

  onResetParticipation() {
    this.participationUid.next('');
    this.participation = undefined;
    this.participationScannedBefore = false;
    this.participationNoGoodMotivation = undefined;
  }
}
