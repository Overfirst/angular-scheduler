import { Component } from '@angular/core';
import { ShedulerEvent } from './shared/interfaces';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public events: ShedulerEvent[] = [
    {
      id: 1,
      name: 'Create sheduler application',
      start: new Date('2021-08-06 12:00'),
      end: new Date('2021-08-13 13:00'),
    },
    {
      id: 2,
      name: 'Test task',
      start: new Date('2021-08-05 14:00'),
      end: new Date('2021-08-06 17:00'),
    },
    {
      id: 3,
      name: 'Test task 2',
      start: new Date('2021-08-13 18:00'),
      end: new Date('2021-08-15 16:00'),
    },
    {
      id: 4,
      name: 'Test task 3',
      start: new Date('2021-08-15 06:00'),
      end: new Date('2021-08-18 13:00'),
    },
    {
      id: 5,
      name: 'Test task 4',
      start: new Date('2021-08-17 15:00'),
      end: new Date('2021-08-18 21:00'),
    },
    {
      id: 6,
      name: 'Test task 5',
      start: new Date('2021-08-21 19:00'),
      end: new Date('2021-08-27 16:00'),
    },
    {
      id: 7,
      name: 'Test task 6',
      start: new Date('2021-08-24 18:00'),
      end: new Date('2021-08-28 21:00'),
    },
    {
      id: 8,
      name: 'Test task 7',
      start: new Date('2021-08-25 22:00'),
      end: new Date('2021-08-26 16:00'),
    },
    {
      id: 9,
      name: 'Test task 8',
      start: new Date('2021-08-26 19:00'),
      end: new Date('2021-08-27 22:00'),
    },
  ];
}
