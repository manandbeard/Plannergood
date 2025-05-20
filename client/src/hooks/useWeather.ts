import { useQuery } from '@tanstack/react-query';
import { WeatherData } from '@shared/types';

export const useWeather = () => {
  // Query for fetching weather data
  const {
    data: weather,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery<WeatherData>({
    queryKey: ['/api/weather'],
    staleTime: 1000 * 60 * 15, // 15 minutes
    refetchInterval: 1000 * 60 * 30, // 30 minutes
  });

  return {
    weather,
    isLoading,
    isError,
    error,
    refetchWeather: refetch
  };
};
