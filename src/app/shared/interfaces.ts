import { SchedulerDayViewComponent } from "./components/scheduler/views/scheduler-day-view/scheduler-day-view.component";
import { SchedulerWeekViewComponent } from "./components/scheduler/views/scheduler-week-view/scheduler-week-view.component";
import { SchedulerMonthViewComponent } from "./components/scheduler/views/scheduler-month-view/scheduler-month-view.component";
import { SchedulerYearViewComponent } from "./components/scheduler/views/scheduler-year-view/scheduler-year-view.component";

export enum ViewDetalization {
  Day = 'Day',
  Week = 'Week',
  Month = 'Month',
  Year = 'Year'
}

export interface SchedulerEvent {
  id: number;
  name: string;
  start: Date;
  end: Date;
  color?: string;
}

export type ViewComponent =
  SchedulerDayViewComponent |
  SchedulerWeekViewComponent |
  SchedulerMonthViewComponent |
  SchedulerYearViewComponent;

export interface CollectDayComponentData {
  component: SchedulerDayViewComponent;
  collection: SchedulerDayViewComponent[];
}
