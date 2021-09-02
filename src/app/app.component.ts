import { Component } from '@angular/core';
import { SchedulerEvent } from './shared/interfaces';
import { schedulerEvents } from "./scheduler-events";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public events: SchedulerEvent[] = schedulerEvents;
}
