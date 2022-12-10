import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RoleType } from 'src/app/models/enum';
import { EmployeeService } from 'src/app/services/employee.service';
import { ToastService } from 'src/app/services/toast.service';
import { Location } from '@angular/common';

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
      // password: new FormControl(null, [Validators.required, Validators.pattern(/[\S]/)]),
      role: new FormControl(RoleType.PR, [Validators.required, Validators.pattern(/[\S]/)]),
      phone: new FormControl(null, [Validators.required, Validators.pattern(/^[0-9]*$/)]),
      zone: new FormControl(null, [Validators.required, Validators.pattern(/[\S]/)])
    });
    this.employeeForm.controls['role'].valueChanges.subscribe((value) => {
      if (value !== RoleType.PR) {
        this.employeeForm.controls['phone'].setValue(null);
        this.employeeForm.controls['zone'].setValue(null);
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
      // this.eventService.getEvent(this.uid).then((event) => {
      //   if (event) {
      //     this.eventForm.patchValue({
      //       imageUrl: event.imageUrl,
      //       name: event.name,
      //       date: event.date.toJSON().split('T')[0],
      //       timeStart: event.timeStart,
      //       timeEnd: event.timeEnd,
      //       maxPerson: event.maxPerson,
      //       place: event.place,
      //       guest: event.guest,
      //       description: event.description,
      //       messageText: event.messageText
      //     });
      //     this.imageSrc = event.imageUrl;
      //     this.lblButton = 'Modifica evento';
      //   }
      // });
    }
  }

  public onSubmit() {
    this.isLoading = true;
    // this.eventService
    //   .addOrUpdateEvent(this.photoFile, this.eventForm.value, this.uid)
    //   .then(() => {
    //     this.imageSrc = null;
    //     this.eventForm.reset();
    //     this.location.back();
    //     this.toastService.showSuccess('Evento creato');
    //   })
    //   .catch((error: Error) => {
    //     this.toastService.showError(error.message);
    //   })
    //   .finally(() => {
    //     this.isLoading = false;
    //   });
  }
}
