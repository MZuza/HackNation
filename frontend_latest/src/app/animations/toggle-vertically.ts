import { animate, style, transition, trigger } from '@angular/animations';


export const toggleVertically = trigger('toggleVertically', [

    //show
    transition(':enter', [
        style({
            opacity: 0,
            height: 0,
            transform: 'translateY(-20px)'
        }),
        animate(200, style({
            opacity: 1,
            height: '*',
            transform: 'translateY(0)'
        }))
    ]),

    //hide
    transition(':leave', [
        style({
            opacity: 1,
            height: '*',
            transform: 'translateY(0)'
        }),
        animate(200, style({
            opacity: 0,
            height: 0,
            transform: 'translateY(-20px)'
        }))
    ]),
]);
