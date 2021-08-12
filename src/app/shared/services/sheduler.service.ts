import { DatePipe } from "@angular/common";
import { Injectable } from "@angular/core";

import {
  addDays,
  addWeeks,
  startOfWeek,
  startOfMonth,
  isToday,
  isSameWeek,
  differenceInCalendarDays,
  getDay,
  isFirstDayOfMonth,
  startOfDay,
  startOfYear,
  addMonths,
  isThisMonth,
  isSameMonth,
  startOfQuarter,
  isSameQuarter,
  differenceInCalendarMonths, addHours, addMinutes
} from "date-fns";

import { ShedulerEvent, ViewDetalization } from "../interfaces";

@Injectable({ providedIn: 'root' })
export class ShedulerService {
  public eventBoxes = new Set<HTMLDivElement>();

  public readonly headerRowHeight = 48;
  public readonly defaultPadding = 24;

  constructor(private datePipe: DatePipe) {}

  public getHoursForDayView(date: Date): Date[] {
    const startDate = startOfDay(date);

    const hours: Date[] = [];

    for (let i = 0; i < 24; i++) {
      const hour = addHours(startDate, i);

      hours.push(hour);
      hours.push(addMinutes(hour, 30));
    }

    return hours;
  }

  public getWeeksForMonthView(date: Date, dateMonth: Date): Array<Date[]> {
    const weeks: Array<Date[]> = [];
    const startDate = addDays(startOfWeek(startOfMonth(date), { weekStartsOn: 1 }), -1);

    for (let i = 0; i < 6; i++) {
      const days: Date[] = [];
      const date = addWeeks(startDate, i);

      if (i === 5 && !this.dayInCurrentMonth(addDays(date, 1), dateMonth)) {
        break;
      }

      for (let j = 1; j <= 7; j++) {
        days.push(addDays(date, j))
      }

      weeks.push(days);
    }

    return weeks;
  }

  public getQuartersForYearView(year: Date): Array<Date[]> {
    const quarters: Array<Date[]> = [];

    const startDate = startOfYear(year);

    for (let i = 0; i < 4; i++) {
      const quarter: Date[] = [];
      const date = addMonths(startDate, 3 * i);

      for (let j = 0; j < 3; j++) {
        quarter.push(addMonths(date, j));
      }

      quarters.push(quarter);
    }

    return quarters;
  }

  public dayInCurrentMonth(day: Date, monthDate: Date): boolean {
    return day.getFullYear() === monthDate.getFullYear() && day.getMonth() === monthDate.getMonth();
  }

  public isToday(date: Date): boolean {
    return isToday(date);
  }

  public isThisMonth(date: Date): boolean {
    return isThisMonth(date);
  }

  public isFullDate(date: Date, weeks: Array<Date[]>): boolean {
    const isFirstDayOfFirstWeek = date == weeks[0][0];
    return isFirstDayOfFirstWeek || (!isFirstDayOfFirstWeek && isFirstDayOfMonth(date));
  }

  public getEventDuration(event: ShedulerEvent, date: Date, view: ViewDetalization): number {
    let total = 0;
    let diff;

    switch (view) {
      case ViewDetalization.Month:
        diff = Math.abs(differenceInCalendarDays(event.start, event.end));

        for (let i = 0; i <= diff; i++) {
          if (isSameWeek(addDays(event.start, i), date, { weekStartsOn: 1 })) {
            total++;
          }
        }

        break;

      case ViewDetalization.Year:
        diff = Math.abs(differenceInCalendarMonths(event.start, event.end));

        for (let i = 0; i <= diff; i++) {
          if (isSameQuarter(addMonths(event.start, i), date)) {
            total++;
          }
        }

        break;
    }

    return total;
  }

  public eventOnTargetWeek(event: ShedulerEvent, monday: Date): boolean {
    const totalDaysDifferent = Math.abs(differenceInCalendarDays(event.start, event.end));

    for (let i = 0; i <= totalDaysDifferent; i++) {
      if (isSameWeek(addDays(event.start, i), monday, { weekStartsOn: 1 })) {
        return true;
      }
    }

    return false;
  }

  public eventOnTargetQuarter(event: ShedulerEvent, quarter: Date): boolean {
    for (let i = 0; i < 3; i++) {
      if (this.eventFallsOnMonth(event, addMonths(quarter, i))) {
        return true;
      }
    }

    return false;
  }

  public eventStartedOnTargetWeek(event: ShedulerEvent, monday: Date): boolean {
    return isSameWeek(event.start, monday, { weekStartsOn: 1 });
  }

  public eventEndedOnTargetWeek(event: ShedulerEvent, monday: Date): boolean {
    return isSameWeek(event.end, monday, { weekStartsOn: 1 });
  }

  public eventStartedOnTargetQuarter(event: ShedulerEvent, quarter: Date): boolean {
    for (let i = 0; i < 3; i++) {
      if (isSameMonth(addMonths(quarter, i), event.start)) {
        return true;
      }
    }

    return false;
  }

  public eventEndedOnTargetQuarter(event: ShedulerEvent, quarter: Date): boolean {
    for (let i = 0; i < 3; i++) {
      if (isSameMonth(addMonths(quarter, i), event.end)) {
        return true;
      }
    }

    return false;
  }

