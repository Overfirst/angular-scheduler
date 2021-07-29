import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'sheduler',
  templateUrl: './sheduler.component.html',
  styleUrls: ['./sheduler.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShedulerComponent {
  public selectedViewDate = new Date();

  public viewDateChanged(date: Date): void {
    this.selectedViewDate = date;
  }
}