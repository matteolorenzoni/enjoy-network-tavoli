import { DatePipe } from '@angular/common';
import { UserService } from 'src/app/services/user.service';
import { ActivatedRoute } from '@angular/router';
import { Participation, Table } from 'src/app/models/type';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ParticipationService } from 'src/app/services/participation.service';
import { ToastService } from 'src/app/services/toast.service';
import { TableService } from 'src/app/services/table.service';

@Component({
  selector: 'app-ticket-manual-validation',
  templateUrl: './ticket-manual-validation.component.html',
  styleUrls: ['./ticket-manual-validation.component.scss']
})
export class TicketManualValidationComponent {
  /* Form */
  phoneForm: FormGroup;
  nameAndLastNameForm: FormGroup;

  /* Event */
  eventUid?: string;

  /* Employee */
  employeeUid = '';

  /* Table */
  table?: Table;

  /* Participation */
  participation?: Participation;
  canGoToTheEvent = false;
  participationNoGoodMotivation = '';
  buttonDecision: 'ACCEPTED' | 'REJECTED' | '' = '';

  constructor(
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private userService: UserService,
    private tableService: TableService,
    private participationService: ParticipationService,
    private toastService: ToastService
  ) {
    this.employeeUid = this.userService.getUserUid();

    this.phoneForm = new FormGroup({
      phone: new FormControl(null, [Validators.required, Validators.pattern(/^\d{9,10}$/)])
    });

    this.nameAndLastNameForm = new FormGroup({
      name: new FormControl(null, [Validators.required, Validators.pattern(/[\S]/)]),
      lastName: new FormControl(null, [Validators.required, Validators.pattern(/[\S]/)])
    });
  }

  /* ---------------------------------- Lifecycle  ---------------------------------- */
  ngOnInit(): void {
    this.eventUid = this.route.snapshot.queryParams['event'];
    if (!this.eventUid) {
      this.toastService.showErrorMessage('Errore: parametri non validi');
      this.userService.logout();
    }
  }

  /* ---------------------------------- a ---------------------------------- */
  onSubmitByPhone() {
    if (!this.eventUid) {
      return;
    }

    if (this.phoneForm.invalid) {
      this.toastService.showErrorMessage('Inserire un numero di telefono valido');
      return;
    }

    this.participationService
      .getParticipationByPhone(this.eventUid, this.phoneForm.value.phone)
      .then((participation) => {
        this.phoneForm.reset();
        this.participation = participation;
        this.checkIfCanGoToTheEvent(participation);
        this.getTableName(participation.props.tableUid);
      })
      .catch((error) => {
        this.toastService.showError(error);
      });
  }

  onSubmitByNameAndLastName() {
    if (!this.eventUid) {
      return;
    }

    if (this.nameAndLastNameForm.invalid) {
      this.toastService.showErrorMessage('Inserire nome e cognome');
      return;
    }

    this.participationService
      .getParticipationByNameAndLastName(
        this.eventUid,
        this.nameAndLastNameForm.value.name,
        this.nameAndLastNameForm.value.lastName
      )
      .then((participation) => {
        this.nameAndLastNameForm.reset();
        this.participation = participation;
        this.checkIfCanGoToTheEvent(participation);
        this.getTableName(participation.props.tableUid);
      })
      .catch((error) => {
        this.toastService.showError(error);
      });
  }

  getTableName(tableUid: string) {
    this.tableService
      .getTable(tableUid)
      .then((table) => {
        this.table = table;
      })
      .catch((error) => {
        this.toastService.showError(error);
      });
  }

  acceptParticipation() {
    if (!this.participation || !this.employeeUid) {
      this.userService.logout();
      return;
    }

    /* Disable forms */
    this.phoneForm.disable();
    this.nameAndLastNameForm.disable();

    this.participationService
      .scanAndGetParticipation(this.participation.uid, this.employeeUid)
      .then(() => {
        this.buttonDecision = 'ACCEPTED';
        this.canGoToTheEvent = true;
        this.resetValues();
        this.toastService.showSuccess('Partecipazione accettata');
      })
      .catch((error) => {
        this.toastService.showError(error);
      });
  }

  rejectParticipation() {
    if (!this.eventUid || !this.table || !this.participation) {
      this.userService.logout();
      return;
    }

    /* Disable forms */
    this.phoneForm.disable();
    this.nameAndLastNameForm.disable();

    this.participationService
      .updateParticipationNotActive(this.eventUid, this.table.props.employeeUid, this.participation.uid)
      .then(() => {
        this.participationNoGoodMotivation = 'Partecipazione rifiutata';
        this.buttonDecision = 'REJECTED';
        this.canGoToTheEvent = false;
        this.resetValues();
        this.toastService.showSuccess('Partecipazione rifiutata');
      })
      .catch((error) => {
        this.toastService.showError(error);
      });
  }

  resetValues() {
    setTimeout(() => {
      this.phoneForm.enable();
      this.nameAndLastNameForm.enable();
      this.participation = undefined;
      this.canGoToTheEvent = false;
      this.participationNoGoodMotivation = '';
      this.buttonDecision = '';
      this.table = undefined;
    }, 4000);
  }

  checkIfCanGoToTheEvent(participation: Participation) {
    this.canGoToTheEvent = participation.props.isActive && !participation.props.scannedAt;
    if (!this.canGoToTheEvent) {
      this.participationNoGoodMotivation = !participation.props.isActive
        ? 'Partecipazione non attiva'
        : `Partecipazione già scansionata alle ${this.datePipe.transform(participation.props.scannedAt, 'HH:mm:ss')}`;
    }
  }
}
