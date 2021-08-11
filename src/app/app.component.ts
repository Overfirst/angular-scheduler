import { Component } from '@angular/core';
import { ShedulerEvent } from './shared/interfaces';
import { shedulerEvents } from "./sheduler-events";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public events: ShedulerEvent[] = shedulerEvents;
}
