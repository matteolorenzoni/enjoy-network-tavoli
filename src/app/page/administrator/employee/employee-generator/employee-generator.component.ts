import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RoleType } from 'src/app/models/enum';
import { EmployeeService } from 'src/app/services/employee.service';
import { ToastService } from 'src/app/services/toast.service';
import { Location } from '@angular/common';
import { EmployeeDTO } from 'src/app/models/table';
import { Employee } from 'src/app/models/type';

@Component({
  selector: 'app-employee-generator',
  templateUrl: './employee-generator.component.html',
  styleUrls: ['./employee-generator.component.scss']
})
export class EmployeeGeneratorComponent implements OnInit {
  /* Type */
  roles = Object.values(RoleType);

  /* Employee */
  employeeUid = '';

  /* Form */
  employeeForm: FormGroup;
  isLoading = false;

  /* Label */
  lblButton = 'Crea dipendente';

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private employeeService: EmployeeService,
    private toastService: ToastService
  ) {
    this.employeeForm = new FormGroup({
      name: new FormControl(null, [Validators.required, Validators.pattern(/[\S]/)]),
      lastName: new FormControl(null, [Validators.required, Validators.pattern(/[\S]/)]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      role: new FormControl(RoleType.PR, [Validators.required, Validators.pattern(/[\S]/)]),
      phone: new FormControl(null, [Validators.required, Validators.pattern(/^[0-9]*$/)]),
      zone: new FormControl(null, [Validators.required, Validators.pattern(/[\S]/)]),
      active: new FormControl(true, [Validators.required])
    });
    this.employeeForm.controls['role'].valueChanges.subscribe((value) => {
      if (value !== RoleType.PR) {
        this.employeeForm.controls['phone'].reset();
        this.employeeForm.controls['zone'].reset();
        this.employeeForm.controls['phone'].disable();
        this.employeeForm.controls['zone'].disable();
      } else {
        this.employeeForm.controls['phone'].enable();
        this.employeeForm.controls['zone'].enable();
      }
    });
  }

  ngOnInit(): void {
    this.employeeUid = this.route.snapshot.paramMap.get('uid') ?? '';

    if (!this.employeeUid) {
      throw new Error('Employee uid is not defined');
    }

    if (this.employeeUid !== 'null') {
      this.employeeForm.controls['email'].disable();
      this.employeeService
        .getEmployee(this.employeeUid)
        .then((employee: Employee) => {
          const { employeeDTO } = employee;
          if (employeeDTO) {
            this.employeeForm.patchValue({
              name: employeeDTO.name,
              lastName: employeeDTO.lastName,
              role: employeeDTO.role,
              phone: employeeDTO.phone,
              zone: employeeDTO.zone
            });
            this.lblButton = 'Modifica dipendente';
          }
        })
        .catch((err: Error) => {
          this.toastService.showError(err);
        });
    }
  }

  public onSubmit() {
    this.isLoading = true;
    const { email } = this.employeeForm.value;
    const employee: EmployeeDTO = {
      name: this.employeeForm.value.name?.trim().replace(/\s\s+/g, ' ') || '',
      lastName: this.employeeForm.value.lastName?.trim().replace(/\s\s+/g, ' ') || '',
      role: this.employeeForm.value.role,
      phone: this.employeeForm.value.phone,
      zone: this.employeeForm.value.zone?.trim().replace(/\s\s+/g, ' ') || '',
      active: this.employeeForm.value.active
    };
    const uidFormatted = this.employeeUid === '' || this.employeeUid === 'null' ? null : this.employeeUid;
    this.employeeService
      .addOrUpdateEmployee(uidFormatted, employee, email)
      .then(() => {
        this.employeeForm.reset();
        this.location.back();
        this.toastService.showSuccess(this.employeeUid ? 'Dipendente aggiornato' : 'Dipendente creato');
      })
      .catch((err: Error) => {
        this.toastService.showError(err);
      })
      .finally(() => {
        this.isLoading = false;
      });
  }
}
