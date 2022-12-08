import { animate, state, style, transition, trigger, sequence, query, group, stagger } from '@angular/animations';

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

export const floatingButtonAnimation = trigger('floatingButtonAnimation', [
  transition(':enter', [
    style({ transform: 'translatex(150%)', opacity: 0 }),
    animate('1000ms ease', style({ transform: 'translatex(0%)', opacity: 1 }))
  ]),
  transition(':leave', [
    style({ transform: 'translatex(0%)', opacity: 1 }),
    animate('1000ms ease', style({ transform: 'translatex(150%)', opacity: 0 }))
  ])
]);

export const bottomNavigationAnimation = trigger('bottomNavigationAnimation', [
  transition(':enter', [
    style({ transform: 'translateY(100%)', opacity: 0 }),
    animate('1000ms ease', style({ transform: 'translateY(0%)', opacity: 1 }))
  ]),
  transition(':leave', [
    style({ transform: 'translateY(0%)', opacity: 1 }),
    animate('1000ms ease', style({ transform: 'translateY(100%)', opacity: 0 }))
  ])
]);

export const slideInAnimation = trigger('routeAnimations', [
  transition('FirstPage => SecondPage', [
    style({ position: 'relative' }),
    query(':enter, :leave', [style({ position: 'absolute', top: 0, left: 0, width: '100%' })]),
    query(':enter', [style({ left: '100%' })]),
    group([
      query(':leave', [animate('200ms ease-out', style({ left: '-100%', opacity: 0 }))]),
      query(':enter', [animate('300ms ease-out', style({ left: '0%' }))])
    ])
  ]),
  transition('FirstPage => ThirdPage', [
    style({ position: 'relative' }),
    query(':enter, :leave', [style({ position: 'absolute', top: 0, left: 0, width: '100%' })]),
    query(':enter', [style({ left: '100%' })]),
    group([
      query(':leave', [animate('200ms ease-out', style({ left: '-100%', opacity: 0 }))]),
      query(':enter', [animate('300ms ease-out', style({ left: '0%' }))])
    ])
  ]),
  transition('FirstPage => FourthPage', [
    style({ position: 'relative' }),
    query(':enter, :leave', [style({ position: 'absolute', top: 0, left: 0, width: '100%' })]),
    query(':enter', [style({ left: '100%' })]),
    group([
      query(':leave', [animate('200ms ease-out', style({ left: '-100%', opacity: 0 }))]),
      query(':enter', [animate('300ms ease-out', style({ left: '0%' }))])
    ])
  ]),

  transition('SecondPage => FirstPage', [
    style({ position: 'relative' }),
    query(':enter, :leave', [style({ position: 'absolute', top: 0, left: 0, width: '100%' })]),
    query(':enter', [style({ left: '-100%' })]),
    group([
      query(':leave', [animate('200ms ease-out', style({ left: '100%', opacity: 0 }))]),
      query(':enter', [animate('300ms ease-out', style({ left: '0%' }))])
    ])
  ]),
  transition('SecondPage => ThirdPage', [
    style({ position: 'relative' }),
    query(':enter, :leave', [style({ position: 'absolute', top: 0, left: 0, width: '100%' })]),
    query(':enter', [style({ left: '100%' })]),
    group([
      query(':leave', [animate('200ms ease-out', style({ left: '-100%', opacity: 0 }))]),
      query(':enter', [animate('300ms ease-out', style({ left: '0%' }))])
    ])
  ]),
  transition('SecondPage => FourthPage', [
    style({ position: 'relative' }),
    query(':enter, :leave', [style({ position: 'absolute', top: 0, left: 0, width: '100%' })]),
    query(':enter', [style({ left: '100%' })]),
    group([
      query(':leave', [animate('200ms ease-out', style({ left: '-100%', opacity: 0 }))]),
      query(':enter', [animate('300ms ease-out', style({ left: '0%' }))])
    ])
  ]),

  transition('ThirdPage => FirstPage', [
    style({ position: 'relative' }),
    query(':enter, :leave', [style({ position: 'absolute', top: 0, left: 0, width: '100%' })]),
    query(':enter', [style({ left: '-100%' })]),
    group([
      query(':leave', [animate('200ms ease-out', style({ left: '100%', opacity: 0 }))]),
      query(':enter', [animate('300ms ease-out', style({ left: '0%' }))])
    ])
  ]),
  transition('ThirdPage => SecondPage', [
    style({ position: 'relative' }),
    query(':enter, :leave', [style({ position: 'absolute', top: 0, left: 0, width: '100%' })]),
    query(':enter', [style({ left: '-100%' })]),
    group([
      query(':leave', [animate('200ms ease-out', style({ left: '100%', opacity: 0 }))]),
      query(':enter', [animate('300ms ease-out', style({ left: '0%' }))])
    ])
  ]),
  transition('ThirdPage => FourthPage', [
    style({ position: 'relative' }),
    query(':enter, :leave', [style({ position: 'absolute', top: 0, left: 0, width: '100%' })]),
    query(':enter', [style({ left: '100%' })]),
    group([
      query(':leave', [animate('200ms ease-out', style({ left: '-100%', opacity: 0 }))]),
      query(':enter', [animate('300ms ease-out', style({ left: '0%' }))])
    ])
  ]),

  transition('FourthPage => FirstPage', [
    style({ position: 'relative' }),
    query(':enter, :leave', [style({ position: 'absolute', top: 0, left: 0, width: '100%' })]),
    query(':enter', [style({ left: '-100%' })]),
    group([
      query(':leave', [animate('200ms ease-out', style({ left: '100%', opacity: 0 }))]),
      query(':enter', [animate('300ms ease-out', style({ left: '0%' }))])
    ])
  ]),
  transition('FourthPage => SecondPage', [
    style({ position: 'relative' }),
    query(':enter, :leave', [style({ position: 'absolute', top: 0, left: 0, width: '100%' })]),
    query(':enter', [style({ left: '-100%' })]),
    group([
      query(':leave', [animate('200ms ease-out', style({ left: '100%', opacity: 0 }))]),
      query(':enter', [animate('300ms ease-out', style({ left: '0%' }))])
    ])
  ]),
  transition('FourthPage => ThirdPage', [
    style({ position: 'relative' }),
    query(':enter, :leave', [style({ position: 'absolute', top: 0, left: 0, width: '100%' })]),
    query(':enter', [style({ left: '-100%' })]),
    group([
      query(':leave', [animate('200ms ease-out', style({ left: '100%', opacity: 0 }))]),
      query(':enter', [animate('300ms ease-out', style({ left: '0%' }))])
    ])
  ])
]);

