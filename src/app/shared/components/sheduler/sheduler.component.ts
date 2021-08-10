import {
  Component,
  ChangeDetectionStrategy,
  Input,
  ViewChild,
  ChangeDetectorRef,
  ViewContainerRef,
  AfterContentInit,
  HostListener
} from '@angular/core';

import { ShedulerEvent, ViewDetalization } from '../../interfaces';
import { ShedulerService } from "../../services/sheduler.service";
import { startOfMonth } from "date-fns";
import { TemplateRef } from '@angular/core';

@Component({
  selector: 'sheduler',
  templateUrl: './sheduler.component.html',
  styleUrls: ['./sheduler.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShedulerComponent implements AfterContentInit {
  @ViewChild('outlet', { static: true, read: ViewContainerRef }) outletRef: ViewContainerRef;
  @ViewChild('view', { static: true, read: TemplateRef }) viewRef: TemplateRef<any>;

  public modalOpened = false;
  public modalEditMode = true;
  public modalEditableEvent: ShedulerEvent;

  public selectedViewDate = new Date();

  public selectedDate = startOfMonth(this.selectedViewDate);
  public selectedMonth = this.selectedDate;

  public selectedView: ViewDetalization;

  @Input() public events: ShedulerEvent[] = [];

  constructor(private service: ShedulerService) {}

  public ngAfterContentInit(): void {
    this.redrawView();
  }

  public viewDateChanged(date: Date): void {
    this.selectedViewDate = date;
  }

  public viewChanged(view: ViewDetalization): void {
    this.selectedView = view;
    this.redrawView();
  }

  public eventDoubleClicked(event: ShedulerEvent): void {
    this.modalEditMode = true;
    this.modalEditableEvent = event;
    this.modalOpened = true;
  }

  public openCreateModal(): void {
    this.modalEditMode = false;
    this.modalOpened = true;
  }

  public modalApplyClicked(event: ShedulerEvent): void {
    if (this.modalEditMode) {
      const idx = this.events.findIndex(currentEvent => currentEvent.id === event.id);
      this.events[idx] = event;
    } else {
      this.events.push(event);
    }

    this.modalOpened = false;
    this.redrawView();
  }

  public modalDeleteClicked(event: ShedulerEvent) {
    const idx = this.events.findIndex(currentEvent => currentEvent.id === event.id);
    this.events.splice(idx, 1);

    this.modalOpened = false;
    this.redrawView();
  }

  public modalCloseClicked(): void {
    this.modalOpened = false;
  }

  public redrawView(): void {
    this.service.eventBoxes.clear();
    this.outletRef.clear();
    this.outletRef.createEmbeddedView(this.viewRef);
  }

  public dateChanged(date: Date): void {
    this.selectedDate = date;
  }

  @HostListener('window:resize') public onResize(): void {
    this.redrawView();
  }
}
