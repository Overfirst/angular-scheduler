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
