import { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { formatHeaderDate } from '@/lib/utils/date';
import WeatherInfo from './WeatherInfo';
import { AppSettings } from '@shared/types';

interface HeaderProps {
  settings: AppSettings;
}

const Header = ({ settings }: HeaderProps) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Update time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Format time based on 12/24 hour preference
  const formattedTime = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: settings.timeFormat === '12'
  }).format(currentTime);
  
  // Format date
  const formattedDate = formatHeaderDate(currentTime);

  return (
    <header className="bg-[#FAFAFA] shadow-[0_2px_10px_rgba(0,0,0,0.05)] flex justify-between items-center px-6 py-3 h-[80px]">
      <div className="flex items-center">
        <h1 className="text-3xl font-bold">{settings.familyName} Calendar</h1>
      </div>
      
      <div className="flex items-center space-x-6">
        {/* Current Time */}
        <div className="text-right">
          <div className="text-xl font-semibold">{formattedTime}</div>
          <div className="text-sm text-[#7A7A7A]">{formattedDate}</div>
        </div>
        
        {/* Weather Information */}
        <WeatherInfo />
        
        {/* Settings Button */}
        <Link href="/settings">
          <Button 
            variant="ghost" 
            size="icon" 
            className="p-2 rounded-full hover:bg-[#F0F0F0] transition-colors"
          >
            <Settings className="h-6 w-6 text-[#7A7A7A]" />
          </Button>
        </Link>
      </div>
    </header>
  );
};

export default Header;
