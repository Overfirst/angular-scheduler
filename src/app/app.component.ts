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
      start: new Date('2021-08-05 04:00'),
      end: new Date('2021-08-06 13:00'),
    },
    {
      id: 3,
      name: 'Test task 2',
      start: new Date('2021-08-13 04:00'),
      end: new Date('2021-08-15 13:00'),
    },
    {
      id: 4,
      name: 'Test task 3',
      start: new Date('2021-08-15 04:00'),
      end: new Date('2021-08-18 13:00'),
    },
  ];
}