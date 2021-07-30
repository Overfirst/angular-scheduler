import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { ShedulerEvent } from '../../interfaces';

@Component({
  selector: 'sheduler',
  templateUrl: './sheduler.component.html',
  styleUrls: ['./sheduler.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShedulerComponent {
  public selectedViewDate = new Date();
  @Input() public events: ShedulerEvent[] = [];

  public viewDateChanged(date: Date): void {
    this.selectedViewDate = date;
  }
}