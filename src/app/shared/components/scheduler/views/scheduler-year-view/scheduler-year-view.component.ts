import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { isSameMonth } from 'date-fns';
import { SchedulerEvent, ViewDetalization } from 'src/app/shared/interfaces';
import { SchedulerService } from 'src/app/shared/services/scheduler.service';

@Component({
  selector: 'scheduler-year-view',
  templateUrl: './scheduler-year-view.component.html',
  styleUrls: ['./scheduler-year-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SchedulerYearViewComponent {
  @ViewChild('column', { static: true }) private column: ElementRef<HTMLTableCellElement>;
  @ViewChild('row', { static: true }) private row: ElementRef<HTMLTableRowElement>;

  constructor(private service: SchedulerService) {}

  public quarters: Array<Date[]>;

  public selectedMonth: Date;
  private monthFirstSetted = false;
  private selectedYear: Date;

  public eventsForSelectedMonth: SchedulerEvent[];

  @Input() public events: SchedulerEvent[];

  @Input() public set year(year: Date) {
    this.selectedYear = year;
    this.quarters = this.service.getQuartersForYearView(this.selectedYear);
  }

  @Input() public set month(month: Date) {
    this.selectedMonth = month;
    this.eventsForSelectedMonth = this.service.getEventsForSelectedMonth(this.selectedMonth, this.events);

    if (!this.monthFirstSetted) {
      this.monthFirstSetted = true;
      return;
    }

    this.monthChanged.emit(this.selectedMonth);
  }

  @Output() public eventDoubleClicked = new EventEmitter<SchedulerEvent>();
  @Output() public monthDoubleClicked = new EventEmitter<Date>();
  @Output() public monthChanged = new EventEmitter<Date>();
  @Output() public showMoreEventsClicked = new EventEmitter<ViewDetalization>();

  public get month() {
    return this.selectedMonth;
  }

  public getHeightStyle(): string {
    return `calc((100vh - (2 * ${this.service.headerRowHeight}px + 3 * ${this.service.defaultPadding}px) - 2px) / 4)`
  }

  public monthDoubleClick(month: Date): void {
    this.monthDoubleClicked.emit(month);
  }

  public isThisMonth(month: Date): boolean {
    return this.service.isThisMonth(month);
  }

  public selectMonth(month: Date): void {
    this.month = month;
  }

  public isSelectedMonth(month: Date): boolean {
    return isSameMonth(month, this.month);
  }

  public eventBoxMouseOver(eventBox: HTMLDivElement): void {
    this.service.eventBoxMouseOver(this, eventBox);
  }

  public eventBoxMouseLeave(eventBox: HTMLDivElement): void {
    this.service.eventBoxMouseLeave(this, eventBox);
  }

  public eventBoxDoubleClick(event: SchedulerEvent): void {
    this.eventDoubleClicked.emit(event);
  }

  public getEventColor(event: SchedulerEvent): string {
    return this.service.getEventColor(event);
  }

  public getEventTitle(event: SchedulerEvent): string {
    return this.service.getEventTitle(event);
  }

  public getWidthForTextEventText(): string {
    return `calc(${this.column.nativeElement.clientWidth}px * 0.8)`;
  }

  public eventBoxOverflowContainer(wrapper: HTMLDivElement, box: HTMLDivElement): boolean {
    return parseInt(wrapper.style.top) / box.clientHeight >= 0.75;
  }

  public eventsCountOnMonth(day: Date): number {
    return this.service.eventsCountOnMonth(day, this.events);
  }

  public eventOnTargetQuarter(event: SchedulerEvent, month: Date): boolean {
    return this.service.eventOnTargetQuarter(event, month);
  }

  public getEventTopOffset(event: SchedulerEvent, wrapper: HTMLDivElement): string {
    return this.service.getEventTopOffset(this, event, wrapper) + 'px';
  }

  public getEventQuarterOffset(event: SchedulerEvent, quarter: Date): string {
    const offset = this.service.getEventMonthsOffsetForTargetQuarter(event, quarter);
    return offset * this.column.nativeElement.clientWidth + 'px';
  }

  public eventStartedOnTargetQuarter(event: SchedulerEvent, quarter: Date): boolean {
    return this.service.eventStartedOnTargetQuarter(event, quarter);
  }

  public eventEndedOnTargetQuarter(event: SchedulerEvent, quarter: Date): boolean {
    return this.service.eventEndedOnTargetQuarter(event, quarter);
  }

  public getEventDurationForTargetQuarter(event: SchedulerEvent, quarter: Date): string {
    if (!this.service.eventStartedOnTargetQuarter(event, quarter) && !this.service.eventEndedOnTargetQuarter(event, quarter)) {
      return this.row.nativeElement.clientWidth + 'px';
    }

    return this.service.getEventDuration(event, quarter, ViewDetalization.Year) * this.row.nativeElement.clientWidth / 3 + 'px';
  }

  public getView(): ViewDetalization {
    return ViewDetalization.Year;
  }

  public showMoreEventsClick(parent: HTMLDivElement): void {
    parent.click();
    this.showMoreEventsClicked.emit(ViewDetalization.Month);
  }
}
