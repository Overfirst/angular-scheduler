import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef
} from '@angular/core';

import { addMinutes, isSameHour } from "date-fns";
import { ShedulerEvent } from "../../../../interfaces";
import { ShedulerService } from "../../../../services/sheduler.service";

@Component({
  selector: 'sheduler-day-view',
  templateUrl: './sheduler-day-view.component.html',
  styleUrls: ['./sheduler-day-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShedulerDayViewComponent {
  @ViewChild('row', { static: true }) private row: ElementRef<HTMLTableRowElement>;

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

  public eventStartedOnTargetHour(event: ShedulerEvent, hour: Date): boolean {
    return isSameHour(event.start, hour);
  }

  public addHalfHour(hour: Date): Date {
    return addMinutes(hour, 30);
  }

  public getEventBoxHourWidth(hour: Date): string {
    return (this.row.nativeElement.clientWidth - 18) / this.service.getEventsCountOnTargetHour(this.events, hour) + 'px';
  }

  public getEventDayBoxTopOffset(event: ShedulerEvent): string {
    return (event.start.getMinutes() < 30 ? 0 : this.service.headerRowHeight) + 'px';
  }

  public getEventColor(event: ShedulerEvent): string {
    return this.service.getEventColor(event);
  }

  public getEventHoursHeight(event: ShedulerEvent): string {
    return 2 * this.service.headerRowHeight * this.service.getEventHoursDuration(event) + 'px';
  }

  public getEventLeftOffset(event: ShedulerEvent, wrapper: HTMLDivElement): string {
    return this.service.getEventLeftOffset(event, wrapper) + 'px';
  }

  public eventBoxDoubleClick(event: ShedulerEvent): void {
    this.eventDoubleClicked.emit(event);
  }
}
