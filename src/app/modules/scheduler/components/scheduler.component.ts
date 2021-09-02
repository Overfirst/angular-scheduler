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

import { SchedulerEvent, ViewDetalization } from '../interfaces';
import { SchedulerService } from "../services/scheduler.service";
import { addMinutes, isSameMinute } from "date-fns";
import { SchedulerDayViewComponent } from "./views/scheduler-day-view/scheduler-day-view.component";

@Component({
  selector: 'scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SchedulerComponent implements AfterContentInit {
  @ViewChild('outlet', { static: true, read: ViewContainerRef }) outletRef: ViewContainerRef;
  @ViewChild('view', { static: true, read: TemplateRef }) viewRef: TemplateRef<any>;

  @ViewChild('dayViewComponent') dayViewComponent: SchedulerDayViewComponent;
  @ViewChild('weekViewComponent') weekViewComponent: SchedulerDayViewComponent;

  public modalOpened = false;
  public modalEditMode = true;
  public dayAndWeekLongEventsOpened = true;

  public modalEditableEvent: SchedulerEvent;

  public selectedViewDate = new Date();
  public selectedDate = new Date();
  public selectedView = ViewDetalization.Week;

  private schedulerEvents: SchedulerEvent[] = [];

  @Input() public set events(events: SchedulerEvent[]) {
    this.schedulerEvents = events.map(event => {
      const newEvent = {...event};

      if (isSameMinute(event.start, event.end)) {
        newEvent.end = addMinutes(event.end, 1);
      }

      return newEvent;
    });

    this.sortEvents();
  }

  constructor(private service: SchedulerService) {
    this.dayAndWeekLongEventsOpened = this.service.restoreOpenCloseEventsState();
    this.selectedView = this.service.restoreSelectedView();
  }

  public get events() {
    return this.schedulerEvents;
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
    this.service.storeSelectedView(view);
  }

  public eventDoubleClicked(event: SchedulerEvent): void {
    this.modalEditMode = true;
    this.modalEditableEvent = event;
    this.modalOpened = true;
  }

  public openCreateModal(): void {
    this.modalEditMode = false;
    this.modalOpened = true;
  }

  public modalApplyClicked(event: SchedulerEvent): void {
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

  public modalDeleteClicked(event: SchedulerEvent) {
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
    this.schedulerEvents.sort((first, second) => (second.end.getTime() - second.start.getTime()) - (first.end.getTime() - first.start.getTime()));
  }

  public dayAndWeekLongEventsOpenClose(opened: boolean): void {
    this.dayAndWeekLongEventsOpened = opened;
    this.service.storeOpenCloseEventsState(opened);
  }
}
