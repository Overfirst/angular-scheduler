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
  differenceInCalendarMonths,
  addHours,
  differenceInHours,
  differenceInMinutes,
  addMinutes,
  isSameDay
} from "date-fns";

import { ShedulerEvent, ViewComponent, ViewDetalization } from "../interfaces";

@Injectable({ providedIn: 'root' })
export class ShedulerService {
  public eventBoxes = new WeakMap<ViewComponent, HTMLDivElement[]>();

  public readonly headerRowHeight = 48;
  public readonly defaultPadding = 24;

  constructor(private datePipe: DatePipe) {}

  public getHoursForDayView(date: Date): Date[] {
    const startDate = startOfDay(date);

    const hours: Date[] = [];

    for (let i = 0; i < 24; i++) {
      hours.push(addHours(startDate, i));
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

    if (event.end.getHours() === 0 && event.end.getMinutes() === 0) {
      total--;
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

  public getEventTopOffset(viewComponent: ViewComponent, event: ShedulerEvent, wrapper: HTMLDivElement): number {
    const needToCheckWrappers: HTMLDivElement[] = [];
    const wrappers = Array.from(this.eventBoxes.get(viewComponent) || []).map(box => box.parentElement!);

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

      return (firstStartX <= secondStartX && firstEndX > secondStartX + 1) || (firstStartX > secondStartX && firstStartX < secondEndX);
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


  public getEventTitle(event: ShedulerEvent): string {
    return event.name + '\n\n' +
      'Start date: ' + this.datePipe.transform(event.start, 'yyyy.MM.dd') + '\n' +
      'End date: ' + this.datePipe.transform(event.end, 'yyyy.MM.dd')
      'Start date: ' + this.datePipe.transform(event.start, 'yyyy.MM.dd HH:mm') + '\n' +
      'End date: ' + this.datePipe.transform(event.end, 'yyyy.MM.dd HH:mm')
  }

  public eventBoxMouseOver(viewComponent: ViewComponent, eventBox: HTMLDivElement): void {
    this.eventBoxes.get(viewComponent)?.forEach(box => {
      if (eventBox.getAttribute('event-id') === box.getAttribute('event-id')) {
        box.style.border = '1px solid #000';
      }
    });
  }

  public eventBoxMouseLeave(viewComponent: ViewComponent, eventBox: HTMLDivElement): void {
    this.eventBoxes.get(viewComponent)?.forEach(box => {
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

  private resolveSeveralDigits(value: number, digitsCount: number = 1): string {
    let stringValue = value.toString();

    while (stringValue.length < digitsCount) {
      stringValue = "0" + stringValue;
    }

    return stringValue;
  }

  private eventFallsOnDay(event: ShedulerEvent, date: Date): boolean {
    if (isSameDay(event.end, date) && event.end.getHours() === 0 && event.end.getMinutes() === 0) {
      return false;
    }

    const eventStartTime = event.start.getTime();
    const eventEndTime = event.end.getTime();

    const inRange = (value: number) => value >= eventStartTime && value <= eventEndTime;

    const dayStart = startOfDay(date);
    const dayEnd = addMinutes(addHours(dayStart, 23), 59);

    return inRange(dayStart.getTime()) || inRange(dayEnd.getTime()) || dayStart.getTime() <= eventStartTime && dayEnd.getTime() >= eventEndTime;
  }

  private eventFallsOnMonth(event: ShedulerEvent, month: Date): boolean {
    const startTime = startOfMonth(event.start).getTime();
    const endTime = startOfMonth(event.end).getTime();
    const monthTime = month.getTime();

    return monthTime >= startTime && monthTime <= endTime;
  }

  public eventTakingOnSelectedDay(event: ShedulerEvent, day: Date): boolean {
    const startDay = startOfDay(day);

    const dayStartTime = startDay.getTime();
    const dayEndTime = addDays(startDay, 1).getTime();

    const eventStartTime = event.start.getTime();
    const eventEndTime = event.end.getTime();

    return (dayStartTime <= eventStartTime && dayEndTime > eventStartTime) || (dayStartTime > eventStartTime && dayStartTime < eventEndTime);
  }

  public getEventDayBoxTopHoursOffset(event: ShedulerEvent, day: Date): number {
    if (!isSameDay(event.start, day)) {
       return 0;
    }

    return Math.abs(differenceInHours(startOfDay(day), event.start)) + (event.start.getMinutes() < 30 ? 0 : 0.5);
  }

  public getEventHoursDuration(event: ShedulerEvent, day: Date): number {
    if (!isSameDay(event.start, day)) {
      const durationHours = (event.end.getTime() - startOfDay(day).getTime()) / 1000 / 3600;
      const intHours = Math.trunc(durationHours);

      const delta = durationHours - intHours;
      let addition = 0;

      if (delta > 0) {
        addition = delta <= 0.5 ? 0.5 : 1;
      }

      return intHours + addition;
    }

    const transformDateMinutes = (date: Date): Date => {
        const newDate = new Date(date);
        const minutes = date.getMinutes();

        if (minutes === 0) {
          return newDate;
        }

        if (minutes <= 30) {
          newDate.setMinutes(30);
        } else {
          newDate.setHours(newDate.getHours() + 1);
          newDate.setMinutes(0);
        }

        return newDate;
    };

    const transformStart = transformDateMinutes(event.start);
    const transformEnd = transformDateMinutes(event.end);

    const result = Math.abs(differenceInMinutes(transformStart, transformEnd)) / 60;
    const maxHours = 24 - transformStart.getHours() - transformStart.getMinutes() / 60;

    if (result > maxHours) {
      return maxHours;
    }

    if (result < 0.5) {
      return 0.5;
    }

    return result;
  }

  public getEventWidthForDayView(viewComponent: ViewComponent, event: ShedulerEvent, events: ShedulerEvent[], boxWidth: number): number {
    const crossEvents: ShedulerEvent[] = [];
    const needBoxes: HTMLDivElement[] = [];
    const allBoxes = Array.from(this.eventBoxes.get(viewComponent) || []);

    const crossEventsCount = events.reduce((total: number, currentEvent: ShedulerEvent) => {
      if (event.id === currentEvent.id) {
        return total;
      }

      const eventStartTime = event.start.getTime();
      const eventEndTime = event.end.getTime();

      const currentEventStartTime = currentEvent.start.getTime();
      const currentEventEndTime = currentEvent.end.getTime();

      if ((eventStartTime <= currentEventStartTime && eventEndTime > currentEventStartTime) || (eventStartTime > currentEventStartTime && eventStartTime < currentEventEndTime)) {
        if (crossEvents.find(potentialCrossEvent => potentialCrossEvent.end.getTime() <= currentEvent.start.getTime())) {
          return total;
        }

        crossEvents.push(currentEvent);
        const needBox = allBoxes.find(box => box.getAttribute('event-id') === currentEvent.id.toString());

        if (needBox) {
          needBoxes.push(needBox);
        }

        return total + 1;
      }

      return total;
    }, 0);

    const getTotal = () => needBoxes.reduce((total: number, box: HTMLDivElement) => total - box.clientWidth, boxWidth);

    if (needBoxes.length !== crossEventsCount) {
      if (needBoxes.length !== 0) {
        return getTotal() / (crossEventsCount - needBoxes.length + 1);
      }

      return boxWidth / (crossEventsCount + 1);
    }

    return getTotal();
  }

  public getEventDayBoxLeftOffset(viewComponent: ViewComponent, wrapper: HTMLDivElement): number {
    const wrappers = Array.from(this.eventBoxes.get(viewComponent) || []);

    const isCrossY = (first: HTMLDivElement, second: HTMLDivElement) => {
      const firstStartY = parseInt(first.style.top);
      const firstEndY = firstStartY + first.clientHeight;

      const secondStartY = parseInt(second.style.top);
      const secondEndY = secondStartY + second.clientHeight;

      return (firstStartY <= secondStartY && firstEndY > secondStartY) || (firstStartY > secondStartY && firstStartY < secondEndY);
    }

    let offset = 0;

    for (let i = 0; i < wrappers.length; i++) {
      const currentWrapper = wrappers[i];

      if (wrapper === currentWrapper) {
        break;
      }

      if (isCrossY(wrapper, currentWrapper)) {
        offset = parseInt(currentWrapper.style.left) + currentWrapper.clientWidth;
      }
    }

    return offset;
  }

  public eventLastsAllDay(event: ShedulerEvent, day: Date): boolean {
    const startDay = addMinutes(startOfDay(day), 30);
    const endDay = addHours(startDay, 23);

    return event.start.getTime() <= startDay.getTime() && event.end.getTime() >= endDay.getTime();
  }

  public getFullDayEvents(events: ShedulerEvent[], day: Date): ShedulerEvent[] {
    return events.filter(event => this.eventLastsAllDay(event, day));
  }

  public getDefaultDayEvents(events: ShedulerEvent[], day: Date): ShedulerEvent[] {
    return events.filter(event => this.eventFallsOnDay(event, day) && !this.eventLastsAllDay(event, day));
  }

  public eventFallsOnPrevDay(event: ShedulerEvent, currentDate: Date): boolean {
    return this.eventFallsOnDay(event, addDays(startOfDay(currentDate), -1));
  }

  public eventFallsOnNextDay(event: ShedulerEvent, currentDate: Date): boolean {
    return this.eventFallsOnDay(event, addDays(startOfDay(currentDate), 1));
  }

  public getWeekDays(date: Date): Date[] {
    const weekDays: Date[] = [];

    const startDay = startOfWeek(date, { weekStartsOn: 1 });

    for (let i = 0; i < 7; i++) {
      weekDays.push(addDays(startDay, i));
    }

    return weekDays;
  }

  public getLongEventWeekDayStart(event: ShedulerEvent, weekDays: Date[]): number {
    for (let i = 0; i < weekDays.length; i++) {
      if (this.eventLastsAllDay(event, weekDays[i])) {
          return i;
      }
    }

    return -1;
  }

  public getLongEventWeekDaysLasts(event: ShedulerEvent, weekDays: Date[]): number {
    return weekDays.reduce((total: number, day: Date) => this.eventLastsAllDay(event, day) ? total + 1 : total, 0);
  }

  public eventBoxWeekMouseHandler(viewComponent: ViewComponent, dayComponents: ViewComponent[], eventBox: HTMLDivElement, isOver: boolean): void {
    const id = eventBox.getAttribute('event-id');
    const dayBoxes: HTMLDivElement[] = [];

    dayComponents.forEach(dayComponent => this.eventBoxes.get(dayComponent)?.forEach(box => {
      if (box.getAttribute('event-id') === id) {
        dayBoxes.push(box);
      }
    }));

    const border = isOver ? '1px solid #000' : '1px solid #bbaacf';

    dayBoxes.forEach(box => (box.childNodes[0] as HTMLDivElement).style.border = border);

    this.eventBoxes.get(viewComponent)?.forEach(box => {
      if (box.getAttribute('event-id') === id) {
        box.style.border = border;
      }
    })
  }

  public eventWeekMouseOver(viewComponent: ViewComponent, dayComponents: ViewComponent[], eventBox: HTMLDivElement): void {
    this.eventBoxWeekMouseHandler(viewComponent, dayComponents, eventBox, true);
  }

  public eventWeekMouseLeave(viewComponent: ViewComponent, dayComponents: ViewComponent[], eventBox: HTMLDivElement): void {
    this.eventBoxWeekMouseHandler(viewComponent, dayComponents, eventBox, false);
  }

  public storeOpenCloseEventsState(state: boolean): void {
    localStorage.setItem('openCloseLongEventsState', state.toString());
  }

  public restoreOpenCloseEventsState(): boolean {
    return localStorage.getItem('openCloseLongEventsState') === 'true';
  }
}
