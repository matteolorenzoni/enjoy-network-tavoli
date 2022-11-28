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
