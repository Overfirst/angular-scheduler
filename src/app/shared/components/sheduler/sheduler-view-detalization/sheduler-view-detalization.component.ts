import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { ShedulerEvent, ViewDetalization } from "../../../interfaces";

@Component({
  selector: 'sheduler-view-detalization',
  templateUrl: './sheduler-view-detalization.component.html',
  styleUrls: ['./sheduler-view-detalization.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShedulerViewDetalizationComponent {
  @Input() view: ViewDetalization;
  @Input() dateEvents: ShedulerEvent[];
  @Input() date: Date;

  @Output() public eventClicked = new EventEmitter<ShedulerEvent>();

  public eventClick(event: ShedulerEvent) {
    this.eventClicked.emit(event);
  }
}
