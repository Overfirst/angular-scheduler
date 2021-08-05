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
  startOfDay
} from "date-fns";
import { ShedulerEvent, ViewDetalization } from "../interfaces";

@Injectable({ providedIn: 'root' })
export class ShedulerService {
  public eventBoxes = new Set<HTMLDivElement>();

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

  public dayInCurrentMonth(day: Date, monthDate: Date): boolean {
    return day.getFullYear() === monthDate.getFullYear() && day.getMonth() === monthDate.getMonth();
  }

  public isToday(date: Date): boolean {
    return isToday(date);
  }

  public isFullDate(date: Date, weeks: Array<Date[]>): boolean {
    const isFirstDayOfFirstWeek = date == weeks[0][0];
    return isFirstDayOfFirstWeek || (!isFirstDayOfFirstWeek && isFirstDayOfMonth(date));
  }

  public getEventDurationForTargetWeek(event: ShedulerEvent, monday: Date, view: ViewDetalization): number {
    switch (view) {
      case ViewDetalization.Month:
        const diff = Math.abs(differenceInCalendarDays(event.start, event.end));
        let total = 0;

        for (let i = 0; i <= diff; i++) {
          if (isSameWeek(addDays(event.start, i), monday, { weekStartsOn: 1 })) {
            total++;
          }
        }

        return total;

      default:
        return 1;
    }
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

  public eventStartedOnTargetWeek(event: ShedulerEvent, monday: Date): boolean {
    return isSameWeek(event.start, monday, { weekStartsOn: 1 });
  }

  public eventEndedOnTargetWeek(event: ShedulerEvent, monday: Date): boolean {
    return isSameWeek(event.end, monday, { weekStartsOn: 1 });
  }

  public getEventDaysOffsetForTargetWeek(event: ShedulerEvent, monday: Date): number {
    if (this.eventStartedOnTargetWeek(event, monday)) {
      const day = getDay(event.start);
      return day === 0 ? 6 : day - 1;
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
    let totalDays = 0;

    events.forEach(event => {
      if (this.eventFallsOnDay(event, day)) {
        totalDays++;
      }
    });

    return totalDays;
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

  private eventFallsOnDay(event: ShedulerEvent, day: Date): boolean {
    const startTime = startOfDay(event.start).getTime();
    const endTime = startOfDay(event.end).getTime();
    const dayTime = day.getTime();

    return dayTime >= startTime && dayTime <= endTime;
  }
}
