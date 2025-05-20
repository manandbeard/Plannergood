import { DayEvents } from '@shared/types';
import DayCard from './DayCard';
import PhotoSlideshow from './PhotoSlideshow';
import TaskCard from './TaskCard';
import { AppSettings } from '@shared/types';

interface SpecialCardsRowProps {
  weekendEvents: DayEvents[];
  settings: AppSettings;
}

const SpecialCardsRow = ({ weekendEvents, settings }: SpecialCardsRowProps) => {
  // Weekend day colors
  const weekendColors = [
    'bg-[#B7C4AA]', // Saturday - sage
    'bg-[#A6CCE8]'  // Sunday - sky
  ];

  return (
    <div className="grid grid-cols-10 gap-4 h-[calc(50vh-80px)]">
      {/* Weekend Cards (40% combined) */}
      <div className="col-span-4 grid grid-cols-2 gap-4">
        {weekendEvents.map((dayEvent, index) => (
          <DayCard
            key={dayEvent.dayOfWeek}
            dayEvents={dayEvent}
            color={weekendColors[index]}
            isWeekend={true}
            settings={settings}
          />
        ))}
      </div>
      
      {/* Photo Slideshow (30%) */}
      <div className="col-span-3">
        <PhotoSlideshow />
      </div>
      
      {/* Family Tasks (30%) */}
      <div className="col-span-3">
        <TaskCard />
      </div>
    </div>
  );
};

export default SpecialCardsRow;
