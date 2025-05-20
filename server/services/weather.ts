import axios from 'axios';
import { WeatherData } from '@shared/types';

// Configuration for weather API
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather';

// Function to fetch weather data
export const fetchWeatherData = async (
  location: string, 
  unit: 'F' | 'C' = 'F', 
  apiKey?: string | null
): Promise<WeatherData | null> => {
  if (!apiKey) {
    console.warn('Weather API key not provided');
    // Return mock weather data for testing purposes
    return {
      temperature: 72,
      condition: 'Sunny',
      icon: '01d',
      location: location,
      unit
    };
  }

  try {
    const unitSystem = unit === 'F' ? 'imperial' : 'metric';
    
    const response = await axios.get(WEATHER_API_URL, {
      params: {
        q: location,
        appid: apiKey,
        units: unitSystem
      }
    });

    const data = response.data;
    
    return {
      temperature: Math.round(data.main.temp),
      condition: data.weather[0].main,
      icon: data.weather[0].icon,
      location: data.name,
      unit
    };
  } catch (error) {
    console.error('Failed to fetch weather data:', error);
    return null;
  }
};

// Function to get weather icon mapping
export const getWeatherIcon = (iconCode: string): string => {
  // Map OpenWeatherMap icon codes to Material Icons
  const iconMap: Record<string, string> = {
    '01d': 'wb_sunny', // clear sky day
    '01n': 'nights_stay', // clear sky night
    '02d': 'partly_cloudy_day', // few clouds day
    '02n': 'nights_stay', // few clouds night
    '03d': 'cloud', // scattered clouds
    '03n': 'cloud',
    '04d': 'cloud', // broken clouds
    '04n': 'cloud',
    '09d': 'grain', // shower rain
    '09n': 'grain',
    '10d': 'rainy', // rain
    '10n': 'rainy',
    '11d': 'thunderstorm', // thunderstorm
    '11n': 'thunderstorm',
    '13d': 'ac_unit', // snow
    '13n': 'ac_unit',
    '50d': 'foggy', // mist
    '50n': 'foggy'
  };

  return iconMap[iconCode] || 'cloud';
};
