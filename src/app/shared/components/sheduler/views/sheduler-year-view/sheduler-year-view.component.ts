import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { isSameMonth, isSameYear, startOfYear } from 'date-fns';
import { ShedulerEvent } from 'src/app/shared/interfaces';
import { ShedulerService } from 'src/app/shared/services/sheduler.service';

@Component({
  selector: 'sheduler-year-view',
  templateUrl: './sheduler-year-view.component.html',
  styleUrls: ['./sheduler-year-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShedulerYearViewComponent {
  constructor(private service: ShedulerService) {}

  public quarters: Array<Date[]> = this.service.getQuartersForYearView();

  public selectedMonth: Date;

  @Input() public events: ShedulerEvent[];

  @Input() public set year(date: Date) {

  }

  @Input() public set month(month: Date) {
    this.selectedMonth = month;
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
}
