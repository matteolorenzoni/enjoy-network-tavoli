import { ToastService } from 'src/app/services/toast.service';
import { ClientService } from 'src/app/services/client.service';
import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Client } from 'src/app/models/type';
import { faFileCsv, faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { FileGeneratorService } from '../../../../services/file-generator.service';

@Component({
  selector: 'app-client-management',
  templateUrl: './client-management.component.html',
  styleUrls: ['./client-management.component.scss']
})
export class ClientManagementComponent {
  /* Icons */
  pdfIcon = faFilePdf;
  csvIcon = faFileCsv;

  /* Client */
  client?: Client;

  /* Form */
  clientForm: FormGroup;
  isLoading = false;

  constructor(
    private clientService: ClientService,
    private fileGeneratorService: FileGeneratorService,
    private toastService: ToastService
  ) {
    /* Init form */
    this.clientForm = new FormGroup<{
      name: FormControl<string | null>;
      lastName: FormControl<string | null>;
      phone: FormControl<number | null>;
    }>({
      name: new FormControl(null, [Validators.required, Validators.pattern(/[\S]/)]),
      lastName: new FormControl(null, [Validators.required, Validators.pattern(/[\S]/)]),
      phone: new FormControl(null, [Validators.required, Validators.pattern(/^\d{9,10}$/)])
    });

    /* Subscribe to phone changes */
    this.clientForm.get('phone')?.valueChanges.subscribe(() => {
      this.client = undefined;
      this.clientForm.patchValue({
        name: null,
        lastName: null
      });
    });
  }

  /* ------------------------------------------- Http Methods ------------------------------------------- */
  public searchClient() {
    const { phone } = this.clientForm.value;

    if (!phone) {
      this.toastService.showErrorMessage('Inserire un numero di telefono');
      return;
    }

    this.clientService
      .getClientByPhone(phone)
      .then((client) => {
        if (!client) {
          this.toastService.showErrorMessage('Nessun cliente trovato');
          return;
        }

        this.client = client;
        this.clientForm.patchValue({
          name: client.props.name,
          lastName: client.props.lastName
        });
      })
      .catch((error) => {
        this.toastService.showError(error);
      });
  }

  public onSubmit() {
    if (!this.client) {
      return;
    }

    if (!this.clientForm.valid) {
      this.toastService.showErrorMessage('Inserire valori validi');
      return;
    }

    const { name, lastName } = this.clientForm.value;
    this.client.props.name = name;
    this.client.props.lastName = lastName;

    this.clientService
      .updateClient(this.client)
      .then(() => {
        this.client = undefined;
        this.clientForm.reset();
        this.toastService.showSuccess('Cliente aggiornato');
      })
      .catch((error) => {
        this.toastService.showError(error);
      });
  }

  public deleteClient() {
    const text = 'Sei sicuro di voler rimuovere il cliente?';
    if (window.confirm(text) === true) {
      if (!this.client) {
        throw new Error('Parametri non validi');
      }

      this.clientService
        .deleteClient(this.client)
        .then(() => {
          this.client = undefined;
          this.clientForm.reset();
          this.toastService.showSuccess('Cliente rimosso e disattivate tutte le sue partecipazioni');
        })
        .catch((error) => {
          this.toastService.showError(error);
        });
    }
  }

  /* ------------------------------------------- Methods ------------------------------------------- */
  async downloadPDF() {
    try {
      const clients = await this.clientService.getClients();
      const headerNames = ['Numero', 'Nome', 'Cognome', 'Telefono'];
      const keys = ['name', 'lastName', 'phone'];
      const fileName = 'clienti';

      this.fileGeneratorService.downloadPDF(clients, headerNames, keys, fileName);
    } catch (error: any) {
      this.toastService.showError(error);
    }
  }

  async downloadCSV() {
    try {
      const clients = await this.clientService.getClients();
      const headerNames = ['Numero', 'Nome', 'Cognome', 'Telefono'];
      const keys = ['name', 'lastName', 'phone'];
      const fileName = 'clienti';

      this.fileGeneratorService.downloadCSV(clients, headerNames, keys, fileName);
    } catch (error: any) {
      this.toastService.showError(error);
    }
  }
}
