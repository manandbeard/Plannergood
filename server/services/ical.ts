import axios from 'axios';
import ical from 'node-ical';
import { CalendarEvent, MealEvent } from '@shared/types';

interface ICalObject {
  [key: string]: any;
}

// Function to fetch iCal data from URL
export const fetchICalData = async (url: string): Promise<ICalObject> => {
  try {
    const response = await axios.get(url);
    const data = ical.parseICS(response.data);
    return data;
  } catch (error) {
    console.error(`Failed to fetch iCal data from ${url}:`, error);
    return {};
  }
};

// Function to convert iCal data to CalendarEvents
export const parseICalToEvents = (
  icalData: ICalObject, 
  owner: string, 
  ownerColor: string
): CalendarEvent[] => {
  const events: CalendarEvent[] = [];

  for (const k in icalData) {
    const event = icalData[k];
    if (event.type !== 'VEVENT') continue;

    if (event.start && event.summary) {
      const calEvent: CalendarEvent = {
        id: event.uid || `${owner}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        title: event.summary,
        start: event.start,
        end: event.end || new Date(event.start.getTime() + 60 * 60 * 1000), // Default 1 hour
        description: event.description || '',
        location: event.location || '',
        owner,
        ownerColor
      };
      events.push(calEvent);
    }
  }

  return events;
};

// Function to convert iCal data to MealEvents
export const parseICalToMeals = (icalData: ICalObject): MealEvent[] => {
  const meals: MealEvent[] = [];

  for (const k in icalData) {
    const event = icalData[k];
    if (event.type !== 'VEVENT') continue;

    if (event.start && event.summary) {
      const mealEvent: MealEvent = {
        id: event.uid || `meal-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        title: event.summary,
        date: new Date(event.start.setHours(0, 0, 0, 0)) // Set to midnight for date comparison
      };
      meals.push(mealEvent);
    }
  }

  return meals;
};

// Function to get events for specific date range
export const getEventsForDateRange = (
  events: CalendarEvent[], 
  startDate: Date, 
  endDate: Date
): CalendarEvent[] => {
  return events.filter(event => {
    const eventStart = new Date(event.start);
    return eventStart >= startDate && eventStart <= endDate;
  }).sort((a, b) => a.start.getTime() - b.start.getTime());
};

// Function to get meals for specific date
export const getMealForDate = (
  meals: MealEvent[], 
  date: Date
): MealEvent | undefined => {
  const targetDate = new Date(date.setHours(0, 0, 0, 0));
  return meals.find(meal => {
    const mealDate = new Date(meal.date.setHours(0, 0, 0, 0));
    return mealDate.getTime() === targetDate.getTime();
  });
};
