import { format, differenceInMinutes, isToday, addDays, isThisWeek } from 'date-fns';

// Format time based on 12/24 hour preference
export const formatTime = (date: Date, use24Hour: boolean = false): string => {
  return format(date, use24Hour ? 'HH:mm' : 'h:mm a');
};

// Format time range for events
export const formatTimeRange = (startDate: Date, endDate: Date, use24Hour: boolean = false): string => {
  const startFormat = use24Hour ? 'HH:mm' : 'h:mm a';
  const endFormat = use24Hour ? 'HH:mm' : 'h:mm a';
  
  return `${format(startDate, startFormat)} - ${format(endDate, endFormat)}`;
};

// Format date for header display
export const formatHeaderDate = (date: Date): string => {
  return format(date, 'EEEE, MMMM d, yyyy');
};

// Get relative date description
export const getRelativeDateDescription = (date: Date): string => {
  if (isToday(date)) {
    return 'Today';
  }
  
  const tomorrow = addDays(new Date(), 1);
  if (format(date, 'yyyy-MM-dd') === format(tomorrow, 'yyyy-MM-dd')) {
    return 'Tomorrow';
  }
  
  if (isThisWeek(date)) {
    return format(date, 'EEEE'); // Day name
  }
  
  return format(date, 'MMM d, yyyy');
};

// Calculate event duration in minutes
export const getEventDuration = (startDate: Date, endDate: Date): number => {
  return differenceInMinutes(endDate, startDate);
};

// Calculate if an event is happening now
export const isEventNow = (startDate: Date, endDate: Date): boolean => {
  const now = new Date();
  return now >= startDate && now <= endDate;
};

// Generate dates for the week starting from Monday
export const getWeekDates = (startDate: Date = new Date()): Date[] => {
  // Get the Monday of current week
  const day = startDate.getDay();
  const diff = startDate.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  const monday = new Date(startDate.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  
  // Generate array of dates for the week
  const weekDates: Date[] = [];
  for (let i = 0; i < 7; i++) {
    weekDates.push(addDays(monday, i));
  }
  
  return weekDates;
};
