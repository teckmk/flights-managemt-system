export type FlightStatus = 'Scheduled' | 'Delayed' | 'Cancelled' | 'In-flight' | 'Landed';
export type FlightType = 'Commercial' | 'Military' | 'Private';

export interface Flight {
  id: string;
  flightNumber: string;
  origin: string;
  destination: string;
  scheduledDeparture: Date;
  scheduledArrival: Date;
  actualDeparture?: Date;
  actualArrival?: Date;
  status: FlightStatus;
  type: FlightType;
  airline: string;
  aircraft: string;
  capacity: number;
  passengers?: number;
  createdAt: Date;
  updatedAt: Date;
}