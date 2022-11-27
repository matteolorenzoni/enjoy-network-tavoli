import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [
    trigger('openCloseFirst', [
      state('first', style({ transform: 'translateY(0%)' })),
      state('second', style({ transform: 'translateY(-100%)' })),
      state('third', style({ transform: 'translateY(-266%)' })),
      transition('first => second', [animate('1200ms cubic-bezier(.56,1.42,.89,1.02)')]),
      transition('second => third', [animate('600ms linear')])
    ]),
    trigger('openCloseSecond', [
      state('first', style({ transform: 'translateY(0%)' })),
      state('second', style({ transform: 'translateY(-61%)' })),
      transition('first => second', [animate('1200ms cubic-bezier(.56,1.42,.89,1.02)')]),
      transition('second => third', [
        animate('600ms 0ms linear', style({ transform: 'translateY(-160%)' })),
        animate('1000ms 200ms linear', style({ backgroundColor: '#000' })),
        animate('10000000ms 500ms linear', style({ backgroundColor: '#000' }))
      ])
    ])
  ]
})
export class LoginComponent {
  /** Section to display */
  section = 0;

  constructor(private router: Router) {}

  incrementSection() {
    this.section += 1;
    if (this.section === 2) {
      setTimeout(() => {
        this.router.navigate(['/dashboard']);
      }, 2500);
    }
  }
}
