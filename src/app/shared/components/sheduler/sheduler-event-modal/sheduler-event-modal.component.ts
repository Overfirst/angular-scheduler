import { Component, ChangeDetectionStrategy, Output, EventEmitter, Input } from '@angular/core';
import { ShedulerEvent } from "../../../interfaces";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import {ShedulerService} from "../../../services/sheduler.service";

@Component({
  selector: 'sheduler-event-modal',
  templateUrl: './sheduler-event-modal.component.html',
  styleUrls: ['./sheduler-event-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShedulerEventModalComponent {
  public form: FormGroup;
  private event: ShedulerEvent;

  constructor(private service: ShedulerService) { }

  @Input() public editMode = true;

  @Input() public set editableEvent(event: ShedulerEvent) {
    if (!this.editMode) {
      return;
    }

    this.event = {...event};

    this.form = new FormGroup({
      name: new FormControl(event.name, Validators.required),
      start: new FormControl(this.service.transformDateForModalInput(event.start), Validators.required),
      end: new FormControl(this.service.transformDateForModalInput(event.end), Validators.required),
      color: new FormControl(event.color),
    })
  }

  @Output() public closeClicked = new EventEmitter<void>();
  @Output() public applyClicked = new EventEmitter<ShedulerEvent>();

  public closeClick(): void {
    this.closeClicked.emit();
  }

  public applyClick(): void {
    const { value } = this.form;

    const event: ShedulerEvent = {
      id: value.id,
      name: value.name,
      start: new Date(value.start),
      end: new Date(value.end),
      color: value.color
    };

    this.applyClicked.emit(event);
  }
}
