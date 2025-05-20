import { useQuery } from '@tanstack/react-query';
import { AppSettings } from '@shared/types';
import Header from '@/components/Header';
import WeekdayRow from '@/components/WeekdayRow';
import SpecialCardsRow from '@/components/SpecialCardsRow';
import { useCalendar } from '@/hooks/useCalendar';
import { useScreensaver } from '@/hooks/useScreensaver';
import Screensaver from '@/components/Screensaver';

const Home = () => {
  const { isScreensaverActive, exitScreensaver } = useScreensaver();
  const { weekdayEvents, weekendEvents, isLoading } = useCalendar();
  
  // Fetch settings
  const { data: settings } = useQuery<AppSettings>({
    queryKey: ['/api/settings'],
  });

  if (isLoading || !settings) {
    return (
      <div className="flex flex-col h-screen max-h-screen overflow-hidden bg-[#F0F0F0]">
        <div className="flex-1 flex items-center justify-center">
          <p className="text-xl">Loading calendar...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen max-h-screen overflow-hidden bg-[#F0F0F0]">
      {/* Header */}
      <Header settings={settings} />
      
      {/* Main Content */}
      <main className="flex-1 px-6 py-4 overflow-hidden">
        {/* Weekday Row (Monday-Friday) */}
        <WeekdayRow 
          weekdayEvents={weekdayEvents} 
          settings={settings}
        />
        
        {/* Special Cards Row (Weekend, Photos, Tasks) */}
        <SpecialCardsRow 
          weekendEvents={weekendEvents}
          settings={settings}
        />
      </main>
      
      {/* Screensaver */}
      <Screensaver 
        isActive={isScreensaverActive} 
        onExit={exitScreensaver} 
      />
    </div>
  );
};

export default Home;
