import { CalendarEvent, DayEvents, MealEvent } from '@shared/types';
import { isToday, isSameDay, format, parse, parseISO } from 'date-fns';

// Safely parse date from server
export const parseDateFromServer = (dateString: string | Date): Date => {
  if (dateString instanceof Date) return dateString;
  try {
    return parseISO(dateString);
  } catch (error) {
    console.error('Failed to parse date:', error);
    return new Date();
  }
};

// Safely parse event from server
export const parseEventsFromServer = (days: any[]): DayEvents[] => {
  return days.map(day => ({
    ...day,
    date: parseDateFromServer(day.date),
    events: day.events.map((event: any) => ({
      ...event,
      start: parseDateFromServer(event.start),
      end: parseDateFromServer(event.end)
    })),
    meal: day.meal ? {
      ...day.meal,
      date: parseDateFromServer(day.meal.date)
    } : undefined
  }));
};

// Get events for a specific day
export const getEventsForDay = (
  events: CalendarEvent[], 
  date: Date
): CalendarEvent[] => {
  return events.filter(event => isSameDay(event.start, date))
    .sort((a, b) => a.start.getTime() - b.start.getTime());
};

// Get color for event owner
export const getEventColor = (
  ownerColor: string,
  defaultColor: string = 'bg-gray-200'
): string => {
  // Map color names to Tailwind classes
  const colorMap: Record<string, string> = {
    'coral': 'bg-[#F8A9A0] text-[#F8A9A0]',
    'sage': 'bg-[#B7C4AA] text-[#B7C4AA]',
    'sky': 'bg-[#A6CCE8] text-[#A6CCE8]',
    'lavender': 'bg-[#C7B8D5] text-[#C7B8D5]',
  };

  return colorMap[ownerColor.toLowerCase()] || defaultColor;
};

// Get header color for day card
export const getDayCardHeaderColor = (
  dayIndex: number,
  isWeekend: boolean = false
): string => {
  // Colors for weekdays: Monday to Friday
  const weekdayColors = [
    'bg-[#F8A9A0]', // Monday - coral
    'bg-[#B7C4AA]', // Tuesday - sage
    'bg-[#A6CCE8]', // Wednesday - sky
    'bg-[#C7B8D5]', // Thursday - lavender
    'bg-[#F8A9A0]', // Friday - coral
  ];
  
  // Colors for weekend days
  const weekendColors = [
    'bg-[#B7C4AA]', // Saturday - sage
    'bg-[#A6CCE8]', // Sunday - sky
  ];
  
  if (isWeekend) {
    return weekendColors[dayIndex - 5] || weekendColors[0];
  }
  
  return weekdayColors[dayIndex] || weekdayColors[0];
};

// Check if a day has any events
export const hasDayEvents = (
  dayEvents: DayEvents
): boolean => {
  return dayEvents.events.length > 0 || !!dayEvents.meal;
};

// Get appropriate badge background color for owner
export const getOwnerBadgeStyle = (
  ownerColor: string
): string => {
  // Map color names to Tailwind background opacity classes
  const colorMap: Record<string, string> = {
    'coral': 'bg-[#F8A9A0] bg-opacity-20 text-[#F8A9A0]',
    'sage': 'bg-[#B7C4AA] bg-opacity-20 text-[#B7C4AA]',
    'sky': 'bg-[#A6CCE8] bg-opacity-20 text-[#A6CCE8]',
    'lavender': 'bg-[#C7B8D5] bg-opacity-20 text-[#C7B8D5]',
  };

  return colorMap[ownerColor.toLowerCase()] || 'bg-gray-200 bg-opacity-20 text-gray-500';
};
