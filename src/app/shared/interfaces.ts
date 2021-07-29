export enum ViewDetalization {
  Day,
  Week,
  Month,
  Year
}

export interface ShedulerEvent {
  id: number;
  name: string;
  start: Date;
  end: Date;
  color?: string;
}