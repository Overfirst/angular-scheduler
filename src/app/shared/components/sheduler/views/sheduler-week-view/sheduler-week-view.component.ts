import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { ShedulerEvent } from "../../../../interfaces";
import {ShedulerService} from "../../../../services/sheduler.service";

@Component({
  selector: 'sheduler-week-view',
  templateUrl: './sheduler-week-view.component.html',
  styleUrls: ['./sheduler-week-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShedulerWeekViewComponent {
  @Input() public events: ShedulerEvent[] = [];

  public weekEvents: Array<ShedulerEvent[]> = [];
  public weekDays: Date[] = [];
  public scrollTop = 0;

  constructor(private service: ShedulerService) {}

  @Input() public set week(date: Date) {
    this.weekDays = this.service.getWeekDays(date);
    this.weekEvents = this.service.getEventsForWeekDays(this.events, this.weekDays);
  }

  @Output() public eventDoubleClicked = new EventEmitter<ShedulerEvent>();
  @Output() public hourDoubleClicked = new EventEmitter<Date>();
  @Output() public hourChanged = new EventEmitter<Date>();
  @Output() public dayChangeClicked = new EventEmitter<Date>();

  public eventDoubleClick(event: ShedulerEvent): void {
    this.eventDoubleClicked.emit(event);
  }

  public hourDoubleClick(date: Date): void {
    this.hourDoubleClicked.emit(date);
  }

  public hourChange(date: Date): void {
    this.hourChanged.emit(date);
  }

  public dayChangeClick(date: Date): void {
    this.dayChangeClicked.emit(date);
  }

  public tableOnScroll(scrollElement: HTMLDivElement): void {
    this.scrollTop = scrollElement.scrollTop;
  }
}
