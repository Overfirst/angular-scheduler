import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { isSameMonth, isSameYear, startOfYear } from 'date-fns';
import { ShedulerEvent, ViewDetalization } from 'src/app/shared/interfaces';
import { ShedulerService } from 'src/app/shared/services/sheduler.service';

@Component({
  selector: 'sheduler-year-view',
  templateUrl: './sheduler-year-view.component.html',
  styleUrls: ['./sheduler-year-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShedulerYearViewComponent {
  @ViewChild('column', { static: true }) private column: ElementRef<HTMLTableCellElement>;
  @ViewChild('row', { static: true }) private row: ElementRef<HTMLTableRowElement>;

  constructor(private service: ShedulerService) {}

  public quarters: Array<Date[]>;

  public selectedMonth: Date;
  private monthFirstSetted = false;
  private selectedYear: Date;

  @Input() public events: ShedulerEvent[];

  @Input() public set year(year: Date) {
    this.selectedYear = year;
    this.quarters = this.service.getQuartersForYearView(this.selectedYear);
  }

  @Input() public set month(month: Date) {
    this.selectedMonth = month;

    if (!this.monthFirstSetted) {
      this.monthFirstSetted = true;
      return;
    }

    this.monthChanged.emit(this.selectedMonth);
  }

  @Output() public eventDoubleClicked = new EventEmitter<ShedulerEvent>();
  @Output() public monthDoubleClicked = new EventEmitter<Date>();
  @Output() public monthChanged = new EventEmitter<Date>();

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
    this.service.eventBoxMouseOver(eventBox);
  }

  public eventBoxMouseLeave(eventBox: HTMLDivElement): void {
    this.service.eventBoxMouseLeave(eventBox);
  }

  public eventBoxDoubleClick(event: ShedulerEvent): void {
    this.eventDoubleClicked.emit(event);
  }

  public getEventColor(event: ShedulerEvent): string {
    return this.service.getEventColor(event);
  }

  public getEventTitle(event: ShedulerEvent): string {
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

  public eventOnTargetQuarter(event: ShedulerEvent, month: Date): boolean {
    return this.service.eventOnTargetQuarter(event, month);
  }

  public getEventTopOffset(event: ShedulerEvent, wrapper: HTMLDivElement): string {
    return this.service.getEventTopOffset(event, wrapper) + 'px';
  }

  public getEventQuarterOffset(event: ShedulerEvent, quarter: Date): string {
    const offset = this.service.getEventMonthsOffsetForTargetQuarter(event, quarter);
    return offset * this.column.nativeElement.clientWidth + 'px';
  }

  public eventStartedOnTargetQuarter(event: ShedulerEvent, quarter: Date): boolean {
    return this.service.eventStartedOnTargetQuarter(event, quarter);
  }

  public eventEndedOnTargetQuarter(event: ShedulerEvent, quarter: Date): boolean {
    return this.service.eventEndedOnTargetQuarter(event, quarter);
  }

  public getEventDurationForTargetQuarter(event: ShedulerEvent, quarter: Date): string {
    if (!this.service.eventStartedOnTargetQuarter(event, quarter) && !this.service.eventEndedOnTargetQuarter(event, quarter)) {
      return this.row.nativeElement.clientWidth + 'px';
    }

    return this.service.getEventDuration(event, quarter, ViewDetalization.Year) * this.row.nativeElement.clientWidth / 3 + 'px';
  }
}
