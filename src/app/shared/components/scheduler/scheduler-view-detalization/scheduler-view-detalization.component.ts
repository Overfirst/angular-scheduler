import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { SchedulerEvent, ViewDetalization } from "../../../interfaces";

@Component({
  selector: 'scheduler-view-detalization',
  templateUrl: './scheduler-view-detalization.component.html',
  styleUrls: ['./scheduler-view-detalization.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SchedulerViewDetalizationComponent {
  @Input() view: ViewDetalization;
  @Input() dateEvents: SchedulerEvent[];
  @Input() date: Date;

  @Output() public eventClicked = new EventEmitter<SchedulerEvent>();

  public eventClick(event: SchedulerEvent) {
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
