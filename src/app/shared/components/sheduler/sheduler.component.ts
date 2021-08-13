import {
  Component,
  ChangeDetectionStrategy,
  Input,
  ViewChild,
  ViewContainerRef,
  AfterContentInit,
  HostListener
} from '@angular/core';

import { ShedulerEvent, ViewDetalization } from '../../interfaces';
import { ShedulerService } from "../../services/sheduler.service";
import { addMinutes, isSameMinute, startOfMonth } from "date-fns";
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

  public selectedView = ViewDetalization.Day;

  private shedulerEvents: ShedulerEvent[];

  @Input() public set events(events: ShedulerEvent[]) {
    this.shedulerEvents = events.map(event => {
      const newEvent = {...event};

      if (isSameMinute(event.start, event.end)) {
        newEvent.end = addMinutes(event.end, 1);
      }

      return newEvent;
    });

    this.sortEvents();
  }

  constructor(private service: ShedulerService) {}

  public get events() {
    return this.shedulerEvents;
  }

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

    this.sortEvents();

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

  public dayChanged(date: Date): void {
    this.selectedDate = date;
    this.selectedViewDate.setMonth(date.getMonth());
    this.selectedViewDate.setDate(date.getDate());
  }

  public monthChanged(date: Date): void {
    this.dayChanged(date);
    this.selectedViewDate.setMonth(date.getMonth());
  }

  @HostListener('window:resize') public onResize(): void {
    this.redrawView();
  }

  public showMoreEventsClicked(view: any): void {
    this.selectedView = view;
  }

  private sortEvents(): void {
    this.shedulerEvents.sort((first, second) => first.start.getTime() - second.start.getTime());
  }
}
