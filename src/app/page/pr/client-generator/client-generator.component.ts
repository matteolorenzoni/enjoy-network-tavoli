import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ClientService } from 'src/app/services/client.service';
import { ToastService } from 'src/app/services/toast.service';
import { ParticipationService } from 'src/app/services/participation.service';
import { Client } from 'src/app/models/type';
import { UtilsService } from 'src/app/services/utils.service';
import { Location } from '@angular/common';
import { environment } from 'src/environments/environment';
import { UserService } from 'src/app/services/user.service';

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
  clientNumberForm: FormGroup;
  clientInfoForm: FormGroup;
  phoneIsChecked = false;
  isLoading: boolean;

  /* Label */
  lblButton = 'Invia ticket';

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private userService: UserService,
    private clientService: ClientService,
    private participationService: ParticipationService,
    private utilsService: UtilsService,
    private toastService: ToastService
  ) {
    /* Init form */
    this.clientNumberForm = new FormGroup({
      phone: new FormControl(null, [Validators.required, Validators.pattern(/^\d{9,10}$/)])
    });

    this.clientInfoForm = new FormGroup({
      name: new FormControl(null, [Validators.required, Validators.pattern(/[\S]/)]),
      lastName: new FormControl(null, [Validators.required, Validators.pattern(/[\S]/)])
    });

    /* Disable name and last name until phone is checked */
    this.clientInfoForm.controls['name'].disable();
    this.clientInfoForm.controls['lastName'].disable();

    /* Reset name and last name when phone is changed */
    this.clientNumberForm.controls['phone'].valueChanges.subscribe(() => {
      this.clientInfoForm.controls['name'].reset();
      this.clientInfoForm.controls['lastName'].reset();
      this.phoneIsChecked = false;
    });

    this.isLoading = false;
  }

  /* ------------------------------------------- Lifecycle ------------------------------------------- */
  ngOnInit(): void {
    this.employeeUid = this.userService.getUserUid();
    this.eventUid = this.route.snapshot.paramMap.get('eventUid');
    this.tableUid = this.route.snapshot.paramMap.get('tableUid');
  }

  /* ------------------------------------------- Http Methods ------------------------------------------- */
  public async onSubmit() {
    try {
      if (this.clientInfoForm.invalid) {
        this.toastService.showErrorMessage('Inserire i dati correttamente', false);
        return;
      }

      this.isLoading = true;

      const { phone } = this.clientNumberForm.value;
      const { name, lastName } = this.clientInfoForm.value;

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
    if (!this.clientNumberForm.value.phone) {
      this.toastService.showErrorMessage('Inserire un numero di telefono', false);
      return;
    }

    try {
      this.isLoading = true;

      const client = await this.clientService.getClientByPhone(this.clientNumberForm.value.phone);

      if (!client) {
        this.toastService.showInfo('Cliente non ancora registrato, inserire i dati');
        this.phoneIsChecked = true;
        this.clientInfoForm.controls['name'].enable();
        this.clientInfoForm.controls['lastName'].enable();
        this.isLoading = false;

        // focus on name input
        setTimeout(() => {
          const element = document.getElementById('name_input');
          if (!element) return;
          element.focus();
        }, 0);
        return;
      }

      const text = `Questo numero appartiene a ${client.props.name} ${client.props.lastName}, lo vuoi aggiungere al tavolo?`;
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
    await this.clientService.addClient(client);
  }

  public async addParticipation(client: Client): Promise<void> {
    if (!this.eventUid || !this.employeeUid || !this.tableUid) {
      throw new Error('Parametri non validi');
    }
    const isTableFidelity = environment.fidelityTables.includes(this.tableUid);
    await this.participationService.addParticipation(this.eventUid, this.tableUid, client, isTableFidelity);
  }

  /* ------------------------------------------- Methods ------------------------------------------- */
  public goBack() {
    this.clientNumberForm.reset();
    this.clientInfoForm.reset();
    this.location.back();
    this.toastService.showSuccess('Ticket inviato');
  }
}