export const slidInHeader = trigger('slidInHeader', [
  transition(':enter', [
    style({ transform: 'translateY(-100%)', opacity: 0 }),
    animate('600ms ease-out', style({ transform: 'translateY(0%)', opacity: 1 }))
  ]),
  transition(':leave', [
    style({ transform: 'translateY(0%)', opacity: 1 }),
    animate('600ms ease-out', style({ transform: 'translateY(-100%)', opacity: 0 }))
  ])
]);

export const fadeInMain = trigger('fadeInMain', [
  transition(':enter', [style({ opacity: 0 }), animate('600ms 600ms ease-out', style({ opacity: 1 }))]),
  transition(':leave', [style({ opacity: 1 }), animate('600ms 600ms ease-out', style({ opacity: 0 }))])
]);

export const fadeIn = trigger('fadeIn', [
  transition(':enter', [style({ opacity: 0 }), animate('600ms ease-out', style({ opacity: 1 }))])
]);

export const expandEventItem = trigger('expandEventItem', [
  transition(':enter', [style({ height: 0 }), animate('600ms ease-out', style({ height: '*' }))]),
  transition(':leave', [style({ height: '*' }), animate('600ms ease-out', style({ height: 0 }))])
]);

export const staggeredFadeIn = trigger('staggeredFadeIn', [
  transition(':enter', [
    query('.staggered-fade-in', [
      style({ opacity: 0, transform: 'translateY(20px)' }),
      stagger(100, [animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))])
    ])
  ])
]);

// add stagger animation on incrmenet list
export const staggeredFadeInIncrement = trigger('staggeredFadeInIncrement', [
  transition(':increment', [
    query(
      ':enter',
      [
        style({ opacity: 0, transform: 'translateY(100px)' }),
        stagger(200, [animate('800ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))])
      ],
      { optional: true }
    )
  ])
]);
