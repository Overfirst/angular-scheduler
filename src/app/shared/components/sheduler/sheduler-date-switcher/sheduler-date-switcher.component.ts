import { EventEmitter, Input } from '@angular/core';
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
  @Input() view: ViewDetalization;
  @Input() date: Date;

  @Output() viewDateChanged = new EventEmitter<Date>();
  @Output() viewChanged = new EventEmitter<ViewDetalization>();

  public views: ViewDetalization[] = Object.values(ViewDetalization);

  public subDate(): void {
    this.changeDate(false);
  }

  public addDate(): void {
    this.changeDate(true);
  }

  public viewChange(): void {
    this.viewChanged.emit(this.view);
  }

  private changeDate(inc: boolean): void {
    const value = inc ? 1 : -1;

    switch (this.view) {
      case ViewDetalization.Day:
      case ViewDetalization.Week:
      case ViewDetalization.Month:
        this.date = addMonths(this.date, value);
        break;
      case ViewDetalization.Year:
        this.date = addYears(this.date, value);
    }

    this.viewDateChanged.emit(this.date);
  }
}
