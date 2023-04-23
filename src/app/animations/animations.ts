import { animate, state, style, transition, trigger, sequence, query, stagger } from '@angular/animations';

/* ---------------------------- GENERAL ANIMATIONS ---------------------------- */
export const fadeInAnimation = trigger('fadeInAnimation', [
  transition(':enter', [style({ opacity: 0 }), animate('1000ms ease-out', style({ opacity: 1 }))]),
  transition(':leave', [style({ opacity: 1 }), animate('1000ms ease-out', style({ opacity: 0 }))])
]);

/* ---------------------------- SPECIFIC ANIMATIONS ---------------------------- */
// Login
export const loginFormAnimation = trigger('loginFormAnimation', [
  state('bottom', style({ transform: 'translateY(0%)' })),
  state('center', style({ transform: 'translateY(-60vh)' })),
  transition('bottom => center', [animate('1200ms cubic-bezier(.56,1.42,.89,1.02)')])
]);

// Login
export const loginFormAnimation2 = trigger('loginFormAnimation2', [
  transition('center => top', [
    sequence([
      animate('800ms ease', style({ transform: 'translateY(-160vh)' })),
      query('*', [animate('1200ms ease-in-out', style({ backgroundColor: '#000' }))])
    ])
  ])
]);

// Toast
export const toastAnimation = trigger('toastAnimation', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(0%)' }),
    sequence([
      animate('1000ms ease', style({ opacity: 1, transform: 'translatey(-40%)' })),
      animate('1000ms 2000ms ease', style({ opacity: 0, transform: 'translatey(0%)' }))
    ])
  ])
]);

// Item main
export const slideInCreateItemHeader = trigger('slideInCreateItemHeader', [
  transition(':enter', [
    style({ transform: 'translateY(-100%)', opacity: 0 }),
    animate('600ms ease-out', style({ transform: 'translateY(0%)', opacity: 1 }))
  ]),
  transition(':leave', [
    style({ transform: 'translateY(0%)', opacity: 1 }),
    animate('600ms ease-out', style({ transform: 'translateY(-100%)', opacity: 0 }))
  ])
]);

// Item main
export const fadeInCreateItemAnimation = trigger('fadeInCreateItemAnimation', [
  transition(':enter', [style({ opacity: 0 }), animate('600ms 600ms ease-out', style({ opacity: 1 }))]),
  transition(':leave', [style({ opacity: 1 }), animate('600ms 600ms ease-out', style({ opacity: 0 }))])
]);

// Item event dettails
export const expandEventItemDetailsAnimation = trigger('expandEventItemDetailsAnimation', [
  transition(':enter', [style({ height: 0 }), animate('600ms ease-out', style({ height: '*' }))]),
  transition(':leave', [style({ height: '*' }), animate('600ms ease-out', style({ height: 0 }))])
]);

// Event item in the event-list
export const staggeredFadeInIncrement = trigger('staggeredFadeInIncrement', [
  transition(':increment', [
    query(':enter', [
      style({ opacity: 0, transform: 'translateY(50px)' }),
      stagger(80, [animate('200ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))])
    ])
  ])
]);
