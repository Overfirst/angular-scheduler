import {Component, ChangeDetectionStrategy, Input, ViewChild} from '@angular/core';
import { ShedulerEvent } from '../../interfaces';
import {ShedulerMonthViewComponent} from "./views/sheduler-month-view/sheduler-month-view.component";

@Component({
  selector: 'sheduler',
  templateUrl: './sheduler.component.html',
  styleUrls: ['./sheduler.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShedulerComponent {
  public modalOpened = false;
  public modalEditMode = true;
  public modalEditableEvent: ShedulerEvent;

  public selectedViewDate = new Date();

  @Input() public events: ShedulerEvent[] = [];

  public viewDateChanged(date: Date): void {
    this.selectedViewDate = date;
  }

  public eventDoubleClicked(event: ShedulerEvent): void {
    this.modalEditMode = true;
    this.modalEditableEvent = event;
    this.modalOpened = true;
  }

  public dayDoubleClicked(day: Date): void {
    this.modalEditMode = false;
    this.modalOpened = true;
  }

  public modalApplyClicked(event: ShedulerEvent): void {
    this.modalEditableEvent.name = event.name;
    this.modalEditableEvent.start = new Date(event.start);
    this.modalEditableEvent.end = new Date(event.end);
    this.modalEditableEvent.color = event.color;

    this.modalOpened = false;
  }

  public modalCloseClicked(): void {
    this.modalOpened = false;
  }
}
