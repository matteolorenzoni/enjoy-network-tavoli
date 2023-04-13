import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ClientService } from 'src/app/services/client.service';
import { ToastService } from 'src/app/services/toast.service';
import { ParticipationService } from 'src/app/services/participation.service';
import { SessionStorageService } from 'src/app/services/sessionstorage.service';
import { Client } from 'src/app/models/type';
import { UtilsService } from 'src/app/services/utils.service';
import { Location } from '@angular/common';
import { environment } from 'src/environments/environment';

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

  /* Form */
  clientForm: FormGroup;
  phoneIsChecked = false;
  isLoading: boolean;

  /* Label */
  lblButton = 'Invia ticket';

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private clientService: ClientService,
    private participationService: ParticipationService,
    private sessionStorageService: SessionStorageService,
    private utilsService: UtilsService,
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

  /* ------------------------------------------- Lifecycle ------------------------------------------- */
  ngOnInit(): void {
    this.eventUid = this.route.snapshot.paramMap.get('eventUid');
    this.employeeUid = this.sessionStorageService.getEmployeeUid();
    this.tableUid = this.route.snapshot.paramMap.get('tableUid');
  }

  /* ------------------------------------------- Http Methods ------------------------------------------- */
  public async onSubmit() {
    if (this.clientForm.invalid) {
      this.toastService.showInfo('Inserire i dati correttamente');
      return;
    }

    try {
      this.isLoading = true;

      const { name, lastName, phone } = this.clientForm.value;

      const client: Client = {
        uid: '',
        props: {
          name: this.utilsService.capitalize(name.trim().replace(/\s\s+/g, ' ')),
          lastName: this.utilsService.capitalize(lastName.trim().replace(/\s\s+/g, ' ')),
          phone
        }
      };

      await this.addClient(client);
      await this.addParticipation(client);

      this.isLoading = false;

      this.goBack();
    } catch (err) {
      this.toastService.showError(err as Error);
    }
  }

  public async checkIfClientAlreadyExists() {
    if (!this.clientForm.value.phone) {
      this.toastService.showInfo('Inserire un numero di telefono');
      return;
    }

    try {
      this.isLoading = true;

      const client = await this.clientService.getClientByPhone(this.clientForm.value.phone);

      if (!client) {
        this.toastService.showInfo('Cliente non ancora registrato, inserire i dati');
        this.phoneIsChecked = true;
        this.clientForm.controls['name'].enable();
        this.clientForm.controls['lastName'].enable();
        this.isLoading = false;
        return;
      }

      const text = `Questo numero appartiene a: ${client.props.name} ${client.props.lastName}, lo vuoi aggiungere al tavolo?`;
      if (window.confirm(text) === true) {
        await this.addParticipation(client);
        this.isLoading = false;
        this.goBack();
      }
    } catch (err) {
      this.toastService.showError(err as Error);
    }
  }

  public async addClient(client: Client): Promise<void> {
    try {
      await this.clientService.addClient(client);
    } catch (err) {
      throw err as Error;
    }
  }

  public async addParticipation(client: Client): Promise<void> {
    if (!this.eventUid || !this.employeeUid || !this.tableUid) {
      throw new Error('Errore: parametri non validi');
    }

    try {
      const isTableFidelity = environment.fidelityTables.includes(this.tableUid);
      await this.participationService.addParticipation(this.eventUid, this.tableUid, client, isTableFidelity);
    } catch (err) {
      throw err as Error;
    }
  }

  /* ------------------------------------------- Methods ------------------------------------------- */
  public goBack() {
    this.clientForm.reset();
    this.location.back();
    this.toastService.showSuccess('Ticket inviato');
  }
}
