import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RoleType } from 'src/app/models/enum';
import { EmployeeService } from 'src/app/services/employee.service';
import { ToastService } from 'src/app/services/toast.service';
import { Location } from '@angular/common';
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
  employeeUid: string | null = null;

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
      isActive: new FormControl(true, [Validators.required])
    });

    this.employeeForm.controls['role'].valueChanges.subscribe((value) => {
      if (value !== RoleType.PR) {
        this.employeeForm.controls['lastName'].reset();
        this.employeeForm.controls['phone'].reset();
        this.employeeForm.controls['zone'].reset();
        this.employeeForm.controls['lastName'].disable();
        this.employeeForm.controls['phone'].disable();
        this.employeeForm.controls['zone'].disable();
      } else {
        this.employeeForm.controls['lastName'].enable();
        this.employeeForm.controls['phone'].enable();
        this.employeeForm.controls['zone'].enable();
      }
    });
  }

  ngOnInit(): void {
    this.employeeUid = this.route.snapshot.paramMap.get('employeeUid');
    this.employeeUid = this.employeeUid === 'null' ? null : this.employeeUid;

    if (!this.employeeUid) {
      throw new Error('Parametri non validi');
    }

    if (this.employeeUid) {
      this.employeeForm.controls['email'].disable();
      this.employeeForm.controls['role'].disable();
      this.employeeService
        .getEmployee(this.employeeUid)
        .then((employee: Employee) => {
          const { props } = employee;
          if (props) {
            this.employeeForm.patchValue({
              name: props.name,
              lastName: props.lastName,
              email: props.email,
              role: props.role,
              phone: props.phone,
              zone: props.zone,
              isActive: props.isActive
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
    const { name, lastName, role, phone, zone, email, isActive } = this.employeeForm.getRawValue();

    const employee: Employee = {
      uid: this.employeeUid ?? '',
      props: {
        name: name.trim().replace(/\s\s+/g, ' '),
        lastName: lastName?.trim().replace(/\s\s+/g, ' ') || null,
        role: role || null,
        phone: phone || null,
        zone: zone?.trim().replace(/\s\s+/g, ' ') || null,
        email: email?.trim().replace(/\s\s+/g, ' ') || null,
        isActive: isActive || false
      }
    };

    this.employeeService
      .addOrUpdateEmployee(email, employee)
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
