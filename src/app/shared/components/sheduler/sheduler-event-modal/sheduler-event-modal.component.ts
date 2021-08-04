import {Component, ChangeDetectionStrategy, Output, EventEmitter, Input} from '@angular/core';
import {ShedulerEvent} from "../../../interfaces";

@Component({
  selector: 'sheduler-event-modal',
  templateUrl: './sheduler-event-modal.component.html',
  styleUrls: ['./sheduler-event-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShedulerEventModalComponent {
  private event: ShedulerEvent;

  @Input() public editMode = true;

  @Input() public set editableEvent(event: ShedulerEvent) {
    if (!this.editMode) {
      return;
    }
  }

  @Output() public closeClicked = new EventEmitter<void>();
  @Output() public applyClicked = new EventEmitter<ShedulerEvent>();

  public closeClick(): void {
    this.closeClicked.emit();
  }

  public applyClick(): void {
    this.applyClicked.emit(this.event);
  }
}
