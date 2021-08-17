import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef
} from '@angular/core';

import { addMinutes } from "date-fns";
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

  public isFullDay = false;

  private hourFirstSetted = false;

  constructor(private service: ShedulerService) {}

  @Input() public events: ShedulerEvent[];

  private selectedDate: Date;

  @Input() public set day(date: Date) {
    this.service.eventBoxes.clear();
    this.selectedDate = date;
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

  public get day() {
    return this.selectedDate;
  }

  public addHalfHour(hour: Date): Date {
    return addMinutes(hour, 30);
  }

  public getEventDayBoxTopHoursOffset(event: ShedulerEvent): string {
    return 2 * this.service.headerRowHeight * this.service.getEventDayBoxTopHoursOffset(event, this.selectedDate) + 'px';
  }

  public getEventColor(event: ShedulerEvent): string {
    return this.service.getEventColor(event);
  }

  public eventBoxDoubleClick(event: ShedulerEvent): void {
    this.eventDoubleClicked.emit(event);
  }

  public eventTakingOnSelectedDay(event: ShedulerEvent): boolean {
    return this.service.eventTakingOnSelectedDay(event, this.day);
  }

  public getEventDayBoxHoursDuration(event: ShedulerEvent): string {
    return 2 * this.service.headerRowHeight * this.service.getEventHoursDuration(event) + 'px';
  }

  public getEventDayBoxWidth(event: ShedulerEvent): string {
    const scrollWidth = 18;
    return (this.row.nativeElement.clientWidth - scrollWidth) / (this.service.getCrossEventsCountForTargetEvent(event, this.events) + 1) + 'px';
  }

  public getEventDayBoxLeftOffset(wrapper: HTMLDivElement): string {
    return this.service.getEventDayBoxLeftOffset(wrapper) + 'px';
  }

  public getEventTitle(event: ShedulerEvent): string {
    return this.service.getEventTitle(event);
  }

  public hourDoubleClick(hour: Date): void {
    this.hour = hour;
    this.hourDoubleClicked.emit(hour);
  }

  // todo: use display: flex for table
  public getHeightStyle(): string {
    return `calc((100vh - (2 * ${this.service.headerRowHeight}px + 3 * ${this.service.defaultPadding}px) - 2px))`
  }

  public changeModeClick(): void {
    this.service.eventBoxes.clear();
    this.isFullDay = !this.isFullDay
  }
}
