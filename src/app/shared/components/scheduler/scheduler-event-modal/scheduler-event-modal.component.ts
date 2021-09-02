import { Component, ChangeDetectionStrategy, Output, EventEmitter, Input } from '@angular/core';
import { SchedulerEvent } from "../../../interfaces";
import { AbstractControl, FormControl, FormGroup, Validators } from "@angular/forms";
import { SchedulerService } from "../../../services/scheduler.service";
import { SchedulerValidators } from "../../../utils/scheduler-validators";
import { addHours } from "date-fns";

@Component({
  selector: 'scheduler-event-modal',
  templateUrl: './scheduler-event-modal.component.html',
  styleUrls: ['./scheduler-event-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SchedulerEventModalComponent {
  public form: FormGroup;
  public confirmOpened = false;

  constructor(private service: SchedulerService) {
    const startDateControl = new FormControl(null, Validators.required);

    const endDateControl = new FormControl(null, [
      Validators.required,
      SchedulerValidators.endDateBeforeStartDate(startDateControl),
      SchedulerValidators.endDateEqualStartDate(startDateControl)
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
    this.form.controls.end.patchValue(this.service.transformDateForModalInput(addHours(date, 1)));
  }

  @Input() public editMode = true;

  @Input() public set editableEvent(event: SchedulerEvent) {
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
  @Output() public applyClicked = new EventEmitter<SchedulerEvent>();
  @Output() public deleteClicked = new EventEmitter<SchedulerEvent>();

  public closeClick(): void {
    this.closeClicked.emit();
  }

  public applyClick(): void {
    if (this.form.invalid) {
      return;
    }

    const { value } = this.form;

    const event: SchedulerEvent = {
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
    this.deleteClicked.emit(this.form.value as SchedulerEvent);
    this.confirmOpened = false;
  }

  public confirmModalNoClicked(): void {
    this.confirmOpened = false;
  }
}
