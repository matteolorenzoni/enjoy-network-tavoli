import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ClientService } from 'src/app/services/client.service';
import { ToastService } from 'src/app/services/toast.service';
import { Location } from '@angular/common';
import { ParticipationService } from 'src/app/services/participation.service';
import { SessionStorageService } from 'src/app/services/sessionstorage.service';
import { Client } from 'src/app/models/type';

@Component({
  selector: 'app-client-generator',
  templateUrl: './client-generator.component.html',
  styleUrls: ['./client-generator.component.scss']
})
export class ClientGeneratorComponent implements OnInit {
  /* Event */
  eventUid: string | null = null;

  /* Employee */
  employeeUid: string | null = null;

  /* Table */
  tableUid: string | null = null;

  /* Client */
  clientUid: string | null = null;

  /* Form */
  clientForm: FormGroup;
  phoneIsChecked = false;
  isLoading: boolean;

  /* Label */
  lblButton = 'Crea cliente';

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private clientService: ClientService,
    private participation: ParticipationService,
    private sessionStorage: SessionStorageService,
    private toastService: ToastService
  ) {
    /* Init form */
    this.clientForm = new FormGroup({
      name: new FormControl(null, [Validators.required, Validators.pattern(/[\S]/)]),
      lastName: new FormControl(null, [Validators.required, Validators.pattern(/[\S]/)]),
      phone: new FormControl(null, [Validators.required, Validators.pattern(/^\d{9,10}$/)])
    });

    /* Disable name and last name until phone is checked */
    this.clientForm.controls['name'].disable();
    this.clientForm.controls['lastName'].disable();

    /* Reset name and last name when phone is changed */
    this.clientForm.controls['phone'].valueChanges.subscribe(() => {
      this.clientForm.controls['name'].reset();
      this.clientForm.controls['lastName'].reset();
      this.phoneIsChecked = false;
    });

    this.isLoading = false;
  }

  ngOnInit(): void {
    this.eventUid = this.route.snapshot.paramMap.get('eventUid');
    this.employeeUid = this.sessionStorage.getEmployeeUid();
    this.tableUid = this.route.snapshot.paramMap.get('tableUid');
    this.clientUid = this.route.snapshot.paramMap.get('uid');
  }

  public onSubmit() {
    this.isLoading = true;
    this.addParticipationAndClient();
  }

  public checkIfPhoneNumberIsAlreadyUsed() {
    if (this.clientForm.value.phone) {
      this.clientService
        .getClientByPhone(this.clientForm.value.phone)
        .then((client) => {
          if (client) {
            // TODO: mettere il popup
            alert(
              `Questo numero appartiene a: ${client?.props.name} ${client?.props.lastName}, lo vuoi aggiungere al tavolo?`
            );

            this.addParticipation();
          } else {
            this.phoneIsChecked = true;
            this.clientForm.controls['name'].enable();
            this.clientForm.controls['lastName'].enable();
          }
        })
        .catch((err: Error) => {
          this.toastService.showError(err);
        });
    }
  }

  public addParticipationAndClient(): void {
    /* Check if the uids are valid */
    if (!this.eventUid || !this.employeeUid || !this.tableUid || !this.clientUid) {
      throw new Error('Errore: parametri non validi');
    }

    const newClient: Client = {
      uid: this.clientUid === 'null' ? '' : this.clientUid,
      props: {
        name: this.clientForm.value.name
          .split(' ')
          .map((word: string) => word.charAt(0).toUpperCase() + word.substring(1).toLowerCase())
          .join(' '),
        lastName: this.clientForm.value.lastName
          .split(' ')
          .map((word: string) => word.charAt(0).toUpperCase() + word.substring(1).toLowerCase())
          .join(' '),
        phone: this.clientForm.getRawValue().phone
      }
    };

    /* Add or update the table */
    this.clientService
      .addOrUpdateClient(newClient, this.eventUid, this.employeeUid, this.tableUid)
      .then(() => {
        this.clientForm.reset();
        this.location.back();
        this.toastService.showSuccess('Cliente creato');
      })
      .catch((err: Error) => {
        this.toastService.showError(err);
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  public addParticipation(): void {
    /* Check if the uids are valid */
    if (!this.eventUid || !this.employeeUid || !this.tableUid || !this.clientUid) {
      throw new Error('Errore: parametri non validi');
    }

    this.participation
      .addParticipation(this.eventUid, this.employeeUid, this.tableUid, this.clientUid)
      .then(() => {
        this.toastService.showSuccess('Partecipazione aggiunta');
      })
      .catch((err: Error) => {
        this.toastService.showError(err);
      });
  }
}
