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
import {ShedulerMonthViewComponent} from "./views/sheduler-month-view/sheduler-month-view.component";
import {ShedulerService} from "../../services/sheduler.service";
import {startOfMonth} from "date-fns";
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
    this.outletRef.createEmbeddedView(this.viewRef);
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
    this.modalEditableEvent.name = event.name;
    this.modalEditableEvent.start = new Date(event.start);
    this.modalEditableEvent.end = new Date(event.end);
    this.modalEditableEvent.color = event.color;

    this.modalOpened = false;
    this.redraw();
  }

  public modalCloseClicked(): void {
    this.modalOpened = false;
  }

  public redraw(): void {
    this.outletRef.clear();
    this.outletRef.createEmbeddedView(this.viewRef);
  }

  public dayChanged(day: Date): void {
    this.selectedDay = day;
  }
}
