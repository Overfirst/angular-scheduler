import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef, ViewContainerRef, TemplateRef, AfterContentInit, ChangeDetectorRef
} from '@angular/core';

import { addMinutes } from "date-fns";
import { ShedulerEvent } from "../../../../interfaces";
import { ShedulerService } from "../../../../services/sheduler.service";

@Component({
  selector: 'sheduler-day-view',
  templateUrl: './sheduler-day-view.component.html',
  styleUrls: ['./sheduler-day-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShedulerDayViewComponent implements AfterContentInit {
  @ViewChild('row', { static: true }) private row: ElementRef<HTMLTableRowElement>;

  @ViewChild('defaultOutlet', { static: true, read: ViewContainerRef }) defaultOutletRef: ViewContainerRef;
  @ViewChild('defaultTemplate', { static: true, read: TemplateRef }) defaultTemplateRef: TemplateRef<any>;

  @ViewChild('fullDaysOutlet', { static: true, read: ViewContainerRef }) fullDaysOutletRef: ViewContainerRef;
  @ViewChild('fullDaysTemplate', { static: true, read: TemplateRef }) fullDaysTemplateRef: TemplateRef<any>;

  public fullDayOpened = false;

  public hours: Date[];
  public selectedHour: Date;

  private hourFirstSetted = false;

  constructor(private service: ShedulerService, private cdRef: ChangeDetectorRef) {}

  @Input() public events: ShedulerEvent[] = [];

  private selectedDate: Date;

  @Input() public set day(date: Date) {
    this.service.eventBoxes.clear();
    this.selectedDate = date;
    this.hours = this.service.getHoursForDayView(date);
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

  public ngAfterContentInit(): void {
    this.redraw();
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
    return 2 * this.service.headerRowHeight * this.service.getEventHoursDuration(event) + 'px';
  }

  public getEventDayBoxWidth(event: ShedulerEvent): string {
    const scrollWidth = 18;
    return (this.row.nativeElement.clientWidth - scrollWidth) / (this.service.getCrossEventsCountForTargetEvent(event, this.events) + 1) + 'px';
  }

  public getEventDayBoxLeftOffset(wrapper: HTMLDivElement): string {
    return this.service.getEventDayBoxLeftOffset(wrapper) + 'px';
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
    this.service.eventBoxes.clear();

    this.fullDaysOutletRef.clear();
    this.fullDaysOutletRef.createEmbeddedView(this.fullDaysTemplateRef);

    this.defaultOutletRef.clear();
    this.defaultOutletRef.createEmbeddedView(this.defaultTemplateRef);

    this.cdRef.detectChanges();
  }

  public getFullDaysBorderHeight(): string {
    if (this.events.length <= 3) {
      return this.service.headerRowHeight * 3 - 3 + 'px';
    }

    return this.service.headerRowHeight * this.events.length + 'px';
  }
}
