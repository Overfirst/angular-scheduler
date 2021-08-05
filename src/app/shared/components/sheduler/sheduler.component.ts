import {
  Component,
  ChangeDetectionStrategy,
  Input,
  ViewChild,
  ChangeDetectorRef,
  ViewContainerRef,
  AfterContentInit
} from '@angular/core';

import { ShedulerEvent } from '../../interfaces';
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
  public selectedDay = startOfMonth(this.selectedViewDate);

  @Input() public events: ShedulerEvent[] = [];

  constructor(private service: ShedulerService, private cdRef: ChangeDetectorRef) {}

  public ngAfterContentInit(): void {
    this.redrawView();
  }

  public viewDateChanged(date: Date): void {
    this.selectedViewDate = date;
  }

  public eventDoubleClicked(event: ShedulerEvent): void {
    this.modalEditMode = true;
    this.modalEditableEvent = event;
    this.modalOpened = true;
  }

  public dayDoubleClicked(day: Date): void {
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

  public modalCloseClicked(): void {
    this.modalOpened = false;
  }

  public redrawView(): void {
    this.service.eventBoxes.clear();
    this.outletRef.clear();
    this.outletRef.createEmbeddedView(this.viewRef);
  }

  public dayChanged(day: Date): void {
    this.selectedDay = day;
  }
}
