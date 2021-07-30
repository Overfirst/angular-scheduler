import { Injectable } from "@angular/core";
import { addDays, addWeeks, startOfWeek, startOfMonth, isToday, isSameWeek, differenceInCalendarDays, getDay } from "date-fns";
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

      // fix this block
      if (i === 5 && !this.dayInCurrentMonth(addDays(date, 7), dateMonth)) {
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
}