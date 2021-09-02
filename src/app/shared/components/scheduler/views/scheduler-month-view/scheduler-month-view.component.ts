import { Component, ChangeDetectionStrategy, Input, ViewChild, ElementRef, Output } from '@angular/core';
import { SchedulerEvent, ViewDetalization } from 'src/app/shared/interfaces';
import { SchedulerService } from 'src/app/shared/services/scheduler.service';
import { isSameDay, startOfMonth } from "date-fns";
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'scheduler-month-view',
  templateUrl: './scheduler-month-view.component.html',
  styleUrls: ['./scheduler-month-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SchedulerMonthViewComponent  {
  @ViewChild('column', { static: true }) private column: ElementRef<HTMLTableCellElement>;
  @ViewChild('row', { static: true }) private row: ElementRef<HTMLTableRowElement>;

  public weeks: Array<Date[]> = [];

  public selectedDay: Date;
  public eventsForSelectedDay: SchedulerEvent[];

  private selectedMonth: Date;
  private dayFirstSetted = false;

  constructor(private service: SchedulerService) {}

  @Input() public events: SchedulerEvent[] = [];

  @Input() public set month(date: Date) {
    this.selectedMonth = date;
    this.day = startOfMonth(date);
    this.weeks = this.service.getWeeksForMonthView(date, this.selectedMonth);
  }

  @Input() public set day(day: Date) {
    this.selectedDay = day;
    this.eventsForSelectedDay = this.service.getEventsForSelectedDay(this.day, this.events);

    if (!this.dayFirstSetted) {
      this.dayFirstSetted = true;
      return;
    }

    this.dayChanged.emit(this.selectedDay);
  }

  @Output() public eventDoubleClicked = new EventEmitter<SchedulerEvent>();
  @Output() public dayDoubleClicked = new EventEmitter<Date>();
  @Output() public dayChanged = new EventEmitter<Date>();
  @Output() public showMoreEventsClicked = new EventEmitter<ViewDetalization>();

  public get day() {
    return this.selectedDay;
  }

  public dayInCurrentMonth(day: Date): boolean {
    return this.service.dayInCurrentMonth(day, this.selectedMonth);
  }

  // todo: use display: flex for table
  public getHeightStyle(): string {
    return `calc((100vh - (2 * ${this.service.headerRowHeight}px + 3 * ${this.service.defaultPadding}px) - 2px) / ${this.weeks.length})`
  }

  public isToday(date: Date): boolean {
    return this.service.isToday(date);
  }

  public isFullDate(date: Date): boolean {
    return this.service.isFullDate(date, this.weeks);
  }

  public getEventDurationForTargetWeek(event: SchedulerEvent, monday: Date): string {
    if (!this.service.eventStartedOnTargetWeek(event, monday) && !this.service.eventEndedOnTargetWeek(event, monday)) {
      return this.row.nativeElement.clientWidth + 'px';
    }

    return this.service.getEventDuration(event, monday, ViewDetalization.Month) * this.row.nativeElement.clientWidth / 7 + 'px';
  }

  public getEventTopOffset(event: SchedulerEvent, wrapper: HTMLDivElement): string {
    return this.service.getEventTopOffset(this, event, wrapper) + 'px';
  }

  public getEventWeekDaysOffset(event: SchedulerEvent, monday: Date): string {
    const offset = this.service.getEventDaysOffsetForTargetWeek(event, monday);
    return offset * this.column.nativeElement.clientWidth + offset + 'px';
  }

  public eventOnTargetWeek(event: SchedulerEvent, monday: Date): boolean {
    return this.service.eventOnTargetWeek(event, monday);
  }

  public eventStartedOnTargetWeek(event: SchedulerEvent, monday: Date): boolean {
    return this.service.eventStartedOnTargetWeek(event, monday);
  }

  public eventEndedOnTargetWeek(event: SchedulerEvent, monday: Date): boolean {
    return this.service.eventEndedOnTargetWeek(event, monday);
  }

  public eventBoxMouseOver(eventBox: HTMLDivElement): void {
    this.service.eventBoxMouseOver(this, eventBox);
  }

  public eventBoxMouseLeave(eventBox: HTMLDivElement): void {
    this.service.eventBoxMouseLeave(this, eventBox);
  }

  public getEventColor(event: SchedulerEvent): string {
    return this.service.getEventColor(event);
  }

  public eventsCountOnDay(day: Date): number {
    return this.service.eventsCountOnDay(day, this.events);
  }

  public eventBoxOverflowContainer(wrapper: HTMLDivElement, box: HTMLDivElement): boolean {
    return parseInt(wrapper.style.top) / box.clientHeight >= 0.75;
  }

  public selectDay(day: Date): void {
    this.day = day;
  }

  public isSelectedDay(day: Date): boolean {
    return isSameDay(day, this.day);
  }

  public eventBoxDoubleClick(event: SchedulerEvent): void {
    this.eventDoubleClicked.emit(event);
  }

  public dayDoubleClick(day: Date): void {
    this.dayDoubleClicked.emit(day);
  }

  public getWidthForEventText(): string {
    return `calc(${this.column.nativeElement.clientWidth}px * 0.8)`;
  }

  public getEventTitle(event: SchedulerEvent): string {
    return this.service.getEventTitle(event);
  }

  public getView(): ViewDetalization {
    return ViewDetalization.Month;
  }

  public showMoreEventsClick(parent: HTMLDivElement): void {
    parent.click();
    this.showMoreEventsClicked.emit(ViewDetalization.Day);
  }
}
