import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef,
  AfterContentInit, ViewChild, ViewContainerRef, TemplateRef, ElementRef
} from '@angular/core';
import { ShedulerEvent } from "../../../../interfaces";
import { ShedulerService } from "../../../../services/sheduler.service";
import { ShedulerDayViewComponent } from "../sheduler-day-view/sheduler-day-view.component";

@Component({
  selector: 'sheduler-week-view',
  templateUrl: './sheduler-week-view.component.html',
  styleUrls: ['./sheduler-week-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShedulerWeekViewComponent implements AfterContentInit {
  @ViewChild('longDaysOutlet', { static: true, read: ViewContainerRef }) longDaysOutletRef: ViewContainerRef;
  @ViewChild('longDaysTemplate', { static: true, read: TemplateRef }) longDaysTemplateRef: TemplateRef<any>;
  @ViewChild('row', { static: true }) public row: ElementRef<HTMLTableRowElement>;

  public dayComponents: ShedulerDayViewComponent[] = [];

  public weekDays: Date[] = [];
  public scrollTop = 0;
  public fullWeekOpened = true;

  constructor(private service: ShedulerService, private cdRef: ChangeDetectorRef) {}

  @Input() public events: ShedulerEvent[] = [];

  @Input() public set week(date: Date) {
    this.weekDays = this.service.getWeekDays(date);
  }

  @Output() public eventDoubleClicked = new EventEmitter<ShedulerEvent>();
  @Output() public hourDoubleClicked = new EventEmitter<Date>();
  @Output() public hourChanged = new EventEmitter<Date>();
  @Output() public dayChangeClicked = new EventEmitter<Date>();

  public ngAfterContentInit(): void {
    this.redraw();
  }

  public eventDoubleClick(event: ShedulerEvent): void {
    this.eventDoubleClicked.emit(event);
  }

  public hourDoubleClick(date: Date): void {
    this.hourDoubleClicked.emit(date);
  }

  public hourChange(date: Date): void {
    this.hourChanged.emit(date);
  }

  public dayChangeClick(date: Date): void {
    this.dayChangeClicked.emit(date);
  }

  public tableOnScroll(scrollElement: HTMLDivElement): void {
    this.scrollTop = scrollElement.scrollTop;
  }

  public redraw(): void {
    this.service.eventBoxes.delete(this);

    this.longDaysOutletRef?.clear();
    this.longDaysOutletRef.createEmbeddedView(this.longDaysTemplateRef);

    this.cdRef.detectChanges();
    this.dayComponents.forEach(component => component.redraw());
  }

  public fullDayOpenCloseClicked(state: boolean) {
    this.fullWeekOpened = state;
  }

  public getOpenCloseTitle(): string {
    return !this.fullWeekOpened ? `Show long events` : 'Hide long events';
  }

  public getHeaderHeight(): string {
    return `${(this.fullWeekOpened ? 4 : 1) * this.service.headerRowHeight}px`
  }

  public getEventColor(event: ShedulerEvent): string {
    return this.service.getEventColor(event);
  }

  public calculateLongEventWeekLeft(event: ShedulerEvent): string {
    return this.service.getLongEventWeekDayStart(event, this.weekDays) * this.row.nativeElement.clientWidth / 7 + 'px';
  }

  public calculateLongEventWeekWidth(event: ShedulerEvent): string {
    return this.service.getLongEventWeekDaysLasts(event, this.weekDays) * (this.row.nativeElement.clientWidth - 2) / 7 + 'px';
  }

  public calculateLongEventWeekTop(event:ShedulerEvent, wrapper: HTMLDivElement): string {
    console.log('calculateLongEventWeekTop');
    return this.service.getEventTopOffset(this, event, wrapper) + 'px';
  }

  public getLongEventWeekDaysLasts(event: ShedulerEvent): number {
    return this.service.getLongEventWeekDaysLasts(event, this.weekDays);
  }
}
