import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  ViewContainerRef,
  TemplateRef,
  AfterContentInit,
  ChangeDetectorRef
} from '@angular/core';

import { addDays, addMinutes } from "date-fns";
import { SchedulerEvent } from "../../../../interfaces";
import { SchedulerService } from "../../../../services/scheduler.service";

@Component({
  selector: 'scheduler-day-view',
  templateUrl: './scheduler-day-view.component.html',
  styleUrls: ['./scheduler-day-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SchedulerDayViewComponent implements AfterContentInit {
  @ViewChild('mainContent', { static: true }) private mainContent: ElementRef<HTMLDivElement>;

  @ViewChild('defaultOutlet', { static: true, read: ViewContainerRef }) defaultOutletRef: ViewContainerRef;
  @ViewChild('defaultTemplate', { static: true, read: TemplateRef }) defaultTemplateRef: TemplateRef<any>;

  @ViewChild('fullDaysOutlet', { static: true, read: ViewContainerRef }) fullDaysOutletRef: ViewContainerRef;
  @ViewChild('fullDaysTemplate', { static: true, read: TemplateRef }) fullDaysTemplateRef: TemplateRef<any>;

  @ViewChild('headerTable', { static: true }) headerTable: ElementRef<HTMLDivElement>;

  @Input() public fullDayOpened = true;

  public hours: Date[];
  public selectedHour: Date;

  private allEvents: SchedulerEvent[] = [];
  public fullDayEvents: SchedulerEvent[];
  public defaultEvents: SchedulerEvent[];

  private hourFirstSetted = false;

  constructor(public service: SchedulerService, private cdRef: ChangeDetectorRef) {}

  @Input() public weekMode = false;
  @Input() public dayIdx = -1;

  @Input() public set weekScrollTop(value: number) {
    this.mainContent.nativeElement.scrollTop = value;
  };

  @Input() public set events(events: SchedulerEvent[]) {
    this.allEvents = events;
    this.fullDayEvents = this.weekMode ? [] : this.service.getFullDayEvents(events, this.selectedDate);
    this.defaultEvents = this.service.getDefaultDayEvents(events, this.selectedDate);
  }

  public get events() {
    return this.allEvents;
  }

  private selectedDate: Date = new Date();

  @Input() public set day(date: Date) {
    this.service.eventBoxes.delete(this);
    this.selectedDate = date;
    this.hours = this.service.getHoursForDayView(date);
    this.fullDayEvents = this.weekMode ? [] : this.service.getFullDayEvents(this.allEvents, this.selectedDate);
    this.defaultEvents = this.service.getDefaultDayEvents(this.allEvents, this.selectedDate);
  }

  @Input() public set hour(hour: Date) {
    this.selectedHour = hour;

    if (!this.hourFirstSetted) {
      this.hourFirstSetted = true;
      return;
    }

    this.hourChanged.emit(this.selectedHour);
  }

  @Output() public eventDoubleClicked = new EventEmitter<SchedulerEvent>();
  @Output() public hourDoubleClicked = new EventEmitter<Date>();
  @Output() public hourChanged = new EventEmitter<Date>();
  @Output() public dayChangeClicked = new EventEmitter<Date>();
  @Output() public weekModeScroll = new EventEmitter<HTMLDivElement>();
  @Output() public openCloseClicked = new EventEmitter<boolean>();
  @Output() public onEventMouseOver = new EventEmitter<HTMLDivElement>();
  @Output() public onEventMouseLeave = new EventEmitter<HTMLDivElement>();

  public ngAfterContentInit(): void {
    this.redraw();
    this.mainContent.nativeElement.onscroll = (event: Event) => this.weekModeScroll.emit(this.mainContent.nativeElement);
  }

  public get day() {
    return this.selectedDate;
  }

  public addHalfHour(hour: Date): Date {
    return addMinutes(hour, 30);
  }

  public getEventDayBoxTopHoursOffset(event: SchedulerEvent): string {
    return 2 * this.service.headerRowHeight * this.service.getEventDayBoxTopHoursOffset(event, this.selectedDate) + 'px';
  }

  public getEventColor(event: SchedulerEvent): string {
    return this.service.getEventColor(event);
  }

  public eventBoxDoubleClick(event: SchedulerEvent): void {
    this.eventDoubleClicked.emit(event);
  }

  public eventTakingOnSelectedDay(event: SchedulerEvent): boolean {
    return this.service.eventTakingOnSelectedDay(event, this.day);
  }

  public getEventDayBoxHoursDuration(event: SchedulerEvent): string {
    return 2 * this.service.headerRowHeight * this.service.getEventHoursDuration(event, this.selectedDate) + 'px';
  }

  public getEventDayBoxWidth(event: SchedulerEvent): string {
    const boxWidth = this.mainContent.nativeElement.clientWidth;
    return this.service.getEventWidthForDayView(this, event, this.defaultEvents, boxWidth) + 'px';
  }

  public getEventDayBoxLeftOffset(wrapper: HTMLDivElement): string {
    return this.service.getEventDayBoxLeftOffset(this, wrapper) + 'px';
  }

  public getEventTitle(event: SchedulerEvent): string {
    return this.service.getEventTitle(event);
  }

  public hourDoubleClick(hour: Date): void {
    this.hour = hour;
    this.hourDoubleClicked.emit(hour);
  }

  public getHeaderHeight(): string {
    return `${(this.fullDayOpened ? 4 : 1) * this.service.headerRowHeight}px`
  }

  public getMainContentHeight(): string {
    if (this.fullDayOpened) {
      return `calc((100vh - (5 * ${this.service.headerRowHeight}px + 3 * ${this.service.defaultPadding}px) - 2px))`
    }

    return `calc((100vh - (2 * ${this.service.headerRowHeight}px + 3 * ${this.service.defaultPadding}px) - 2px))`
  }

  public redraw(): void {
    this.service.eventBoxes.delete(this);

    this.fullDayEvents = this.weekMode ? [] : this.service.getFullDayEvents(this.events, this.selectedDate);
    this.defaultEvents = this.service.getDefaultDayEvents(this.events, this.selectedDate);

    if (!this.weekMode) {
      this.fullDaysOutletRef?.clear();
      this.fullDaysOutletRef?.createEmbeddedView(this.fullDaysTemplateRef);
    } else if (this.headerTable) {
        this.headerTable.nativeElement.innerHTML = '';
    }

    this.defaultOutletRef.clear();
    this.defaultOutletRef.createEmbeddedView(this.defaultTemplateRef);

    this.cdRef.detectChanges();
  }

  public getFullDaysBorderHeight(): string {
    if (this.fullDayEvents.length <= 3) {
      return this.service.headerRowHeight * 3 - 3 + 'px';
    }

    return this.service.headerRowHeight * this.fullDayEvents.length + 'px';
  }

  public eventFallsOnPrevDay(event: SchedulerEvent): boolean {
    return this.service.eventFallsOnPrevDay(event, this.selectedDate);
  }

  public eventFallsOnNextDay(event: SchedulerEvent): boolean {
    return this.service.eventFallsOnNextDay(event, this.selectedDate);
  }

  public clickToPrevDay(event: MouseEvent): void {
    this.dayChangeClicked.emit(addDays(this.selectedDate, -1))
  }

  public clickToNextDay(event: MouseEvent): void {
    this.dayChangeClicked.emit(addDays(this.selectedDate, 1))
  }

  public fullDayOpenClose(): void {
    this.fullDayOpened = !this.fullDayOpened;
    this.openCloseClicked.emit(this.fullDayOpened);
  }

  public getOpenCloseTitle(): string {
    return !this.fullDayOpened ? `Show long events (${this.fullDayEvents.length})` : 'Hide long events';
  }

  public eventMouseOver(eventBox: HTMLDivElement): void {
    this.onEventMouseOver.emit(eventBox);
  }

  public eventMouseLeave(eventBox: HTMLDivElement): void {
    this.onEventMouseLeave.emit(eventBox);
  }
}
