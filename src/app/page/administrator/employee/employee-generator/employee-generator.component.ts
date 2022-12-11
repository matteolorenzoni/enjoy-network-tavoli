import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RoleType } from 'src/app/models/enum';
import { EmployeeService } from 'src/app/services/employee.service';
import { ToastService } from 'src/app/services/toast.service';
import { Location } from '@angular/common';
import { EmployeeDTO } from 'src/app/models/table';

@Component({
  selector: 'app-employee-generator',
  templateUrl: './employee-generator.component.html',
  styleUrls: ['./employee-generator.component.scss']
})
export class EmployeeGeneratorComponent implements OnInit {
  /* Type */
  roles = Object.values(RoleType);

  /* Employee */
  uid = '';

  /* Form */
  employeeForm: FormGroup;
  isLoading: boolean;

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
      zone: new FormControl(null, [Validators.required, Validators.pattern(/[\S]/)])
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
    this.isLoading = false;
  }
  ngOnInit(): void {
    this.uid = this.route.snapshot.paramMap.get('uid') || '';
    if (this.uid && this.uid !== '' && this.uid !== 'null') {
      this.employeeForm.controls['email'].disable();
      this.employeeService.getEmployee(this.uid).then((employeDTO) => {
        if (employeDTO) {
          this.employeeForm.patchValue({
            name: employeDTO.name,
            lastName: employeDTO.lastName,
            role: employeDTO.role,
            phone: employeDTO.phone,
            zone: employeDTO.zone
          });
          this.lblButton = 'Modifica dipendente';
        }
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
      active: true,
      createdAt: this.employeeForm.value.createdAt || new Date(),
      modificatedAt: this.employeeForm.value.createdAt || new Date()
    };
    const uidFormatted = this.uid === '' || this.uid === 'null' ? null : this.uid;
    this.employeeService
      .addOrUpdateEmployee(email, employee, uidFormatted)
      .then(() => {
        this.employeeForm.reset();
        this.location.back();
        this.toastService.showSuccess('Dipendente creato');
      })
      .catch((error: Error) => {
        this.toastService.showError(error.message);
      })
      .finally(() => {
        this.isLoading = false;
      });
  }
}
