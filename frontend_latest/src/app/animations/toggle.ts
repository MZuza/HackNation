import { animate, style, transition, trigger } from '@angular/animations';

export const toggle = trigger('toggle', [
  //show
  transition(':enter', [
    style({
      opacity: 0,
      height: 0,
      width: 0,
      transform: 'translate(-20px, -20px)',
    }),
    animate(
      200,
      style({
        opacity: 1,
        height: '*',
        width: '*',
        transform: 'translate(0, 0)',
      }),
    ),
  ]),

  //hide
  transition(':leave', [
    style({
      opacity: 1,
      height: '*',
      width: '*',
      transform: 'translate(0, 0)',
    }),
    animate(
      200,
      style({
        opacity: 0,
        height: 0,
        width: 0,
        transform: 'translate(-20px, -20px)',
      }),
    ),
  ]),
]);
