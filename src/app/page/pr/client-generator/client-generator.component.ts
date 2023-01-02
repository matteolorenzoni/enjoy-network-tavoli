import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ClientService } from 'src/app/services/client.service';
import { ToastService } from 'src/app/services/toast.service';
import { Location } from '@angular/common';
import { ClientDTO } from 'src/app/models/collection';

@Component({
  selector: 'app-client-generator',
  templateUrl: './client-generator.component.html',
  styleUrls: ['./client-generator.component.scss']
})
export class ClientGeneratorComponent implements OnInit {
  /* Table */
  tableUid: string | null = null;

  /* Client */

  clientUid: string | null = null;

  /* Form */
  clientForm: FormGroup;
  isLoading: boolean;

  /* Label */
  lblButton = 'Crea cliente';

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private clientService: ClientService,
    private toastService: ToastService
  ) {
    this.clientForm = new FormGroup({
      name: new FormControl(null, [Validators.required, Validators.pattern(/[\S]/)]),
      lastName: new FormControl(null, [Validators.required, Validators.pattern(/[\S]/)]),
      phone: new FormControl(null, [Validators.required, Validators.pattern(/^[0-9]*$/)])
    });
    this.isLoading = false;
  }

  ngOnInit(): void {
    this.tableUid = this.route.snapshot.paramMap.get('tableUid');
    this.clientUid = this.route.snapshot.paramMap.get('uid');

    /* Check if the uids are valid */
    if (!this.tableUid || !this.clientUid) {
      throw new Error('Errore: parametri non validi');
    }

    if (this.clientUid !== 'null') {
      this.clientService
        .getClient(this.clientUid)
        .then((client) => {
          const { clientDTO } = client;
          this.clientForm.patchValue({
            name: clientDTO.name,
            lastName: clientDTO.lastName,
            phone: clientDTO.phone
          });
          this.lblButton = 'Modifica cliente';
        })
        .catch((err: Error) => {
          this.toastService.showError(err);
        });
    }
  }

  public onSubmit() {
    this.isLoading = true;

    /* Check if the uids are valid */
    if (!this.tableUid || !this.clientUid) {
      throw new Error('Errore: parametri non validi');
    }

    /* create the new table */
    const newClient: ClientDTO = {
      name: this.clientForm.value.name,
      lastName: this.clientForm.value.lastName,
      phone: this.clientForm.value.phone
    };

    /* If the table uid is null, it means that we are creating a new table */
    const uidFormatted = this.clientUid === 'null' ? null : this.clientUid;

    /* Add or update the table */
    this.clientService
      .addOrUpdateClient(uidFormatted, newClient)
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
}
