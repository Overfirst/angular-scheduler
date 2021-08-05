import { Component, ChangeDetectionStrategy, Output, EventEmitter, Input } from '@angular/core';
import { ShedulerEvent } from "../../../interfaces";
import { AbstractControl, FormControl, FormGroup, Validators } from "@angular/forms";
import { ShedulerService } from "../../../services/sheduler.service";
import { ShedulerValidators } from "../../../utils/sheduler-validators";

@Component({
  selector: 'sheduler-event-modal',
  templateUrl: './sheduler-event-modal.component.html',
  styleUrls: ['./sheduler-event-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShedulerEventModalComponent {
  public form: FormGroup;
  public confirmOpened = false;

  constructor(private service: ShedulerService) {
    const startDateControl = new FormControl(null, Validators.required);

    const endDateControl = new FormControl(null, [
      Validators.required,
      ShedulerValidators.endDateBeforeStartDate(startDateControl)
    ]);

    const controls: { [name: string]: AbstractControl } = {
      id: new FormControl(null),
      name: new FormControl('', Validators.required),
      start: startDateControl,
      end: endDateControl,
      color: new FormControl('#ffffff')
    };

    this.form = new FormGroup(controls);
  }

  @Input() public set defaultDate(date: Date) {
    if (this.editMode) {
      return;
    }

    this.form.controls.start.patchValue(this.service.transformDateForModalInput(date));
    this.form.controls.end.patchValue(this.service.transformDateForModalInput(date));
  }

  @Input() public editMode = true;

  @Input() public set editableEvent(event: ShedulerEvent) {
    if (!this.editMode) {
      return;
    }

    this.form.controls.id.patchValue(event.id);
    this.form.controls.name.patchValue(event.name);
    this.form.controls.start.patchValue(this.service.transformDateForModalInput(event.start));
    this.form.controls.end.patchValue(this.service.transformDateForModalInput(event.end));
    this.form.controls.color.patchValue(event.color);
  }

  @Output() public closeClicked = new EventEmitter<void>();
  @Output() public applyClicked = new EventEmitter<ShedulerEvent>();
  @Output() public deleteClicked = new EventEmitter<ShedulerEvent>();

  public closeClick(): void {
    this.closeClicked.emit();
  }

  public applyClick(): void {
    if (this.form.invalid) {
      return;
    }

    const { value } = this.form;

    const event: ShedulerEvent = {
      id: this.editMode ? value.id : new Date().getTime(),
      name: value.name.trim(),
      start: new Date(value.start),
      end: new Date(value.end),
      color: value.color
    };

    this.applyClicked.emit(event);
  }

  public updateEndDateValidation(): void {
    this.form.controls.end.updateValueAndValidity();
  }

  public deleteClick(): void {
    this.confirmOpened = true;
  }

  public confirmModalYesClicked(): void {
    this.deleteClicked.emit(this.form.value as ShedulerEvent);
    this.confirmOpened = false;
  }

  public confirmModalNoClicked(): void {
    this.confirmOpened = false;
  }
}
