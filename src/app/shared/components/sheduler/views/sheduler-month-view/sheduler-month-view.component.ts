import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { ShedulerService } from 'src/app/shared/services/sheduler.service';

@Component({
  selector: 'sheduler-month-view',
  templateUrl: './sheduler-month-view.component.html',
  styleUrls: ['./sheduler-month-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShedulerMonthViewComponent {
  public weeks: Array<Date[]> = [];

  private currentDate: Date = new Date();
  private readonly headerRowHeight = 48;
  private readonly defaultPadding = 24;

  constructor(private service: ShedulerService) { }

  @Input() public set date(date: Date) {
    this.currentDate = date;
    this.weeks = this.service.getWeeksForMonthView(date, this.currentDate);
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
}