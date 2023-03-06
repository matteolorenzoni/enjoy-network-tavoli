import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from 'src/app/services/toast.service';
import { TableService } from 'src/app/services/table.service';
import { Location } from '@angular/common';
import { Table } from 'src/app/models/type';
import { SessionStorageService } from '../../../services/sessionstorage.service';

@Component({
  selector: 'app-table-generator',
  templateUrl: './table-generator.component.html',
  styleUrls: ['./table-generator.component.scss']
})
export class TableGeneratorComponent implements OnInit {
  /* Event */
  eventUid: string | null = '';

  /* Employee */
  employeeUid: string | null = '';

  /* Table */
  tableUid: string | null = '';
  personMarked = 0;

  /* Form */
  tableForm: FormGroup;
  isLoading: boolean;

  /* Label */
  lblButton = 'Crea tavolo';

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private tableService: TableService,
    private sessionStorage: SessionStorageService,
    private toastService: ToastService
  ) {
    this.tableForm = new FormGroup({
      name: new FormControl(null, [Validators.required, Validators.pattern(/[\S]/)]),
      price: new FormControl(30, [Validators.pattern(/^[0-9]*$/)]),
      hour: new FormControl(null),
      drink: new FormControl(null, [Validators.pattern(/[\S]/)])
    });
    this.isLoading = false;
  }

  ngOnInit(): void {
    this.eventUid = this.route.snapshot.paramMap.get('eventUid');
    this.employeeUid = this.sessionStorage.getEmployeeUid();
    this.tableUid = this.route.snapshot.paramMap.get('tableUid');
    this.tableUid = this.tableUid === 'null' ? null : this.tableUid;

    if (!this.eventUid || !this.employeeUid || !this.tableUid) {
      throw new Error('Errore: parametri non validi');
    }

    if (this.tableUid) {
      this.tableService
        .getTable(this.tableUid)
        .then((table) => {
          const { props } = table;
          this.tableForm.patchValue({
            name: props.name,
            price: props.price,
            hour: props.hour?.toISOString().slice(0, 16) || '',
            drink: props.drinkList
          });
          this.lblButton = 'Modifica tavolo';
        })
        .catch((err: Error) => {
          this.toastService.showError(err);
        });
    }
  }

  public onSubmit() {
    this.isLoading = true;

    /* Check if the uids are valid */
    if (!this.eventUid || !this.employeeUid) {
      throw new Error('Errore: parametri non validi');
    }

    const { name, price, hour, drinkList } = this.tableForm.value;

    /* create the new table */
    const newTable: Table = {
      uid: this.tableUid ?? '',
      props: {
        eventUid: this.eventUid,
        employeeUid: this.employeeUid,
        name: name.trim().replace(/\s\s+/g, ' ') || '',
        price,
        hour: hour ? new Date(hour) : undefined,
        drinkList
      }
    };

    /* Add or update the table */
    this.tableService
      .addOrUpdateTable(newTable)
      .then(() => {
        this.tableForm.reset();
        this.location.back();
        this.toastService.showSuccess('Tavolo creato');
      })
      .catch((err: Error) => {
        this.toastService.showError(err);
      })
      .finally(() => {
        this.isLoading = false;
      });
  }
}
