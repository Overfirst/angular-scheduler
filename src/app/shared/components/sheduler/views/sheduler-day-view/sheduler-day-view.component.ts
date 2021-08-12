import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { addHours, addMinutes, startOfMonth } from "date-fns";
import { ShedulerEvent} from "../../../../interfaces";
import {ShedulerService} from "../../../../services/sheduler.service";

@Component({
  selector: 'sheduler-day-view',
  templateUrl: './sheduler-day-view.component.html',
  styleUrls: ['./sheduler-day-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShedulerDayViewComponent {
  public hours: Date[];
  public selectedHour: Date;

  private hourFirstSetted = false;

  constructor(private service: ShedulerService) {}

  @Input() public events: ShedulerEvent[];

  @Input() public set day(date: Date) {
    this.hours = this.service.getHoursForDayView(date);
  }

  @Input() public set hour(hour: Date) {
    this.selectedHour = hour;

    if (!this.hourFirstSetted) {
      this.hourFirstSetted = true;
      return;
    }

    this.hourChanged.emit(this.selectedHour);
  }

  @Output() public eventDoubleClicked = new EventEmitter<ShedulerEvent>();
  @Output() public hourDoubleClicked = new EventEmitter<Date>();
  @Output() public hourChanged = new EventEmitter<Date>();
}
