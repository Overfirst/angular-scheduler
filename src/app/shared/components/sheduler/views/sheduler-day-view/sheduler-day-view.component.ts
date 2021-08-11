import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { addHours, addMinutes, startOfMonth } from "date-fns";
import { ShedulerEvent} from "../../../../interfaces";

@Component({
  selector: 'sheduler-day-view',
  templateUrl: './sheduler-day-view.component.html',
  styleUrls: ['./sheduler-day-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShedulerDayViewComponent {
  @Input() public events: ShedulerEvent[];

  @Input() public set day(date: Date) {}

  @Input() public set hour(day: Date) {}

  @Output() public eventDoubleClicked = new EventEmitter<ShedulerEvent>();
  @Output() public dayDoubleClicked = new EventEmitter<Date>();
  @Output() public dayChanged = new EventEmitter<Date>();


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
