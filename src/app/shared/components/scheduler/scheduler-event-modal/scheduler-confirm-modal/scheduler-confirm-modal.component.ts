import { EventEmitter } from '@angular/core';
import { Component, ChangeDetectionStrategy, Output } from '@angular/core';

@Component({
  selector: 'scheduler-confirm-modal',
  templateUrl: './scheduler-confirm-modal.component.html',
  styleUrls: ['./scheduler-confirm-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SchedulerConfirmModalComponent {
  @Output() public yesClicked = new EventEmitter<void>();
  @Output() public noClicked = new EventEmitter<void>();

  public yesClick(): void {
    this.yesClicked.emit();
  }

  public noClick(): void {
    this.noClicked.emit();
  }
}
