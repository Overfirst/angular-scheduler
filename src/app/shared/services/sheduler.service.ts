import { Injectable } from "@angular/core";
import { addDays, addWeeks, startOfWeek, startOfMonth, isToday } from "date-fns";

@Injectable({ providedIn: 'root' })
export class ShedulerService {
  public getWeeksForMonthView(date: Date, dateMonth: Date): Array<Date[]> {
    const weeks: Array<Date[]> = [];
    const startDate = addDays(startOfWeek(startOfMonth(date), { weekStartsOn: 1 }), -1);

    for (let i = 0; i < 6; i++) {
      const days: Date[] = [];
      const date = addWeeks(startDate, i);

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
}