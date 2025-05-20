import { DayEvents } from '@shared/types';
import DayCard from './DayCard';
import { getDayCardHeaderColor } from '@/lib/utils/calendar';
import { AppSettings } from '@shared/types';

interface WeekdayRowProps {
  weekdayEvents: DayEvents[];
  settings: AppSettings;
}

const WeekdayRow = ({ weekdayEvents, settings }: WeekdayRowProps) => {
  // Colors for day cards
  const dayColors = [
    'bg-[#F8A9A0]', // Monday - coral
    'bg-[#B7C4AA]', // Tuesday - sage
    'bg-[#A6CCE8]', // Wednesday - sky
    'bg-[#C7B8D5]', // Thursday - lavender
    'bg-[#F8A9A0]', // Friday - coral
  ];

  return (
    <div className="grid grid-cols-5 gap-4 mb-4 h-[calc(50vh-80px)]">
      {weekdayEvents.map((dayEvent, index) => (
        <DayCard 
          key={dayEvent.dayOfWeek} 
          dayEvents={dayEvent} 
          color={dayColors[index]} 
          settings={settings}
        />
      ))}
    </div>
  );
};

export default WeekdayRow;
