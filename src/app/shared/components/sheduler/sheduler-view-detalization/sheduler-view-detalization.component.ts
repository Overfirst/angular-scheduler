import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {ShedulerEvent, ViewDetalization} from "../../../interfaces";

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

  public getEmptyText(): string {
    let text = "There are no events on this ";

    switch (this.view) {
      case ViewDetalization.Day:
        text += 'hour';
        break;

      case ViewDetalization.Week:
      case ViewDetalization.Month:
        text += 'day';
        break;

      case ViewDetalization.Year:
        text += 'month';
    }

    return text += '!';
  }
}
