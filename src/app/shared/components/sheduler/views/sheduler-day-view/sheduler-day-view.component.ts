import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef, ViewContainerRef, TemplateRef, AfterContentInit, ChangeDetectorRef
} from '@angular/core';

import { addDays, addMinutes } from "date-fns";
import { ShedulerEvent } from "../../../../interfaces";
import { ShedulerService } from "../../../../services/sheduler.service";

@Component({
  selector: 'sheduler-day-view',
  templateUrl: './sheduler-day-view.component.html',
  styleUrls: ['./sheduler-day-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShedulerDayViewComponent implements AfterContentInit {
  @ViewChild('mainContent', { static: true }) private mainContent: ElementRef<HTMLDivElement>;

  @ViewChild('defaultOutlet', { static: true, read: ViewContainerRef }) defaultOutletRef: ViewContainerRef;
  @ViewChild('defaultTemplate', { static: true, read: TemplateRef }) defaultTemplateRef: TemplateRef<any>;

  @ViewChild('fullDaysOutlet', { static: true, read: ViewContainerRef }) fullDaysOutletRef: ViewContainerRef;
  @ViewChild('fullDaysTemplate', { static: true, read: TemplateRef }) fullDaysTemplateRef: TemplateRef<any>;

  @Input() public fullDayOpened = false;

  public hours: Date[];
  public selectedHour: Date;

  private allEvents: ShedulerEvent[] = [];
  public fullDayEvents: ShedulerEvent[];
  public defaultEvents: ShedulerEvent[];

  private hourFirstSetted = false;

  constructor(public service: ShedulerService, private cdRef: ChangeDetectorRef) {}

  @Input() public weekMode = false;
  @Input() public dayIdx = -1;

  @Input() public set weekScrollTop(value: number) {
    this.mainContent.nativeElement.scrollTop = value;
  };

  @Input() public set events(events: ShedulerEvent[]) {
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

  @Output() public eventDoubleClicked = new EventEmitter<ShedulerEvent>();
  @Output() public hourDoubleClicked = new EventEmitter<Date>();
  @Output() public hourChanged = new EventEmitter<Date>();
  @Output() public dayChangeClicked = new EventEmitter<Date>();
  @Output() public weekModeScroll = new EventEmitter<HTMLDivElement>();
  @Output() public openCloseClicked = new EventEmitter<boolean>();

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

  public getEventDayBoxTopHoursOffset(event: ShedulerEvent): string {
    return 2 * this.service.headerRowHeight * this.service.getEventDayBoxTopHoursOffset(event, this.selectedDate) + 'px';
  }

  public getEventColor(event: ShedulerEvent): string {
    return this.service.getEventColor(event);
  }

  public eventBoxDoubleClick(event: ShedulerEvent): void {
    this.eventDoubleClicked.emit(event);
  }

  public eventTakingOnSelectedDay(event: ShedulerEvent): boolean {
    return this.service.eventTakingOnSelectedDay(event, this.day);
  }

  public getEventDayBoxHoursDuration(event: ShedulerEvent): string {
    return 2 * this.service.headerRowHeight * this.service.getEventHoursDuration(event, this.selectedDate) + 'px';
  }

  public getEventDayBoxWidth(event: ShedulerEvent): string {
    const boxWidth = this.mainContent.nativeElement.clientWidth;
    return this.service.getEventWidthForDayView(this, event, this.defaultEvents, boxWidth) + 'px';
  }

  public getEventDayBoxLeftOffset(wrapper: HTMLDivElement): string {
    return this.service.getEventDayBoxLeftOffset(this, wrapper) + 'px';
  }

  public getEventTitle(event: ShedulerEvent): string {
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

    this.fullDaysOutletRef.clear();
    this.fullDaysOutletRef.createEmbeddedView(this.fullDaysTemplateRef);

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

  public eventFallsOnPrevDay(event: ShedulerEvent): boolean {
    return this.service.eventFallsOnPrevDay(event, this.selectedDate);
  }

  public eventFallsOnNextDay(event: ShedulerEvent): boolean {
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
}
