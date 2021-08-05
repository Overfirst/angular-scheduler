import { Component, ChangeDetectionStrategy, Input, ViewChild, ElementRef, HostListener, ChangeDetectorRef, DoCheck, OnChanges, SimpleChanges, Output } from '@angular/core';
import { ShedulerEvent, ViewDetalization } from 'src/app/shared/interfaces';
import { ShedulerService } from 'src/app/shared/services/sheduler.service';
import { isSameDay, startOfMonth } from "date-fns";
import { EventEmitter } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'sheduler-month-view',
  templateUrl: './sheduler-month-view.component.html',
  styleUrls: ['./sheduler-month-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShedulerMonthViewComponent implements OnChanges {
  @ViewChild('column', { static: true }) private column: ElementRef<HTMLTableCellElement>;
  @ViewChild('row', { static: true }) private row: ElementRef<HTMLTableRowElement>;

  public weeks: Array<Date[]> = [];

  public _selectedDay: Date;
  public eventsForSelectedDay: ShedulerEvent[];

  private currentDate: Date;
  private readonly headerRowHeight = 48;
  private readonly defaultPadding = 24;

  constructor(
    private service: ShedulerService,
    private cdRef: ChangeDetectorRef,
    private datePipe: DatePipe
  ) { }

  @Input() public events: ShedulerEvent[] = [];

  @Input() public set date(date: Date) {
    this.currentDate = date;
    this.selectedDay = startOfMonth(date);
    this.weeks = this.service.getWeeksForMonthView(date, this.currentDate);
  }

  @Output() public eventDoubleClicked = new EventEmitter<ShedulerEvent>()
  @Output() public dayDoubleClicked = new EventEmitter<Date>()

  public set selectedDay(day: Date) {
    this._selectedDay = day;
    this.eventsForSelectedDay = this.service.getEventsForSelectedDay(this.selectedDay, this.events);
  }

  public get selectedDay() {
    return this._selectedDay;
  }

  public ngOnChanges(changes: SimpleChanges): void {
    this.service.eventBoxes.clear();
  }

  public dayInCurrentMonth(day: Date): boolean {
    return this.service.dayInCurrentMonth(day, this.currentDate);
  }

  // todo: use display: flex for table
  public getHeightStyle(): string {
    return `calc((100vh - (2 * ${this.headerRowHeight}px + 3 * ${this.defaultPadding}px) - 2px) / ${this.weeks.length})`
  }

  public isToday(date: Date): boolean {
    return this.service.isToday(date);
  }

  public isFullDate(date: Date): boolean {
    return this.service.isFullDate(date, this.weeks);
  }

  public getEventDurationForTargetWeek(event: ShedulerEvent, monday: Date): string {
    if (!this.service.eventStartedOnTargetWeek(event, monday) && !this.service.eventEndedOnTargetWeek(event, monday)) {
      return this.row.nativeElement.clientWidth + 'px';
    }

    return this.service.getEventDurationForTargetWeek(event, monday, ViewDetalization.Month) * this.row.nativeElement.clientWidth / 7 + 'px';
  }

  public getEventTopOffset(event: ShedulerEvent, wrapper: HTMLDivElement): string {
    return this.service.getEventTopOffset(event, wrapper) + 'px';
  }

  public getEventWeekDaysOffset(event: ShedulerEvent, monday: Date): string {
    const offset = this.service.getEventDaysOffsetForTargetWeek(event, monday);
    return offset * this.column.nativeElement.clientWidth + offset + 'px';
  }

  public eventOnTargetWeek(event: ShedulerEvent, monday: Date): boolean {
    return this.service.eventOnTargetWeek(event, monday);
  }

  public eventStartedOnTargetWeek(event: ShedulerEvent, monday: Date): boolean {
    return this.service.eventStartedOnTargetWeek(event, monday);
  }

  public eventEndedOnTargetWeek(event: ShedulerEvent, monday: Date): boolean {
    return this.service.eventEndedOnTargetWeek(event, monday);
  }

  public eventBoxMouseOver(eventBox: HTMLDivElement): void {
    this.service.eventBoxes.forEach(box => {
      if (eventBox.getAttribute('event-id') === box.getAttribute('event-id')) {
        box.style.border = '1px solid #000';
      }
    });
  }

  public eventBoxMouseLeave(eventBox: HTMLDivElement): void {
    this.service.eventBoxes.forEach(box => {
      if (eventBox.getAttribute('event-id') === box.getAttribute('event-id')) {
        box.style.border = '1px solid #bbaacf';
      }
    });
  }

  @HostListener('window:resize') public onResize(): void {
    setTimeout(() => this.cdRef.detectChanges(), 0)
  }

  public getEventColor(event: ShedulerEvent): string {
    if (!event.color) {
      event.color = '#93ff86';
    }

    return event.color;
  }

  public eventsCountOnDay(day: Date): number {
    return this.service.eventsCountOnDay(day, this.events);
  }

  public eventBoxOverflowContainer(wrapper: HTMLDivElement, box: HTMLDivElement): boolean {
    return parseInt(wrapper.style.top) / box.clientHeight >= 0.75;
  }

  public selectDay(day: Date): void {
    this.selectedDay = day;
  }

  public isSelectedDay(day: Date): boolean {
    return isSameDay(day, this.selectedDay);
  }

  public eventBoxDoubleClick(event: ShedulerEvent): void {
    this.eventDoubleClicked.emit(event);
  }

  public dayDoubleClick(day: Date): void {
    this.dayDoubleClicked.emit(day);
  }

  public getWidthForTextEventText(): string {
    return `calc(${this.column.nativeElement.clientWidth}px * 0.8)`;
  }

  public getEventTitle(event: ShedulerEvent): string {
    return event.name + '\n\n' +
           'Start date: ' + this.datePipe.transform(event.start, 'yyyy.MM.dd') + '\n' +
           'End date: ' + this.datePipe.transform(event.end, 'yyyy.MM.dd')
  }
}
