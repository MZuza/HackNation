import { animate, style, transition, trigger } from '@angular/animations';


export const toggleHorizontally = trigger('toggleHorizontally', [

    //show
    transition(':enter', [
        style({
            opacity: 0,
            width: 0,
            transform: 'translateX(-100%)'
        }),
        animate(200, style({
            opacity: 1,
            width: '*',
            transform: 'translateX(0)'
        }))
    ]),

    //hide
    transition(':leave', [
        style({
            opacity: 1,
            width: '*',
            transform: 'translateX(0)'
        }),
        animate(200, style({
            opacity: 0,
            width: 0,
            transform: 'translateX(-100%)'
        }))
    ]),
]);
