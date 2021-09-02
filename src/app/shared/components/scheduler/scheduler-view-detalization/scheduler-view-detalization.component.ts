import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { SchedulerEvent, ViewDetalization } from "../../../interfaces";
import {SchedulerService} from "../../../services/scheduler.service";

@Component({
  selector: 'scheduler-view-detalization',
  templateUrl: './scheduler-view-detalization.component.html',
  styleUrls: ['./scheduler-view-detalization.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SchedulerViewDetalizationComponent {
  constructor(private service: SchedulerService) {}

  @Input() view: ViewDetalization;
  @Input() dateEvents: SchedulerEvent[];
  @Input() date: Date;

  @Output() public eventClicked = new EventEmitter<SchedulerEvent>();

  public eventClick(event: SchedulerEvent) {
    this.eventClicked.emit(event);
  }

  public getEmptyText(): string {
    return this.service.viewDetalizationGetEmptyText(this.view);
  }
}
