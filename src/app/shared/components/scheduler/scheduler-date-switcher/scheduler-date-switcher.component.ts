import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import {
  addDays,
  addMonths,
  addWeeks,
  addYears,
  endOfWeek,
  isSameDay,
  isSameMonth,
  isSameWeek,
  isSameYear,
  startOfWeek
} from 'date-fns';

import { ViewDetalization } from 'src/app/shared/interfaces';

@Component({
  selector: 'scheduler-date-switcher',
  templateUrl: './scheduler-date-switcher.component.html',
  styleUrls: ['./scheduler-date-switcher.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SchedulerDateSwitcherComponent {
  @Input() view: ViewDetalization;
  @Input() date: Date;

  @Output() viewDateChanged = new EventEmitter<Date>();
  @Output() viewChanged = new EventEmitter<ViewDetalization>();
  @Output() createEventClicked = new EventEmitter<void>();

  public views: ViewDetalization[] = Object.values(ViewDetalization);

  public subDate(): void {
    this.changeDate(false);
  }

  public addDate(): void {
    this.changeDate(true);
  }

  public viewChange(): void {
    if (this.view === ViewDetalization.Week) {
      this.date = startOfWeek(this.date, { weekStartsOn: 1 });
    }

    this.viewChanged.emit(this.view);
  }

  private changeDate(inc: boolean): void {
    const value = inc ? 1 : -1;

    switch (this.view) {
      case ViewDetalization.Day:
        this.date = addDays(this.date, value);
        break;

      case ViewDetalization.Week:
        this.date = addWeeks(this.date, value);
        break;

      case ViewDetalization.Month:
        this.date = addMonths(this.date, value);
        break;

      case ViewDetalization.Year:
        this.date = addYears(this.date, value);
    }

    this.viewDateChanged.emit(this.date);
  }

  public selectCurrentDate(): void {
    if (this.selectCurrentDateIsLocked()) {
      return;
    }

    const currentDate = new Date();

    switch (this.view) {
      case ViewDetalization.Day:
        this.date.setFullYear(currentDate.getFullYear());
        this.date.setMonth(currentDate.getMonth());
        this.date.setDate(currentDate.getDate());
        break;

      case ViewDetalization.Week:
        const weekStart = startOfWeek(currentDate,{ weekStartsOn: 1 });
        this.date.setFullYear(weekStart.getFullYear());
        this.date.setMonth(weekStart.getMonth());
        this.date.setDate(weekStart.getDate());
        break;

      case ViewDetalization.Month:
        this.date.setFullYear(currentDate.getFullYear());
        this.date.setMonth(currentDate.getMonth());
        break;

      case ViewDetalization.Year:
        this.date.setFullYear(currentDate.getFullYear());
    }

    this.date = new Date(this.date);
    this.viewDateChanged.emit(this.date);
  }

  public selectCurrentDateIsLocked(): boolean {
    const currentDate = new Date();

    switch (this.view) {
      case ViewDetalization.Day:
        return isSameDay(this.date, currentDate);

      case ViewDetalization.Week:
        return isSameWeek(this.date, currentDate);

      case ViewDetalization.Month:
        return isSameMonth(this.date, currentDate);

      case ViewDetalization.Year:
        return isSameYear(this.date, currentDate);
    }
  }

  public createEventClick(): void {
    this.createEventClicked.emit();
  }

  startOfWeek(date: Date) {
    return startOfWeek(date, { weekStartsOn: 1 });
  }

  public endOfWeek(date: Date): Date {
    return endOfWeek(date, { weekStartsOn: 1 });
  }
}
