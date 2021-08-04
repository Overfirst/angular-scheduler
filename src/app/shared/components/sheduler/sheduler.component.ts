import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { ShedulerEvent } from '../../interfaces';

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

  public modalApplyClicked(): void {
    this.modalOpened = false;
  }

  public modalCloseClicked(): void {
    this.modalOpened = false;
  }
}
