import { EventEmitter } from '@angular/core';
import { Component, ChangeDetectionStrategy, Output } from '@angular/core';
import { addMonths, addYears } from 'date-fns';
import { ViewDetalization } from 'src/app/shared/interfaces';

@Component({
  selector: 'sheduler-date-switcher',
  templateUrl: './sheduler-date-switcher.component.html',
  styleUrls: ['./sheduler-date-switcher.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShedulerDateSwitcherComponent {
  public selectedDate = new Date();
  public selectedView = ViewDetalization.Year;
  public views: ViewDetalization[] = Object.values(ViewDetalization);

  @Output() viewDateChanged = new EventEmitter<Date>();
  @Output() viewChanged = new EventEmitter<ViewDetalization>();

  public subDate(): void {
    this.changeDate(false);
  }

  public addDate(): void {
    this.changeDate(true);
  }

  public viewChange(): void {
    this.viewChanged.emit(this.selectedView);
  }

  private changeDate(inc: boolean): void {
    const value = inc ? 1 : -1;

    switch (this.selectedView) {
      case ViewDetalization.Day:
      case ViewDetalization.Week:
      case ViewDetalization.Month:
        this.selectedDate = addMonths(this.selectedDate, value);
        break;
      case ViewDetalization.Year:
        this.selectedDate = addYears(this.selectedDate, value);
    }

    this.viewDateChanged.emit(this.selectedDate);
  }
}