  public getEventDaysOffsetForTargetWeek(event: ShedulerEvent, monday: Date): number {
    if (this.eventStartedOnTargetWeek(event, monday)) {
      const day = getDay(event.start);
      return day === 0 ? 6 : day - 1;
    }

    return 0;
  }

  public getEventMonthsOffsetForTargetQuarter(event: ShedulerEvent, quarter: Date): number {
    if (this.eventStartedOnTargetQuarter(event, quarter)) {
      return Math.abs(startOfQuarter(quarter).getMonth() - event.start.getMonth());
    }

    return 0;
  }

  public getEventTopOffset(event: ShedulerEvent, wrapper: HTMLDivElement): number {
    const needToCheckWrappers: HTMLDivElement[] = [];
    const wrappers = Array.from(this.eventBoxes).map(box => box.parentElement!);

    for (let i = 0; i < wrappers.length; i++) {
      const boxWrapper = wrappers[i];

      if (boxWrapper === wrapper) {
        break;
      }

      if (boxWrapper.parentElement === wrapper.parentElement) {
        needToCheckWrappers.push(boxWrapper as HTMLDivElement);
      }
    }

    let topOffset = 0;

    const isCrossX = (first: HTMLDivElement, second: HTMLDivElement) => {
      const firstStartX = parseInt(first.style.left);
      const firstEndX = firstStartX + first.clientWidth;

      const secondStartX = parseInt(second.style.left);
      const secondEndX = secondStartX + second.clientWidth;

      return (firstStartX <= secondStartX && firstEndX > secondStartX) || (firstStartX > secondStartX && firstStartX < secondEndX);
    }

    needToCheckWrappers.forEach(boxWrapper => {
      if (isCrossX(wrapper, boxWrapper)) {
        topOffset = parseInt(boxWrapper.style.top) + boxWrapper.clientHeight
      }
    });

    return topOffset;
  }

  public eventsCountOnDay(day: Date, events: ShedulerEvent[]): number {
    let totalEvents = 0;

    events.forEach(event => {
      if (this.eventFallsOnDay(event, day)) {
        totalEvents++;
      }
    });

    return totalEvents;
  }

  public eventsCountOnMonth(month: Date, events: ShedulerEvent[]): number {
    let totalEvents = 0;

    events.forEach(event => {
      if (this.eventFallsOnMonth(event, month)) {
        totalEvents++;
      }
    });

    return totalEvents;
  }

  public getEventsForSelectedDay(day: Date, events: ShedulerEvent[]): ShedulerEvent[] {
    const suitableEvents: ShedulerEvent[] = [];

    events.forEach(event => {
      if (this.eventFallsOnDay(event, day)) {
        suitableEvents.push(event);
      }
    });

    return suitableEvents;
  }

  public getEventsForSelectedMonth(month: Date, events: ShedulerEvent[]): ShedulerEvent[] {
    const suitableEvents: ShedulerEvent[] = [];

    events.forEach(event => {
      if (this.eventFallsOnMonth(event, month)) {
        suitableEvents.push(event);
      }
    });

    return suitableEvents;
  }

  public transformDateForModalInput(date: Date): string {
    const year = this.resolveSeveralDigits(date.getFullYear(), 4);
    const month = this.resolveSeveralDigits(date.getMonth() + 1, 2);
    const day = this.resolveSeveralDigits(date.getDate(), 2);

    const hours = this.resolveSeveralDigits(date.getHours(), 2);
    const minutes = this.resolveSeveralDigits(date.getMinutes(), 2);

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  private resolveSeveralDigits(value: number, digitsCount: number = 1): string {
    let stringValue = value.toString();

    while (stringValue.length < digitsCount) {
      stringValue = "0" + stringValue;
    }

    return stringValue;
  }

  private eventFallsOnDay(event: ShedulerEvent, date: Date): boolean {
    const startTime = startOfDay(event.start).getTime();
    const endTime = startOfDay(event.end).getTime();
    const dayTime = date.getTime();

    return dayTime >= startTime && dayTime <= endTime;
  }

  private eventFallsOnMonth(event: ShedulerEvent, month: Date): boolean {
    const startTime = startOfMonth(event.start).getTime();
    const endTime = startOfMonth(event.end).getTime();
    const monthTime = month.getTime();

    return monthTime >= startTime && monthTime <= endTime;
  }

  public getEventTitle(event: ShedulerEvent): string {
    return event.name + '\n\n' +
           'Start date: ' + this.datePipe.transform(event.start, 'yyyy.MM.dd') + '\n' +
           'End date: ' + this.datePipe.transform(event.end, 'yyyy.MM.dd')
  }

  public eventBoxMouseOver(eventBox: HTMLDivElement): void {
    this.eventBoxes.forEach(box => {
      if (eventBox.getAttribute('event-id') === box.getAttribute('event-id')) {
        box.style.border = '1px solid #000';
      }
    });
  }

  public eventBoxMouseLeave(eventBox: HTMLDivElement): void {
    this.eventBoxes.forEach(box => {
      if (eventBox.getAttribute('event-id') === box.getAttribute('event-id')) {
        box.style.border = '1px solid #bbaacf';
      }
    });
  }

  public getEventColor(event: ShedulerEvent): string {
    if (!event.color) {
      event.color = '#93ff86';
    }

    return event.color;
  }
}
