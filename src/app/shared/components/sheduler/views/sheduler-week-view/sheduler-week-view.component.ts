import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef,
  ViewChild, ViewContainerRef, TemplateRef, AfterContentInit
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
  public dayComponents: ShedulerDayViewComponent[] = [];

  public weekDays: Date[] = [];
  public scrollTop = 0;
  public fullWeekOpened = false;

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
    this.cdRef.detectChanges();
    this.dayComponents.forEach(component => component.redraw());
  }

  public fullDayOpenCloseClicked(state: boolean) {
    this.fullWeekOpened = state;
  }
}
