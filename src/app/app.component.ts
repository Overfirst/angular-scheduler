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
      start: new Date('2021-7-8 12:00'),
      end: new Date('2021-7-30 13:00'),
    }
  ];
}