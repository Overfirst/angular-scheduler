import { EventEmitter } from '@angular/core';
import { Component, OnInit, ChangeDetectionStrategy, Output } from '@angular/core';
import { addMonths } from 'date-fns';
import { ViewDetalization } from 'src/app/shared/interfaces';

@Component({
  selector: 'sheduler-date-switcher',
  templateUrl: './sheduler-date-switcher.component.html',
  styleUrls: ['./sheduler-date-switcher.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShedulerDateSwitcherComponent implements OnInit {
  public view = ViewDetalization.Month;
  public selectedDate = new Date();

  @Output() viewDateChanged = new EventEmitter<Date>();

  public ngOnInit(): void {

  }

  public subDate(): void {
    this.selectedDate = addMonths(this.selectedDate, -1);
    this.viewDateChanged.emit(this.selectedDate);
  }

  public addDate(): void {
    this.selectedDate = addMonths(this.selectedDate, 1);
    this.viewDateChanged.emit(this.selectedDate);
  }
}
