import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  HostListener,
  Input,
  TemplateRef,
  ViewChild,
  ViewContainerRef
} from '@angular/core';

import { ShedulerEvent, ViewDetalization } from '../../interfaces';
import { ShedulerService } from "../../services/sheduler.service";
import { addMinutes, isSameMinute } from "date-fns";
import { ShedulerDayViewComponent } from "./views/sheduler-day-view/sheduler-day-view.component";

@Component({
  selector: 'sheduler',
  templateUrl: './sheduler.component.html',
  styleUrls: ['./sheduler.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShedulerComponent implements AfterContentInit {
  @ViewChild('outlet', { static: true, read: ViewContainerRef }) outletRef: ViewContainerRef;
  @ViewChild('view', { static: true, read: TemplateRef }) viewRef: TemplateRef<any>;

  @ViewChild('dayViewComponent') dayViewComponent: ShedulerDayViewComponent;
  @ViewChild('weekViewComponent') weekViewComponent: ShedulerDayViewComponent;

  public modalOpened = false;
  public modalEditMode = true;
  public modalEditableEvent: ShedulerEvent;

  public selectedViewDate = new Date();
  public selectedDate = new Date();
  public selectedView = ViewDetalization.Week;

  private shedulerEvents: ShedulerEvent[] = [];

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
    this.selectedDate = date;
    this.selectedViewDate = date;
    this.selectedDate.setMinutes(0);
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
    if (this.selectedView === ViewDetalization.Day) {
      this.dayViewComponent?.redraw();
      return;
    }

    if (this.selectedView === ViewDetalization.Week) {
      this.weekViewComponent?.redraw();
      return;
    }

    this.outletRef.clear();
    this.outletRef.createEmbeddedView(this.viewRef);
  }

  public hourChanged(date: Date): void {
    this.selectedDate = date;
    this.selectedViewDate.setHours(date.getHours());
  }

  public dayChanged(date: Date): void {
    this.hourChanged(date);
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
    this.shedulerEvents.sort((first, second) => (second.end.getTime() - second.start.getTime()) - (first.end.getTime() - first.start.getTime()));
  }
}
