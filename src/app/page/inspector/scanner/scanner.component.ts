import { faBan, faCircleCheck, faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import { Participation } from 'src/app/models/type';
import { Component, HostListener, ViewChild } from '@angular/core';
import { BarcodeFormat } from '@zxing/library';
import { Subscription } from 'rxjs';
import { ParticipationService } from 'src/app/services/participation.service';
import { UserService } from 'src/app/services/user.service';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  Html5Qrcode,
  Html5QrcodeResult,
  Html5QrcodeScanType,
  Html5QrcodeScanner,
  Html5QrcodeSupportedFormats
} from 'html5-qrcode';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Html5QrcodeError } from 'html5-qrcode/esm/core';
import { ToastService } from '../../../services/toast.service';

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

  /* Camera */
  availableDevices: MediaDeviceInfo[] = [];
  availableDevicesChecked = false;
  currentDevice?: MediaDeviceInfo;
  hasPermission?: boolean;
  formatsEnabled: BarcodeFormat[] = [BarcodeFormat.QR_CODE];
  enabled = false;

  /* Event */
  eventUid?: string;

  /* Participation */
  participation?: Participation;
  participationAlreadyScanned = false;
  participationsToScan: { participation: Participation; time: number }[] = [];
  participationNoGoodMotivation?: string;
  participationsActive: Participation[] = [];
  participationSubscription?: Subscription;

  readonly participationsToScanInterval = 10;
  lastParticipationUid?: string;

  /* Employee */
  employeeUid = '';

  /* ------------------------------------ Constructor ------------------------------------ */
  scanner?: Html5Qrcode;
  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private participationService: ParticipationService,
    private toastService: ToastService
  ) {
    this.employeeUid = this.userService.getUserUid();
    this.eventUid = this.route.snapshot.queryParams['event'] || undefined;
  }

  ngAfterViewInit(): void {
    const qrCodeSuccessCallback = (decodedText: string, decodedResult: Html5QrcodeResult) => {
      // handle the scanned code as you like, for example:
      console.log(`Code matched = ${decodedText}`, decodedResult);
    };

    const qrCodeErrorCallback = (errorMessage: string, error: Html5QrcodeError) => {
      // handle the scanned code as you like, for example:
      console.log(errorMessage, error);
    };

    const config = {
      fps: 10,
      qrbox: { width: 100, height: 100 },
      rememberLastUsedCamera: true,
      supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
      formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE]
    };

    const html5QrcodeScanner = new Html5QrcodeScanner('reader', config, /* verbose= */ false);
    html5QrcodeScanner.render(qrCodeSuccessCallback, qrCodeErrorCallback);
  }

  /* ------------------------------------ Lifecycle Hooks ------------------------------------ */
  ngOnInit(): void {
    this.getParticipationsActive();
  }

  ngOnDestroy(): void {
    if (this.participationSubscription) this.participationSubscription.unsubscribe();
    this.scanParticipations();
  }

  /* ------------------------------------ Hot listener ------------------------------------ */
  @HostListener('window:visibilitychange')
  visibilityChangeScanParticipations() {
    const path = environment.production ? 'visibilityChange' : 'z_visibilityChange';
    this.participationsToScan.forEach((participation) => {
      const url = `https://us-central1-enjoy-network-tavoli.cloudfunctions.net/${path}?participation=${participation.participation.uid}&scannedFrom=${this.employeeUid}`;
      navigator.sendBeacon(url);
      this.participationsToScan = this.participationsToScan.filter(
        (x) => x.participation.uid !== participation.participation.uid
      );
    });
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
          this.participationAlreadyScanned = true;
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
    console.log('onCamerasFound');
    if (!this.availableDevicesChecked) {
      this.availableDevicesChecked = true;
      this.availableDevices = devices;
    }
  }

  onCamerasNotFound(): void {
    console.log('onCamerasNotFound');
    if (!this.availableDevicesChecked) {
      this.availableDevicesChecked = true;
      this.lblCameraInfo = 'Nessuna camera trovata';
      this.toastService.showErrorMessage('Nessuna camera trovata');
    }
  }

  onDeviceSelectChange(event: Event) {
    console.log('onDeviceSelectChange');
    const { value } = event.target as HTMLSelectElement;
    const device = this.availableDevices.find((x) => x.deviceId === value);

    if (!device) {
      this.enabled = false;
      this.currentDevice = undefined;
      this.onResetParticipation();
      return;
    }

    this.enabled = true;
    this.currentDevice = device;
  }

  onHasPermission(has: boolean) {
    console.log('onHasPermission');
    this.hasPermission = has;
    if (!has) {
      this.toastService.showErrorMessage('Permessi alla camera negati');
    }
  }

  onScanSuccess(resultString: string) {
    console.log('onScanSuccess');
    if (this.participation || this.lastParticipationUid === resultString) return;
    this.getParticipation(resultString);
  }

  onScanNoSuccess() {
    console.log('onScanNoSuccess');
    this.toastService.showErrorMessage('Si è verificato un errore durante la scansione, riprovare');
  }

  /* ------------------------------------ Methods ------------------------------------ */
  getParticipation(participationUid: string) {
    this.lastParticipationUid = participationUid;
    const participationNotScannedYet = this.participationsActive.find(
      (participation) => participation.uid === participationUid
    );

    // Participation not active
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
      this.participationAlreadyScanned = true;
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
    if (this.participationsToScan.length === this.participationsToScanInterval) {
      this.scanParticipations();
    }
  }

  onResetParticipation() {
    this.participation = undefined;
    this.participationAlreadyScanned = false;
    this.participationNoGoodMotivation = undefined;
    this.lastParticipationUid = undefined;
  }
}
