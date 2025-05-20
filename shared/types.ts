// Calendar Event Types
export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  location?: string;
  description?: string;
  owner: string;
  ownerColor: string;
}

export interface MealEvent {
  id: string;
  title: string;
  date: Date;
}

export interface WeatherData {
  temperature: number;
  condition: string;
  icon: string;
  location: string;
  unit: string;
}

// Helper type for grouped events by day
export interface DayEvents {
  date: Date;
  dayOfWeek: string;
  dayOfMonth: number;
  month: string;
  meal?: MealEvent;
  events: CalendarEvent[];
}

// Calendar Feed
export interface CalendarFeed {
  url: string;
  owner: string;
  color: string;
}

// Settings interface for frontend
export interface AppSettings {
  familyName: string;
  timeFormat: "12" | "24";
  screensaverTimeout: number; // in minutes
  photoDirectory: string;
  weatherApiKey?: string;
  weatherLocation: string;
  tempUnit: "F" | "C";
  familyMembers: {
    id: number;
    name: string;
    color: string;
    calendarUrl: string;
  }[];
  mealCalendarUrl?: string;
  taskCalendarUrl?: string; // Todoist or other task management iCal URL
}
