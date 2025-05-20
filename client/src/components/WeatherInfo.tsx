import { useWeather } from '@/hooks/useWeather';
import { getWeatherIcon, getWeatherColor } from '@/lib/utils/weather';

const WeatherInfo = () => {
  const { weather, isLoading, isError } = useWeather();

  if (isLoading) {
    return (
      <div className="flex items-center bg-[#F0F0F0] rounded-lg px-4 py-2 shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
        <span className="material-icons mr-2">cloud</span>
        <div>
          <div className="font-semibold">Loading...</div>
          <div className="text-sm text-[#7A7A7A]">Weather</div>
        </div>
      </div>
    );
  }

  if (isError || !weather) {
    return (
      <div className="flex items-center bg-[#F0F0F0] rounded-lg px-4 py-2 shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
        <span className="material-icons mr-2">error_outline</span>
        <div>
          <div className="font-semibold">Unavailable</div>
          <div className="text-sm text-[#7A7A7A]">Weather</div>
        </div>
      </div>
    );
  }

  const iconName = getWeatherIcon(weather.condition);
  const iconColor = getWeatherColor(weather.condition);

  return (
    <div className="flex items-center bg-[#F0F0F0] rounded-lg px-4 py-2 shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
      <span className={`material-icons mr-2 ${iconColor}`}>{iconName}</span>
      <div>
        <div className="font-semibold">{weather.temperature}°{weather.unit}</div>
        <div className="text-sm text-[#7A7A7A]">{weather.condition}</div>
      </div>
    </div>
  );
};

export default WeatherInfo;
