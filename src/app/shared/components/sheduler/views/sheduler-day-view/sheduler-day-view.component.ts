import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import {addHours, addMinutes} from "date-fns";

@Component({
  selector: 'sheduler-day-view',
  templateUrl: './sheduler-day-view.component.html',
  styleUrls: ['./sheduler-day-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShedulerDayViewComponent {
  public hours: Date[] = (() => {
    const startDate = new Date();

    startDate.setHours(0);
    startDate.setMinutes(0);

    const hours: Date[] = [];

    for (let i = 0; i < 24; i++) {
      const h = addHours(startDate, i);

      hours.push(h);
      hours.push(addMinutes(h, 30));
    }

    return hours;
  })();
}
