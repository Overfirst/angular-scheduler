import {Component, ChangeDetectionStrategy, Input} from '@angular/core';
import {ShedulerEvent} from "../../../../../interfaces";

@Component({
  selector: 'sheduler-month-view-day-detalization',
  templateUrl: './sheduler-month-view-day-detalization.component.html',
  styleUrls: ['./sheduler-month-view-day-detalization.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShedulerMonthViewDayDetalizationComponent {
  @Input() dayEvents: ShedulerEvent[];
  @Input() day: Date;
}
