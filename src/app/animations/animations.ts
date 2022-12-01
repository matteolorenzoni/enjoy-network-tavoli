import { animate, state, style, transition, trigger, sequence, query } from '@angular/animations';

export const loginFormAnimation = trigger('loginFormAnimation', [
  state('bottom', style({ transform: 'translateY(0%)' })),
  state('center', style({ transform: 'translateY(-60vh)' })),
  transition('bottom => center', [animate('1200ms cubic-bezier(.56,1.42,.89,1.02)')])
]);

export const loginFormAnimation2 = trigger('loginFormAnimation2', [
  transition('center => top', [
    sequence([
      animate('800ms ease', style({ transform: 'translateY(-160vh)' })),
      query('*', [animate('1200ms ease-in-out', style({ backgroundColor: '#000' }))])
    ])
  ])
]);

export const toastAnimation = trigger('toastAnimation', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(0%)' }),
    sequence([
      animate('1000ms ease', style({ opacity: 1, transform: 'translatey(-40%)' })),
      animate('1000ms 2000ms ease', style({ opacity: 0, transform: 'translatey(0%)' }))
    ])
  ])
]);
