import { DayEvents, CalendarEvent, MealEvent } from '@shared/types';
import { getOwnerBadgeStyle } from '@/lib/utils/calendar';
import { formatTimeRange } from '@/lib/utils/date';
import { AppSettings } from '@shared/types';

interface DayCardProps {
  dayEvents: DayEvents;
  color: string;
  isWeekend?: boolean;
  settings: AppSettings;
}

const DayCard = ({ dayEvents, color, isWeekend = false, settings }: DayCardProps) => {
  const { dayOfWeek, dayOfMonth, month, meal, events } = dayEvents;
  const use24Hour = settings.timeFormat === '24';

  return (
    <div className="calendar-card bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col h-full">
      <div className={`${color} text-white text-center py-2 px-3`}>
        <h2 className="text-xl font-semibold">{dayOfWeek}</h2>
        <p className="text-sm opacity-90">{month} {dayOfMonth}</p>
      </div>
      
      {/* Meal Section */}
      <div className="bg-[#FAFAFA] p-3 border-b border-[#DADADA]">
        <h3 className="text-sm uppercase text-[#7A7A7A] font-semibold mb-1">Meal</h3>
        <p className="font-medium">
          {meal ? meal.title : "No meal planned"}
        </p>
      </div>
      
      {/* Events List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-3">
        {events.length === 0 ? (
          <p className="text-[#7A7A7A] text-center p-4">No events scheduled</p>
        ) : (
          events.map((event: CalendarEvent) => (
            <div key={event.id} className="mb-3 pb-3 border-b border-[#DADADA] last:border-0">
              <div className="flex justify-between items-start mb-1">
                <span className="font-semibold">
                  {formatTimeRange(event.start, event.end, use24Hour)}
                </span>
                <span className={`text-xs px-2 py-1 ${getOwnerBadgeStyle(event.ownerColor)} rounded-full`}>
                  {event.owner}
                </span>
              </div>
              <p className="font-medium">{event.title}</p>
              {event.location && (
                <p className="text-sm text-[#7A7A7A]">{event.location}</p>
              )}
              {event.description && (
                <p className="text-sm text-[#7A7A7A]">{event.description}</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DayCard;
