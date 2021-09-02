import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { endOfWeek, startOfWeek } from 'date-fns';
import { ViewDetalization } from 'src/app/modules/scheduler/interfaces';
import { SchedulerService } from "../../services/scheduler.service";

@Component({
  selector: 'scheduler-date-switcher',
  templateUrl: './scheduler-date-switcher.component.html',
  styleUrls: ['./scheduler-date-switcher.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SchedulerDateSwitcherComponent {
  constructor(private service: SchedulerService) {}

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
    this.date = this.service.changeDate(this.view, this.date, inc);
    this.viewDateChanged.emit(this.date);
  }

  public selectCurrentDate(): void {
    if (this.selectCurrentDateIsLocked()) {
      return;
    }

    this.date = this.service.selectCurrentDate(this.view, this.date);
    this.viewDateChanged.emit(this.date);
  }

  public selectCurrentDateIsLocked(): boolean {
    return this.service.selectCurrentDateIsLocked(this.view, this.date);
  }

  public createEventClick(): void {
    this.createEventClicked.emit();
  }

  public startOfWeek(date: Date): Date {
    return startOfWeek(date, { weekStartsOn: 1 });
  }

  public endOfWeek(date: Date): Date {
    return endOfWeek(date, { weekStartsOn: 1 });
  }
}
