import { Injectable } from "@angular/core";
import { addDays, addWeeks, startOfWeek, startOfMonth, isToday, isSameWeek, differenceInCalendarDays, getDay, isFirstDayOfMonth } from "date-fns";
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

      return (firstStartX > secondStartX - 1 && firstStartX < secondEndX - 1) || (firstEndX - 1 > secondStartX && firstEndX < secondEndX - 1)
    }

    needToCheckWrappers.forEach(boxWrapper => topOffset += isCrossX(wrapper, boxWrapper)
      ? parseInt(boxWrapper.style.top) + boxWrapper.clientHeight
      : 0
    );
    
    return topOffset;
  }
}