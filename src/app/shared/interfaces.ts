import {ShedulerDayViewComponent} from "./components/sheduler/views/sheduler-day-view/sheduler-day-view.component";
import {ShedulerWeekViewComponent} from "./components/sheduler/views/sheduler-week-view/sheduler-week-view.component";
import {ShedulerMonthViewComponent} from "./components/sheduler/views/sheduler-month-view/sheduler-month-view.component";
import {ShedulerYearViewComponent} from "./components/sheduler/views/sheduler-year-view/sheduler-year-view.component";

export enum ViewDetalization {
  Day = 'Day',
  Week = 'Week',
  Month = 'Month',
  Year = 'Year'
}

export interface ShedulerEvent {
  id: number;
  name: string;
  start: Date;
  end: Date;
  color?: string;
}

export type ViewComponent =
  ShedulerDayViewComponent |
  ShedulerWeekViewComponent |
  ShedulerMonthViewComponent |
  ShedulerYearViewComponent;
