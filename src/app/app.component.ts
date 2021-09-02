import { Component } from '@angular/core';
import { SchedulerEvent } from './modules/scheduler/interfaces';
import { schedulerEvents } from "./modules/scheduler/scheduler-events";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public events: SchedulerEvent[] = schedulerEvents;
}
