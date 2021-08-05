import { EventEmitter } from '@angular/core';
import { Component, ChangeDetectionStrategy, Output } from '@angular/core';

@Component({
  selector: 'sheduler-confirm-modal',
  templateUrl: './sheduler-confirm-modal.component.html',
  styleUrls: ['./sheduler-confirm-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShedulerConfirmModalComponent {
  @Output() public yesClicked = new EventEmitter<void>();
  @Output() public noClicked = new EventEmitter<void>();

  public yesClick(): void {
    this.yesClicked.emit();
  }

  public noClick(): void {
    this.noClicked.emit();
  }
}
